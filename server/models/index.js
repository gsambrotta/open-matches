const mongoose = require('mongoose')
mongoose.Promise = global.Promise

const db = {}

db.mongoose = mongoose
db.user = require('./UserModel')
db.role = require('./RoleModel')
db.ROLES = ['user', 'admin', 'moderator']

module.exports = db
