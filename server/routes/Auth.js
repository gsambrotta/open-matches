'use strict'

const { signup, signin } = require('../controllers/AuthController')
const {
  checkDuplicateUsernameOrEmail,
  checkRolesExisted,
} = require('../middlewares/verifySignup')

module.exports = (function () {
  return [
    {
      method: 'POST',
      path: '/api/auth/signup',
      config: {
        pre: [
          { method: checkDuplicateUsernameOrEmail },
          { method: checkRolesExisted },
        ],
      },
      handler: signup,
    },
    {
      method: 'POST',
      path: '/api/auth/signin',
      handler: signin,
    },
  ]
})()
