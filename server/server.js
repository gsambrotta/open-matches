'use strict'
const Hapi = require('@hapi/hapi')
const mongoose = require('mongoose')
const UsersRoute = require('./routes/Users')
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
})

const init = async () => {
  await server.register(Inert).catch((err) => {
    console.log(`inert plugin err: ${err}`)
  })

  await server.register({ plugin: UsersRoute }).catch((err) => {
    console.log(`routes register err: ${err}`)
  })

  await server.route({
    method: 'GET',
    path: '/api/hello',
    handler: (req, h) => {
      return { text: 'Hello gioggi!' }
    },
  })

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
