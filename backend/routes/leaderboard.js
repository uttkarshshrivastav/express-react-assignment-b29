const express = require('express')
const router = express.Router()

const { getLeaderboard} = require('../controllers/leaderboardController')
const { auth } = require('../middleware/auth')

router.get('/', getLeaderboard)


module.exports = router
