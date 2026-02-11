# 💬 WhatsApp-Like Backend

A simple, real-time messaging backend built with Node.js, Express, MongoDB, and Socket.IO.

## ✨ Features

- 🔐 **User Authentication** - JWT-based login/register (username + password)
- 👥 **User Management** - Fetch all users to start conversations
- 💬 **One-to-One Chat** - Real-time text messaging between users
- ⚡ **Real-Time Communication** - Socket.IO for instant message delivery
- 💾 **Message Persistence** - All messages stored in MongoDB
- 🟢 **Online Status** - Track user presence in real-time
- ⌨️ **Typing Indicators** - See when someone is typing

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (with Mongoose ODM)
- **Real-Time**: Socket.IO
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs

## 📋 Prerequisites

Before running this project, make sure you have:

- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **MongoDB** - [Download](https://www.mongodb.com/try/download/community) or use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

## 🚀 Getting Started

### 1. Clone or Navigate to Project

```bash
cd /Users/avanishpatel/MyPracticeProject/whatsapp-backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

The `.env` file is already created with default values:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/whatsapp-db
JWT_SECRET=whatsapp_secret_key_2026_change_in_production
JWT_EXPIRE=7d
```

**Important**: Change `JWT_SECRET` in production!

### 4. Start MongoDB

If using local MongoDB:

```bash
# macOS (with Homebrew)
brew services start mongodb-community

# Or start manually
mongod --dbpath /path/to/your/data/directory
```

If using MongoDB Atlas, update `MONGODB_URI` in `.env` with your connection string.

### 5. Run the Server

```bash
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:5000`

## 📡 API Endpoints

### Authentication

#### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "username": "john_doe",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "65a1b2c3d4e5f6g7h8i9j0k1",
      "username": "john_doe",
      "createdAt": "2026-01-21T08:30:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Login User
```http
POST /auth/login
Content-Type: application/json

{
  "username": "john_doe",
  "password": "password123"
}
```

**Response:** Same as register

### Users

#### Get All Users
```http
GET /users
Authorization: Bearer <your_jwt_token>
```

**Response:**
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
      "username": "alice",
      "createdAt": "2026-01-20T10:00:00.000Z"
    },
    {
      "_id": "65a1b2c3d4e5f6g7h8i9j0k2",
      "username": "bob",
      "createdAt": "2026-01-20T11:00:00.000Z"
    }
  ]
}
```

#### Get User by ID
```http
GET /users/:id
Authorization: Bearer <your_jwt_token>
```

### Messages

#### Get Chat History
```http
GET /messages/:userId
Authorization: Bearer <your_jwt_token>
```

**Response:**
```json
{
  "success": true,
  "count": 10,
  "data": [
    {
      "_id": "65a1b2c3d4e5f6g7h8i9j0k3",
      "senderId": {
        "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
        "username": "john_doe"
      },
      "receiverId": {
        "_id": "65a1b2c3d4e5f6g7h8i9j0k2",
        "username": "alice"
      },
      "text": "Hello, how are you?",
      "timestamp": "2026-01-21T08:35:00.000Z",
      "isRead": false
    }
  ]
}
```

#### Send Message (REST)
```http
POST /messages
Authorization: Bearer <your_jwt_token>
Content-Type: application/json

{
  "receiverId": "65a1b2c3d4e5f6g7h8i9j0k2",
  "text": "Hello!"
}
```

#### Mark Messages as Read
```http
PUT /messages/read/:userId
Authorization: Bearer <your_jwt_token>
```

## 🔌 Socket.IO Events

### Client → Server Events

#### Join (Connect User)
```javascript
socket.emit('join', {
  token: 'your_jwt_token',
  userId: 'your_user_id'
});
```

#### Send Message
```javascript
socket.emit('sendMessage', {
  token: 'your_jwt_token',
  senderId: 'your_user_id',
  receiverId: 'recipient_user_id',
  text: 'Hello, World!'
});
```

#### Typing Indicator
```javascript
socket.emit('typing', {
  receiverId: 'recipient_user_id',
  isTyping: true
});
```

### Server → Client Events

#### Joined Confirmation
```javascript
socket.on('joined', (data) => {
  console.log(data); // { message: 'Successfully connected', userId: '...' }
});
```

#### Receive Message
```javascript
socket.on('receiveMessage', (data) => {
  console.log(data.data); // Message object
});
```

#### Message Sent Confirmation
```javascript
socket.on('messageSent', (data) => {
  console.log(data); // { success: true, data: {...} }
});
```

#### User Online/Offline
```javascript
socket.on('userOnline', (data) => {
  console.log(`${data.userId} is online`);
});

socket.on('userOffline', (data) => {
  console.log(`${data.userId} is offline`);
});
```

#### User Typing
```javascript
socket.on('userTyping', (data) => {
  console.log(`${data.userId} is typing: ${data.isTyping}`);
});
```

#### Error
```javascript
socket.on('error', (data) => {
  console.error(data.message);
});
```

## 📁 Project Structure

```
whatsapp-backend/
├── src/
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js     # Auth logic
│   │   ├── messageController.js  # Message logic
│   │   └── userController.js     # User logic
│   ├── middleware/
│   │   └── auth.js               # JWT authentication
│   ├── models/
│   │   ├── Message.js            # Message schema
│   │   └── User.js               # User schema
│   ├── routes/
│   │   ├── auth.js               # Auth routes
│   │   ├── messages.js           # Message routes
│   │   └── users.js              # User routes
│   ├── socket/
│   │   └── socketHandler.js      # Socket.IO logic
│   ├── utils/
│   │   └── tokenUtils.js         # JWT utilities
│   └── server.js                 # Main entry point
├── .env                          # Environment variables
├── .env.example                  # Environment template
├── .gitignore                    # Git ignore rules
├── package.json                  # Dependencies
└── README.md                     # Documentation
```

## 🧪 Testing the API

### Using cURL

**Register:**
```bash
curl -X POST http://localhost:5000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"test123"}'
```

**Login:**
```bash
curl -X POST http://localhost:5000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"test123"}'
```

**Get Users:**
```bash
curl -X GET http://localhost:5000/users \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Using Postman

1. Import the endpoints from the API documentation above
2. Set up environment variables for `baseUrl` and `token`
3. Test each endpoint sequentially

### Testing Socket.IO

You can use the [Socket.IO Client Tool](https://amritb.github.io/socketio-client-tool/) or create a simple HTML client:

```html
<!DOCTYPE html>
<html>
<head>
  <title>Socket.IO Test</title>
  <script src="https://cdn.socket.io/4.6.0/socket.io.min.js"></script>
</head>
<body>
  <script>
    const socket = io('http://localhost:5000');
    
    // Join
    socket.emit('join', {
      token: 'YOUR_JWT_TOKEN',
      userId: 'YOUR_USER_ID'
    });
    
    // Listen for messages
    socket.on('receiveMessage', (data) => {
      console.log('New message:', data);
    });
  </script>
</body>
</html>
```

## 🔒 Security Notes

- Passwords are hashed using bcryptjs before storage
- JWT tokens expire after 7 days (configurable)
- All protected routes require valid JWT token
- Socket.IO events validate authentication
- **Change JWT_SECRET in production!**

## 🐛 Troubleshooting

### MongoDB Connection Issues

**Error:** `MongooseServerSelectionError: connect ECONNREFUSED`

**Solution:** Make sure MongoDB is running:
```bash
# Check if MongoDB is running
ps aux | grep mongod

# Start MongoDB
brew services start mongodb-community
```

### Port Already in Use

**Error:** `EADDRINUSE: address already in use :::5000`

**Solution:** Change the PORT in `.env` or kill the process:
```bash
lsof -ti:5000 | xargs kill -9
```

## 📝 Future Enhancements

- [ ] Group chat support
- [ ] File/image sharing
- [ ] Message encryption
- [ ] Read receipts
- [ ] Last seen status
- [ ] Message search
- [ ] User profiles with avatars
- [ ] Phone number authentication with OTP
- [ ] Message reactions
- [ ] Voice messages

## 📄 License

ISC

## 👨‍💻 Author

Created for WhatsApp-like messaging application

---

**Happy Coding! 🚀**
