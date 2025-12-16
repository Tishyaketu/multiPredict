import mongoose from "mongoose";

const fieldSchema = new mongoose.Schema({
    name: { type: String, required: true },
    label: { type: String, required: true },
    inputType: {
        type: String,
        required: true,
        enum: ["number", "text", "select", "radio", "checkbox"]
    },
    // Optional array for select/radio options
    options: [{ type: String }],
    validation: {
        min: { type: Number },
        max: { type: Number },
        required: { type: Boolean, default: true },
        regex: { type: String }
    },
    // Default value for the field
    defaultValue: { type: mongoose.Schema.Types.Mixed }
});

const diseaseConfigSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    icon: {
        type: String,
        default: "" // URL or identifier for icon
    },
    analysisType: {
        type: String,
        required: true,
        enum: ["form", "image"]
    },
    hasPrescriptionUpload: {
        type: Boolean,
        default: false
    },
    // Path to the .pkl or .h5 file (used by backend)
    modelPath: {
        type: String,
        required: true
    },
    // Path to the python script (used by backend)
    scriptPath: {
        type: String,
        required: true
    },
    // Defines how the backend calls the python script
    scriptInterface: {
        type: {
            type: String,
            enum: ["json_arg", "cli_args"],
            default: "json_arg"
        },
        // For cli_args, defines the order of fields to pass
        argsTemplate: [{ type: String }]
    },
    // The Input Schema for the Frontend
    formSchema: [fieldSchema]
}, { timestamps: true });

export const DiseaseConfig = mongoose.model("DiseaseConfig", diseaseConfigSchema);
