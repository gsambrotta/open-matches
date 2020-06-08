const mongoose = require('mongoose')
const Schema = mongoose.Schema

const validator = require('validator')
const mongodbErrorHandler = require('mongoose-mongodb-errors')

const UserSchema = new Schema({
  username: {
    type: String,
    unique: true,
    trim: true,
    validate: [validator.isEmail, 'Invalid Email'],
    // required: "Username can't be empty",
  },
  email: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    required: "Email can't be empty",
  },
  password: {
    type: String,
    required: "Password can't be empty",
  },
  profilePic: {
    type: String,
    createdDate: Date.now,
  },
  bio: {
    type: String,
  },
  isActive: {
    type: Boolean,
    // required: true,
  },
  days_available: {
    type: Number,
    minimum: 1,
    maximum: 5,
    // required: true,
  },
  day_type: {
    type: String,
    // required: true,
  },
  time_of_day: {
    type: String,
    // required: true,
  },
  isRemote: {
    type: Boolean,
    // required: true,
  },
  city: {
    type: String,
  },
  skills: {
    type: [String],
    // required: true,
  },
})

UserSchema.plugin(mongodbErrorHandler) // nice error hanlder

module.exports = User = mongoose.model('users', UserSchema)
