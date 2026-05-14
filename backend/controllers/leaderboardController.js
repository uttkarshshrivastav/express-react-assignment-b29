const leaderboardService = require('../services/leaderboardService')
const getLeaderboard = async (req, res) => {
  try {
    const parsedLimit = Math.min(parseInt(limit) || 10, 100)
    const parsedPage = Math.max(parseInt(page) || 1, 1);
    const skip = (parsedPage - 1) * parsedLimit;
    
    const result = await leaderboardService.getLeaderboard({
      limit: parsedLimit,
      skip: skip
    })
    
    return res.status(200).json(result);
    
  } catch (error) {
    console.error('Get Leaderboard Controller Error:', error)
    return res.status(500).json({
      success: false,
      message: 'Server error fetching leaderboard'
    })
  }
}


module.exports = {
  getLeaderboard,
}
