import mongoose from "mongoose";
import dotenv from "dotenv";
import { DiseaseConfig } from "../src/models/DiseaseConfig.model.mjs";

dotenv.config({ path: "./.env" });

const seedData = [
    // 1. HEART DISEASE
    {
        name: "Heart Disease Prediction",
        slug: "heart-disease",
        analysisType: "form",
        hasPrescriptionUpload: true,
        modelPath: "./dynamic/ML/models/heart_model.pkl",
        scriptPath: "./dynamic/ML/predict_form.py",
        icon: "heart_icon_url_placeholder",
        scriptInterface: {
            type: "cli_args",
            argsTemplate: ["heart", "<json_string>"]
        },
        formSchema: [
            { name: "age", label: "Age", inputType: "number", validation: { min: 1, max: 120, required: true } },
            { name: "sex", label: "Sex (1=Male, 0=Female)", inputType: "select", options: ["1", "0"], validation: { required: true } },
            { name: "cp", label: "Chest Pain Type (0-3)", inputType: "select", options: ["0", "1", "2", "3"], validation: { required: true } },
            { name: "trestbps", label: "Resting Blood Pressure", inputType: "number", validation: { min: 50, max: 250, required: true } },
            { name: "chol", label: "Cholesterol", inputType: "number", validation: { min: 100, max: 600, required: true } },
            { name: "fbs", label: "Fasting Blood Sugar > 120 mg/dl (1=True, 0=False)", inputType: "select", options: ["1", "0"], validation: { required: true } },
            { name: "restecg", label: "Resting ECG (0-2)", inputType: "select", options: ["0", "1", "2"], validation: { required: true } },
            { name: "thalach", label: "Max Heart Rate Achieved", inputType: "number", validation: { min: 60, max: 220, required: true } },
            { name: "exang", label: "Exercise Induced Angina (1=Yes, 0=No)", inputType: "select", options: ["1", "0"], validation: { required: true } },
            { name: "oldpeak", label: "ST Depression", inputType: "number", validation: { min: 0, max: 10, required: true } },
            { name: "slope", label: "Slope of Peak Exercise ST (0-2)", inputType: "select", options: ["0", "1", "2"], validation: { required: true } },
            { name: "ca", label: "Number of Major Vessels (0-3)", inputType: "select", options: ["0", "1", "2", "3"], validation: { required: true } },
            { name: "thal", label: "Thalassemia (1-3)", inputType: "select", options: ["1", "2", "3"], validation: { required: true } }
        ]
    },
    // 2. DIABETES
    {
        name: "Diabetes Prediction",
        slug: "diabetes",
        analysisType: "form",
        hasPrescriptionUpload: true,
        modelPath: "./dynamic/ML/models/diabetes_model.pkl",
        scriptPath: "./dynamic/ML/predict_form.py",
        icon: "diabetes_icon_url_placeholder",
        scriptInterface: {
            type: "cli_args",
            argsTemplate: ["diabetes", "<json_string>"]
        },
        formSchema: [
            { name: "Pregnancies", label: "Pregnancies", inputType: "number", validation: { min: 0, max: 20, required: true } },
            { name: "Glucose", label: "Glucose", inputType: "number", validation: { min: 0, max: 300, required: true } },
            { name: "BloodPressure", label: "Blood Pressure", inputType: "number", validation: { min: 0, max: 200, required: true } },
            { name: "SkinThickness", label: "Skin Thickness", inputType: "number", validation: { min: 0, max: 100, required: true } },
            { name: "Insulin", label: "Insulin", inputType: "number", validation: { min: 0, max: 900, required: true } },
            { name: "BMI", label: "BMI", inputType: "number", validation: { min: 0, max: 70, required: true } },
            { name: "DiabetesPedigreeFunction", label: "Diabetes Pedigree Function", inputType: "number", validation: { min: 0, max: 3, required: true } },
            { name: "Age", label: "Age", inputType: "number", validation: { min: 0, max: 120, required: true } }
        ]
    },
    // 3. BREAST CANCER
    {
        name: "Breast Cancer Detection",
        slug: "breast-cancer",
        analysisType: "image",
        hasPrescriptionUpload: false,
        modelPath: "./dynamic/ML/models/breast_cancer_model.h5",
        scriptPath: "./dynamic/ML/predict_cancer.py",
        icon: "breast_icon_url_placeholder",
        scriptInterface: {
            type: "cli_args",
            argsTemplate: ["breast", "<filePath>"]
        },
        formSchema: [] // No form fields for image, generic upload handles it
    },
    // 4. LUNG CANCER
    {
        name: "Lung Cancer Screening",
        slug: "lung-cancer",
        analysisType: "image",
        hasPrescriptionUpload: false,
        modelPath: "./dynamic/ML/models/lung_cancer_model.h5",
        scriptPath: "./dynamic/ML/predict_cancer.py",
        icon: "lung_icon_url_placeholder",
        scriptInterface: {
            type: "cli_args",
            argsTemplate: ["lung", "<filePath>"]
        },
        formSchema: []
    }
];

const seedDB = async () => {
    try {
        console.log("Connecting to MongoDB...");
        // Use standard URI or load from env. Assuming default local if env missing for script context.
        const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/multi_predict_db";

        await mongoose.connect(MONGODB_URI);
        console.log("✅ Connected to MongoDB.");

        console.log("Cleaning old configs...");
        await DiseaseConfig.deleteMany({});

        console.log("Seeding new configs...");
        await DiseaseConfig.insertMany(seedData);

        console.log("✅ Seeded 4 Disease Configurations successfully!");

        // Validation query
        const count = await DiseaseConfig.countDocuments();
        console.log(`Verified: ${count} documents exist.`);

        process.exit(0);
    } catch (error) {
        console.error("❌ Error seeding database:", error);
        process.exit(1);
    }
};

seedDB();
