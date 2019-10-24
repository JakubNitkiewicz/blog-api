const router = require('express').Router()
const verify = require('../middleware/verifyToken')
const News = require('../models').News
const NewsComments = require('../models').NewsComments
const User = require('../models').User
const UserDetails = require('../models').UserDetails
const jwtController = require('../controllers/validation/jwt')

const { newNewsValidation } = require('../controllers/validation/news')

// display all news
router.get('/', (req, res) => {
  console.log('in get /news')
  News.findAll({
    order: [['id', 'DESC']],
    include: [
      {
        model: User,
        attributes: []
      }
    ],
    attributes: {
      exclude: ['expandedText'],
      include: ['User.username']
    },
    raw: true
  })
    .then((news) => {
      res.send(news)
    })
    .catch((err) => {
      res.status(400).send(err)
    })
})

// add new news
router.post('/', verify, (req, res) => {
  const news = {
    title: req.body.title,
    introductionText: req.body.introductionText,
    expandedText: req.body.expandedText
  }
  // Validate input
  const { error } = newNewsValidation(news)
  if (error) return res.status(400).send(error.details[0].message)

  const token = req.header('auth-token')
  if (!token) return res.status(401).send('Access Denied')
  news.authorId = jwtController.getUserId(token)

  News.create({
    ...news
  })
    .then((response) => {
      res.send(response)
    })
    .catch((error) => {
      res.status(400).send(error)
    })
})

router.get('/:id', (req, res) => {
  News.findOne({
    where: {
      id: req.params.id
    },
    include: [
      {
        model: User,
        attributes: []
      }
    ],
    attributes: {
      include: ['User.username']
    },
    raw: true
  })
    .then((news) => {
      res.send(news)
    })
    .catch((err) => {
      res.status(400).send(err)
    })
})

router.get('/:id/comments', (req, res) => {
  NewsComments.findAll({
    order: [['id', 'DESC']],
    where: {
      newsId: req.params.id
    },
    include: [
      {
        model: User,
        attributes: [],
        include: [
          {
            model: UserDetails,
            attributes: []
          }
        ]
      }
    ],
    attributes: {
      include: [
        'User.username',
        'User.UserDetail.avatarURL',
        'User.UserDetail.posts'
      ]
    },
    raw: true
  })
    .then((news) => {
      res.send(news)
    })
    .catch((err) => {
      res.status(400).send(err)
    })
})

router.post('/:id/comments', verify, async (req, res) => {
  const token = req.header('auth-token')
  if (!token) return res.status(401).send('Access Denied')
  const comment = {
    content: req.body.commentText,
    authorId: jwtController.getUserId(token),
    newsId: req.params.id
  }

  // Validate input
  // NOT YET IMPLEMENTED (NYI)

  News.findOne({
    where: {
      id: req.params.id
    }
  })
    .then((news) => {
      news.increment('comments', { by: 1 })
    })
    .then(() => {
      NewsComments.create({
        ...comment
      })
        .then((response) => {
          res.send(response)
        })
        .catch((error) => {
          res.status(400).send(error)
        })
    })
    .catch((error) => {
      res.status(400).send(error)
    })
})

module.exports = router
