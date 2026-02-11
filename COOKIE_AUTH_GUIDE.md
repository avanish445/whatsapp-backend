# Cookie-Based JWT Authentication Guide

## Overview
The WhatsApp backend now uses **HTTP-only cookies** for JWT token storage, which provides better security compared to storing tokens in localStorage or sessionStorage.

## Security Benefits
1. **XSS Protection**: HTTP-only cookies cannot be accessed by JavaScript, preventing XSS attacks
2. **CSRF Protection**: Using `sameSite: 'strict'` prevents CSRF attacks
3. **Automatic Management**: Cookies are automatically sent with requests, no manual header management needed

## API Endpoints

### 1. Register User
**POST** `/auth/register`

**Request Body:**
```json
{
  "username": "john_doe",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "65f1a2b3c4d5e6f7g8h9i0j1",
      "username": "john_doe",
      "createdAt": "2026-02-11T00:00:00.000Z"
    }
  }
}
```

**Cookie Set:** `token` (HTTP-only, 7 days expiry)

---

### 2. Login User
**POST** `/auth/login`

**Request Body:**
```json
{
  "username": "john_doe",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "65f1a2b3c4d5e6f7g8h9i0j1",
      "username": "john_doe",
      "createdAt": "2026-02-11T00:00:00.000Z"
    }
  }
}
```

**Cookie Set:** `token` (HTTP-only, 7 days expiry)

---

### 3. Get Current User (Protected)
**GET** `/auth/me`

**Headers:** Cookie is automatically sent by browser

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "65f1a2b3c4d5e6f7g8h9i0j1",
      "username": "john_doe",
      "createdAt": "2026-02-11T00:00:00.000Z"
    }
  }
}
```

---

### 4. Logout User (Protected)
**POST** `/auth/logout`

**Headers:** Cookie is automatically sent by browser

**Response:**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

**Cookie Cleared:** `token` cookie is removed

---

## Frontend Integration

### Using Fetch API

```javascript
// Register
const register = async (username, password) => {
  const response = await fetch('http://localhost:3000/auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', // Important: Include cookies
    body: JSON.stringify({ username, password })
  });
  
  const data = await response.json();
  return data;
};

// Login
const login = async (username, password) => {
  const response = await fetch('http://localhost:3000/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', // Important: Include cookies
    body: JSON.stringify({ username, password })
  });
  
  const data = await response.json();
  return data;
};

// Get current user
const getCurrentUser = async () => {
  const response = await fetch('http://localhost:3000/auth/me', {
    method: 'GET',
    credentials: 'include', // Important: Include cookies
  });
  
  const data = await response.json();
  return data;
};

// Logout
const logout = async () => {
  const response = await fetch('http://localhost:3000/auth/logout', {
    method: 'POST',
    credentials: 'include', // Important: Include cookies
  });
  
  const data = await response.json();
  return data;
};
```

### Using Axios

```javascript
import axios from 'axios';

// Configure axios to include credentials
axios.defaults.withCredentials = true;
axios.defaults.baseURL = 'http://localhost:3000';

// Register
const register = async (username, password) => {
  const { data } = await axios.post('/auth/register', {
    username,
    password
  });
  return data;
};

// Login
const login = async (username, password) => {
  const { data } = await axios.post('/auth/login', {
    username,
    password
  });
  return data;
};

// Get current user
const getCurrentUser = async () => {
  const { data } = await axios.get('/auth/me');
  return data;
};

// Logout
const logout = async () => {
  const { data } = await axios.post('/auth/logout');
  return data;
};
```

## Testing with cURL

### Register
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"testpass123"}' \
  -c cookies.txt
```

### Login
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"testpass123"}' \
  -c cookies.txt
```

### Get Current User
```bash
curl -X GET http://localhost:3000/auth/me \
  -b cookies.txt
```

### Logout
```bash
curl -X POST http://localhost:3000/auth/logout \
  -b cookies.txt
```

## Important Notes

1. **CORS Configuration**: The backend is configured to accept requests from `http://localhost:5173` (Vite default). Update this in `src/server.js` if your frontend runs on a different port.

2. **Credentials**: Always include `credentials: 'include'` in fetch requests or set `withCredentials: true` in axios to send cookies.

3. **HTTPS in Production**: The `secure` flag is set based on `NODE_ENV`. In production, ensure you're using HTTPS.

4. **Cookie Expiry**: Cookies expire after 7 days. Users will need to log in again after that.

5. **Backward Compatibility**: The auth middleware still supports Bearer tokens in the Authorization header for backward compatibility.

## Environment Variables

Make sure these are set in your `.env` file:

```env
PORT=3000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key_change_in_production
JWT_EXPIRE=7d
NODE_ENV=development
```

## Cookie Configuration

The cookie is set with the following options:

```javascript
{
  httpOnly: true,        // Prevents JavaScript access
  secure: false,         // true in production (HTTPS only)
  sameSite: 'strict',    // CSRF protection
  maxAge: 604800000      // 7 days in milliseconds
}
```
