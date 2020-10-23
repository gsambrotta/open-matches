'use strict'

const Boom = require('@hapi/boom')
const bcrypt = require('bcrypt')
const UserHelper = require('../utils/usersFunctions')

module.exports = {
  authenticate,
}

async function authenticate({ email, password, ipAddress, withVerifyToken }) {
  const user = await User.findOne({ email })
  // check that user exists and password is the same as user
  if (!withVerifyToken || !user) {
    const isSamePassword = await bcrypt.compare(password, user.password)

    if (!isSamePassword) {
      return Boom.badRequest({
        error: 'Email or password are incorrect',
      })
    }
  }

  // create jwt token and refresh token
  const jwtToken = UserHelper.generateJwtToken(user)
  const refreshToken = await UserHelper.generateRefreshToken(user, ipAddress)
  // return user and tokens
  return {
    user,
    jwtToken,
    refreshToken: refreshToken.token,
  }
}
