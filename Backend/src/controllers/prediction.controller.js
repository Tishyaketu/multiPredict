import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { runPythonModel } from "../utils/runPythonModel.js";
import fs from "fs";
import path from "path";

// 1. Heart Disease Prediction
const predictHeart = asyncHandler(async (req, res) => {
    // Expecting JSON body with 13 features
    // { "age": 63, "sex": 1, ... }
    const inputData = req.body;

    // Convert inputData values to array of strings for command line args if needed, 
    // OR pass the whole JSON string as one argument.
    // Our python script expects JSON string as the first argument.
    const jsonString = JSON.stringify(inputData);

    try {
        const result = await runPythonModel("predict_heart.py", [jsonString]);
        return res.status(200).json(new ApiResponse(200, result, "Heart prediction successful"));
    } catch (error) {
        throw new ApiError(500, error.message || "Prediction failed");
    }
});

// 2. Diabetes Prediction
const predictDiabetes = asyncHandler(async (req, res) => {
    const inputData = req.body;
    const jsonString = JSON.stringify(inputData);

    try {
        const result = await runPythonModel("predict_diabetes.py", [jsonString]);
        return res.status(200).json(new ApiResponse(200, result, "Diabetes prediction successful"));
    } catch (error) {
        throw new ApiError(500, error.message || "Prediction failed");
    }
});

// 3. Breast Cancer Prediction (Image)
const predictBreast = asyncHandler(async (req, res) => {
    if (!req.file) {
        throw new ApiError(400, "Image file is required");
    }

    const imagePath = path.resolve(req.file.path); // Resolve absolute path

    try {
        // First arg: cancer_type ('breast'), Second arg: image_path
        const result = await runPythonModel("predict_cancer.py", ["breast", imagePath]);

        // Cleanup temp file
        fs.unlinkSync(imagePath);

        return res.status(200).json(new ApiResponse(200, result, "Breast Cancer prediction successful"));
    } catch (error) {
        // Cleanup temp file even on error
        if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
        throw new ApiError(500, error.message || "Prediction failed");
    }
});

// 4. Lung Cancer Prediction (Image)
const predictLung = asyncHandler(async (req, res) => {
    if (!req.file) {
        throw new ApiError(400, "Image file is required");
    }

    const imagePath = path.resolve(req.file.path);

    try {
        // First arg: cancer_type ('lung'), Second arg: image_path
        const result = await runPythonModel("predict_cancer.py", ["lung", imagePath]);

        fs.unlinkSync(imagePath);

        return res.status(200).json(new ApiResponse(200, result, "Lung Cancer prediction successful"));
    } catch (error) {
        if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
        throw new ApiError(500, error.message || "Prediction failed");
    }
});

export {
    predictHeart,
    predictDiabetes,
    predictBreast,
    predictLung
}
