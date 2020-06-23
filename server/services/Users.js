'use strict'

const bcrypt = require('bcrypt')
const UserHelper = require('../helpers/Users')

module.exports = {
  authenticate,
}

async function authenticate({ email, password, ipAddress }) {
  const user = await User.findOne({ email })
  // check that user exists and password is the same as user
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return Boom.badRequest({
      error: 'Email or password are incorrect',
    })
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
