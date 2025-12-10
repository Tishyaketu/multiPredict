import axios from "axios";
import fs from "fs";
import FormData from "form-data";

const API_URL = "http://localhost:8000/api/v1";
let accessToken = "";

// 1. Register User
async function testRegister() {
    console.log("Testing Registration...");
    try {
        const res = await axios.post(`${API_URL}/users/register`, {
            fullName: "Test User",
            email: `test${Date.now()}@example.com`,
            password: "password123"
        });
        console.log("✅ Register Success:", res.data.message);
    } catch (error) {
        console.error("❌ Register Failed:", error.response?.data || error.message);
    }
}

// 2. Login User
async function testLogin() {
    console.log("Testing Login...");
    try {
        // Must use a known email if we want to login consistently, 
        // but for now let's just use the one we just made logic or hardcode for repeatable tests
        // Let's create a *specific* user for login test
        const email = "login_test@example.com";
        try {
            await axios.post(`${API_URL}/users/register`, {
                fullName: "Login Test",
                email: email,
                password: "password123"
            });
        } catch (e) { } // Ignore if already exists

        const res = await axios.post(`${API_URL}/users/login`, {
            email: email,
            password: "password123"
        });
        console.log("✅ Login Success");
        accessToken = res.data.data.accessToken;
        return accessToken;
    } catch (error) {
        console.error("❌ Login Failed:", error.response?.data || error.message);
    }
}

// 3. Heart Prediction
async function testHeartPrediction() {
    console.log("Testing Heart Prediction...");
    try {
        const res = await axios.post(`${API_URL}/predict/heart`,
            { age: 60, sex: 1, cp: 0, trestbps: 140, chol: 260, fbs: 0, restecg: 1, thalach: 150, exang: 1, oldpeak: 2.3, slope: 2, ca: 0, thal: 2 },
            { headers: { Authorization: `Bearer ${accessToken}` } }
        );
        console.log("✅ Heart Prediction Success:", res.data.data);
    } catch (error) {
        console.error("❌ Heart Prediction Failed:", error.response?.data || error.message);
    }
}

// 4. Breast Cancer Prediction (needs image)
async function testBreastPrediction() {
    console.log("Testing Breast Prediction...");
    // Always copy fresh image
    try {
        if (fs.existsSync("../ML/test_image.jpg")) {
            fs.copyFileSync("../ML/test_image.jpg", "test_img.jpg");
        } else {
            // Fallback if real image missing (shouldn't happen in this flow)
            fs.writeFileSync("test_img.jpg", "dummy content");
        }
    } catch (e) {
        console.error("Failed to copy image:", e);
    }

    try {
        const form = new FormData();
        form.append("image", fs.createReadStream("test_img.jpg"));

        const res = await axios.post(`${API_URL}/predict/breast`, form, {
            headers: {
                ...form.getHeaders(),
                Authorization: `Bearer ${accessToken}`
            }
        });
        console.log("✅ Breast Prediction Success:", res.data.data);
    } catch (error) {
        console.error("❌ Breast Prediction Failed:", error.response?.data || error.message);
    }
}

// 5. Download Report
async function testDownloadReport() {
    console.log("Testing PDF Report...");
    try {
        const res = await axios.post(`${API_URL}/report/download`,
            {
                predictionData: { prediction: 1, label: "Malignant", confidence: 0.85 },
                predictionType: "Breast Cancer"
            },
            {
                headers: { Authorization: `Bearer ${accessToken}` },
                responseType: 'arraybuffer' // Important for PDF
            }
        );
        console.log("✅ Report Download Success. PDF Size:", res.data.length);
        fs.writeFileSync("test_report.pdf", res.data);
    } catch (error) {
        console.error("❌ Report Download Failed:", error.response?.status, error.message);
    }
}

async function runTests() {
    await testRegister();
    await testLogin();
    if (accessToken) {
        await testHeartPrediction();
        await testBreastPrediction();
        await testDownloadReport();
    }
}

runTests();
