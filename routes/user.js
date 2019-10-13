const router = require('express').Router()
const User = require('../models').User
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
    where: {
      id: req.params.id
    }
  })
    .then((user) => {
      res.send(user)
    })
    .catch((err) => {
      res.status(400).send(err)
    })
})

module.exports = router
