import { jsPDF } from "jspdf";

function ResultModal({ result, onClose, onReset, diseaseName }) {
    if (!result) return null;

    const isHealthy = result.prediction === 0; // Assuming 0 is negative/healthy for all? 
    // Wait, Heart: 1=Disease, 0=No Disease.
    // Breast: 0=Benign (Healthy), 1=Malignant. 
    // So 0 is generally "good" or at least "negative".


    const handleDownload = () => {
        const doc = new jsPDF();
        doc.setFontSize(20);
        doc.text("Medical Analysis Report", 20, 20);

        doc.setFontSize(14);
        doc.text(`Disease Included: ${diseaseName || "General Analysis"}`, 20, 40);
        doc.text(`Date: ${new Date().toLocaleString()}`, 20, 50);

        doc.setLineWidth(0.5);
        doc.line(20, 55, 190, 55);

        doc.setFontSize(16);
        if (isHealthy) {
            doc.setTextColor(0, 128, 0);
            doc.text(`Result: ${result.label || "Negative / Healthy"}`, 20, 70);
        } else {
            doc.setTextColor(200, 0, 0);
            doc.text(`Result: ${result.label || "Positive / Attention Needed"}`, 20, 70);
        }

        doc.setTextColor(0, 0, 0);
        doc.setFontSize(12);
        if (result.confidence) {
            doc.text(`Confidence Score: ${(result.confidence * 100).toFixed(2)}%`, 20, 85);
        }

        doc.text("Disclaimer: This is an AI-generated prediction and not a medical diagnosis.", 20, 110);
        doc.save("medical-report.pdf");
    };

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
            <div style={{ background: 'white', padding: '2rem', borderRadius: '0.5rem', maxWidth: '500px', width: '100%' }}>
                <h2>Analysis Result</h2>

                <div style={{ margin: '1.5rem 0', padding: '1rem', background: isHealthy ? '#f0fdf4' : '#fef2f2', borderRadius: '0.5rem' }}>
                    <h3 style={{ color: isHealthy ? '#166534' : '#991b1b' }}>
                        {result.label || (isHealthy ? "Negative / Healthy" : "Positive / Attention Needed")}
                    </h3>
                    {result.confidence && <p>Confidence: {(result.confidence * 100).toFixed(2)}%</p>}
                </div>

                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
                    <button onClick={onClose} className="btn" style={{ border: '1px solid #cbd5e1' }}>Close</button>
                    <button onClick={handleDownload} className="btn" style={{ background: '#475569', color: 'white' }}>Download Report</button>
                    <button onClick={onReset} className="btn btn-primary">New Analysis</button>
                </div>
            </div>
        </div>
    );
}

export default ResultModal;
