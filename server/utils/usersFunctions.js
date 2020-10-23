'use strict'

const User = require('../models/UserModel')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const RefreshToken = require('../models/RefreshTokenModel')
const { badRequest } = require('@hapi/boom')

module.exports = {
  verifyUserExist,
  generateRefreshToken,
  randomTokenString,
  setTokenCookie,
}

async function verifyUserExist(req, res) {
  console.log('hallo?', req.payload.email)
  const user = await User.findOne({ email: req.payload.email })
  console.log('hallo2 ?')

  if (user) {
    console.log('user ?')
    if (user.email === req.payload.email) {
      res(badRequest('Email taken'))
    }
  }

  res(req.payload)
}

async function generateRefreshToken(user, ipAddress) {
  // create a refresh token that expires in 7 days
  const token = await RefreshToken.create({
    user: user._id,
    token: randomTokenString(),
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    createdByIp: ipAddress,
  })

  return token
}

function randomTokenString() {
  return crypto.randomBytes(40).toString('hex')
}

function setTokenCookie(h, token) {
  // create http only cookie with refresh token that expires in 7 days
  const cookieOptions = {
    httpOnly: true,
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  }
  h.state('refreshToken', token, cookieOptions)

  return h.continue
}
