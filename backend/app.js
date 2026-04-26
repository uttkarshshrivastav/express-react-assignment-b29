const express = require('express')
const dotenv = require('dotenv')


dotenv.config()

const app = express()

app.use(express.json())

app.use(express.urlencoded({ extended: true }))

const authRoutes = require('./routes/auth')

const puzzleRoutes = require('./routes/puzzle')

const leaderboardRoutes = require('./routes/leaderboard')

app.use('/api/auth', authRoutes)
app.use('/api/puzzles', puzzleRoutes)
app.use('/api/leaderboard', leaderboardRoutes)



module.exports = app;


