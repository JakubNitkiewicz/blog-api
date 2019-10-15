const router = require('express').Router()
const verify = require('../middleware/verifyToken')
const News = require('../models').News
const User = require('../models').User
const jwtController = require('../controllers/validation/jwt')

const { newNewsValidation } = require('../controllers/validation/news')

// display all news
router.get('/', (req, res) => {
  News.findAll({
    order: [
      ['id', 'DESC']
    ],
    include: [
      {
        model: User,
        attributes: []
      }
    ],
    attributes: {
      exclude: ['updatedAt'],
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
  const error = newNewsValidation(news).error
  if (error) return res.status(400).send(error.details)

  const token = req.header('auth-token')
  if (!token) return res.status(401).send('Access Denied')
  news.authorId = jwtController.getUserId(token).id

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
      exclude: ['updatedAt'],
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

module.exports = router
