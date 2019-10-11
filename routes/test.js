const router = require('express').Router()
const verify = require('../middleware/verifyToken')

router.get('/', verify, (req, res) => {
  res.json({
    posts: {
      title: 'titjskd',
      content: 'lorem'
    }
  })
})

module.exports = router
