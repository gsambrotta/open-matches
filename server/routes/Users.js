'use strict'

const Joi = require('@hapi/joi')
const UsersController = require('../controllers/UsersController')
const { verifyUserExist } = require('../utils/usersFunctions')

module.exports = (function () {
  return [
    {
      method: 'POST',
      path: '/api/signup',
      config: {
        pre: [{ method: verifyUserExist }],
        validate: {
          payload: Joi.object({
            email: Joi.string().required(),
            password: Joi.string().required(),
          }),
          failAction: 'log',
        },
        auth: false,
        handler: UsersController.signup,
      },
      // options: { auth: false },
    },
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
