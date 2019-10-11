const router = require('express').Router()
const db = require('../db')

router.get('/', (req, res) => {
  let query =
    'CREATE TABLE users(id int AUTO_INCREMENT, name VARCHAR(35) NOT NULL, email VARCHAR(254) NOT NULL, password VARCHAR(255) NOT NULL, PRIMARY KEY (id), UNIQUE (email), UNIQUE (name))'
  db.query(query, (err, result) => {
    if (err) {
      throw err
    } else {
      console.log(result)
      res.json(result)
    }
  })
})

module.exports = router
