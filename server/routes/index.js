const path = require('path')
const fs = require('fs')
const _ = require('underscore')

fs.readdirSync(__dirname).forEach(function (file) {
  if (file === 'index.js' || file === 'Users-old.js') return
  const mod = {}

  // Store module with its name (from filename)
  mod[path.basename(file, '.js')] = require(path.join(__dirname, file))

  // Extend module.exports
  _.extend(module.exports, mod)
})
