const router = require('express').Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const User = require('../models').User
const AuthorizationUser = require('../models').AuthorizationUser
const UserDetails = require('../models').UserDetails
const {
  signupValidation,
  loginValidation
} = require('../controllers/validation/auth')

// Get all users
router.get('/', (req, res) => {
  User.findAll()
    .then((gigs) => {
      res.send(gigs)
    })
    .catch((err) => {
      res.status(400).send(err)
    })
})

// Register user route
router.post('/signup', async (req, res) => {
  // Hash password
  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(req.body.password, salt)

  const lowercaseEmail = new String(req.body.email).toLowerCase()
  const user = {
    username: req.body.username,
    email: lowercaseEmail,
    password: hashedPassword
  }

  // Validate input
  const error = signupValidation(user).error
  if (error) return res.status(400).send(error.details)

  // Check if email/username already exists
  const emailExists = await AuthorizationUser.findOne({
    where: {
      email: user.email
    }
  })
  if (emailExists) return res.status(400).send('Email is already taken')
  const usernameExists = await User.findOne({
    where: {
      username: user.username
    }
  })
  if (usernameExists) return res.status(400).send('Username is already taken')

  // Create new user
  AuthorizationUser.create({
    ...user
  })
    .then((createdUser) => {
      const token = generateToken(
        createdUser.id,
        process.env.TOKEN_SECRET,
        process.env.TOKEN_LIFE
      )
      const refreshToken = generateToken(
        createdUser.id,
        process.env.REFRESH_TOKEN_SECRET,
        process.env.REFRESH_TOKEN_LIFE
      )
      user.id = createdUser.id
      Promise.all([
        User.create({
          ...user
        }),
        UserDetails.create({
          ...user
        })
      ])
        .then(() => {
          res.send({
            id: user.id,
            username: user.username,
            token,
            refreshToken
          })
        })
        .catch((error) => {
          res.status(400).send(error)
        })
    })
    .catch((err) => {
      res.status(400).send(err)
    })
})

// Login route
router.post('/signin', async (req, res) => {
  // Validate input
  const error = loginValidation({
    email: req.body.email,
    password: req.body.password
  }).error
  if (error) return res.status(400).send(error.details)

  const user = await AuthorizationUser.findOne({
    include: [
      {
        model: User,
        attributes: []
      }
    ],
    attributes: {
      exclude: [],
      include: ['User.username']
    },
    where: {
      email: req.body.email
    },
    raw: true
  })
  if (!user) return res.status(400).send('Email or password is incorrect')

  // Check if password is correct
  const validPassword = await bcrypt.compare(req.body.password, user.password)
  if (!validPassword)
    return res.status(400).send('Email or password is incorrect')

  const token = generateToken(
    user.id,
    process.env.TOKEN_SECRET,
    process.env.TOKEN_LIFE
  )
  const refreshToken = generateToken(
    user.id,
    process.env.REFRESH_TOKEN_SECRET,
    process.env.REFRESH_TOKEN_LIFE
  )
  res.send({ id: user.id, username: user.username, token, refreshToken })
})

// Refresh JWT route
router.post('/refresh', async (req, res) => {
  const refreshToken = req.body.refreshToken
  if (!refreshToken) return res.status(401).send('Access Denied')
  try {
    // check if refreshToken is still valid
    const verifiedJWT = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET
    )
    const user = await AuthorizationUser.findOne({
      include: [
        {
          model: User,
          attributes: []
        }
      ],
      attributes: {
        exclude: [],
        include: ['User.username']
      },
      where: {
        id: verifiedJWT.id
      },
      raw: true
    })

    // TODO:
    // check if user is banned

    // if last time user was modified before refreshToken was issued
    // it means email/password hasn't been changed and it's safe to refresh token
    const issued = new Date(verifiedJWT.exp * 1000)
    if (issued < user.updatedAt) {
      res.status(401).json({ messae: '!Invalid token' })
    }

    // generate new set of tokens and send to user
    const newToken = generateToken(
      user.id,
      process.env.TOKEN_SECRET,
      process.env.TOKEN_LIFE
    )
    const newRefreshToken = generateToken(
      user.id,
      process.env.REFRESH_TOKEN_SECRET,
      process.env.REFRESH_TOKEN_LIFE
    )
    res.send({
      id: user.id,
      username: user.username,
      token: newToken,
      refreshToken: newRefreshToken
    })
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' })
  }
})

const generateToken = (id, secret, life) => {
  return jwt.sign({ id }, secret, { expiresIn: life })
}

module.exports = router
