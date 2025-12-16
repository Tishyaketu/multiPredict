import { useState } from 'react';
import api from '../utils/api';

const PrescriptionUpload = ({ onDataExtracted, endpoint = '/predict/upload-prescription', diseaseSlug }) => {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        setError(null);

        const formData = new FormData();
        formData.append('prescription', file);
        // The endpoint is generic /predict/upload-prescription in my backend Phase 3?
        // Let's check routes.
        // Backend routes: router.post('/upload-prescription', ...);
        // So endpoint should be '/predict/upload-prescription'. Correct.

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
            e.target.value = '';
        }
    };

    return (
        <div style={{ marginBottom: '1.5rem', padding: '1rem', border: '2px dashed #cbd5e1', borderRadius: '0.5rem', textAlign: 'center' }}>
            <h3 style={{ marginBottom: '0.5rem' }}>Autofill from Prescription</h3>
            <p style={{ marginBottom: '1rem', color: '#64748b' }}>Upload a PDF to automatically fill fields.</p>

            <input
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
                disabled={uploading}
                style={{ display: 'inline-block' }}
            />

            {uploading && <p style={{ color: '#2563eb', marginTop: '0.5rem' }}>Extracting data...</p>}
            {error && <p style={{ color: '#ef4444', marginTop: '0.5rem' }}>{error}</p>}
        </div>
    );
};

export default PrescriptionUpload;
