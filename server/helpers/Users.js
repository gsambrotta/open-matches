'use strict'

const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const RefreshToken = require('../models/RefreshToken')

module.exports = {
  generateJwtToken,
  generateRefreshToken,
  randomTokenString,
  setTokenCookie,
}

// HELPER FUNCTIONS
function generateJwtToken(user) {
  // create a jwt token containing the user id that expires in 15 minutes
  return jwt.sign({ id: user.id }, process.env.SECRET_KEY, {
    expiresIn: '15m',
  })
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
  debugger
  h.state('refreshToken', token, cookieOptions)

  return h.continue
}
