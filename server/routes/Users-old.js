'use strict'

const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const Joi = require('@hapi/joi')
const Boom = require('@hapi/boom')
const User = require('../models/User')

exports.plugin = {
  register: (server, options, next) => {
    server.route({
      method: 'POST',
      path: '/api/signup',
      options: {
        validate: {
          payload: Joi.object({
            email: Joi.string().required(),
            password: Joi.string().required(),
          }),
          failAction: 'log',
        },
      },
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
                    return
                  })
                  .catch((err) => {
                    return Boom.badRequest({ userError: 'error creating user' })
                  })
              })
              return userData
            } else {
              return Boom.badRequest({
                userAlreadyExist: 'User already exists',
              })
            }
          })
          .catch((err) => {
            throw new Error('unexpect error')
          })
      },
    }),
      server.route({
        method: 'POST',
        path: '/api/login',
        options: {
          validate: {
            payload: Joi.object({
              email: Joi.string().required(),
              password: Joi.string().required(),
            }),
            failAction: 'log',
          },
        },
        handler: (req, h) => {
          return User.findOne({ email: req.payload.email })
            .then((user) => {
              if (!user) {
                return Boom.badRequest({
                  noUserFound: `${req.payload.email} doesn't seems to exist`,
                })
              } else {
                if (bcrypt.compareSync(req.payload.password, user.password)) {
                  const payload = {
                    id: user._id,
                    email: user.email,
                  }
                  let token = jwt.sign(payload, process.env.SECRET_KEY, {
                    expiresIn: 1140,
                  })
                  return { token }
                } else {
                  return Boom.badRequest('cannot retrieve token')
                }
              }
            })
            .catch((err) => {
              throw new Error('unexpect error')
            })
        },
      }),
      server.route({
        method: 'GET',
        path: '/api/my-profile',
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
