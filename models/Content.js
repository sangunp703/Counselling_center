const mongoose = require('mongoose')

var Schema = mongoose.Schema

var replySchema = new Schema({
  reply: String,
  watched: Boolean
})

var contentSchema = new Schema({
  author: String,
  title: String,
  story: String,
  type: String,
  reply: [replySchema]
})

module.exports = mongoose.model('content', contentSchema)
