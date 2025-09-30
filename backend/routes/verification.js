const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { sendVerification, verifyEmail } = require('../controllers/verificationController');

// @route   POST api/verification/send
// @desc    Send verification email
// @access  Public
router.post(
  '/send',
  [
    check('email', 'Please include a valid email').isEmail(),
  ],
  sendVerification
);

// @route   GET api/verification/verify
// @desc    Verify email with token
// @access  Public
router.get(
  '/verify',
  [
    check('token', 'Verification token is required').not().isEmpty(),
  ],
  verifyEmail
);

module.exports = router;
