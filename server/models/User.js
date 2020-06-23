const mongoose = require('mongoose')
const Schema = mongoose.Schema

const validator = require('validator')
const mongodbErrorHandler = require('mongoose-mongodb-errors')

const UserSchema = new Schema({
  email: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    validate: [validator.isEmail, 'Invalid Email'],
    required: "Email can't be empty",
  },
  password: {
    type: String,
    required: "Password can't be empty",
  },
  profile_id: {
    type: String,
  },
})

UserSchema.plugin(mongodbErrorHandler) // nice error hanlder

module.exports = User = mongoose.model('users', UserSchema)
