#!/bin/bash

BASE_URL="http://localhost:8000/api/v1"

echo -e "\n1. Logging In..."
# Capture cookies for auth
curl -s -c /tmp/cookies.txt -X POST $BASE_URL/users/login \
  -H "Content-Type: application/json" \
  -d '{"email": "p3test@example.com", "password": "password123"}' > /tmp/login_response.json
cat /tmp/login_response.json

echo -e "\n\n2. Predicting Diabetes..."
# Diabetes prediction
# Schema: Pregnancies, Glucose, BloodPressure, SkinThickness, Insulin, BMI, DiabetesPedigreeFunction, Age

curl -s -b /tmp/cookies.txt -X POST $BASE_URL/predict/diabetes \
  -H "Content-Type: application/json" \
  -d '{
    "Pregnancies": 1,
    "Glucose": 85,
    "BloodPressure": 66,
    "SkinThickness": 29,
    "Insulin": 0,
    "BMI": 26.6,
    "DiabetesPedigreeFunction": 0.351,
    "Age": 31
  }' | jq '.'
