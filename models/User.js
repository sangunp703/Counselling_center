const mongoose = require('mongoose')

var Schema = mongoose.Schema

var userSchema = new Schema({
  name: String,
  pw: String,
  email: String
})

module.exports = mongoose.model('user', userSchema)
