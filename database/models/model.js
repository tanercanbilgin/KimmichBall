const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
    isim: {
        type: String,
        required: true,
    },
    auth: {
        type: String,
        required: true,
    },
    conn: {
        type: String,
        required: true,
    },
    isMaster: {
        type: Boolean,
        default: false,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    isVIP: {
        type: Boolean,
        default: false,
    },
    discordID: {
        type: String,
        default: "0",
    },
    gol: {
        type: Number,
        default: 0,
    },
    asist: {
        type: Number,
        default: 0,
    },
    kk: {
        type: Number,
        default: 0,
    },
    galibiyet: {
        type: Number,
        default: 0,
    },
    aktiflik: {
        type: Number,
        default: 0,
    },
    oyunlar: {
        type: Number,
        default: 0,
    },
    cs: {
        type: Number,
        default: 0,
    },
    puan: {
        type: Number,
        default: 1000,
    },
    bakiye: {
        type: Number,
        default: 0,
    },
    createdAt: {
        type: Number
    },
    updatedAt: {
        type: Number
    }
}, {
    timestamps: { currentTime: () => Math.floor(Date.now() / 1000) }
})
module.exports = mongoose.model('gamedata', dataSchema);