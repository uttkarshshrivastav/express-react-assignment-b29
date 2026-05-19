const { User } = require('../models');

const getLeaderboard = async (options = {}) => {
  try {
    const { limit = 10, skip = 0 } = options
    
    const users = await User.find({ role: 'user' })
      .select('username puzzlesSolved totalScore createdAt')
      .sort({ puzzlesSolved: -1, totalScore: -1, createdAt: 1 })
      .skip(skip)
      .limit(limit)
    
    const total = await User.countDocuments({ role: 'user' });
    
    const rankedUsers = users.map((user, index) => ({
      rank: skip + index + 1,
      userId: user._id,
      username: user.username,
      puzzlesSolved: user.puzzlesSolved,
      totalScore: user.totalScore,
      joinedAt: user.createdAt
    }))
    
    return {
      success: true,
      data: {
        leaderboard: rankedUsers,
        pagination: {
          currentPage: Math.floor(skip / limit) + 1,
          totalPages: Math.ceil(total / limit),
          totalUsers: total,
          usersPerPage: limit
        }
      }
    }
    
  } catch (error) {
    console.error('Get Leaderboard Error:', error)
    throw new Error('Failed to fetch leaderboard')
  }
}

const getUserRank = async (userId) => {
  try {
    const user = await User.findById(userId).select('username puzzlesSolved totalScore createdAt')

    if (!user) {
      return {
        success: false,
        message: 'User not found'
      }
    }

    const higherRankedUsers = await User.countDocuments({
      role: 'user',
      $or: [
        { puzzlesSolved: { $gt: user.puzzlesSolved } },
        {
          puzzlesSolved: user.puzzlesSolved,
          totalScore: { $gt: user.totalScore }
        },
        {
          puzzlesSolved: user.puzzlesSolved,
          totalScore: user.totalScore,
          createdAt: { $lt: user.createdAt }
        }
      ]
    })

    return {
      success: true,
      data: {
        rank: higherRankedUsers + 1,
        user: {
          id: user._id,
          username: user.username,
          puzzlesSolved: user.puzzlesSolved,
          totalScore: user.totalScore
        }
      }
    }
  } catch (error) {
    console.error('Get User Rank Error:', error)
    throw new Error('Failed to fetch user rank')
  }
}

module.exports = {
  getLeaderboard,
  getUserRank,
}
