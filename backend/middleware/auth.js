const jwt = require('jsonwebtoken')




const auth = (req, res, next) => {
  try {

        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Access denied '
      })
        }
        const token = authHeader.substring(7);
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
    next();
  } catch (error) {
if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired Please login again.'
      })
    } else if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token Please login again.'
      })
    }

    console.error('Auth Middleware Error:', error.message)
    return res.status(500).json({
      success: false,
      message: 'Server error during authentication'
    })
  }
}





// Admin auth validation remaining  {adminOnly}







module.exports = {
  auth
}