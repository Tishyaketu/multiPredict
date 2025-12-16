#!/bin/bash
BASE_URL="http://localhost:8000/api/v1"
COOKIE="/tmp/cookies_admin_backup.txt"

# Defined Payloads (Hardcoded to match original seeds)
HEART_PAYLOAD='{
  "name": "Heart Disease Prediction",
  "slug": "heart-disease",
  "icon": "heart_icon_url_placeholder",
  "analysisType": "form",
  "hasPrescriptionUpload": true,
  "modelPath": "./dynamic/ML/models/heart_model.pkl",
  "scriptPath": "./dynamic/ML/predict_heart.py",
  "scriptInterface": { "type": "json_arg", "argsTemplate": ["<json_string>"] },
  "formSchema": [{"name":"age","label":"Age","inputType":"number","validation":{"min":1,"max":120,"required":true}},{"name":"sex","label":"Sex (1=Male, 0=Female)","inputType":"select","options":["1","0"],"validation":{"required":true}},{"name":"cp","label":"Chest Pain Type (0-3)","inputType":"select","options":["0","1","2","3"],"validation":{"required":true}},{"name":"trestbps","label":"Resting Blood Pressure","inputType":"number","validation":{"min":50,"max":250,"required":true}},{"name":"chol","label":"Cholesterol","inputType":"number","validation":{"min":100,"max":600,"required":true}},{"name":"fbs","label":"Fasting Blood Sugar > 120 mg/dl (1=True, 0=False)","inputType":"select","options":["1","0"],"validation":{"required":true}},{"name":"restecg","label":"Resting ECG (0-2)","inputType":"select","options":["0","1","2"],"validation":{"required":true}},{"name":"thalach","label":"Max Heart Rate Achieved","inputType":"number","validation":{"min":60,"max":220,"required":true}},{"name":"exang","label":"Exercise Induced Angina (1=Yes, 0=No)","inputType":"select","options":["1","0"],"validation":{"required":true}},{"name":"oldpeak","label":"ST Depression","inputType":"number","validation":{"min":0,"max":10,"required":true}},{"name":"slope","label":"Slope of Peak Exercise ST (0-2)","inputType":"select","options":["0","1","2"],"validation":{"required":true}},{"name":"ca","label":"Number of Major Vessels (0-3)","inputType":"select","options":["0","1","2","3"],"validation":{"required":true}},{"name":"thal","label":"Thalassemia (1-3)","inputType":"select","options":["1","2","3"],"validation":{"required":true}}]
}'

BREAST_PAYLOAD='{
  "name": "Breast Cancer Detection",
  "slug": "breast-cancer",
  "icon": "breast_icon_url_placeholder",
  "analysisType": "image",
  "hasPrescriptionUpload": false,
  "modelPath": "./dynamic/ML/models/breast_cancer_model.h5",
  "scriptPath": "./dynamic/ML/predict_cancer.py",
  "scriptInterface": { "type": "cli_args", "argsTemplate": ["breast", "<filePath>"] },
  "formSchema": []
}'

LUNG_PAYLOAD='{
  "name": "Lung Cancer Screening",
  "slug": "lung-cancer",
  "icon": "lung_icon_url_placeholder",
  "analysisType": "image",
  "hasPrescriptionUpload": false,
  "modelPath": "./dynamic/ML/models/lung_cancer_model.h5",
  "scriptPath": "./dynamic/ML/predict_cancer.py",
  "scriptInterface": { "type": "cli_args", "argsTemplate": ["lung", "<filePath>"] },
  "formSchema": []
}'

DIABETES_PAYLOAD='{
  "name": "Diabetes Prediction",
  "slug": "diabetes",
  "icon": "diabetes_icon_url_placeholder",
  "analysisType": "form",
  "hasPrescriptionUpload": true,
  "modelPath": "./dynamic/ML/models/diabetes_model.pkl",
  "scriptPath": "./dynamic/ML/predict_diabetes.py",
  "scriptInterface": { "type": "json_arg", "argsTemplate": ["<json_string>"] },
  "formSchema": [{"name":"Pregnancies","label":"Pregnancies","inputType":"number","validation":{"min":0,"max":20,"required":true}},{"name":"Glucose","label":"Glucose","inputType":"number","validation":{"min":0,"max":300,"required":true}},{"name":"BloodPressure","label":"Blood Pressure","inputType":"number","validation":{"min":0,"max":200,"required":true}},{"name":"SkinThickness","label":"Skin Thickness","inputType":"number","validation":{"min":0,"max":100,"required":true}},{"name":"Insulin","label":"Insulin","inputType":"number","validation":{"min":0,"max":900,"required":true}},{"name":"BMI","label":"BMI","inputType":"number","validation":{"min":0,"max":70,"required":true}},{"name":"DiabetesPedigreeFunction","label":"Diabetes Pedigree Function","inputType":"number","validation":{"min":0,"max":3,"required":true}},{"name":"Age","label":"Age","inputType":"number","validation":{"min":0,"max":120,"required":true}}]
}'


# 1. Login (Ensure valid cookie)
echo "--- 1. Login Admin ---"
curl -s -c $COOKIE -X POST $BASE_URL/users/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@multipredict.com", "password": "password123"}' > /dev/null

# 2. DELETE ALL
echo -e "\n--- 2. Deleting All Diseases ---"
DISEASES=("heart-disease" "diabetes" "breast-cancer" "lung-cancer")
for slug in "${DISEASES[@]}"; do
    echo "Deleting $slug..."
    curl -s -b $COOKIE -X DELETE "$BASE_URL/admin/configs/$slug" > /dev/null
done
echo "All configs deleted."

# 3. Add Heart & Breast
echo -e "\n--- 3. Restoring Heart & Breast ---"
curl -s -b $COOKIE -X POST "$BASE_URL/admin/configs" -H "Content-Type: application/json" -d "$HEART_PAYLOAD" > /dev/null
echo "Heart Restored."
curl -s -b $COOKIE -X POST "$BASE_URL/admin/configs" -H "Content-Type: application/json" -d "$BREAST_PAYLOAD" > /dev/null
echo "Breast Restored."

# 4. Predict Heart (Using existing PDF logic)
echo -e "\n--- 4. Prediction Test: Heart (PDF) ---"
# We re-run the verify_prescription.sh logic inline or call it?
# Let's call verify_prescription.sh but passing our cookie if needed? No, that script logs in as p3test. 
# We can just run the existing script.
./verify_prescription.sh
echo "Heart Prediction Done."

# 5. Predict Breast (Using existing logic)
echo -e "\n--- 5. Prediction Test: Breast (Image) ---"
./verify_breast_cancer.sh
echo "Breast Prediction Done."

# 6. Restore Lung & Diabetes
echo -e "\n--- 6. Restoring Lung & Diabetes ---"
curl -s -b $COOKIE -X POST "$BASE_URL/admin/configs" -H "Content-Type: application/json" -d "$LUNG_PAYLOAD" > /dev/null
echo "Lung Restored."
curl -s -b $COOKIE -X POST "$BASE_URL/admin/configs" -H "Content-Type: application/json" -d "$DIABETES_PAYLOAD" > /dev/null
echo "Diabetes Restored."

# 7. Predict Diabetes (Using existing flow logic)
echo -e "\n--- 7. Prediction Test: Diabetes ---"
./verify_diabetes_flow.sh
echo "Diabetes Prediction Done."

echo -e "\n--- TEST COMPLETE ---"
