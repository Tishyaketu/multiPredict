import { useState } from 'react';
import api from '../utils/api';

const PrescriptionUpload = ({ onDataExtracted, endpoint = '/predict/heart/upload-prescription' }) => {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        setError(null);

        const formData = new FormData();
        formData.append('prescription', file);

        try {
            const res = await api.post(endpoint, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (res.data.success) {
                onDataExtracted(res.data.data);
            } else {
                setError('Failed to extract data.');
            }
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Upload failed.');
        } finally {
            setUploading(false);
            // Reset file input
            e.target.value = '';
        }
    };

    return (
        <div className="prescription-upload" style={{ marginBottom: '20px', padding: '15px', border: '1px dashed #ccc', borderRadius: '8px' }}>
            <h3>Autofill from Prescription</h3>
            <p className="hint">Upload a PDF prescription to automatically fill the form.</p>

            <input
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
                disabled={uploading}
                style={{ display: 'block', margin: '10px 0' }}
            />

            {uploading && <p style={{ color: '#007bff' }}>Extracting data...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default PrescriptionUpload;
