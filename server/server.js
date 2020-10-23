'use strict'
const Hapi = require('@hapi/hapi')
const mongoose = require('mongoose')
const routes = require('./routes')
const Inert = require('@hapi/inert')
const HapiAuthJwt = require('hapi-auth-jwt2')
//const jwt = require('jsonwebtoken'),

// import environmental variables
require('dotenv').config({ path: '../env' })

const server = new Hapi.server({
  host: 'localhost',
  port: 5000,
  routes: {
    cors: true,
  },
})

const validate = async function (user, request, h) {
  // do your checks to see if the user is valid
  if (!user.id) {
    return console.log('user is not valid')
  } else {
    return console.log('user is valid')
  }
}

async function init() {
  await server.register(Inert).catch((err) => {
    console.log(`inert plugin err: ${err}`)
  })

  await server.register(HapiAuthJwt).catch((err) => {
    console.log(`jwt auth plugin err: ${err}`)
  })
  // strategy name and Schema are call 'jwt'
  server.auth.strategy('jwt', 'jwt', {
    key: process.env.SECRET_KEY,
    validate,
    verifyOptions: { algorithms: ['HS256'] },
  })
  server.auth.default('jwt') // so JWT auth is required for all routes

  // Add all the routes within the routes folder
  for (let route in routes) {
    server.route(routes[route])
  }

  await server.start((err) => {
    if (err) throw err

    server.app.db = mongoose.connect(
      process.env.DATABASE,
      {
        useNewUrlParser: true,
        useFindAndModify: false,
      },
      (err) => {
        if (err) {
          console.error(`🙅 🚫 🙅 🚫 🙅 🚫 🙅 🚫 → ${err.message}`)
          throw err
        }
      }
    )
  })

  process.on('unhandledRejection', (err) => {
    console.log(err)
    process.exit(1)
  })
}

init()
