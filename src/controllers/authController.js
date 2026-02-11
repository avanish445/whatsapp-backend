const User = require('../models/User');
const { generateToken } = require('../utils/tokenUtils');

// @desc    Register new user
// @route   POST /auth/register
// @access  Public
const register = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Validate input
        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide username and password'
            });
        }

        // Check if user already exists
        const userExists = await User.findOne({ username });
        if (userExists) {
            return res.status(400).json({
                success: false,
                message: 'Username already taken'
            });
        }

        // Create user
        const user = await User.create({
            username,
            password
        });

        // Generate token
        const token = generateToken(user._id);

        // Set cookie with JWT token
        res.cookie('token', token, {
            httpOnly: true, // Prevents client-side JS from accessing the cookie
            secure: process.env.NODE_ENV === 'production', // Use HTTPS in production
            sameSite: 'strict', // CSRF protection
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds
        });

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: {
                user: {
                    _id: user._id,
                    username: user.username,
                    createdAt: user.createdAt
                },
                token: token // Include token for Socket.IO authentication
            }
        });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Server error during registration'
        });
    }
};

// @desc    Login user
// @route   POST /auth/login
// @access  Public
const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Validate input
        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide username and password'
            });
        }

        // Find user (include password for comparison)
        const user = await User.findOne({ username }).select('+password');
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Check password
        const isPasswordMatch = await user.comparePassword(password);
        if (!isPasswordMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Generate token
        const token = generateToken(user._id);

        // Set cookie with JWT token
        res.cookie('token', token, {
            httpOnly: true, // Prevents client-side JS from accessing the cookie
            secure: process.env.NODE_ENV === 'production', // Use HTTPS in production
            sameSite: 'strict', // CSRF protection
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds
        });

        res.status(200).json({
            success: true,
            message: 'Login successful',
            data: {
                user: {
                    _id: user._id,
                    username: user.username,
                    createdAt: user.createdAt
                },
                token: token // Include token for Socket.IO authentication
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Server error during login'
        });
    }
};

// @desc    Logout user
// @route   POST /auth/logout
// @access  Private
const logout = async (req, res) => {
    try {
        // Clear the token cookie
        res.cookie('token', '', {
            httpOnly: true,
            expires: new Date(0) // Set expiry to past date
        });

        res.status(200).json({
            success: true,
            message: 'Logout successful'
        });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Server error during logout'
        });
    }
};

// @desc    Get current logged in user
// @route   GET /auth/me
// @access  Private
const getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Get token from cookie to return in response for Socket.IO
        const token = req.cookies.token;

        res.status(200).json({
            success: true,
            data: {
                user: {
                    _id: user._id,
                    username: user.username,
                    createdAt: user.createdAt
                },
                token: token // Include token for Socket.IO authentication
            }
        });
    } catch (error) {
        console.error('Get current user error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Server error'
        });
    }
};

module.exports = {
    register,
    login,
    logout,
    getCurrentUser
};
