
const express = require('express')
const router = express.Router()



const {
  getRandomPuzzle,
  getPuzzlesByDifficulty,
  submitAnswer,
  getPuzzleById
} = require('../controllers/puzzleController')

const { auth } = require('../middleware/auth')

router.get('/random', getRandomPuzzle)

router.get('/difficulty/:level', getPuzzlesByDifficulty)

router.get('/:id', getPuzzleById)

router.post('/:id/attempt', auth, submitAnswer)

module.exports = router
