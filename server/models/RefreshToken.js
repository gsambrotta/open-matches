const mongoose = require('mongoose')
const Schema = mongoose.Schema
const mongodbErrorHandler = require('mongoose-mongodb-errors')

const RefreshTokenSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  token: String,
  expires: Date,
  created: { type: Date, default: Date.now },
  createdByIp: String,
  revoked: Date,
  revokedByIp: String,
  replacedByToken: String,
})

// vitruals => fields that don't need to be saved in db
RefreshTokenSchema.virtual('isExpired').get(function () {
  return Date.now() >= this.expires
})

RefreshTokenSchema.virtual('isActive').get(function () {
  return !this.revoked && !this.isExpired
})

RefreshTokenSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    // remove these props when object is serialized
    delete ret._id
    delete ret.id
    delete ret.user
  },
})

RefreshTokenSchema.plugin(mongodbErrorHandler) // nice error hanlder
module.exports = RefreshToken = mongoose.model(
  'RefreshToken',
  RefreshTokenSchema
)
