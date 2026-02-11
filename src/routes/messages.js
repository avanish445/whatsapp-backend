const express = require('express');
const router = express.Router();
const { getChatHistory, sendMessage, markAsRead } = require('../controllers/messageController');
const { protect } = require('../middleware/auth');

// Get chat history with a user (protected route)
router.get('/:userId', protect, getChatHistory);

// Send a message (protected route)
router.post('/', protect, sendMessage);

// Mark messages as read (protected route)
router.put('/read/:userId', protect, markAsRead);

module.exports = router;
