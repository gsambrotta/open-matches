const db = require('../models')
const Boom = require('@hapi/boom')
const ROLES = db.ROLES
const User = db.user

module.exports = {
  checkDuplicateUsernameOrEmail,
  checkRolesExisted,
}

function checkDuplicateUsernameOrEmail(req, res) {
  const { username, email } = req.payload
  console.log(username, email)

  User.findOne({
    username,
  }).exec((err, user) => {
    if (err) {
      console.log('Error finding user')
      res(Boom.badImplementation('Error finding user'))
    }

    if (user) {
      console.log('Username already exist')
      res(Boom.badRequest('Username already exist'))
    }

    User.findOne({
      email,
    }).exec((err, user) => {
      if (err) {
        console.log('Error finding user email')
        res(Boom.badImplementation('Error finding user'))
      }

      if (user) {
        console.log('Email already exist')
        res(Boom.badRequest('Email already exist'))
      }
    })
  })
  console.log('What?')
}

// check if roles in the request is legal or not
function checkRolesExisted(req, res) {
  const { roles } = req.payload
  if (roles) {
    for (let i = 0; i < roles.length; i++) {
      if (!ROLES.includes(roles[i])) {
        res(Boom.badRequest(`${roles[i]} does not exist!`, err))
      }
    }
  }
}
