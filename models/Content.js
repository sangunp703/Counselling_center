const mongoose = require('mongoose')

var Schema = mongoose.Schema

var contentSchema = new Schema({
  author: String,
  title: String,
  story: String,
  type: String,
  reply: [String]
})

module.exports = mongoose.model('content', contentSchema)
