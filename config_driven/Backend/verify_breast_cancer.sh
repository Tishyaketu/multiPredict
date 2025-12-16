#!/bin/bash

BASE_URL="http://localhost:8000/api/v1"
IMAGE_PATH="/home/tish/thas/dynamic/ML/datasets/Breast_Cancer/val/benign/benign (1).png"

# Ensure image exists
if [ ! -f "$IMAGE_PATH" ]; then
    echo "Error: Test image not found at $IMAGE_PATH"
    exit 1
fi

echo -e "\n1. Logging In..."
# Capture cookies for auth
curl -s -c /tmp/cookies.txt -X POST $BASE_URL/users/login \
  -H "Content-Type: application/json" \
  -d '{"email": "p3test@example.com", "password": "password123"}' > /tmp/login_response.json
cat /tmp/login_response.json

echo -e "\n\n2. Predicting Breast Cancer (Image Upload)..."
# Breast cancer prediction
# Expects a file upload with key 'file'

curl -s -b /tmp/cookies.txt -X POST $BASE_URL/predict/breast-cancer \
  -H "Content-Type: multipart/form-data" \
  -F "file=@$IMAGE_PATH" 
