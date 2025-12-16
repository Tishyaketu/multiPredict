
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { DiseaseConfig } from "../models/DiseaseConfig.model.mjs";

const createConfig = asyncHandler(async (req, res) => {
    // Basic validation
    const { name, slug, analysisType } = req.body;
    if (!name || !slug || !analysisType) {
        throw new ApiError(400, "Name, Slug, and AnalysisType are required");
    }

    const existing = await DiseaseConfig.findOne({ slug });
    if (existing) {
        throw new ApiError(409, "Disease with this slug already exists");
    }

    const newConfig = await DiseaseConfig.create(req.body);

    return res.status(201).json(
        new ApiResponse(201, newConfig, "Disease configuration created successfully")
    );
});

const updateConfig = asyncHandler(async (req, res) => {
    const { slug } = req.params;
    const updates = req.body;

    // Prevent changing slug if it breaks URLs, but allow it for now
    const config = await DiseaseConfig.findOneAndUpdate({ slug }, updates, { new: true });

    if (!config) {
        throw new ApiError(404, "Disease configuration not found");
    }

    return res.status(200).json(
        new ApiResponse(200, config, "Disease configuration updated successfully")
    );
});

const deleteConfig = asyncHandler(async (req, res) => {
    const { slug } = req.params;
    const config = await DiseaseConfig.findOneAndDelete({ slug });

    if (!config) {
        throw new ApiError(404, "Disease configuration not found");
    }

    return res.status(200).json(
        new ApiResponse(200, {}, "Disease configuration deleted successfully")
    );
});

const getAdminConfigs = asyncHandler(async (req, res) => {
    const configs = await DiseaseConfig.find({});
    return res.status(200).json(
        new ApiResponse(200, configs, "Admin configs fetched successfully")
    );
});

const getAdminConfigBySlug = asyncHandler(async (req, res) => {
    const { slug } = req.params;
    const config = await DiseaseConfig.findOne({ slug });
    if (!config) {
        throw new ApiError(404, "Configs not found");
    }
    return res.status(200).json(
        new ApiResponse(200, config, "Admin config fetched successfully")
    );
});

export {
    createConfig,
    updateConfig,
    deleteConfig,
    getAdminConfigs,
    getAdminConfigBySlug
};
