const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { auth, authorize } = require('../middleware/auth');

// Mock database (replace with actual database)
let users = [];

// @route   GET api/users
// @desc    Get all users (admin only)
// @access  Private/Admin
router.get('/', [auth, authorize('admin')], (req, res) => {
  try {
    // Return users without passwords
    const usersWithoutPasswords = users.map(({ password, ...user }) => user);
    res.json(usersWithoutPasswords);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/users/:id
// @desc    Get user by ID
// @access  Private
router.get('/:id', auth, (req, res) => {
  try {
    const user = users.find(u => u.id === parseInt(req.params.id));
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    // Only allow users to access their own profile unless admin
    if (user.id !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ msg: 'Not authorized' });
    }
    // Don't return password
    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/users/:id
// @desc    Update user
// @access  Private
router.put(
  '/:id',
  [
    auth,
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail()
  ],
  async (req, res) => {
    try {
      const user = users.find(u => u.id === parseInt(req.params.id));
      if (!user) {
        return res.status(404).json({ msg: 'User not found' });
      }

      // Only allow users to update their own profile unless admin
      if (user.id !== req.user.id && req.user.role !== 'admin') {
        return res.status(401).json({ msg: 'Not authorized' });
      }

      const { name, email, role } = req.body;

      // Update user
      user.name = name;
      user.email = email;
      
      // Only allow admin to change roles
      if (role && req.user.role === 'admin') {
        user.role = role;
      }

      // Don't return password
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   DELETE api/users/:id
// @desc    Delete user
// @access  Private/Admin
router.delete('/:id', [auth, authorize('admin')], (req, res) => {
  try {
    const userIndex = users.findIndex(u => u.id === parseInt(req.params.id));
    if (userIndex === -1) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Prevent deleting self
    if (users[userIndex].id === req.user.id) {
      return res.status(400).json({ msg: 'Cannot delete your own account' });
    }

    users.splice(userIndex, 1);
    res.json({ msg: 'User removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
