const express = require('express')
const router = express.Router()

const { getLeaderboard, getMyRank } = require('../controllers/leaderboardController')
const { auth } = require('../middleware/auth')

router.get('/', getLeaderboard)
router.get('/me', auth, getMyRank)


module.exports = router
