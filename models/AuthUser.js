const Sequelize = require('sequelize')
const db = require('../db')

const UserAuth = db.define('authuser', {
  email: {
    type: Sequelize.STRING
  },
  password: {
    type: Sequelize.STRING
  }
})

module.exports = UserAuth