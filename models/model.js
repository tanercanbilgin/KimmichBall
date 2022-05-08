const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
    isim: {
        required: true,
        type: String
    },
    auth: {
        required: true,
        type: String
    },
    conn: {
        required: true,
        type: String
    },
    isMaster: {
        required: false,
        type: Boolean
    },
    isAdmin: {
        required: false,
        type: Boolean
    },
    isVIP: {
        required: false,
        type: Boolean
    },
    discordID: {
        required: false,
        type: String
    },
    gol: {
        required: false,
        type: Number,
        default: 0
    },
    asist: {
        required: false,
        type: Number,
        default: 0
    },
    kk: {
        required: false,
        type: Number,
        default: 0
    },
    galibiyet: {
        required: false,
        type: Number,
        default: 0
    },
    aktiflik: {
        required: false,
        type: Number,
        default: 0
    },
    oyunlar: {
        required: false,
        type: Number,
        default: 0
    },
    cs: {
        required: false,
        type: Number,
        default: 0
    },
    puan: {
        required: false,
        type: Number,
        default: 1000
        },
    bakiye: {
        required: false,
        type: Number,
        default: 0
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

module.exports = mongoose.model('gamedata', dataSchema)