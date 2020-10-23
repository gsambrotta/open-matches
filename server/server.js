'use strict'
const Hapi = require('@hapi/hapi')
const mongoose = require('mongoose')
const Inert = require('@hapi/inert')
// const HapiAuthJwt = require('hapi-auth-jwt2')
//const jwt = require('jsonwebtoken'),

const routes = require('./routes')
const db = require('./models')
// import environmental variables
require('dotenv').config({ path: '../env' })

const server = Hapi.server({
  host: 'localhost',
  port: 5000,
  routes: {
    cors: true,
  },
})

const Role = db.role

const init = async () => {
  await server.register(Inert).catch((err) => {
    console.log(`inert plugin err: ${err}`)
  })
  // await server.register(HapiAuthJwt).catch((err) => {
  //   console.log(`jwt auth plugin err: ${err}`)
  // })

  // Add role to DB if they don't exist yet
  Role.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      new Role({
        name: 'user',
      }).save((err) => {
        if (err) return console.log('error', err)
        console.log('added *user* to roles collection')
      })
    }
  })
  Role.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      new Role({
        name: 'moderator',
      }).save((err) => {
        if (err) return console.log('error', err)
        console.log('added *moderator* to roles collection')
      })
    }
  })
  Role.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      new Role({
        name: 'admin',
      }).save((err) => {
        if (err) return console.log('error', err)
        console.log('added *admin* to roles collection')
      })
    }
  })

  // Add all the routes within the routes folder
  for (let route in routes) {
    server.route(routes[route])
  }

  await server.start()
  console.log(`server is running at ${server.info.uri}`)

  server.app.db = mongoose
    .connect(
      process.env.DATABASE,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true,
      },
      (err) => {
        if (err) {
          console.error(`🙅 🚫 🙅 🚫 🙅 🚫 🙅 🚫 → ${err.message}`)
          throw err
        }
      }
    )
    .then(() => {
      console.log('Successfully connect to MongoDB')
    })
}

process.on('unhandledRejection', (err) => {
  console.log(err)
  process.exit(1)
})

init()
