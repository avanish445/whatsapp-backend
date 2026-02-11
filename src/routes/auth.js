const express = require('express');
const router = express.Router();
const { register, login, logout, getCurrentUser } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// Register route
router.post('/register', register);

// Login route
router.post('/login', login);

// Logout route (protected)
router.post('/logout', protect, logout);

// Get current user (protected)
router.get('/me', protect, getCurrentUser);

module.exports = router;
