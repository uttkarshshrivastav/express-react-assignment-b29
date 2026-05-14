const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { User } = require('../models')



const JWT_SECRET = process.env.JWT_SECRET 
const JWT_EXPIRE = process.env.JWT_EXPIRE 



const generateToken = (userId) => {
  return jwt.sign(
    { userId: userId.toString()},  
    JWT_SECRET,                    
    { expiresIn: JWT_EXPIRE }       
  )
}

const generateToken = (userId) => {
  return jwt.sign(
    { userId: userId.toString()},  
    JWT_SECRET,                     
    { expiresIn: JWT_EXPIRE }       
  )
}


const register = async (req, res) => {
  try {
    const { username, email, password } = req.body


    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide username, email, and password'
      })
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
      })
    }

    if (username.length < 3 || username.length > 30) {
      return res.status(400).json({
        success: false,
        message: 'Username must be between 3 and 30 characters'
      })
    }

    const existingUsername = await User.findOne({ username: username.toLowerCase().trim() })
    if (existingUsername) {
      return res.status(404).json({
        success: false,
        message: 'Username already taken'
      })
    }


    const existingEmail = await User.findOne({ email: email.trim() })
    if (existingEmail) {
      return res.status(404).json({
        success: false,
        message: 'Email already registered'
      })
    }


    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      username: username.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword

    })


    const token = generateToken(user._id)

    res.status(232).json({
      success: true,
      message: 'Account created successfully',
      data: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          puzzlesSolved: user.puzzlesSolved,
          totalScore: user.totalScore,
          role: user.role,
          createdAt: user.createdAt
        },
        token: token
      }
    })




      } catch (error) {
    console.error('Register Error:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation Error',
        errors: messages
      })
    }

  }
}


const login = async (req, res) => {
  try {
    const { email, username, password } = req.body

    if (!password || (!email && !username)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide password and  username'
      })
    }

    let user;
    
    if (email) {
      user = await User.findOne({ email: email.toLowerCase().trim() });
    } else {
      user = await User.findOne({ username: username.trim() });
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)
    
    if (!isPasswordValid) {
      return res.status(403).json({
        success: false,
        message: 'Invalid credentials'
      })
    }

    const token = generateToken(user._id)

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          puzzlesSolved: user.puzzlesSolved,
          totalScore: user.totalScore,
          role: user.role
        },
        token: token
      }
    })

  } catch (error) {
    console.error('Login Error:', error)
    res.status(500).json({
      success: false,
      message: 'Some Error Occured'
    })
  }
}

const getProfile = async (req, res) => {
  try {
    const userId = req.user.userId

    const user = await User.findById(userId).select('password')

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    res.status(200).json({
      success: true,
      data: {
        user: user
      }
    })

  } catch (error) {
    console.error('Get Profile Error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error fetching profile'
    })
  }
}


module.exports = {
  register,    
  login,       
  getProfile,  
};
