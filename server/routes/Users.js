'use strict'

const Joi = require('@hapi/joi')
const { verifyToken, isModerator, isAdmin } = require('../middlewares/authJwt')
const {
  allAccess,
  userBoard,
  moderatorBoard,
  adminBoard,
} = require('../controllers/UsersController')

module.exports = (function () {
  return [
    {
      method: 'GET',
      path: '/api/test/all',
      handler: allAccess,
    },
    {
      method: 'GET',
      path: '/api/test/user',
      config: {
        pre: [{ method: verifyToken }],
      },
      handler: userBoard,
    },
    {
      method: 'GET',
      path: '/api/test/mod',
      config: {
        pre: [{ method: verifyToken }, { method: isModerator }],
      },
      handler: moderatorBoard,
    },
    {
      method: 'GET',
      path: '/api/test/admin',
      config: {
        pre: [{ method: verifyToken }, { method: isAdmin }],
      },
      handler: adminBoard,
    },
    // {
    //   method: 'POST',
    //   path: '/api/signup',
    //   config: {
    //     pre: [{ method: verifyUserExist }],
    //     validate: {
    //       payload: Joi.object({
    //         email: Joi.string().required(),
    //         password: Joi.string().required(),
    //       }),
    //       failAction: 'log',
    //     },
    //     auth: false,
    //     handler: UsersController.signup,
    //   },
    //   // options: { auth: false },
    // },
    // {
    //   method: 'GET',
    //   path: '/api/verifyEmail/{token}',
    //   options: {
    //     validate: {
    //       params: Joi.object({
    //         token: Joi.string().required(),
    //       }),
    //       failAction: 'log',
    //     },
    //   },
    //   handler: UsersController.verifyEmail,
    //   options: { auth: false },
    // },
    // {
    //   method: 'POST',
    //   path: '/api/login',
    //   options: {
    //     validate: {
    //       payload: Joi.object({
    //         email: Joi.string().required(),
    //         password: Joi.string().required(),
    //       }),
    //       failAction: 'log',
    //     },
    //   },
    //   handler: //TODO
    // },
  ]
})()
