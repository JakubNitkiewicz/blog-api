const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const app = express()
require('dotenv').config()

const db = require('./db')
app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true
  })
)

// temp routes
// app.get('/', (req, res) => {
//   let sql = 'SELECT * FROM `users`'
//   let query = db.query(sql, (err, results) => {
//     if (err) {
//       res.status(400).send(err)
//     } else {
//       res.json(results)
//     }
//   })
// })

// app.get('/', (req, res) => {
//   let sql = 'SELECT * FROM `users` WHERE `name` = ?'
//   let [rows, fields] = db.execute(sql, 'Ryszardj2')
//   res.json(fields)
// })

db.authenticate()
.then(() => console.log('Database connected'))
.catch(err => console.log('Error: ' + err))

// Import routes
const authRoute = require('./routes/auth')
const installRoute = require('./routes/install')

// Route MiddleWare
app.use('/api/install', installRoute)
app.use('/api/user', authRoute)


//test
const testRoute = require('./routes/test')
app.use('/api/test', testRoute)

const PORT = process.env.PORT || 3300

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
