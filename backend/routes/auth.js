const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const { v4: uuidv4 } = require('uuid');
const { User, VerificationToken } = require('../models');
const { sendVerificationEmail } = require('../services/emailService');

// @route   POST api/auth/register
// @desc    Register user
// @access  Public
router.post(
  '/register',
  [
    check('firstName', 'First name is required').not().isEmpty(),
    check('lastName', 'Last name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 8 or more characters').isLength({ min: 8 })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false,
        message: 'Validation failed',
        errors: errors.array() 
      });
    }

    const { firstName, lastName, email, password } = req.body;

    try {
      // Check if user exists (case-insensitive email check)
      const existingUser = await User.findOne({ where: { email: email.toLowerCase() } });
      if (existingUser) {
        return res.status(400).json({ 
          success: false,
          message: 'User with this email already exists',
          field: 'email'
        });
      }

      // Create user
      const user = await User.create({
        firstName,
        lastName,
        email: email.toLowerCase(),
        password,
        role: 'user',
        isVerified: false
      });

      try {
        // Generate and send verification email
        const token = VerificationToken.generateToken();
        await VerificationToken.create({
          userId: user.id,
          token,
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
        });

        await sendVerificationEmail(user.email, token);

        // Return success response (without sensitive data)
        res.status(201).json({
          success: true,
          message: 'Registration successful! Please check your email to verify your account.',
          requiresVerification: true,
          user: {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
            isVerified: user.isVerified
          }
        });
      } catch (emailError) {
        console.error('Failed to send verification email:', emailError);
        // Still return success but inform about the email issue
        res.status(201).json({
          success: true,
          message: 'Account created, but we were unable to send the verification email. Please request a new verification email.',
          requiresVerification: true,
          user: {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
            isVerified: user.isVerified
          }
        });
      }
    } catch (err) {
      console.error('Registration error:', err);
      res.status(500).json({
        success: false,
        message: 'Server error during registration',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
      });
    }
  }
);

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post(
  '/login',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false,
        message: 'Validation failed',
        errors: errors.array() 
      });
    }

    const { email, password } = req.body;

    try {
      // Check if user exists (case-insensitive email check)
      const user = await User.findOne({ where: { email: email.toLowerCase() } });
      if (!user) {
        return res.status(400).json({ 
          success: false,
          message: 'Invalid email or password',
          field: 'email'
        });
      }

      // Check password
      const isMatch = await user.isValidPassword(password);
      if (!isMatch) {
        return res.status(400).json({ 
          success: false,
          message: 'Invalid email or password',
          field: 'password'
        });
      }

      // Check if email is verified
      if (!user.isVerified) {
        return res.status(403).json({
          success: false,
          message: 'Please verify your email before logging in',
          requiresVerification: true,
          userId: user.id
        });
      }

      // Update last login
      await user.update({ lastLogin: new Date() });

      // Generate JWT token using the instance method
      const token = user.generateAuthToken();

      // Return user data (without sensitive information)
      res.json({
        success: true,
        message: 'Login successful',
        token,
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
          isVerified: user.isVerified,
          createdAt: user.createdAt
        }
      });
    } catch (err) {
      console.error('Login error:', err);
      res.status(500).json({
        success: false,
        message: 'Server error during login',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
      });
    }
  }
);

// @route   POST api/auth/verify-email
// @desc    Verify user's email
// @access  Public
router.get('/verify-email', async (req, res) => {
  const { token } = req.query;

  if (!token) {
    return res.status(400).json({ 
      success: false, 
      message: 'Verification token is required' 
    });
  }

  try {
    // Find the verification token
    const verificationToken = await VerificationToken.findOne({
      where: { 
        token,
        used: false,
        expiresAt: { [Sequelize.Op.gt]: new Date() }
      },
      include: [{ model: User, as: 'user' }]
    });

    if (!verificationToken) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid or expired verification token' 
      });
    }

    // Mark the token as used
    await verificationToken.update({ used: true });

    // Mark user as verified
    await verificationToken.user.update({ isVerified: true });

    res.json({ 
      success: true, 
      message: 'Email verified successfully',
      user: {
        id: verificationToken.user.id,
        email: verificationToken.user.email,
        isVerified: true
      }
    });
  } catch (err) {
    console.error('Email verification error:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Server error during email verification',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// @route   POST api/auth/resend-verification
// @desc    Resend verification email
// @access  Public
router.post('/resend-verification', 
  [
    check('email', 'Please include a valid email').isEmail()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false,
        message: 'Validation failed',
        errors: errors.array() 
      });
    }

    const { email } = req.body;

    try {
      // Find user by email
      const user = await User.findOne({ where: { email: email.toLowerCase() } });
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'No account found with this email address'
        });
      }

      if (user.isVerified) {
        return res.status(400).json({
          success: false,
          message: 'This email has already been verified'
        });
      }

      // Invalidate any existing verification tokens
      await VerificationToken.update(
        { used: true },
        { 
          where: { 
            userId: user.id,
            used: false
          } 
        }
      );

      // Create new verification token
      const token = VerificationToken.generateToken();
      await VerificationToken.create({
        userId: user.id,
        token,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
      });

      // Send verification email
      await sendVerificationEmail(user.email, token);

      res.json({
        success: true,
        message: 'Verification email has been resent. Please check your inbox.'
      });
    } catch (err) {
      console.error('Resend verification error:', err);
      res.status(500).json({
        success: false,
        message: 'Failed to resend verification email',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
      });
    }
  }
);

module.exports = router;
