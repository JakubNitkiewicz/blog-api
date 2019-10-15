const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
  const token = req.header('auth-token')
  if (!token) return res.status(401).send('Access Denied')

  try {
    const verified = jwt.verify(token, process.env.TOKEN_SECRET)
    // if token is valid for the next 10 seconds or less -> reject it
    const expirationDate = new Date(verified.exp * 1000)
    const currentTime = new Date()
    const timeDifference = (expirationDate.getTime() - currentTime.getTime()) / 1000
    if (timeDifference <= 10) {
      throw error
    }
    req.user = verified
    next()
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' })
  }
}
