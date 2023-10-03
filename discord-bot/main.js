// Definitions
require('dotenv').config()
const { Client, GatewayIntentBits } = require('discord.js')
const client = new Client({
  intents: [
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildBans,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent]
})

// Handlers and Collections
import('./handler.js')
global.client = client

// Starting Bot
client.login(process.env.MAINBOT)
  .then(() => console.log('[BOT] Bota giriş yapıldı!'))
  .catch(e => console.log('[HATA] Bota giriş yapılırken bir hata oluştu:\n' + e))
