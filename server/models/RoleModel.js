const mongoose = require('mongoose')
const Schema = mongoose.Schema
const validator = require('validator')
const mongodbErrorHandler = require('mongoose-mongodb-errors')

const ROLES = ['user', 'admin']

const RoleSchema = new Schema({
  name: {
    type: String,
    lowercase: true,
    trim: true,
    required: "Role can't be empty",
  },
})

RoleSchema.plugin(mongodbErrorHandler) // nice error handler

module.exports = Role = mongoose.model('roles', RoleSchema)
