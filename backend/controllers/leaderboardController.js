const leaderboardService = require('../services/leaderboardService')
const getLeaderboard = async (req, res) => {
  try {
    const { limit, page } = req.query
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

const getMyRank = async (req, res) => {
  try {
    const result = await leaderboardService.getUserRank(req.user.userId)

    if (!result.success) {
      return res.status(404).json(result)
    }

    return res.status(200).json(result)
  } catch (error) {
    console.error('Get My Rank Controller Error:', error)
    return res.status(500).json({
      success: false,
      message: 'Server error fetching rank'
    })
  }
}


module.exports = {
  getLeaderboard,
  getMyRank,
}
