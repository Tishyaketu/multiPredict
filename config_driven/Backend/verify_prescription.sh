#!/bin/bash

BASE_URL="http://localhost:8000/api/v1"
PDF_PATH="/home/tish/thas/dynamic/ML/datasets/Heart_Disease/row1.pdf"

# Ensure PDF exists
if [ ! -f "$PDF_PATH" ]; then
    echo "Error: Test PDF not found at $PDF_PATH"
    # Try looking in other location if moved
    PDF_PATH="/home/tish/thas/Multi-Predict/Backend/test_prescription.pdf"
    if [ ! -f "$PDF_PATH" ]; then
         echo "Error: Backup PDF also not found."
         # Create a dummy text file to test endpoint connectivity at least (will fail regex but pass upload)
         # Actually pdf-parse will fail if not valid pdf.
         exit 1
    fi
fi

echo "Using PDF: $PDF_PATH"

echo -e "\n1. Logging In..."
curl -s -c /tmp/cookies.txt -X POST $BASE_URL/users/login \
  -H "Content-Type: application/json" \
  -d '{"email": "p3test@example.com", "password": "password123"}' > /tmp/login_response.json
cat /tmp/login_response.json

echo -e "\n\n2. Uploading Prescription..."
curl -s -b /tmp/cookies.txt -X POST $BASE_URL/predict/upload-prescription \
  -H "Content-Type: multipart/form-data" \
  -F "prescription=@$PDF_PATH" 
