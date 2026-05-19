const express = require('express')
const dotenv = require('dotenv')
const cors = require('cors')


dotenv.config()

const app = express()

app.use(cors())

app.use(express.json())

app.use(express.urlencoded({ extended: true }))

const authRoutes = require('./routes/auth')

const puzzleRoutes = require('./routes/puzzle')

const leaderboardRoutes = require('./routes/leaderboard')

app.use('/api/auth', authRoutes)
app.use('/api/puzzles', puzzleRoutes)
app.use('/api/leaderboard', leaderboardRoutes)



module.exports = app;


