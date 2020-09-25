const config = require('config.json')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const crypto = require('crypto')
const sendEmail = require('_helpers/send-email')
const db = require('_helpers/db')
const Role = require('_helpers/role')

// business logic for
// - sign up & verification
// - authentication with JWT and refresh token
// - forgot password
// - reset password
// we expose some methods used by the controller

module.exports = {
  authenticate,
  refreshToken,
  revokeToken,
  register,
  verifyEmail,
  forgotPassword,
  validateResetToken,
  resetPassword,
  getAll,
  getById,
  create,
  update,
  delete: _delete,
}

async function authenticate({ email, password, ipAddress }) {
  const account = await db.Account.findOne({ email })

  if (
    !account ||
    !account.isVerified ||
    !bcrypt.compareSync(password, account.passwordHash)
  ) {
    throw 'Email or password is incorrect'
  }

  //authenticate successfully so generate jwt and refresh token
  const jwtToken = generateJwtToken(account)
  const refreshToken = generateRefreshToken(account, ipAddress)

  //save refresh token on db
  await refreshToken.save()

  return {
    ...basicDetails(account),
    jwtToken,
    refreshToken: refreshToken.token,
  }
}

async function refreshToken({ token, ipAddress }) {
  const refreshToken = await getRefreshToken(token)
  const { account } = refreshToken

  const newRefreshToken = generateRefreshToken(account, ipAddress)
  refreshToken.revoked = Date.now()
  refreshToken.revokedByIp = ipAddress
  refreshToken.replaceByToken = newRefreshToken.token
  await refreshToken.save()
  await newRefreshToken.save()

  // generate new jwt token
  const jwtToken = generateJwtToken(account)

  return {
    ...basicDetails(account),
    jwtToken,
    refreshToken: newRefreshToken.token,
  }
}

async function revokeToken({ token, ipAddress }) {
  const refreshToken = await getRefreshToken(token)

  // revoke token and save
  refreshToken.revoked = Date.now()
  refreshToken.revokedByIp = ipAddress
  await refreshToken.save()
}

async function register(params, origin) {
  // validate
  if (await db.Account.findOne({ email: params.email })) {
    return await sendAlreadyRegisteredEmail(params.email, origin)
  }

  const account = new db.Account(params)

  // first registered account is an admin
  const isFirstAccount = (await db.Account.countDocuments({})) === 0
  account.role = isFirstAccount ? Role.Admin : Role.User
  account.verificationToken = randomTokenString()
  account.passwordHash = hash(params.password)

  //save account
  await account.save()

  //send email
  await sendVerificationEmail(account, origin)
}

async function verifyEmail({ token }) {
  const account = await db.Account.findOne({ verificationToken: token })

  if (!account) throw 'Verification failed'

  account.verified = Date.now()
  account.verificationToken = undefined
  await account.save()
}

async function forgotPassword({ email }, origin) {
  const account = await db.Account.findOne({ email })

  // return ok so is not possible to know we are collecting email in db
  if (!account) return

  // create reset token that expires after 24h
  account.resetToken = {
    token: randomTokenString(),
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
  }
  await account.save()

  //send email
  await sendPasswordResetEmail(account, origin)
}

async function validateResetToken({ token }) {
  const account = await db.Account.findOne({
    'resetToken.token': token,
    'resetToken.expires': { $gt: Date.now() },
  })

  if (!account) throw 'Invalid token'
}

async function resetPassword({ token, password }) {
  const account = await db.Account.findOne({
    'resetToken.token': token,
    'resetToken.expires': { $gt: Date.now() },
  })

  if (!account) throw 'Invalid token'

  // update password and remove reset token
  // why remove rest token??
  account.passwordHash = hash(password)
  account.passwordReset = Date.now()
  account.resetToken = undefined
  await account.save()
}

// get all accounts
async function getAll() {
  const accounts = await db.Account.find()
  return accounts.map((x) => basicDetails(x))
}

// get account by Id
async function getById(id) {
  const account = await getAccount(id)
  return basicDetails(account)
}

async function create(params) {
  //validate
  if (await db.Account.findOne({ email: params.email })) {
    throw `Email ${params.email} is already registered`
  }

  const account = new db.Account(params)
  account.verified = Date.now()

  await account.save()
  return basicDetails(account)
}

async function update(id, params) {
  const account = await getAccount(id)

  if (
    params.email &&
    account.email !== params.email &&
    (await db.Account.findOne({ email: params.email }))
  ) {
    throw `Email ${params.email} is already taken`
  }

  // update hash password, if it was entered
  if (params.password) {
    params.passwordHash = hash(params.password)
  }

  // copy params to account and save
  Object.assign(account, params)
  account.updated = Date.now()
  await account.save()

  return basicDetails(account)
}

async function _delete(id) {
  const account = await getAccount(id)
  await account.remove()
}

// helper functions

// find account
async function getAccount(id) {
  if (!db.isValidId(id)) throw 'Account not found'

  const account = await db.Account.findById(id)
  if (!account) throw 'Account not found'

  return account
}

function hash(password) {
  return bcrypt.hashSync(password, 10)
}

function generateJwtToken(account) {
  // create a jwt token containing the account id that expires in 15 minutes
  return jwt.sign({ sub: account.id, id: account.id }, config.secret, {
    expiresIn: '15m',
  })
}

function generateRefreshToken(account, ipAddress) {
  // create a refresh token that expires in 7 days
  return new db.RefreshToken({
    account: account.id,
    token: randomTokenString(),
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    createdByIp: ipAddress,
  })
}

async function getRefreshToken(token) {
  const refreshToken = await db.RefreshToken.findOne({ token }).populate(
    'account'
  )
  if (!refreshToken || !refreshToken.isActive) throw 'Invalid token'
  return refreshToken
}

function randomTokenString() {
  return crypto.randomBytes(40).toString('hex')
}

function basicDetails(account) {
  const {
    id,
    title,
    firstName,
    lastName,
    email,
    role,
    created,
    updated,
    isVerified,
  } = account
  return {
    id,
    title,
    firstName,
    lastName,
    email,
    role,
    created,
    updated,
    isVerified,
  }
}

async function sendVerificationEmail(account, origin) {
  let message
  if (origin) {
    const verifyUrl = `${origin}/account/verify-email?token=${account.verificationToken}`
    message = `<p>Please click the below link to verify your email address:</p>
                 <p><a href="${verifyUrl}">${verifyUrl}</a></p>`
  } else {
    message = `<p>Please use the below token to verify your email address with the <code>/account/verify-email</code> api route:</p>
                 <p><code>${account.verificationToken}</code></p>`
  }

  await sendEmail({
    to: account.email,
    subject: 'Sign-up Verification API - Verify Email',
    html: `<h4>Verify Email</h4>
             <p>Thanks for registering!</p>
             ${message}`,
  })
}

async function sendAlreadyRegisteredEmail(email, origin) {
  let message
  if (origin) {
    message = `<p>If you don't know your password please visit the <a href="${origin}/account/forgot-password">forgot password</a> page.</p>`
  } else {
    message = `<p>If you don't know your password you can reset it via the <code>/account/forgot-password</code> api route.</p>`
  }

  await sendEmail({
    to: email,
    subject: 'Sign-up Verification API - Email Already Registered',
    html: `<h4>Email Already Registered</h4>
             <p>Your email <strong>${email}</strong> is already registered.</p>
             ${message}`,
  })
}

async function sendPasswordResetEmail(account, origin) {
  let message
  if (origin) {
    const resetUrl = `${origin}/account/reset-password?token=${account.resetToken.token}`
    message = `<p>Please click the below link to reset your password, the link will be valid for 1 day:</p>
                 <p><a href="${resetUrl}">${resetUrl}</a></p>`
  } else {
    message = `<p>Please use the below token to reset your password with the <code>/account/reset-password</code> api route:</p>
                 <p><code>${account.resetToken.token}</code></p>`
  }

  await sendEmail({
    to: account.email,
    subject: 'Sign-up Verification API - Reset Password',
    html: `<h4>Reset Password Email</h4>
             ${message}`,
  })
}

// {
//   "email": "jason@example.com",
//   "password": "hakfjhQIUEQ64381HEKJ"
// }

// jwt eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1ZjZkZmVjMTNjMWY3NjVkZTIzNmJmODIiLCJpZCI6IjVmNmRmZWMxM2MxZjc2NWRlMjM2YmY4MiIsImlhdCI6MTYwMTA0NTE1NiwiZXhwIjoxNjAxMDQ2MDU2fQ.GjpfLQKYOs7QpHlaNWKFdybZxP-zZgQ_OkdRarLcqMg
