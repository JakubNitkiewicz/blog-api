const jwt = require('jsonwebtoken')

const getUserId = (data) => {
  const decodedToken = jwt.decode(data, process.env.TOKEN_SECRET)
  return decodedToken.id
}

module.exports.getUserId = getUserId
