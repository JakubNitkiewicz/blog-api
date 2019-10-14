const router = require('express').Router()
const verify = require('../middleware/verifyToken')
const User = require('../models').User
const AuthorizationUser = require('../models').AuthorizationUser

router.get('/', verify, (req, res) => {
  res.json({
    posts: {
      title: 'titjskd',
      content: 'lorem'
    }
  })
})

// router.get('/', (req, res) => {
//   User.findAll({
//     include: [
//       {
//         model: AuthorizationUser,
//         attributes: []
//       }
//     ],
//     attributes: {
//       exclude: ['createdAt', 'updatedAt'],
//       include: ['AuthorizationUser.email']
//     },
//     raw: true
//   })
//     .then((gigs) => {
//       res.send(gigs)
//     })
//     .catch((err) => {
//       res.status(400).send(err)
//     })
// })

module.exports = router
