const nodemailer = require('nodemailer')
const config = require('config.json')

module.exports = sendEmail

// wrapper around nodemailer to being able to send email from everywhere in the app
async function sendEmail({ to, subject, html, from = config.emailFrom }) {
  const transporter = nodemailer.createTransport(config.smtpOptions)
  await transporter.sendMail({ from, to, subject, html })
}
