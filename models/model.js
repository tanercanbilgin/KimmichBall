const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
    playerName: {
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
        required: false,
        type: String
    },
    goals: {
        required: false,
        type: Number,
        default: 0
    },
    assists: {
        required: false,
        type: Number,
        default: 0
    },
    ownGoals: {
        required: false,
        type: Number,
        default: 0
    },
    wins: {
        required: false,
        type: Number,
        default: 0
    },
    loses: {
        required: false,
        type: Number,
        default: 0
    },
    playtime: {
        required: false,
        type: Number,
        default: 0
    },
    winrate: {
        required: false,
        type: Number,
        default: 0
    },
    games: {
        required: false,
        type: Number,
        default: 0
    },
    elo: {
        required: false,
        type: Number,
        default: 1000
    },
    createdAt: { 
        type: Number
    },
    updatedAt:{
        type: Number
    }
}, {
    timestamps: { currentTime: () => Math.floor(Date.now() / 1000) }
  })

module.exports = mongoose.model('Data', dataSchema)