'use strict'

module.exports = {
  allAccess,
  userBoard,
  adminBoard,
  moderatorBoard,
}

function allAccess(req, h) {
  res('Pubic Content').code(201)
}

function userBoard(req, h) {
  res('User Content').code(201)
}

function adminBoard(req, h) {
  res('Admin Content').code(201)
}

function moderatorBoard(req, h) {
  res('Moderator Content').code(201)
}
