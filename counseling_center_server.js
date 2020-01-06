const express = require('express')
const app = express()
const mongoose = require('mongoose')
const PORT = process.env.PORT || 3001
var User = require('./models/User')
var Content = require('./models/Content')

var db = mongoose.connection
db.on('error', console.error)
db.once('open', () => {
  console.log('Connected to mongod server')
})
mongoose.connect('mongodb://localhost/counseling_center')

const bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use('/', express.static('./public'))
app.use('/intro', express.static('./public'))
app.use('/check', express.static('./public'))
app.use('/main', express.static('./public'))

const database = require('./server/database')(app, User, Content)

app.listen(PORT, () => {
  console.log('server is running => ' + `http://localhost:${PORT}`)
})
