const Message = require('../models/Message');

// @desc    Get chat history with a specific user
// @route   GET /messages/:userId
// @access  Private
const getChatHistory = async (req, res) => {
    try {
        const { userId } = req.params;
        const currentUserId = req.user._id;

        // Get messages between current user and specified user
        const messages = await Message.find({
            $or: [
                { senderId: currentUserId, receiverId: userId },
                { senderId: userId, receiverId: currentUserId }
            ]
        })
            .populate('senderId', 'username')
            .populate('receiverId', 'username')
            .sort({ timestamp: 1 });

        res.status(200).json({
            success: true,
            count: messages.length,
            data: messages
        });
    } catch (error) {
        console.error('Get chat history error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Server error fetching messages'
        });
    }
};

// @desc    Send a message (REST alternative to Socket.IO)
// @route   POST /messages
// @access  Private
const sendMessage = async (req, res) => {
    try {
        const { receiverId, text } = req.body;
        const senderId = req.user._id;

        // Validate input
        if (!receiverId || !text) {
            return res.status(400).json({
                success: false,
                message: 'Please provide receiverId and message text'
            });
        }

        // Create message
        const message = await Message.create({
            senderId,
            receiverId,
            text
        });

        // Populate sender and receiver info
        await message.populate('senderId', 'username');
        await message.populate('receiverId', 'username');

        res.status(201).json({
            success: true,
            message: 'Message sent successfully',
            data: message
        });
    } catch (error) {
        console.error('Send message error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Server error sending message'
        });
    }
};

// @desc    Mark messages as read
// @route   PUT /messages/read/:userId
// @access  Private
const markAsRead = async (req, res) => {
    try {
        const { userId } = req.params;
        const currentUserId = req.user._id;

        // Mark all messages from userId to currentUser as read
        await Message.updateMany(
            { senderId: userId, receiverId: currentUserId, isRead: false },
            { isRead: true }
        );

        res.status(200).json({
            success: true,
            message: 'Messages marked as read'
        });
    } catch (error) {
        console.error('Mark as read error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Server error marking messages as read'
        });
    }
};

module.exports = {
    getChatHistory,
    sendMessage,
    markAsRead
};
