
const { Puzzle, Attempt, User } = require('../models')

const CONFIG = {
  DIFFICULTY_SCORES: {
    easy: 100,
    medium: 200,
    hard: 300
  },
  
  HINT_UNLOCK_THRESHOLD: 3,
  PENALTY_PER_ATTEMPT: 10,
  MINIMUM_SCORE: 10
};


const getRandomPuzzle = async (difficulty = 'all', userId = null) => {
  try {
    const query = { isActive: true }
    
    if (difficulty !== 'all' && ['easy', 'medium', 'hard'].includes(difficulty)) {
      query.level = difficulty
    }

    let excludePuzzleIds = []
    if (userId) {
      const solvedAttempts = await Attempt.find({
        userId,
        isSolved: true
      }).select('puzzleId')
      excludePuzzleIds = solvedAttempts.map(attempt => attempt.puzzleId.toString())
    }
    // $nin this means not in mongo 
    if (excludePuzzleIds.length > 0) {
      query._id = { $nin: excludePuzzleIds }
    }

    const availableCount = await Puzzle.countDocuments(query);
    
    if (availableCount === 0) {
      return {
        success: false,
        message: userId 
          ? 'No unsolved puzzles available'
          : 'No puzzles available for this difficulty',
        data: null
      }
    }

    const [puzzle] = await Puzzle.aggregate([
      { $match: query }, //equall to find
      { $sample: { size: 1 } }//ssample one from the result of find 
    ])

    let attemptInfo = null
    let hintUnlocked = false
    
    if (userId) {
      attemptInfo = await Attempt.findOne({
        userId,
        puzzleId: puzzle._id
      });
      
      if (attemptInfo && attemptInfo.attemptsCount >= CONFIG.HINT_UNLOCK_THRESHOLD) {
        hintUnlocked = true;
        if (!attemptInfo.hintUnlocked) {
          attemptInfo.hintUnlocked = true
          await attemptInfo.save()
        }
      }
    }

    return {
      success: true,
      message: 'Puzzle fetched successfully',
      data: {
        puzzle: {
          id: puzzle._id,
          description: puzzle.description,
          level: puzzle.level,
          timesSolved: puzzle.timesSolved,
          hint: hintUnlocked ? puzzle.hint : null,
          hintUnlocked: hintUnlocked
        },
        attemptInfo: attemptInfo ? {
          attemptsCount: attemptInfo.attemptsCount,
          isSolved: attemptInfo.isSolved,
          hintUnlocked: attemptInfo.hintUnlocked
        } : null
      }
    };

  } catch (error) {
    console.error('Get Random Puzzle Error:', error);
    throw new Error('Failed to fetch puzzle');
  }
}






const validateAnswer = async (puzzleId, userId, answer) => {
  try {
    if (!answer || answer.trim().length === 0) {
      return {
        success: false,
        message: 'Please provide an answer',
        data: { isCorrect: false }
      }
    }

    const puzzle = await Puzzle.findById(puzzleId);
    if (!puzzle) {
      return {
        success: false,
        message: 'Puzzle not found',
        data: { isCorrect: false }
      };
    }

    const normalizedAnswer = answer.toLowerCase().trim();
    const puzzleName = puzzle.name.toLowerCase().trim();
    const aliases = puzzle.aliases.map(a => a.toLowerCase().trim());
    
    let isCorrect;

    if (
    normalizedAnswer === puzzleName ||
    aliases.includes(normalizedAnswer)
    ) {
      isCorrect = true;
    } else {
      isCorrect = false;
    }

    let attempt = await Attempt.findOne({ userId, puzzleId });

    if (!attempt) {
      attempt = new Attempt({
        userId,
        puzzleId,
        attemptsCount: 0,
        isSolved: false,
        hintUnlocked: false
      });
    }

    if (attempt.isSolved) {
      return {
        success: true,
        message: 'You have already solved this puzzle',
        data: {
          isCorrect: true,
          alreadySolved: true,
          correctAnswer: puzzle.name,
          attemptsCount: attempt.attemptsCount
        }
      };
    }

    attempt.attemptsCount += 1;

    const hintJustUnlocked = !attempt.hintUnlocked &&  attempt.attemptsCount >= CONFIG.HINT_UNLOCK_THRESHOLD;
    
    if (hintJustUnlocked) {
      attempt.hintUnlocked = true;
    }

    let score = 0;

    if (isCorrect) {
      attempt.isSolved = true;
      attempt.solvedAt = new Date();
      
      score = calculateScore(puzzle.level, attempt.attemptsCount);
      
      puzzle.timesSolved += 1;
      await puzzle.save();
      
      await User.findByIdAndUpdate(userId, {
        $inc: {
          puzzlesSolved: 1,
          totalScore: score
        }
      });
    }

    await attempt.save();

    const response = {
      success: true,
      message: isCorrect ? 'Correct Well done' : 'Incorrect answer. Try again',
      data: {
        isCorrect: isCorrect,
        attemptsCount: attempt.attemptsCount,
        hintUnlocked: attempt.hintUnlocked || hintJustUnlocked,
        hint: (attempt.hintUnlocked || hintJustUnlocked) ? puzzle.hint : null,
        hintJustUnlocked: hintJustUnlocked
      }
    }

    if (isCorrect) {
      response.data.score = score
      response.data.correctAnswer = puzzle.name
    }

    return response

  } catch (error) {
    console.error('Validate Answer Error:', error)
    throw new Error('Failed to validate answer')
  }
}






const calculateScore = (difficulty, attemptsCount) => {
  const baseScore = CONFIG.DIFFICULTY_SCORES[difficulty] || 100;
  const failedAttempts = attemptsCount - 1;
  const penalty = failedAttempts * CONFIG.PENALTY_PER_ATTEMPT;
  const finalScore = Math.max(baseScore - penalty, CONFIG.MINIMUM_SCORE);
  return finalScore;
}



const getPuzzlesByDifficulty = async (difficulty) => {
  try {
    if (!['easy', 'medium', 'hard'].includes(difficulty)) {
      return {
        success: false,
        message: 'Invalid difficulty level, Must be: easy, medium, or hard'
      }
    }

    const puzzles = await Puzzle.find({
      level: difficulty,
      isActive: true
    }).select('description level timesSolved')

    return {
      success: true,
      data: {
        puzzles: puzzles.map(p => ({
          id: p._id,
          description: p.description,
          level: p.level,
          timesSolved: p.timesSolved
        }))
      }
    }

  } catch (error) {
    console.error('Get Puzzles By Difficulty Error:', error);
    throw new Error('Failed to fetch puzzles');
  }
};

module.exports = {
  getRandomPuzzle,
  validateAnswer,
  calculateScore,
  getPuzzlesByDifficulty,
  CONFIG
};
