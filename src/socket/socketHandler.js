const Message = require('../models/Message');
const { verifyToken } = require('../utils/tokenUtils');
const User = require('../models/User');

// Store online users: { userId: socketId }
const onlineUsers = new Map();

const socketHandler = (io) => {
    io.on('connection', (socket) => {
        console.log(`🔌 New socket connection: ${socket.id}`);

        // Handle user joining
        socket.on('join', async (data) => {
            try {
                const { token, userId } = data;

                // Verify token
                const decoded = verifyToken(token);
                if (!decoded || decoded.id !== userId) {
                    socket.emit('error', { message: 'Invalid authentication' });
                    return;
                }

                // Store user's socket connection
                onlineUsers.set(userId, socket.id);
                socket.userId = userId;

                console.log(`✅ User ${userId} joined (socket: ${socket.id})`);

                // Notify user they're connected
                socket.emit('joined', {
                    message: 'Successfully connected',
                    userId
                });

                // Broadcast online status to all users
                io.emit('userOnline', { userId });
            } catch (error) {
                console.error('Join error:', error);
                socket.emit('error', { message: 'Failed to join' });
            }
        });

        // Handle sending messages
        socket.on('sendMessage', async (data) => {
            try {
                const { senderId, receiverId, text, token } = data;

                // Verify token
                const decoded = verifyToken(token);
                if (!decoded || decoded.id !== senderId) {
                    socket.emit('error', { message: 'Invalid authentication' });
                    return;
                }

                // Validate input
                if (!receiverId || !text) {
                    socket.emit('error', { message: 'Missing required fields' });
                    return;
                }

                // Save message to database
                const message = await Message.create({
                    senderId,
                    receiverId,
                    text,
                    timestamp: new Date()
                });

                // Populate sender and receiver info
                await message.populate('senderId', 'username');
                await message.populate('receiverId', 'username');

                // Send message to sender (confirmation)
                socket.emit('messageSent', {
                    success: true,
                    data: message
                });

                // Send message to receiver if they're online
                const receiverSocketId = onlineUsers.get(receiverId);
                if (receiverSocketId) {
                    io.to(receiverSocketId).emit('receiveMessage', {
                        data: message
                    });
                    console.log(`📨 Message delivered to ${receiverId}`);
                } else {
                    console.log(`📭 Receiver ${receiverId} is offline, message saved`);
                }

            } catch (error) {
                console.error('Send message error:', error);
                socket.emit('error', {
                    message: 'Failed to send message',
                    error: error.message
                });
            }
        });

        // Handle typing indicator
        socket.on('typing', (data) => {
            const { receiverId, isTyping } = data;
            const receiverSocketId = onlineUsers.get(receiverId);

            if (receiverSocketId) {
                io.to(receiverSocketId).emit('userTyping', {
                    userId: socket.userId,
                    isTyping
                });
            }
        });

        // Handle disconnection
        socket.on('disconnect', () => {
            if (socket.userId) {
                onlineUsers.delete(socket.userId);
                console.log(`❌ User ${socket.userId} disconnected`);

                // Broadcast offline status
                io.emit('userOffline', { userId: socket.userId });
            }
            console.log(`🔌 Socket disconnected: ${socket.id}`);
        });

        // Handle errors
        socket.on('error', (error) => {
            console.error('Socket error:', error);
        });
    });

    // Return online users for external access
    return {
        getOnlineUsers: () => Array.from(onlineUsers.keys()),
        isUserOnline: (userId) => onlineUsers.has(userId)
    };
};

module.exports = socketHandler;
