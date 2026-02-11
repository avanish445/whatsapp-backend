#!/bin/bash

# WhatsApp Backend API Test Script
# This script tests all the main endpoints

BASE_URL="http://localhost:3000"
echo "🧪 Testing WhatsApp Backend API at $BASE_URL"
echo "=============================================="
echo ""

# Test 1: Health Check
echo "1️⃣ Testing Health Check..."
curl -s $BASE_URL | jq '.' || echo "Failed"
echo ""
echo ""

# Test 2: Register User 1
echo "2️⃣ Registering User 1 (alice)..."
RESPONSE1=$(curl -s -X POST $BASE_URL/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"alice","password":"password123"}')
echo $RESPONSE1 | jq '.'
TOKEN1=$(echo $RESPONSE1 | jq -r '.data.token')
USER1_ID=$(echo $RESPONSE1 | jq -r '.data.user.id')
echo "Token: $TOKEN1"
echo "User ID: $USER1_ID"
echo ""
echo ""

# Test 3: Register User 2
echo "3️⃣ Registering User 2 (bob)..."
RESPONSE2=$(curl -s -X POST $BASE_URL/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"bob","password":"password123"}')
echo $RESPONSE2 | jq '.'
TOKEN2=$(echo $RESPONSE2 | jq -r '.data.token')
USER2_ID=$(echo $RESPONSE2 | jq -r '.data.user.id')
echo "Token: $TOKEN2"
echo "User ID: $USER2_ID"
echo ""
echo ""

# Test 4: Login
echo "4️⃣ Testing Login (alice)..."
LOGIN_RESPONSE=$(curl -s -X POST $BASE_URL/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"alice","password":"password123"}')
echo $LOGIN_RESPONSE | jq '.'
echo ""
echo ""

# Test 5: Get All Users
echo "5️⃣ Getting All Users (as alice)..."
curl -s -X GET $BASE_URL/users \
  -H "Authorization: Bearer $TOKEN1" | jq '.'
echo ""
echo ""

# Test 6: Send Message (REST)
echo "6️⃣ Sending Message from alice to bob..."
MESSAGE_RESPONSE=$(curl -s -X POST $BASE_URL/messages \
  -H "Authorization: Bearer $TOKEN1" \
  -H "Content-Type: application/json" \
  -d "{\"receiverId\":\"$USER2_ID\",\"text\":\"Hello Bob! How are you?\"}")
echo $MESSAGE_RESPONSE | jq '.'
echo ""
echo ""

# Test 7: Send Reply
echo "7️⃣ Sending Reply from bob to alice..."
curl -s -X POST $BASE_URL/messages \
  -H "Authorization: Bearer $TOKEN2" \
  -H "Content-Type: application/json" \
  -d "{\"receiverId\":\"$USER1_ID\",\"text\":\"Hi Alice! I'm doing great, thanks!\"}" | jq '.'
echo ""
echo ""

# Test 8: Get Chat History
echo "8️⃣ Getting Chat History (alice's view)..."
curl -s -X GET $BASE_URL/messages/$USER2_ID \
  -H "Authorization: Bearer $TOKEN1" | jq '.'
echo ""
echo ""

# Test 9: Mark as Read
echo "9️⃣ Marking Messages as Read..."
curl -s -X PUT $BASE_URL/messages/read/$USER1_ID \
  -H "Authorization: Bearer $TOKEN2" | jq '.'
echo ""
echo ""

echo "✅ All tests completed!"
echo ""
echo "📝 Summary:"
echo "  - User 1 (alice): $USER1_ID"
echo "  - User 2 (bob): $USER2_ID"
echo "  - Alice's Token: $TOKEN1"
echo "  - Bob's Token: $TOKEN2"
