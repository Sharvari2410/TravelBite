const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const { query } = require('../database/connection');

class GoogleAuthService {
  constructor() {
    this.client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  }

  async verifyGoogleToken(token) {
    try {
      const ticket = await this.client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      
      const payload = ticket.getPayload();
      return {
        email: payload.email,
        name: payload.name,
        picture: payload.picture,
        googleId: payload.sub,
        emailVerified: payload.email_verified
      };
    } catch (error) {
      throw new Error('Invalid Google token');
    }
  }

  async findOrCreateUser(googleUser) {
    try {
      // First, try to find user by Google ID
      let result = await query(
        'SELECT * FROM users WHERE google_id = $1',
        [googleUser.googleId]
      );

      if (result.rows.length > 0) {
        return result.rows[0];
      }

      // If not found by Google ID, try by email (for existing users linking Google)
      result = await query(
        'SELECT * FROM users WHERE LOWER(email) = LOWER($1)',
        [googleUser.email]
      );

      if (result.rows.length > 0) {
        // Update existing user with Google info
        const updateResult = await query(`
          UPDATE users 
          SET google_id = $1, avatar_url = $2, is_verified = $3, updated_at = NOW()
          WHERE id = $4
          RETURNING *
        `, [googleUser.googleId, googleUser.picture, googleUser.emailVerified, result.rows[0].id]);
        
        return updateResult.rows[0];
      }

      // Create new user
      const insertResult = await query(`
        INSERT INTO users (full_name, email, password_hash, google_id, avatar_url, is_verified, auth_provider)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING id, full_name, email, avatar_url, is_verified, auth_provider, created_at
      `, [
        googleUser.name,
        googleUser.email,
        'google_oauth_user', // Special password hash for Google users
        googleUser.googleId,
        googleUser.picture,
        googleUser.emailVerified,
        'google'
      ]);

      return insertResult.rows[0];
    } catch (error) {
      console.error('Error in findOrCreateUser:', error);
      throw new Error('Failed to create or find user');
    }
  }

  generateJWT(user) {
    return jwt.sign(
      { 
        userId: user.id, 
        email: user.email,
        googleId: user.google_id 
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );
  }

  async authenticateWithGoogle(token) {
    try {
      // Verify Google token
      const googleUser = await this.verifyGoogleToken(token);
      
      // Find or create user
      const user = await this.findOrCreateUser(googleUser);
      
      // Generate JWT
      const jwtToken = this.generateJWT(user);
      
      // Remove sensitive data
      delete user.password_hash;
      
      return {
        user,
        token: jwtToken
      };
    } catch (error) {
      console.error('Google authentication error:', error);
      throw error;
    }
  }
}

module.exports = new GoogleAuthService();
