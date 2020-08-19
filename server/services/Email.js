const Mail = require('email-templates')
const { env } = require('../../config')

require('dotenv').config({ path: __dirname + '/../../env' })

module.exports = {
  sendTokenEmail,
}

function sendTokenEmail(userEmail, templateName, token) {
  // Better to do go to fake route and then make a call to endpoint + redirect or
  // we can also go directly to API endpoint and redirect?
  const url = `${env.APP_URL}/verify?token=${token}`

  const email = new Mail({
    message: {
      from: 'openmatches@gmail.com',
    },
    preview: true,
    send: true,
    transport: {
      host: process.env.MAIL_HOST,
      port: process.env.MAIL_PORT,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    },
  })

  return email
    .send({
      template: templateName,
      message: {
        to: userEmail,
      },
      locals: {
        url,
      },
    })
    .then((res) => {
      // console.log('res.originalMessage', res.originalMessage)
      return
    })
    .catch(console.error)
}
