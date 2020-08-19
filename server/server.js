'use strict'
const Hapi = require('@hapi/hapi')
const mongoose = require('mongoose')
const routes = require('./routes')
const Inert = require('@hapi/inert')
const path = require('path')

// import environmental variables
require('dotenv').config({ path: '../env' })

const server = new Hapi.server({
  host: 'localhost',
  port: 5000,
  routes: {
    cors: true,
  },
})

server.app.db = mongoose.connect(process.env.DATABASE, {
  useNewUrlParser: true,
  useFindAndModify: false,
})

const init = async () => {
  await server.register(Inert).catch((err) => {
    console.log(`inert plugin err: ${err}`)
  })

  // Add all the routes within the routes folder
  for (let route in routes) {
    server.route(routes[route])
  }

  await server.route({
    method: 'GET',
    path: '/{path*}',
    handler: {
      directory: {
        path: path.join(__dirname, '../dist/'),
        // display a list of all the file in that folder
        listing: false,
        index: true,
      },
    },
  })

  await server.start()
  console.log(`server is running at: ${server.info.uri}`)
}

process.on('unhandledRejection', (err) => {
  console.log(err)
  process.exit(1)
})

mongoose.connection.on('error', (err) => {
  console.error(`🙅 🚫 🙅 🚫 🙅 🚫 🙅 🚫 → ${err.message}`)
})

init()
// require('./services/Email')
