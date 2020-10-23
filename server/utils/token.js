'use strict'

const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const RefreshToken = require('../models/RefreshTokenModel')
const { resolveNs } = require('dns')

module.exports = {
  generateJwtToken,
}

function generateJwtToken(user) {
  let roles
  if (user.admin) {
    roles = 'admin'
  }

  // create a jwt token containing the user id that expires in 15 minutes
  return jwt.sign({ id: user.id, role: roles }, process.env.SECRET_KEY, {
    expiresIn: '1h',
  })
}
