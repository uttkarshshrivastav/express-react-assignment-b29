const { User } = require('../models');

const getLeaderboard = async (options = {}) => {
  try {
    
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
// function so that a user can cheeck his  \her rank make it here and exppoer (getUserRank)

module.exports = {
  getLeaderboard,
}
