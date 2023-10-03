require('dotenv').config()

const cors = require('cors')
const express = require('express')
const mongoose = require('mongoose')

const mongoString = process.env.DATABASE_URL;
mongoose.set('strictQuery', false);

(async () => {
  try {
    await mongoose.connect(mongoString)
    console.log('Database Connected')
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
})()

const database = mongoose.connection

database.on('disconnected', () => {
  console.log('Database Disconnected. Attempting to reconnect...')
  mongoose.connect(mongoString)
})

const app = express()
app.use(cors())
app.use(express.json())

const routes = require('./routes/routes.js')

app.use('/api', routes)
app.use(cors({ origin: 'https://html5.haxball.com' }))

const PORT = process.env.PORT || 3100

app.listen(PORT, () => {
  console.log(`Server Started at ${PORT}`)
})
