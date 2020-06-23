'use strict'

const mongoose = require('mongoose')
const Boom = require('@hapi/boom')
const bcrypt = require('bcrypt')
const User = require('../models/User')
const UserService = require('../services/Users')
const UserHelper = require('../helpers/Users')

module.exports = {
  signup,
}

async function signup(req, h) {
  const { email, password } = req.payload
  const ipAddress = req.ip
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
        const newUser = await User.create({ email, password: hash })
        if (newUser) {
          // authenticate user
          const { refreshToken } = await UserService.authenticate({
            email,
            password,
            ipAddress,
          })
          UserHelper.setTokenCookie(h, refreshToken)
        }
      } else {
        return Boom.badRequest('Error creating the hash password')
      }
    })
    return { email }
  } else {
    return Boom.badRequest('User already exists')
  }
}
