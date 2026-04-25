const puzzleService = require('../services/puzzleService')



const getRandomPuzzle = async (req, res) => {
  try {
    const { difficulty = 'all' } = req.query
    
    const userId = req.user.userId 
    
    const result = await puzzleService.getRandomPuzzle(difficulty, userId)
    
    if (!result.success) {
      return res.status(404).json(result)
    }
    
    return res.status(200).json(result)
    
  } catch (error) {
    console.error('Random Puzzle Controller Error:', error)
    return res.status(500).json({
      success: false,
      message: 'error finding puzzle'
    })
  }
}




const getPuzzlesByDifficulty = async (req, res) => {
  try {
    const { level } = req.params
    
    if (!['easy', 'medium', 'hard'].includes(level)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid difficulty level. Must be: easy, medium, or hard'
      })
    }
    
    const result = await puzzleService.getPuzzlesByDifficulty(level)
    
    if (!result.success) {
      return res.status(404).json(result)
    }
    
    return res.status(200).json(result)
    
  } catch (error) {
    console.error('Puzzles By Difficulty Controller Error:', error)
    return res.status(500).json({
      success: false,
      message: ' error finding puzzles'
    })
  }
}



const submitAnswer = async (req, res) => {
  try {
    const { id: puzzleId } = req.params
    const { answer } = req.body
    const userId = req.user.userId
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required to submit'
      });
    }
    if (!answer || answer.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'no answer summited ',
        data: { isCorrect: false }
      });
    }
    
    const result = await puzzleService.validateAnswer(puzzleId, userId, answer)
    
    if (!result.success) {
      if (result.message === 'Puzzle not found') {
        return res.status(404).json(result)
      }
      return res.status(404).json(result)
    }
    
    return res.status(200).json(result)
    
  } catch (error) {
    console.error('Submit Answer Controller Error:', error)
    return res.status(500).json({
      success: false,
      message: 'error in validating answer'
    })
  }
}

const getPuzzleById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId || null
    
    const Puzzle = require('../models/Puzzle')
    const Attempt = require('../models/Attempt')
    
    const puzzle = await Puzzle.findById(id)
    
    if (!puzzle) {
      return res.status(404).json({
        success: false,
        message: 'Puzzle not found'
      });
    }
    
    let hintUnlocked = false
    let attemptsCount = 0
    
    if (userId) {
      const attempt = await Attempt.findOne({ userId, puzzleId: id })
      if (attempt) {
        attemptsCount = attempt.attemptsCount;
        hintUnlocked = attempt.hintUnlocked;
      }
    }
    
    return res.status(200).json({
      success: true,
      data: {
        puzzle: {
          id: puzzle._id,
          description: puzzle.description,
          level: puzzle.level,
          timesSolved: puzzle.timesSolved,
          hint: hintUnlocked ? puzzle.hint : null,
          hintUnlocked: hintUnlocked
        },
        attemptsCount: attemptsCount
      }
    });
    
  } catch (error) {
    console.error('Error in getting puzzle by id ', error)
    return res.status(500).json({
      success: false,
      message: 'error in fetching puzzle'
    })
  }
}

module.exports = {
  getRandomPuzzle,
  getPuzzlesByDifficulty,
  submitAnswer,
  getPuzzleById
}
