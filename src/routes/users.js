const express = require('express');
const router = express.Router();
const { getUsers, getUserById } = require('../controllers/userController');
const { protect } = require('../middleware/auth');

// Get all users (protected route)
router.get('/', protect, getUsers);

// Get user by ID (protected route)
router.get('/:id', protect, getUserById);

module.exports = router;
