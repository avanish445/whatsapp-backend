require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const socketHandler = require('./socket/socketHandler');

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const messageRoutes = require('./routes/messages');

// Initialize Express app
const app = express();
const server = http.createServer(app);

// Initialize Socket.IO with CORS
const io = new Server(server, {
    cors: {
        origin: '*', // In production, specify your frontend URL
        methods: ['GET', 'POST']
    }
});

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
    origin: 'http://localhost:5173', // Update this to your frontend URL
    credentials: true // Allow cookies to be sent
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
});

// Health check route
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'WhatsApp Backend API is running',
        version: '1.0.0',
        endpoints: {
            auth: {
                register: 'POST /auth/register',
                login: 'POST /auth/login',
                logout: 'POST /auth/logout (protected)',
                me: 'GET /auth/me (protected)'
            },
            users: {
                getAll: 'GET /users',
                getById: 'GET /users/:id'
            },
            messages: {
                getChatHistory: 'GET /messages/:userId',
                sendMessage: 'POST /messages',
                markAsRead: 'PUT /messages/read/:userId'
            },
            socket: {
                events: ['join', 'sendMessage', 'receiveMessage', 'typing', 'userOnline', 'userOffline']
            }
        }
    });
});

// Mount routes
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/messages', messageRoutes);

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal server error'
    });
});

// Initialize Socket.IO handlers
const socketUtils = socketHandler(io);

// Make io accessible to routes if needed
app.set('io', io);
app.set('socketUtils', socketUtils);

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`
╔═══════════════════════════════════════════════╗
║                                               ║
║   🚀 WhatsApp Backend Server Running          ║
║                                               ║
║   📡 Port: ${PORT}                              ║
║   🌐 API: http://localhost:${PORT}              ║
║   🔌 Socket.IO: Connected                     ║
║   💾 Database: MongoDB                        ║
║                                               ║
╚═══════════════════════════════════════════════╝
  `);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.error('Unhandled Rejection:', err);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
});

module.exports = { app, server, io };
