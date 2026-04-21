const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { query } = require('../database/connection');
const googleAuthService = require('../services/googleAuthService');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

const register = async (req, res, next) => {
  try {
    const { full_name, email, password } = req.body;
    
    // Check if user already exists
    const existingUser = await query(
      'SELECT id FROM users WHERE LOWER(email) = LOWER($1)',
      [email]
    );
    
    if (existingUser.rows.length > 0) {
      return res.status(409).json({ error: 'User with this email already exists' });
    }
    
    // Hash password
    const password_hash = await bcrypt.hash(password, 10);
    
    // Create user
    const result = await query(`
      INSERT INTO users (full_name, email, password_hash)
      VALUES ($1, $2, $3)
      RETURNING id, full_name, email, created_at
    `, [full_name, email, password_hash]);
    
    // Generate JWT token
    const token = jwt.sign(
      { userId: result.rows[0].id, email: result.rows[0].email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.status(201).json({
      user: result.rows[0],
      token
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    // Find user
    const result = await query(
      'SELECT id, full_name, email, password_hash FROM users WHERE LOWER(email) = LOWER($1)',
      [email]
    );
    
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const user = result.rows[0];
    
    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    // Remove password from response
    delete user.password_hash;
    
    res.json({
      user,
      token
    });
  } catch (error) {
    next(error);
  }
};

const getProfile = async (req, res, next) => {
  try {
    // For now, return a mock user (should be from JWT middleware later)
    const mockUser = {
      id: 1,
      full_name: 'Demo User',
      email: 'demo@example.com',
      is_verified: false,
      created_at: new Date().toISOString()
    };
    
    res.json(mockUser);
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const { full_name, avatar_url } = req.body;
    
    // For now, updating mock user (should be from JWT middleware later)
    const mockUser = {
      id: 1,
      full_name: full_name || 'Demo User',
      email: 'demo@example.com',
      avatar_url,
      is_verified: false,
      updated_at: new Date().toISOString()
    };
    
    res.json(mockUser);
  } catch (error) {
    next(error);
  }
};

const googleSignIn = async (req, res, next) => {
  try {
    const { token } = req.body;
    
    if (!token) {
      return res.status(400).json({ error: 'Google token is required' });
    }
    
    const result = await googleAuthService.authenticateWithGoogle(token);
    
    res.json({
      user: result.user,
      token: result.token,
      message: 'Google sign-in successful'
    });
  } catch (error) {
    console.error('Google sign-in error:', error);
    
    if (error.message === 'Invalid Google token') {
      return res.status(401).json({ error: 'Invalid Google token' });
    }
    
    if (error.message === 'Failed to create or find user') {
      return res.status(500).json({ error: 'Authentication failed' });
    }
    
    next(error);
  }
};

const linkGoogleAccount = async (req, res, next) => {
  try {
    const { token } = req.body;
    
    if (!token) {
      return res.status(400).json({ error: 'Google token is required' });
    }
    
    // This would require JWT middleware to get the current user
    // For now, return a mock response
    res.json({
      message: 'Google account linked successfully',
      user: {
        id: 1,
        full_name: 'Demo User',
        email: 'demo@example.com',
        google_id: 'google-user-id',
        avatar_url: 'https://example.com/avatar.jpg'
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  googleSignIn,
  linkGoogleAccount
};