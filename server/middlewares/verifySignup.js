const db = require('../models')
const Boom = require('@hapi/boom')
const ROLES = db.ROLES
const User = db.user

module.exports = {
  checkDuplicateUsernameOrEmail,
  checkRolesExisted,
}

function checkDuplicateUsernameOrEmail(req, h) {
  const { username, email } = req.payload
  console.log(username, email)

  User.findOne({
    username,
  }).exec((err, user) => {
    if (err) {
      console.log('Error finding user')
      return Boom.badImplementation('Error finding user')
    }

    if (user) {
      console.log('Username already exist')
      return Boom.badRequest('Username already exist')
    }

    User.findOne({
      email,
    }).exec((err, user) => {
      if (err) {
        console.log('Error finding user email')
        return Boom.badImplementation('Error finding user')
      }

      if (user) {
        console.log('Email already exist')
        return Boom.badRequest('Email already exist')
      }
    })
  })
  return req
}

// check if roles in the request is legal or not
function checkRolesExisted(req, h) {
  const { roles } = req.payload
  if (roles) {
    for (let i = 0; i < roles.length; i++) {
      if (!ROLES.includes(roles[i])) {
        throw Boom.badRequest(`${roles[i]} does not exist!`, err)
      }
    }
  }
  return req
}
