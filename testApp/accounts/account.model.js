const mongoose = require('mongoose')
const Schema = mongoose.Schema

const schema = new Schema({
  email: { type: String, unique: true, required: true },
  passwordHash: { type: String, required: true },
  title: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  acceptTerms: Boolean,
  role: { type: String, required: true },
  verificationToken: String,
  verified: Date,
  resetToken: {
    token: String,
    expires: Date,
  },
  passwordReset: Date,
  created: { type: Date, default: Date.now },
  updated: Date,
})

schema.virtual('isVerified').get(function () {
  return !!(this.verified || this.passwordReset)
})

// set which properties to use when converting from MongoDb to json obj.
schema.set('toJSON', {
  virtuals: true, //include mongoose id property and not Mongodb _id
  versionKey: false, // exclude mongoose __v
  transform: function (doc, ret) {
    // remove these props when object is serialized
    delete ret._id
    delete ret.passwordHash
  },
})

module.exports = mongoose.model('Account', schema)
