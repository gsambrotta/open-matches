const jwt = require('jsonwebtoken')
const Boom = require('@hapi/boom')
const db = require('../models')
const User = db.User
const Role = db.role // role.model

module.exports = {
  verifyToken,
  isAdmin,
  isModerator,
}

function verifyToken(req, res) {
  // get token from x-access-token of HTTP headers
  let token = req.headers['x-access-token']

  if (!token) {
    return Boom.forbidden('No token provided!', err)
  }

  // if token, decoded it with secret
  // return userId from json
  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    if (err) {
      return Boom.unauthorized('Unauthorized', err)
    }
    req.userId = decoded.id
  })
}

function isAdmin(req, res) {
  User.findById(req.userId).exec((err, user) => {
    if (err) {
      return Boom.badImplementation('Error finding userId', err)
    }

    Role.find({ _id: { $in: user.roles } }, (err, roles) => {
      if (err) {
        return Boom.badImplementation('Error finding user role', err)
      }

      for (let i = 0; i < roles.length; i++) {
        if (roles[i].name === 'admin') {
          return
        }
      }

      return Boom.unauthorized('Require admin role!', err)
    })
  })
}

function isModerator(req, res) {
  User.findById(req.userId).exec((err, user) => {
    if (err) {
      return Boom.badImplementation('Error finding userId', err)
    }

    Role.find({ _id: { $in: user.roles } }, (err, roles) => {
      if (err) {
        return Boom.badImplementation('Error finding user role', err)
      }

      for (let i = 0; i < roles.length; i++) {
        if (roles[i].name === 'moderator') {
          next()
          return
        }
      }

      return Boom.unauthorized('Require moderator role!', err)
    })
  })
}
