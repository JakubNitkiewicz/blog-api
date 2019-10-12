const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const app = express()
const cors = require('cors')
require('dotenv').config()

const db = require('./db')

app.use(cors());
app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true
  })
)

db.authenticate()
.then(() => console.log('Database connected'))
.catch(err => console.log('Error: ' + err))

// Import routes
const authRoutes = require('./routes/auth')
const installRoutes = require('./routes/install')
const userRoutes = require('./routes/user')

// Route MiddleWare
app.use('/api/install', installRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/user', userRoutes)


//test
const testRoute = require('./routes/test')
app.use('/api/test', testRoute)

const PORT = process.env.PORT || 3300

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
