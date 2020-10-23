'use strict'

const Boom = require('@hapi/boom')
const bcrypt = require('bcrypt')
const moment = require('moment')
const User = require('../models/UserModel')
const Mail = require('../services/Email')
const { randomTokenString, setTokenCookie } = require('../utils/usersFunctions')

moment().format()

module.exports = {
  signup,
  login,
  verifyEmail,
}

function hashPassword(password, cb) {
  // Generate a salt at level 10 strength
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt, (err, hash) => {
      return cb(err, hash)
    })
  })
}

async function signup(req, h) {
  const { email, password } = req.payload

  // hash password
  hashPassword(password, async (err, hash) => {
    if (err) {
      throw Boom.badRequest('Error creating the hash password', err)
    }

    const emailToken = randomTokenString()

    // create new user on db
    const newUser = await User.create({
      email,
      password: hash,
      idToken: createToken(user),
      emailVerifyToken: emailToken,
      emailVerifyExpires: moment().add(1, 'hours'),
    })

    if (newUser) {
      // send email with verification token
      Mail.sendTokenEmail(email, 'verify', emailToken)

      return newUser
      // res(newUser).code(201)
    }
  })
  // return { email }
  res(newUser).code(201)
}

async function login(req, h) {
  const { email, password } = req.payload
  if (!email || !password) {
    return Boom.badRequest('Email and password fields are required')
  }

  // check if user already exist
  const user = await User.findOne({ email })
  if (user) {
    const isUser = bcrypt.compareSync(password, user.password)

    if (isUser) {
      const payload = {
        id: user._id,
        email: user.email,
        profile_id: user.profile_id,
      }
      // why we do that?
      let token = jwt.sign(payload, process.env.SECRET_KEY, {
        expiresIn: 1440,
      })
      return token
    } else {
      console.log('login error decode password')
      return Boom.badRequest('User does not exist')
    }
  } else {
    console.log('login error')
    return Boom.badRequest('User does not exist')
  }
}

async function verifyEmail(req, h) {
  const token = req.params.token
  const user = await User.findOneAndUpdate(
    {
      emailVerifyToken: token,
      emailVerifyExpires: { $gte: moment() },
    },
    { isVerify: true },
    { new: true }
  )

  // Authenticate user
  if (user) {
    const { refreshToken, jwtToken } = await UserService.authenticate({
      email: user.email,
      password: user.password,
      ipAddress: req.ip,
      withVerifyToken: true,
    })
    setTokenCookie(h, refreshToken)
    const updatedUser = await User.findOneAndUpdate(
      {
        email: user.email,
        password: user.password,
      },
      { jwtToken }
    )
    return updatedUser
  } else {
    // TO FIX: doesn't return 404 and doesn't stop (go to 500 error)
    Boom.badRequest('Email validation token expired')
    return
  }
}
