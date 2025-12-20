#!/bin/bash

# Configuration
API_URL="http://localhost:8000/api/v1"
ADMIN_EMAIL="testadmin@multipredict.com"
ADMIN_PASSWORD="password123"
ADMIN_NAME="Test Admin"

# 1. Register Admin
echo "Registering Admin..."
REG_RESPONSE=$(curl -s -X POST "$API_URL/admin-auth/register" \
    -H "Content-Type: application/json" \
    -d "{\"fullName\": \"$ADMIN_NAME\", \"email\": \"$ADMIN_EMAIL\", \"password\": \"$ADMIN_PASSWORD\"}")

if echo "$REG_RESPONSE" | grep -q '"success":true'; then
    echo "Admin registered successfully."
else
    echo "Admin registration failed: $REG_RESPONSE"
fi

# 2. Login Admin
echo "Logging in Admin..."
LOGIN_RESPONSE=$(curl -s -X POST "$API_URL/admin-auth/login" \
    -H "Content-Type: application/json" \
    -d "{\"email\": \"$ADMIN_EMAIL\", \"password\": \"$ADMIN_PASSWORD\"}" -c cookies.txt)

if echo "$LOGIN_RESPONSE" | grep -q '"success":true'; then
    echo "Admin logged in successfully."
    ADMIN_TOKEN=$(echo "$LOGIN_RESPONSE" | grep -oP '"accessToken":"\K[^"]+')
else
    echo "Admin login failed: $LOGIN_RESPONSE"
    exit 1
fi

# 3. Access Protected Admin Route
echo "Accessing protected admin route..."
CONFIG_RESPONSE=$(curl -s -X GET "$API_URL/admin/configs" -b cookies.txt)

if echo "$CONFIG_RESPONSE" | grep -q '"success":true'; then
    echo "Successfully accessed admin configs."
else
    echo "Failed to access admin configs: $CONFIG_RESPONSE"
fi

# 4. Verify regular user access is denied
echo "Registering regular user..."
USER_EMAIL="testuser@gmail.com"
USER_REG=$(curl -s -X POST "$API_URL/users/register" \
    -H "Content-Type: application/json" \
    -d "{\"fullName\": \"Test User\", \"email\": \"$USER_EMAIL\", \"password\": \"password123\"}")

echo "Logging in regular user..."
USER_LOGIN=$(curl -s -X POST "$API_URL/users/login" \
    -H "Content-Type: application/json" \
    -d "{\"email\": \"$USER_EMAIL\", \"password\": \"password123\"}" -c user_cookies.txt)

echo "Regular user trying to access admin configs..."
USER_ADMIN_ACCESS=$(curl -s -X GET "$API_URL/admin/configs" -b user_cookies.txt)

if echo "$USER_ADMIN_ACCESS" | grep -q '"success":false'; then
    echo "Regular user correctly denied access to admin configs."
else
    echo "CRITICAL: Regular user was able to access admin configs! $USER_ADMIN_ACCESS"
fi

# Cleanup
rm cookies.txt user_cookies.txt
