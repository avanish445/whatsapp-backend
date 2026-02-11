# 🚀 Quick Start Guide

## Prerequisites Check

Before starting, ensure you have:
- ✅ Node.js installed (v14+)
- ✅ MongoDB installed and running

## Step 1: Start MongoDB

```bash
# Option 1: Using Homebrew (macOS)
brew services start mongodb-community

# Option 2: Manual start
mongod --dbpath ~/data/db

# Option 3: Using MongoDB Atlas (cloud)
# Update MONGODB_URI in .env with your Atlas connection string
```

## Step 2: Install Dependencies

```bash
cd /Users/avanishpatel/MyPracticeProject/whatsapp-backend
npm install
```

## Step 3: Start the Server

```bash
npm start
```

You should see:
```
╔═══════════════════════════════════════════════╗
║                                               ║
║   🚀 WhatsApp Backend Server Running          ║
║                                               ║
║   📡 Port: 3000                              ║
║   🌐 API: http://localhost:3000              ║
║   🔌 Socket.IO: Connected                     ║
║   💾 Database: MongoDB                        ║
║                                               ║
╚═══════════════════════════════════════════════╝
```

## Step 4: Test the API

### Option A: Using the Test Script

```bash
chmod +x test-api.sh
./test-api.sh
```

### Option B: Manual Testing with cURL

**1. Register User:**
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"alice","password":"password123"}'
```

**2. Login:**
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"alice","password":"password123"}'
```

**3. Get Users (replace TOKEN):**
```bash
curl -X GET http://localhost:3000/users \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Step 5: Test Real-Time Messaging

1. Open `socket-test.html` in your browser
2. Register two users using the API
3. Copy their tokens and user IDs
4. Paste into the test interface
5. Connect both users
6. Send messages and watch them appear in real-time!

## Common Issues

### MongoDB Connection Failed
```
❌ Error connecting to MongoDB
```
**Solution:** Start MongoDB using one of the commands in Step 1

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::3000
```
**Solution:** 
```bash
# Kill the process on port 3000
lsof -ti:3000 | xargs kill -9

# Or change PORT in .env file
```

### Token Invalid
```
Not authorized, token failed
```
**Solution:** Make sure you're using a fresh token from login/register

## Next Steps

- Read the full [README.md](README.md) for complete API documentation
- Check out the [Socket.IO Events](README.md#-socketio-events) section
- Build a frontend application to connect to this backend
- Deploy to production (Heroku, AWS, DigitalOcean, etc.)

## API Endpoints Summary

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | Health check | No |
| POST | `/auth/register` | Register new user | No |
| POST | `/auth/login` | Login user | No |
| GET | `/users` | Get all users | Yes |
| GET | `/users/:id` | Get user by ID | Yes |
| GET | `/messages/:userId` | Get chat history | Yes |
| POST | `/messages` | Send message | Yes |
| PUT | `/messages/read/:userId` | Mark as read | Yes |

## Socket.IO Events

**Client → Server:**
- `join` - Connect user
- `sendMessage` - Send message
- `typing` - Typing indicator

**Server → Client:**
- `joined` - Connection confirmed
- `receiveMessage` - New message
- `messageSent` - Send confirmation
- `userOnline` - User came online
- `userOffline` - User went offline
- `userTyping` - User is typing

---

**Need Help?** Check the [README.md](README.md) for detailed documentation!
