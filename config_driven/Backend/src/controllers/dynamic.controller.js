import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { DiseaseConfig } from "../models/DiseaseConfig.model.mjs";
import { PredictionLog } from "../models/PredictionLog.model.js";
import { runPythonScript } from "../utils/pythonRunner.js";
import fs from "fs";
import path from "path";

// 1. Get All Available Diseases (for Dashboard)
const getConfigs = asyncHandler(async (req, res) => {
    const configs = await DiseaseConfig.find({}).select("-modelPath -scriptPath -scriptInterface");

    return res.status(200).json(
        new ApiResponse(200, configs, "Configs fetched successfully")
    );
});

// 2. Get Single Config (for Analysis Page)
const getConfigBySlug = asyncHandler(async (req, res) => {
    const { slug } = req.params;
    const config = await DiseaseConfig.findOne({ slug }).select("-modelPath -scriptPath -scriptInterface");

    if (!config) {
        throw new ApiError(404, "Disease configuration not found");
    }

    return res.status(200).json(
        new ApiResponse(200, config, "Config fetched successfully")
    );
});

// 3. Predict Dynamic
const predictDynamic = asyncHandler(async (req, res) => {
    const { slug } = req.params;
    const config = await DiseaseConfig.findOne({ slug });

    if (!config) {
        throw new ApiError(404, "Disease configuration not found");
    }

    let inputs = { ...req.body };
    let pythonArgs = [];

    // --- INPUT PREPARATION & VALIDATION ---

    // Handle File Uploads (if image analysis)
    if (config.analysisType === 'image') {
        if (!req.file) {
            throw new ApiError(400, "Image file is required");
        }
        inputs.filePath = path.resolve(req.file.path);
        // Clean input for logs (don't save full path if sensitive, but here it's temp)
        inputs.originalName = req.file.originalname;
    } else {
        // Validation for Form Data
        // Simple check: ensure all required fields in schema are present
        if (config.formSchema) {
            for (const field of config.formSchema) {
                if (field.validation?.required && inputs[field.name] === undefined) {
                    // Try converting string numbers if coming from weird form-data
                    if (inputs[field.name] === undefined) {
                        throw new ApiError(400, `Missing required field: ${field.label} (${field.name})`);
                    }
                }
            }
        }
    }

    // --- PYTHON ARGUMENT MAPPING ---

    if (config.scriptInterface.type === "json_arg") {
        // Pass all inputs as a single JSON string
        // If image, we assume the script just needs other args if any, but typically image scripts use CLI args
        // Based on our Seeder:
        // Heart/Diabetes -> json_arg
        // Cancer -> cli_args

        // For tabular, we ensure numerical values are numbers
        if (config.analysisType === 'form') {
            // Convert to numbers if schema says so
            config.formSchema.forEach(field => {
                if (field.inputType === 'number' && inputs[field.name]) {
                    inputs[field.name] = Number(inputs[field.name]);
                }
            });

            // We need to match the specific "features" array expected by existing Heart/Diabetes scripts?
            // Existing scripts expect: `json.loads(sys.argv[1])` which is a dict.
            // Then they look for `input_data.get('features')` OR `list(input_data.values())`.
            // To be safe and generic, we should standardize on passing the DICT.
            // The updated `predict_heart.py` handles dicts.
        }

        pythonArgs.push(JSON.stringify(inputs));

    } else if (config.scriptInterface.type === "cli_args") {
        // Map based on template
        // e.g. ["breast", "<filePath>"]

        for (const argTemplate of config.scriptInterface.argsTemplate) {
            if (argTemplate === "<slug>") {
                pythonArgs.push(slug); // e.g. "breast-cancer" or specific keyword needed?
                // Wait, User's cancer script expects "breast" or "lung" (the type), NOT "breast-cancer" (the slug).
                // Our seeder scriptInterface.argsTemplate hardcoded "breast" or "lung".
            } else if (argTemplate === "<filePath>") {
                if (!inputs.filePath) throw new ApiError(400, "File path missing for script");
                pythonArgs.push(inputs.filePath);
            } else if (argTemplate === "<json_string>") {
                pythonArgs.push(JSON.stringify(inputs));
            } else if (argTemplate.startsWith("<") && argTemplate.endsWith(">")) {
                // Dynamic field lookup e.g. <age>
                const key = argTemplate.slice(1, -1);
                pythonArgs.push(inputs[key] || "");
            } else {
                // Static string (like "breast" in the template)
                pythonArgs.push(argTemplate);
            }
        }
    }

    // --- EXECUTION ---
    try {
        const result = await runPythonScript(config.scriptPath, pythonArgs);

        // --- LOGGING ---
        await PredictionLog.create({
            userId: req.user._id,
            diseaseSlug: config.slug,
            diseaseName: config.name,
            analysisType: config.analysisType,
            inputs: inputs,
            result: result,
            modelUsed: config.modelPath
        });

        // Cleanup temp file if exists
        if (inputs.filePath) {
            fs.unlinkSync(inputs.filePath);
        }

        return res.status(200).json(
            new ApiResponse(200, result, "Prediction successful")
        );

    } catch (error) {
        // Cleanup temp file
        if (inputs.filePath && fs.existsSync(inputs.filePath)) {
            fs.unlinkSync(inputs.filePath);
        }
        throw new ApiError(500, "Prediction failed: " + error.message);
    }
});

// 4. Prescription Upload (Auto-fill)
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const pdf = require("pdf-parse");

const parsePrescription = asyncHandler(async (req, res) => {
    if (!req.file) {
        throw new ApiError(400, "PDF file is required");
    }

    let stats = fs.statSync(req.file.path);
    if (stats.size === 0) {
        throw new ApiError(400, "Empty PDF file");
    }

    let dataBuffer = fs.readFileSync(req.file.path);

    try {
        const data = await pdf(dataBuffer);
        const text = data.text;

        // Simple Regex Extraction (Demo Logic)
        // In real world, use more robust patterns
        const extract = (pattern) => {
            const match = text.match(pattern);
            return match ? match[1] : null;
        };

        // Example Text: "Age: 45", "BP: 120", "Sex: Male"
        const extractedData = {
            age: extract(/Age[:\s]+(\d+)/i),
            sex: extract(/Sex[:\s]+(Male|Female|1|0)/i) === "Male" ? "1" : extract(/Sex[:\s]+(1|0)/i),
            trestbps: extract(/(?:Resting\s)?BP[:\s]+(\d+)/i) || extract(/Blood Pressure[:\s]+(\d+)/i),
            chol: extract(/Chol(?:esterol)?[:\s]+(\d+)/i),
            fbs: extract(/Fasting BS[:\s]+(\d+)/i) || extract(/Glucose[:\s]+(\d+)/i), // Map BS/Glucose to fbs
            restecg: extract(/Rest ECG[:\s]+(\d+)/i),
            thalach: extract(/Max HR[:\s]+(\d+)/i),
            exang: extract(/Ex Angina[:\s]+(\d+)/i),
            oldpeak: extract(/Oldpeak[:\s]+([\d\.]+)/i),
            slope: extract(/Slope[:\s]+(\d+)/i),
            ca: extract(/CA[:\s]+(\d+)/i),
            thal: extract(/Thal[:\s]+(\d+)/i),
            cp: extract(/Chest Pain[:\s]+(\d+)/i),

            // Diabetes Mapping
            Pregnancies: extract(/Pregnancies[:\s]+(\d+)/i),
            Glucose: extract(/Glucose[:\s]+(\d+)/i),
            BloodPressure: extract(/BloodPressure[:\s]+(\d+)/i),
            SkinThickness: extract(/SkinThickness[:\s]+(\d+)/i),
            Insulin: extract(/Insulin[:\s]+(\d+)/i),
            BMI: extract(/BMI[:\s]+([\d\.]+)/i),
            DiabetesPedigreeFunction: extract(/DiabetesPedigreeFunction[:\s]+([\d\.]+)/i),
            Age: extract(/Age[:\s]+(\d+)/i), // Diabetes uses TitleCase 'Age'
        };

        // Post-processing logic for specific boolean/numeric fields if needed
        // For FBS, if it extracted "110", we might need to convert to 1 or 0 if schema expects boolean. 
        // But the text says "Fasting BS : 0", so it seems pre-processed or boolean int.
        // We will pass values as strings/numbers exactly as found.

        // Cleanup
        fs.unlinkSync(req.file.path);

        return res.status(200).json(
            new ApiResponse(200, extractedData, "Prescription parsed successfully")
        );
    } catch (e) {
        // Cleanup
        fs.unlinkSync(req.file.path);
        throw new ApiError(500, "Failed to parse PDF: " + e.message);
    }
});


const getPredictionLogs = asyncHandler(async (req, res) => {
    const logs = await PredictionLog.find({ userId: req.user._id })
        .sort({ createdAt: -1 });

    return res.status(200).json(
        new ApiResponse(200, logs, "Logs fetched successfully")
    );
});

export {
    getConfigs,
    getConfigBySlug,
    predictDynamic,
    parsePrescription,
    getPredictionLogs
};
