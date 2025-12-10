import { asyncHandler } from "../utils/asyncHandler.js";
import { generatePDFReport } from "../utils/generateReport.js";

const downloadReport = asyncHandler(async (req, res) => {
    // Client sends the prediction result they just received, plus user info is in req.user
    const { predictionData, predictionType } = req.body;
    const user = req.user;

    if (!predictionData || !predictionType) {
        return res.status(400).json({ message: "Missing prediction data" });
    }

    const pdfBytes = await generatePDFReport(user, predictionData, predictionType);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=report_${Date.now()}.pdf`);
    res.send(Buffer.from(pdfBytes));
});

const parsePrescription = asyncHandler(async (req, res) => {
    // This is a placeholder for OCR. For now, it just parses text fields if provided? 
    // Or we assume a text file upload. 
    // Requirement says: "regex logic for prescription parsing"
    // Let's assume the user sends raw text extracted from frontend (or future OCR)
    const { text } = req.body;

    if (!text) {
        return res.status(400).json({ message: "No text provided" });
    }

    // Basic regex examples
    const medicineRegex = /(?:\d+\.\s*)?([A-Za-z\s]+)(?:\s\d+mg)?(?:\s(?:BD|OD|TDS))/gi;
    const medicines = text.match(medicineRegex) || [];

    return res.status(200).json({
        message: "Parsed successfully",
        medicines: medicines
    });
});

export { downloadReport, parsePrescription };
