'use strict'
const Hapi = require('hapi')
const mongoose = require('mongoose')

// import environmental variables
require('dotenv').config({ path: 'env' })

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
  await server
    .register(
      { plugin: require('./routes/Users') },
      { routes: { prefix: '/users' } }
    )
    .catch((err) => {
      console.log(`routes register err: ${err}`)
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
