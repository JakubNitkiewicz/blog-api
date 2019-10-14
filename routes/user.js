const router = require('express').Router()
const User = require('../models').User
const UserDetails = require('../models').UserDetails
const AuthorizationUser = require('../models').AuthorizationUser

// Get all users
// router.get('/', (req, res) => {
//   User.findAll()
//     .then((users) => {
//       res.send(users)
//     })
//     .catch((err) => {
//       res.status(400).send(err)
//     })
// })

router.get('/', (req, res) => {
  User.findAll({
    attributes: {
      exclude: ['updatedAt']
    },
    raw: true
  })
    .then((users) => {
      res.send(users)
    })
    .catch((err) => {
      res.status(400).send(err)
    })
})

router.get('/:id', (req, res) => {
  User.findOne({
    include: [
      {
        model: UserDetails,
        attributes: []
      }
    ],
    attributes: {
      exclude: [],
      include: ['UserDetails.avatarURL', 'UserDetails.posts']
    },
    where: {
      id: req.params.id
    },
    raw: true
  })
    .then((user) => {
      res.send(user)
    })
    .catch((err) => {
      res.status(400).send(err)
    })
})


module.exports = router
