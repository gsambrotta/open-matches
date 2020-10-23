'use strict'
const path = require('path')

// public route to serve react content

module.exports = (function () {
  return [
    {
      method: 'GET',
      path: '/{path*}',
      handler: {
        directory: {
          path: path.join(__dirname, '../dist/'),
          // display directory list of files in /dist folder
          listing: false,
          index: true,
        },
      },
      options: { auth: false },
    },
  ]
})()
