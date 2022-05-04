const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
    name: {
        required: true,
        type: String
    },
    auth: {
        required: true,
        type: String
    },
    isAdmin: {
        required: true,
        type: Boolean
    },
    discordID: {
        required: true,
        type: String
    },
    goals: {
        required: false,
        type: Number,
        default: 0
    }
})

module.exports = mongoose.model('Data', dataSchema)