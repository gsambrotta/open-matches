const jwt = require('express-jwt')
const { secret } = require('config.json')
const db = require('../_helpers/db')

module.exports = authorize

function authorize(roles = []) {
  // roles can be string or array
  if (typeof roles === 'string') {
    roles = [roles]
  }

  return [
    // authenticate the req validating the JWT token in the "Authorization" header of http
    // success ? user obj is attach to req (with token as data)
    jwt({ secret, algorithms: ['HS256'] }),

    async (req, res, next) => {
      const account = await db.Account.findById(req.user.id)
      const refreshTokens = await db.RefreshToken.find({ account: account.id })

      // account not exist or account doesn't have the requested role
      if (!account || (roles.length && !roles.includes(account.role))) {
        return res.status(401).json({ message: 'Unauthorized' })
      }

      //authentication and authorization successful
      req.user.role = account.role
      req.user.ownsToken = (token) =>
        !!refreshTokens.find((item) => item.token === token)

      next()
    },
  ]
}
