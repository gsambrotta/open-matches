'use strict'

const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const User = require('../models/User')

exports.plugin = {
  register: (server, options, next) => {
    server.route({
      method: 'POST',
      path: '/signup',
      handler: (req, h) => {
        const userData = {
          email: req.payload.email,
          password: req.payload.password,
        }

        return User.findOne({
          email: req.payload.email,
        })
          .then((user) => {
            if (!user) {
              bcrypt.hash(req.payload.password, 10, (err, hash) => {
                userData.password = hash
                return User.create(userData)
                  .then((user) => {
                    return { status: user.email + 'Signed up!!' }
                  })
                  .catch((err) => {
                    return `error: ${err}`
                  })
              })
              return userData
            } else {
              return { error: 'User already exists' }
            }
          })
          .catch((err) => {
            return `error: ${err}`
          })
      },
    }),
      server.route({
        method: 'POST',
        path: '/login',
        handler: (req, h) => {
          return User.findOne({ email: req.payload.email })
            .then((user) => {
              if (!user) {
                return { error: user.email + "doesn't exist" }
              } else {
                if (bcrypt.compareSync(req.payload.password, user.password)) {
                  const payload = {
                    id: user._id,
                    email: user.email,
                    //username: user.username
                  }
                  let token = jwt.sign(payload, process.env.SECRET_KEY, {
                    expiresIn: 1140,
                  })
                  return token
                } else {
                  return { error: 'email or password are incorrect' }
                }
              }
            })
            .catch((err) => {
              return `error: ${err}`
            })
        },
      }),
      server.route({
        method: 'GET',
        path: '/my-profile',
        handler: (req, h) => {
          const decoded = jwt.verify(
            req.headers.authorization,
            process.env.SECRET_KEY
          )

          return User.findOne({
            _id: mongoose.Types.ObjectId(decoded.id),
          })
            .then((user) => {
              console.log('user', user)

              if (user) {
                return user
              } else {
                return { error: 'user do not exist' }
              }
            })
            .catch((err) => {
              return `error: ${err}`
            })
        },
      })
  },
  name: 'users',
}
