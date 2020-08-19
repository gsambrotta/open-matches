'use strict'

const Joi = require('@hapi/joi')
const UsersController = require('../controllers/Users')

module.exports = (function () {
  return [
    {
      method: 'POST',
      path: '/api/signup',
      options: {
        validate: {
          payload: Joi.object({
            email: Joi.string().required(),
            password: Joi.string().required(),
          }),
          failAction: 'log',
        },
      },
      handler: UsersController.signup,
    },
    {
      method: 'GET',
      path: '/api/verifyEmail/{token}',
      options: {
        validate: {
          params: Joi.object({
            token: Joi.string().required(),
          }),
          failAction: 'log',
        },
      },
      handler: UsersController.verifyEmail,
    },
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
