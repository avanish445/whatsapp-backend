const User = require('../models/User');

// @desc    Get all users except logged-in user
// @route   GET /users
// @access  Private
const getUsers = async (req, res) => {
    try {
        // Get all users except the logged-in user
        const users = await User.find({ _id: { $ne: req.user._id } })
            .select('username createdAt')
            .sort({ username: 1 });

        res.status(200).json({
            success: true,
            count: users.length,
            data: users
        });
    } catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Server error fetching users'
        });
    }
};

// @desc    Get user by ID
// @route   GET /users/:id
// @access  Private
const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('username createdAt');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Server error fetching user'
        });
    }
};

module.exports = {
    getUsers,
    getUserById
};
