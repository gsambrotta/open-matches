'use strict'

const mongoose = require('mongoose')
const Boom = require('@hapi/boom')
const bcrypt = require('bcrypt')
const User = require('../models/User')
const UserService = require('../services/Users')
const UserHelper = require('../helpers/Users')
const Mail = require('../services/Email')

module.exports = {
  signup,
}

async function signup(req, h) {
  const { email, password } = req.payload
  if (!email) {
    return Boom.badRequest('Email field is required')
  }

  // check if user already exist
  const user = await User.findOne({ email })
  if (!user) {
    // hash password
    bcrypt.hash(password, 10, async (err, hash) => {
      if (!err) {
        // create new user on db
        await User.create({ email, password: hash })

        // TODO: SEND EMAIL with verify token
        Mail.sendTokenEmail(email, '7931874913793481', 'verify')
      } else {
        return Boom.badRequest('Error creating the hash password')
      }
    })
    return { email }
  } else {
    return Boom.badRequest('User already exists')
  }
}

async function verifyEmail(req, h) {
  // 1_ get token from param
  // 2_ User.findOne() emailVerifyToken + emailVerifyExpires
  // 3_ handle error if expired
  // 4_ add User.isVerify: true to User record
  // 5_ Authenticate user
  //   // authenticate user
  //   const ipAddress = req.ip
  //   const { refreshToken } = await UserService.authenticate({
  //     email,
  //     password,
  //     ipAddress,
  //   })
  //   UserHelper.setTokenCookie(h, refreshToken)
  // Return User
}
