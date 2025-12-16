#!/bin/bash

BASE_URL="http://localhost:8000/api/v1"

echo "1. Registering User..."
REGISTER_RES=$(curl -s -X POST $BASE_URL/users/register \
  -H "Content-Type: application/json" \
  -d '{"fullName": "Test User", "email": "p3test@example.com", "password": "password123"}')
echo $REGISTER_RES

echo -e "\n2. Logging In..."
# Capture cookies for auth
curl -s -c /tmp/cookies.txt -X POST $BASE_URL/users/login \
  -H "Content-Type: application/json" \
  -d '{"email": "p3test@example.com", "password": "password123"}' > /tmp/login_response.json
cat /tmp/login_response.json

echo -e "\n\n3. Fetching All Configs..."
curl -s -b /tmp/cookies.txt $BASE_URL/predict/configs | jq '.'

echo -e "\n\n4. Predicting Heart Disease..."
# Heart disease prediction
curl -s -b /tmp/cookies.txt -X POST $BASE_URL/predict/heart-disease \
  -H "Content-Type: application/json" \
  -d '{
    "age": 63,
    "sex": 1,
    "cp": 3,
    "trestbps": 145,
    "chol": 233,
    "fbs": 1,
    "restecg": 0,
    "thalach": 150,
    "exang": 0,
    "oldpeak": 2.3,
    "slope": 0,
    "ca": 0,
    "thal": 1
  }'
