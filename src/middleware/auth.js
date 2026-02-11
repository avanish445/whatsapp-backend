const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token;

    // Check for token in cookies first (preferred method)
    if (req.cookies.token) {
        token = req.cookies.token;
    }
    // Fall back to Authorization header for backward compatibility
    else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized, no token'
        });
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Get user from token (exclude password)
        req.user = await User.findById(decoded.id).select('-password');

        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'User not found'
            });
        }

        next();
    } catch (error) {
        console.error('Auth middleware error:', error.message);
        return res.status(401).json({
            success: false,
            message: 'Not authorized, token failed'
        });
    }
};

module.exports = { protect };
