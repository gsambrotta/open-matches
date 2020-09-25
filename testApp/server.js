require('rootpath')()
const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const errorHandler = require('_middleware/error-handler')

const app = express()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cookieParser())
app.use(cors())

// api routes
app.use('/accounts', require('./accounts/account.controller'))

app.use(errorHandler)

const port =
  process.env.NODE_ENV === 'production' ? process.env.PORT || 80 : 4000
app.listen(port, () => {
  console.log('server listing on port' + port)
})
