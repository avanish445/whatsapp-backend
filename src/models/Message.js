const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    text: {
        type: String,
        required: [true, 'Message text is required'],
        trim: true,
        maxlength: [5000, 'Message cannot exceed 5000 characters']
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    isRead: {
        type: Boolean,
        default: false
    }
});

// Index for faster queries
messageSchema.index({ senderId: 1, receiverId: 1, timestamp: -1 });

module.exports = mongoose.model('Message', messageSchema);
