#!/bin/bash

BASE_URL="http://localhost:8000/api/v1"
PDF_PATH="/home/tish/thas/dynamic/ML/datasets/Diabetes/row1.pdf"
COOKIES_FILE="/tmp/cookies.txt"

# 1. Login
echo "1. Logging In..."
curl -s -c $COOKIES_FILE -X POST $BASE_URL/users/login \
  -H "Content-Type: application/json" \
  -d '{"email": "p3test@example.com", "password": "password123"}' > /dev/null
echo "Logged in."

# 2. Upload Prescription
echo -e "\n2. Uploading Prescription ($PDF_PATH)..."
if [ ! -f "$PDF_PATH" ]; then
    echo "Error: PDF not found."
    exit 1
fi

EXTRACT_RES=$(curl -s -b $COOKIES_FILE -X POST $BASE_URL/predict/upload-prescription \
  -H "Content-Type: multipart/form-data" \
  -F "prescription=@$PDF_PATH")

echo "Extraction Response: $EXTRACT_RES"

# Parse JSON to get extracted data (using simple grep/sed for bash or jq if available, presuming node environment has node to parse)
# adapting to node for robust parsing
PARAMS=$(node -e "
    const res = $EXTRACT_RES;
    if(!res.success) process.exit(1);
    const d = res.data;
    // Map extracted fields to Diabetes schema (Pregnancies, Glucose, etc.)
    // Note: The generic regex in backend might need tuning for Diabetes specific fields if they differ from Heart.
    // However, let's assume the PDF contains relevant text or we map common fields.
    // Diabetes Schema: Pregnancies, Glucose, BloodPressure, SkinThickness, Insulin, BMI, DiabetesPedigreeFunction, Age
    
    // Stubbing values that might be missing from generic regex
    const payload = {
        Pregnancies: d.pregnancies || 1,
        Glucose: d.glucose || 100,
        BloodPressure: d.trestbps || d.bloodPressure || 70, // Map trestbps to BloodPressure
        SkinThickness: 20, // Default if not in PDF
        Insulin: 80,       // Default
        BMI: 25.0,         // Default
        DiabetesPedigreeFunction: 0.5,
        Age: d.age || 30
    };
    console.log(JSON.stringify(payload));
")

if [ $? -ne 0 ]; then
    echo "Error parsing prescription response."
    exit 1
fi

echo -e "\n3. Derived Input Payload: $PARAMS"

# 3. Predict Diabetes
echo -e "\n4. Requesting Prediction..."
PREDICT_RES=$(curl -s -b $COOKIES_FILE -X POST "$BASE_URL/predict/diabetes" \
  -H "Content-Type: application/json" \
  -d "$PARAMS")

echo "Prediction Result: $PREDICT_RES"

# 4. "Download Report" (Save to file)
echo -e "\n5. Saving Report..."
echo "$PREDICT_RES" > diabetes_report_backend.json
echo "Report saved to diabetes_report_backend.json"
