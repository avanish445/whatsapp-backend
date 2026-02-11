# 📱 WhatsApp Backend API - React Frontend Integration Guide

Complete API documentation for building a React frontend application.

---

## 🌐 Base URL

```
http://localhost:3000
```

**For production:** Replace with your deployed backend URL

---

## 🔐 Authentication

All protected endpoints require a JWT token in the Authorization header:

```javascript
headers: {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json'
}
```

---

## 📡 REST API Endpoints

### 1. Health Check

**Endpoint:** `GET /`

**Description:** Check if the API is running

**Authentication:** Not required

**Request:**
```javascript
fetch('http://localhost:3000/')
  .then(res => res.json())
  .then(data => console.log(data));
```

**Response:**
```json
{
  "success": true,
  "message": "WhatsApp Backend API is running",
  "version": "1.0.0",
  "endpoints": {
    "auth": {
      "register": "POST /auth/register",
      "login": "POST /auth/login"
    },
    "users": {
      "getAll": "GET /users",
      "getById": "GET /users/:id"
    },
    "messages": {
      "getChatHistory": "GET /messages/:userId",
      "sendMessage": "POST /messages",
      "markAsRead": "PUT /messages/read/:userId"
    }
  }
}
```

---

### 2. Register User

**Endpoint:** `POST /auth/register`

**Description:** Create a new user account

**Authentication:** Not required

**Request Body:**
```json
{
  "username": "john_doe",
  "password": "password123"
}
```

**Validation Rules:**
- Username: 3-30 characters, unique
- Password: minimum 6 characters

**React Example:**
```javascript
const registerUser = async (username, password) => {
  try {
    const response = await fetch('http://localhost:3000/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    });
    
    const data = await response.json();
    
    if (data.success) {
      // Save token to localStorage
      localStorage.setItem('token', data.data.token);
      localStorage.setItem('userId', data.data.user.id);
      localStorage.setItem('username', data.data.user.username);
      return data;
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};
```

**Success Response (201):**
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
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1YTFiMmMzZDRlNWY2ZzdoOGk5ajBrMSIsImlhdCI6MTcwNjY5MTAwMCwiZXhwIjoxNzA3Mjk1ODAwfQ.abc123..."
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "Username already taken"
}
```

---

### 3. Login User

**Endpoint:** `POST /auth/login`

**Description:** Authenticate existing user

**Authentication:** Not required

**Request Body:**
```json
{
  "username": "john_doe",
  "password": "password123"
}
```

**React Example:**
```javascript
const loginUser = async (username, password) => {
  try {
    const response = await fetch('http://localhost:3000/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    });
    
    const data = await response.json();
    
    if (data.success) {
      // Save token to localStorage
      localStorage.setItem('token', data.data.token);
      localStorage.setItem('userId', data.data.user.id);
      localStorage.setItem('username', data.data.user.username);
      return data;
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
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

**Error Response (401):**
```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

---

### 4. Get All Users

**Endpoint:** `GET /users`

**Description:** Fetch all users except the logged-in user (for starting new chats)

**Authentication:** Required

**React Example:**
```javascript
const getAllUsers = async () => {
  try {
    const token = localStorage.getItem('token');
    
    const response = await fetch('http://localhost:3000/users', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    const data = await response.json();
    
    if (data.success) {
      return data.data; // Array of users
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    console.error('Get users error:', error);
    throw error;
  }
};
```

**Success Response (200):**
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "_id": "65a1b2c3d4e5f6g7h8i9j0k2",
      "username": "alice",
      "createdAt": "2026-01-20T10:00:00.000Z"
    },
    {
      "_id": "65a1b2c3d4e5f6g7h8i9j0k3",
      "username": "bob",
      "createdAt": "2026-01-20T11:00:00.000Z"
    }
  ]
}
```

**Error Response (401):**
```json
{
  "success": false,
  "message": "Not authorized, no token"
}
```

---

### 5. Get User by ID

**Endpoint:** `GET /users/:id`

**Description:** Get details of a specific user

**Authentication:** Required

**React Example:**
```javascript
const getUserById = async (userId) => {
  try {
    const token = localStorage.getItem('token');
    
    const response = await fetch(`http://localhost:3000/users/${userId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    const data = await response.json();
    
    if (data.success) {
      return data.data;
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    console.error('Get user error:', error);
    throw error;
  }
};
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "65a1b2c3d4e5f6g7h8i9j0k2",
    "username": "alice",
    "createdAt": "2026-01-20T10:00:00.000Z"
  }
}
```

---

### 6. Get Chat History

**Endpoint:** `GET /messages/:userId`

**Description:** Get all messages between logged-in user and specified user

**Authentication:** Required

**React Example:**
```javascript
const getChatHistory = async (otherUserId) => {
  try {
    const token = localStorage.getItem('token');
    
    const response = await fetch(`http://localhost:3000/messages/${otherUserId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    const data = await response.json();
    
    if (data.success) {
      return data.data; // Array of messages
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    console.error('Get chat history error:', error);
    throw error;
  }
};
```

**Success Response (200):**
```json
{
  "success": true,
  "count": 10,
  "data": [
    {
      "_id": "65a1b2c3d4e5f6g7h8i9j0k4",
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
    },
    {
      "_id": "65a1b2c3d4e5f6g7h8i9j0k5",
      "senderId": {
        "_id": "65a1b2c3d4e5f6g7h8i9j0k2",
        "username": "alice"
      },
      "receiverId": {
        "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
        "username": "john_doe"
      },
      "text": "I'm good, thanks!",
      "timestamp": "2026-01-21T08:36:00.000Z",
      "isRead": true
    }
  ]
}
```

---

### 7. Send Message (REST)

**Endpoint:** `POST /messages`

**Description:** Send a message via REST API (alternative to Socket.IO)

**Authentication:** Required

**Request Body:**
```json
{
  "receiverId": "65a1b2c3d4e5f6g7h8i9j0k2",
  "text": "Hello, World!"
}
```

**React Example:**
```javascript
const sendMessageREST = async (receiverId, text) => {
  try {
    const token = localStorage.getItem('token');
    
    const response = await fetch('http://localhost:3000/messages', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ receiverId, text })
    });
    
    const data = await response.json();
    
    if (data.success) {
      return data.data;
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    console.error('Send message error:', error);
    throw error;
  }
};
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Message sent successfully",
  "data": {
    "_id": "65a1b2c3d4e5f6g7h8i9j0k6",
    "senderId": {
      "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
      "username": "john_doe"
    },
    "receiverId": {
      "_id": "65a1b2c3d4e5f6g7h8i9j0k2",
      "username": "alice"
    },
    "text": "Hello, World!",
    "timestamp": "2026-01-21T09:00:00.000Z",
    "isRead": false
  }
}
```

---

### 8. Mark Messages as Read

**Endpoint:** `PUT /messages/read/:userId`

**Description:** Mark all messages from a specific user as read

**Authentication:** Required

**React Example:**
```javascript
const markMessagesAsRead = async (userId) => {
  try {
    const token = localStorage.getItem('token');
    
    const response = await fetch(`http://localhost:3000/messages/read/${userId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    const data = await response.json();
    
    if (data.success) {
      return data;
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    console.error('Mark as read error:', error);
    throw error;
  }
};
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Messages marked as read"
}
```

---

## 🔌 Socket.IO Real-Time Events

### Installation

```bash
npm install socket.io-client
```

### Setup in React

```javascript
import { io } from 'socket.io-client';

// Initialize socket connection
const socket = io('http://localhost:3000', {
  autoConnect: false // Connect manually after login
});

export default socket;
```

---

### Client → Server Events

#### 1. Join (Connect User)

**Event:** `join`

**Description:** Connect user to Socket.IO and authenticate

**Emit after login:**

```javascript
import socket from './socket';

const connectSocket = () => {
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');
  
  // Connect socket
  socket.connect();
  
  // Join with authentication
  socket.emit('join', {
    token: token,
    userId: userId
  });
};
```

---

#### 2. Send Message

**Event:** `sendMessage`

**Description:** Send a real-time message to another user

```javascript
const sendMessage = (receiverId, text) => {
  const token = localStorage.getItem('token');
  const senderId = localStorage.getItem('userId');
  
  socket.emit('sendMessage', {
    token: token,
    senderId: senderId,
    receiverId: receiverId,
    text: text
  });
};
```

---

#### 3. Typing Indicator

**Event:** `typing`

**Description:** Notify another user that you're typing

```javascript
const sendTypingIndicator = (receiverId, isTyping) => {
  socket.emit('typing', {
    receiverId: receiverId,
    isTyping: isTyping
  });
};

// Usage in input field
const handleInputChange = (e, receiverId) => {
  const text = e.target.value;
  
  if (text.length > 0) {
    sendTypingIndicator(receiverId, true);
  } else {
    sendTypingIndicator(receiverId, false);
  }
};
```

---

### Server → Client Events

#### 1. Joined Confirmation

**Event:** `joined`

**Description:** Confirmation that user successfully joined

```javascript
socket.on('joined', (data) => {
  console.log('Connected successfully:', data);
  // data = { message: 'Successfully connected', userId: '...' }
});
```

---

#### 2. Receive Message

**Event:** `receiveMessage`

**Description:** Receive a new message from another user

```javascript
socket.on('receiveMessage', (data) => {
  const message = data.data;
  
  // Update your messages state
  setMessages(prevMessages => [...prevMessages, message]);
  
  // Show notification
  showNotification(`New message from ${message.senderId.username}`);
});
```

**Data Structure:**
```javascript
{
  data: {
    _id: "65a1b2c3d4e5f6g7h8i9j0k7",
    senderId: {
      _id: "65a1b2c3d4e5f6g7h8i9j0k2",
      username: "alice"
    },
    receiverId: {
      _id: "65a1b2c3d4e5f6g7h8i9j0k1",
      username: "john_doe"
    },
    text: "Hey! How are you?",
    timestamp: "2026-01-21T09:15:00.000Z",
    isRead: false
  }
}
```

---

#### 3. Message Sent Confirmation

**Event:** `messageSent`

**Description:** Confirmation that your message was sent successfully

```javascript
socket.on('messageSent', (data) => {
  if (data.success) {
    const message = data.data;
    
    // Update your messages state
    setMessages(prevMessages => [...prevMessages, message]);
    
    // Clear input field
    setInputText('');
  }
});
```

---

#### 4. User Online

**Event:** `userOnline`

**Description:** Notification when a user comes online

```javascript
socket.on('userOnline', (data) => {
  const { userId } = data;
  
  // Update user status in your state
  setOnlineUsers(prev => [...prev, userId]);
});
```

---

#### 5. User Offline

**Event:** `userOffline`

**Description:** Notification when a user goes offline

```javascript
socket.on('userOffline', (data) => {
  const { userId } = data;
  
  // Update user status in your state
  setOnlineUsers(prev => prev.filter(id => id !== userId));
});
```

---

#### 6. User Typing

**Event:** `userTyping`

**Description:** Notification when another user is typing

```javascript
socket.on('userTyping', (data) => {
  const { userId, isTyping } = data;
  
  // Show/hide typing indicator
  if (isTyping) {
    setTypingUsers(prev => [...prev, userId]);
  } else {
    setTypingUsers(prev => prev.filter(id => id !== userId));
  }
});
```

---

#### 7. Error

**Event:** `error`

**Description:** Error notification from server

```javascript
socket.on('error', (data) => {
  console.error('Socket error:', data.message);
  alert(data.message);
});
```

---

## 🎯 Complete React Integration Example

### 1. Create API Service (`src/services/api.js`)

```javascript
const API_URL = 'http://localhost:3000';

// Auth APIs
export const register = async (username, password) => {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  return response.json();
};

export const login = async (username, password) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  return response.json();
};

// User APIs
export const getUsers = async (token) => {
  const response = await fetch(`${API_URL}/users`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return response.json();
};

// Message APIs
export const getChatHistory = async (token, userId) => {
  const response = await fetch(`${API_URL}/messages/${userId}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return response.json();
};

export const sendMessageREST = async (token, receiverId, text) => {
  const response = await fetch(`${API_URL}/messages`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ receiverId, text })
  });
  return response.json();
};

export const markAsRead = async (token, userId) => {
  const response = await fetch(`${API_URL}/messages/read/${userId}`, {
    method: 'PUT',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return response.json();
};
```

---

### 2. Create Socket Service (`src/services/socket.js`)

```javascript
import { io } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:3000';

class SocketService {
  constructor() {
    this.socket = null;
  }

  connect(token, userId) {
    this.socket = io(SOCKET_URL);

    this.socket.on('connect', () => {
      console.log('Socket connected');
      this.socket.emit('join', { token, userId });
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }

  sendMessage(token, senderId, receiverId, text) {
    if (this.socket) {
      this.socket.emit('sendMessage', {
        token,
        senderId,
        receiverId,
        text
      });
    }
  }

  onReceiveMessage(callback) {
    if (this.socket) {
      this.socket.on('receiveMessage', callback);
    }
  }

  onMessageSent(callback) {
    if (this.socket) {
      this.socket.on('messageSent', callback);
    }
  }

  onUserOnline(callback) {
    if (this.socket) {
      this.socket.on('userOnline', callback);
    }
  }

  onUserOffline(callback) {
    if (this.socket) {
      this.socket.on('userOffline', callback);
    }
  }

  sendTyping(receiverId, isTyping) {
    if (this.socket) {
      this.socket.emit('typing', { receiverId, isTyping });
    }
  }

  onUserTyping(callback) {
    if (this.socket) {
      this.socket.on('userTyping', callback);
    }
  }
}

export default new SocketService();
```

---

### 3. Example Chat Component

```javascript
import React, { useState, useEffect } from 'react';
import socketService from '../services/socket';
import { getChatHistory } from '../services/api';

function ChatComponent({ selectedUser }) {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    // Load chat history
    loadChatHistory();

    // Setup socket listeners
    socketService.onReceiveMessage((data) => {
      if (data.data.senderId._id === selectedUser._id) {
        setMessages(prev => [...prev, data.data]);
      }
    });

    socketService.onMessageSent((data) => {
      if (data.success) {
        setMessages(prev => [...prev, data.data]);
        setInputText('');
      }
    });

    socketService.onUserTyping((data) => {
      if (data.userId === selectedUser._id) {
        setIsTyping(data.isTyping);
      }
    });
  }, [selectedUser]);

  const loadChatHistory = async () => {
    const response = await getChatHistory(token, selectedUser._id);
    if (response.success) {
      setMessages(response.data);
    }
  };

  const handleSendMessage = () => {
    if (inputText.trim()) {
      socketService.sendMessage(token, userId, selectedUser._id, inputText);
    }
  };

  const handleInputChange = (e) => {
    setInputText(e.target.value);
    socketService.sendTyping(selectedUser._id, e.target.value.length > 0);
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h2>{selectedUser.username}</h2>
        {isTyping && <span>typing...</span>}
      </div>

      <div className="messages">
        {messages.map((msg) => (
          <div
            key={msg._id}
            className={msg.senderId._id === userId ? 'sent' : 'received'}
          >
            <p>{msg.text}</p>
            <span>{new Date(msg.timestamp).toLocaleTimeString()}</span>
          </div>
        ))}
      </div>

      <div className="input-area">
        <input
          type="text"
          value={inputText}
          onChange={handleInputChange}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="Type a message..."
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
}

export default ChatComponent;
```

---

## 🚀 Quick Start for React Developers

### 1. Install Dependencies

```bash
npm install socket.io-client
```

### 2. Environment Variables

Create `.env` file in your React project:

```env
REACT_APP_API_URL=http://localhost:3000
REACT_APP_SOCKET_URL=http://localhost:3000
```

### 3. App Flow

1. **Login/Register** → Save token and userId to localStorage
2. **Connect Socket** → Call `socketService.connect(token, userId)`
3. **Fetch Users** → Get list of users to chat with
4. **Select User** → Load chat history
5. **Send/Receive Messages** → Use Socket.IO for real-time updates
6. **Logout** → Disconnect socket and clear localStorage

---

## 📝 Important Notes

1. **Token Storage:** Store JWT token in localStorage or secure cookie
2. **Socket Connection:** Connect socket AFTER successful login
3. **Error Handling:** Always handle API errors and show user-friendly messages
4. **Offline Messages:** Messages are stored in DB, so offline users will see them when they login
5. **CORS:** Backend has CORS enabled for all origins (change in production)

---

## 🔒 Security Best Practices

1. Never store passwords in state or localStorage
2. Always validate token before making API calls
3. Implement auto-logout on token expiration
4. Use HTTPS in production
5. Sanitize user inputs before sending

---

## 📱 Recommended React Project Structure

```
src/
├── components/
│   ├── Auth/
│   │   ├── Login.jsx
│   │   └── Register.jsx
│   ├── Chat/
│   │   ├── ChatList.jsx
│   │   ├── ChatWindow.jsx
│   │   └── MessageItem.jsx
│   └── Users/
│       └── UserList.jsx
├── services/
│   ├── api.js
│   └── socket.js
├── context/
│   ├── AuthContext.jsx
│   └── ChatContext.jsx
├── hooks/
│   ├── useAuth.js
│   └── useSocket.js
└── App.jsx
```

---

## 🎨 UI Component Suggestions

- **Login/Register Page:** Form with username and password
- **User List:** Sidebar showing all available users
- **Chat Window:** Messages display with input field
- **Online Indicator:** Green dot for online users
- **Typing Indicator:** "User is typing..." animation
- **Unread Count:** Badge showing unread message count
- **Timestamp:** Show message time in human-readable format

---

## 🐛 Common Issues & Solutions

### Issue: Socket not connecting
**Solution:** Make sure to connect socket AFTER login and pass valid token

### Issue: Messages not appearing in real-time
**Solution:** Check if both users are connected to socket and listening to `receiveMessage` event

### Issue: 401 Unauthorized
**Solution:** Token might be expired or invalid. Re-login to get new token

### Issue: CORS error
**Solution:** Backend has CORS enabled. If still facing issues, check browser console

---

## 📞 Need Help?

- Check the main [README.md](README.md) for backend setup
- Review [QUICKSTART.md](QUICKSTART.md) for testing the API
- Open the `socket-test.html` file to test Socket.IO events

---

**Happy Coding! 🚀**
