'use strict'
const Boom = require('@hapi/boom')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const db = require('../models')
const User = db.user
const Role = db.role

module.exports = {
  signup,
  signin,
}

async function signup(req, h) {
  const { username, email, password, roles } = req.payload
  const user = new User({
    username,
    email,
    password: bcrypt.hashSync(password, 8),
  })

  user.save((err, save) => {
    if (err) {
      return Boom.badImplementation('Error saving user', err)
    }

    if (roles) {
      Role.find({ name: { $in: roles } }, (err, roles) => {
        if (err) {
          return Boom.badImplementation(
            `This user doesn't have a role listed in ${roles}`,
            err
          )
        }

        user.roles = roles.map((role) => role._id)
        user.save((err) => {
          if (err) {
            return Boom.badImplementation('Error saving role', err)
          }
          res({ message: 'User was registered successfully!' }).code(201)
        })
      })
    } else {
      Role.findOne({ name: 'user' }, (err, role) => {
        if (err) {
          return Boom.badImplementation("No user with name: 'user'", err)
        }

        user.roles = [role._id]
        user.save((err) => {
          if (err) {
            return Boom.badImplementation('Error saving role', err)
          }
          res({ message: 'User was registered successfully!' }).code(201)
        })
      })
    }
  })
}

async function signin(req, h) {
  const { username, password } = req.payload
  User.findOne({ username })
    .populated('roles', '-__v')
    .exec((err, user) => {
      if (err) {
        return Boom.badImplementation(err)
      }

      if (!user) {
        return Boom.badRequest('User Not Found', err)
      }

      const passwordIsValid = bcrypt.compareSync(password, user.password)
      if (!passwordIsValid) {
        return Boom.badRequest('Invalid Password', err)
      }
      // if user exists and credential are correct
      // generate a token using jsonwebtoken
      const token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 86400, //24h
      })
      const authorities = []
      for (let i = 0; i < user.roles.length; i++) {
        authorities.push(`ROLES_${user.roles[i].name.toUpperCase()}`)
      }

      res({
        id: user._id,
        username: user.username,
        email: user.email,
        roles: authorities,
        accessToken: token,
      }).code(201)
    })
}

// async function signup(req, h) {
//   const { email, password } = req.payload

//   // hash password
//   hashPassword(password, async (err, hash) => {
//     if (err) {
//       throw Boom.badRequest('Error creating the hash password', err)
//     }

//     const emailToken = randomTokenString()

//     // create new user on db
//     const newUser = await User.create({
//       email,
//       password: hash,
//       idToken: createToken(user),
//       emailVerifyToken: emailToken,
//       emailVerifyExpires: moment().add(1, 'hours'),
//     })

//     if (newUser) {
//       // send email with verification token
//       Mail.sendTokenEmail(email, 'verify', emailToken)

//       return newUser
//       // res(newUser).code(201)
//     }
//   })
//   // return { email }
//   res(newUser).code(201)
// }
