const { createVerificationToken, getVerificationToken, markTokenAsUsed } = require('../models/verificationToken');
const { sendVerificationEmail } = require('../services/emailService');

// In-memory user store (replace with database in production)
const users = [];

// Helper to find user by ID
const findUserById = (id) => users.find(u => u.id === id);

// Helper to find user by email
const findUserByEmail = (email) => users.find(u => u.email === email);

// Send verification email
const sendVerification = async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }
    
    // Find user by email
    const user = findUserByEmail(email);
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'No account found with this email address' 
      });
    }

    // Check if user is already verified
    if (user.emailVerified) {
      return res.status(400).json({ 
        success: false,
        message: 'This email has already been verified' 
      });
    }

    // Create and save verification token (expires in 24 hours)
    const verificationToken = createVerificationToken(user.id);
    
    try {
      // Send verification email
      const emailSent = await sendVerificationEmail(user.email, verificationToken.token);
      
      if (!emailSent) {
        throw new Error('Failed to send verification email');
      }

      res.json({ 
        success: true,
        message: 'Verification email sent. Please check your inbox.' 
      });
    } catch (error) {
      console.error('Email sending error:', error);
      res.status(500).json({ 
        success: false,
        message: 'Failed to send verification email. Please try again later.' 
      });
    }
  } catch (error) {
    console.error('Error sending verification email:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Verify email with token
const verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;
    
    if (!token) {
      return res.status(400).json({ 
        success: false,
        message: 'Verification token is required' 
      });
    }
    
    // Get verification token
    const verificationToken = getVerificationToken(token);
    if (!verificationToken) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid or expired verification link' 
      });
    }

    // Find user by ID
    const user = findUserById(verificationToken.userId);
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'User account not found' 
      });
    }

    // Check if already verified
    if (user.emailVerified) {
      return res.status(400).json({ 
        success: false,
        message: 'This email has already been verified' 
      });
    }

    // Mark user as verified
    user.emailVerified = true;
    user.verifiedAt = new Date();
    
    // Mark token as used
    markTokenAsUsed(token);

    res.json({ 
      success: true,
      message: 'Email verified successfully. You can now log in.' 
    });
  } catch (error) {
    console.error('Error verifying email:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  sendVerification,
  verifyEmail,
};
