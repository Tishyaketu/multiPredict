#!/bin/bash
BASE_URL="http://localhost:8000/api/v1"

# 1. Login as Regular User
echo "1. Testing access as Regular User (p3test@example.com)..."
curl -s -c /tmp/cookies_regular.txt -X POST $BASE_URL/users/login \
  -H "Content-Type: application/json" \
  -d '{"email": "p3test@example.com", "password": "password123"}' > /dev/null

# Try creating a config (should fail)
RES_REG=$(curl -s -b /tmp/cookies_regular.txt -X POST $BASE_URL/admin/configs \
  -H "Content-Type: application/json" \
  -d '{}')
echo "Regular User Response: $RES_REG"

# 2. Register/Login as Admin User
echo -e "\n2. Registering/Logging in as Admin (admin@multipredict.com)..."
curl -s -c /tmp/cookies_admin.txt -X POST $BASE_URL/users/register \
  -H "Content-Type: application/json" \
  -d '{"fullName": "Admin User", "email": "admin@multipredict.com", "password": "password123"}' > /dev/null

# If register failed (already exists), try login
curl -s -c /tmp/cookies_admin.txt -X POST $BASE_URL/users/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@multipredict.com", "password": "password123"}' > /dev/null

# Try creating a dummy config (should succeed or at least fail validation with 400, NOT 403)
RES_ADMIN=$(curl -s -b /tmp/cookies_admin.txt -X POST $BASE_URL/admin/configs \
  -H "Content-Type: application/json" \
  -d '{}')

echo "Admin User Response: $RES_ADMIN"
