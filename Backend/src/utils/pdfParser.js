import pdf from 'pdf-parse';
import fs from 'fs';

const extractHeartData = async (filePath) => {
    const dataBuffer = fs.readFileSync(filePath);

    try {
        const data = await pdf(dataBuffer);
        const text = data.text;

        // Define regex patterns for each field
        const patterns = {
            age: /(?:age|Age)\s*[:=]\s*(\d+)/i,
            sex: /(?:sex|Sex)\s*[:=]\s*(\d+)/i,
            cp: /(?:cp|chest pain|chest\s*pain|Cp)\s*[:=]\s*(\d+)/i,
            trestbps: /(?:trestbps|resting blood pressure|Resting BP)\s*[:=]\s*(\d+)/i,
            chol: /(?:chol|cholesterol|Chol)\s*[:=]\s*(\d+)/i,
            fbs: /(?:fbs|fasting blood sugar|Fasting BS)\s*[:=]\s*(\d+)/i,
            restecg: /(?:restecg|resting electrocardiographic results|Rest ECG)\s*[:=]\s*(\d+)/i,
            thalach: /(?:thalach|maximum heart rate achieved|Max HR)\s*[:=]\s*(\d+)/i,
            exang: /(?:exang|exercise induced angina|Ex Angina)\s*[:=]\s*(\d+)/i,
            oldpeak: /(?:oldpeak|ST depression induced by exercise relative to rest)\s*[:=]\s*(\d+(?:\.\d+)?)/i,
            slope: /(?:slope|the slope of the peak exercise ST segment)\s*[:=]\s*(\d+)/i,
            ca: /(?:ca|number of major vessels|CA)\s*[:=]\s*(\d+)/i,
            thal: /(?:thal|Thal)\s*[:=]\s*(\d+)/i
        };

        const extractedData = {};

        for (const [key, pattern] of Object.entries(patterns)) {
            const match = text.match(pattern);
            if (match && match[1]) {
                extractedData[key] = parseFloat(match[1]); // Parse as number 
            } else {
                extractedData[key] = null; // Or handle missing data as preferred
            }
        }

        return extractedData;

    } catch (error) {
        console.error("Error extracting PDF data:", error);
        throw new Error("Failed to extract data from PDF");
    }
};

export { extractHeartData };
