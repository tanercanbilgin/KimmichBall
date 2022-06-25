const mongoose = require('mongoose');

const banSchema = new mongoose.Schema({
    auth: {
        type: String
    },
    conn: {
        type: String
    }
})

module.exports = mongoose.model('ban', banSchema)