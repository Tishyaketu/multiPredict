import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';

// Config
const API_URL = 'http://localhost:8000/api/v1';
const PDF_PATH = '/home/tish/thas/Multi-Predict/ML/datasets/Heart Disease/row1.pdf';

const runTest = async () => {
    try {
        console.log("1. Authenticating...");
        // Generate random user credentials
        const randomStr = Math.random().toString(36).substring(7);
        const email = `test_${randomStr}@example.com`;
        const password = 'password123';
        const fullName = 'Test User';

        // 1. Register User
        console.log(`   Registering user: ${email}`);
        await axios.post(`${API_URL}/users/register`, {
            email,
            password,
            fullName
        });

        // 2. Login User
        console.log("   Logging in...");
        const loginRes = await axios.post(`${API_URL}/users/login`, {
            email,
            password
        });

        const accessToken = loginRes.data.data.accessToken;
        console.log("   Authentication successful. Token received.");

        // 3. Upload Prescription
        console.log("2. Uploading Prescription...");

        if (!fs.existsSync(PDF_PATH)) {
            throw new Error(`PDF file not found at ${PDF_PATH}`);
        }

        const form = new FormData();
        form.append('prescription', fs.createReadStream(PDF_PATH));

        const uploadRes = await axios.post(
            `${API_URL}/predict/heart/upload-prescription`,
            form,
            {
                headers: {
                    ...form.getHeaders(),
                    'Authorization': `Bearer ${accessToken}`
                }
            }
        );

        console.log("3. Upload Result:");
        console.log(JSON.stringify(uploadRes.data, null, 2));

        if (uploadRes.status === 200 && uploadRes.data.success) {
            console.log("✅ TEST PASSED: Prescription uploaded and extracted successfully.");
        } else {
            console.log("❌ TEST FAILED: Unexpected response status or data.");
            process.exit(1);
        }

    } catch (error) {
        console.error("❌ TEST FAILED:", error.message);
        if (error.response) {
            console.error("Response data:", error.response.data);
            console.error("Response status:", error.response.status);
        }
        process.exit(1);
    }
};

runTest();
