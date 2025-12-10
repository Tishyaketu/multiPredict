import { useState } from 'react';
import api from '../utils/api';

const ResultModal = ({ result, type, onClose, closeText }) => {
    const [downloading, setDownloading] = useState(false);

    const handleDownload = async () => {
        setDownloading(true);
        try {
            const response = await api.post('/report/download', {
                predictionData: result,
                predictionType: type
            }, {
                responseType: 'blob' // Important for PDF
            });

            // Create blob link to download
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${type}_Report_${Date.now()}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error("Download failed:", error);
            alert("Failed to download report");
        } finally {
            setDownloading(false);
        }
    };

    if (!result) return null;

    const isPositive = result.prediction === 1 || result.label === "Malignant";
    const statusColor = isPositive ? "red" : "green";

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Prediction Result: {type}</h2>
                <div className="result-box" style={{ borderColor: statusColor }}>
                    <h3 style={{ color: statusColor }}>
                        {result.label || (result.prediction === 1 ? "Positive (Risk Detected)" : "Negative (Healthy)")}
                    </h3>
                    {result.confidence !== undefined && (
                        <p>Confidence: {(result.confidence * 100).toFixed(2)}%</p>
                    )}
                </div>

                <div className="modal-actions">
                    <button onClick={handleDownload} disabled={downloading} className="btn-primary">
                        {downloading ? "Generating PDF..." : "Download Report"}
                    </button>
                    <button onClick={onClose} className="btn-secondary">{closeText || "Close"}</button>
                </div>
            </div>
        </div>
    );
};

export default ResultModal;
