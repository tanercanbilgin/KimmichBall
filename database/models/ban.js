const mongoose = require('mongoose')

const banSchema = new mongoose.Schema({
  auth: {
    type: String,
    required: true,
    unique: true
  },
  conn: {
    type: String,
    required: true,
    unique: true
  }
})
module.exports = mongoose.model('ban', banSchema)
