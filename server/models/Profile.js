const mongoose = require('mongoose')
const Schema = mongoose.Schema

const validator = require('validator')
const mongodbErrorHandler = require('mongoose-mongodb-errors')

const ProfileSchema = new Schema({
  user_is: {
    type: String,
    required: true,
    // RELATION DB
  },
  username: {
    type: String,
    unique: true,
    trim: true,
    required: "Username can't be empty",
  },
  is_coach: {
    type: Boolean,
    required: true,
  },
  is_active: {
    type: Boolean,
    required: true,
  },
  days_available: {
    type: Number,
    minimum: 1,
    maximum: 5,
    required: true,
  },
  day_type: {
    type: String,
    required: true,
  },
  time_of_day: {
    type: String,
    required: true,
  },
  is_remote: {
    type: Boolean,
    required: true,
  },
  city: {
    type: String,
  },
  skills: {
    type: [String],
    required: true,
  },
  profile_pic: {
    type: String,
    createdDate: Date.now,
  },
  bio: {
    type: String,
  },
})

ProfileSchema.plugin(mongodbErrorHandler) // nice error handler

module.exports = Profile = mongoose.model('profile', ProfileSchema)
