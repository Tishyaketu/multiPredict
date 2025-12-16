#!/bin/bash
BASE_URL="http://localhost:8000/api/v1"
COOKIES_FILE="/tmp/cookies.txt"

# 1. Login
echo "1. Login (Initial Session)..."
curl -s -c $COOKIES_FILE -X POST $BASE_URL/users/login \
  -H "Content-Type: application/json" \
  -d '{"email": "p3test@example.com", "password": "password123"}' > /dev/null

# 2. Simulate Refresh (Use Cookies Only)
echo "2. Simulate Refresh (Calling /current-user with cookies)..."
USER_RES=$(curl -s -b $COOKIES_FILE $BASE_URL/users/current-user)
echo "User Res: $USER_RES"

if [[ $USER_RES == *"p3test@example.com"* ]]; then
    echo "SUCCESS: User session persisted."
else
    echo "FAILURE: User session lost."
    exit 1
fi
