import mongoose from "mongoose";

const predictionLogSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    diseaseSlug: {
        type: String,
        required: true
    },
    diseaseName: {
        type: String,
        required: true
    },
    analysisType: {
        type: String,
        required: true
    },
    // Stores the inputs used for prediction
    // Note: Sensitivity of data should be considered (encryption might be needed in future)
    inputs: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    },
    // Stores the full result returned by the model
    result: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    },
    // Model version or path used at time of prediction
    modelUsed: { type: String },

}, { timestamps: true });

export const PredictionLog = mongoose.model("PredictionLog", predictionLogSchema);
