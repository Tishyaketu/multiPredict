import { useState } from 'react';

const ImageUploadZone = ({ onFileSelect }) => {
    const [preview, setPreview] = useState(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPreview(URL.createObjectURL(file));
            onFileSelect(file);
        }
    };

    return (
        <div style={{
            marginBottom: '1.5rem',
            padding: '2rem',
            border: '2px dashed #cbd5e1',
            borderRadius: '0.5rem',
            textAlign: 'center',
            backgroundColor: '#f8fafc'
        }}>
            <h3 style={{ marginBottom: '1rem' }}>Upload Image for Analysis</h3>

            {preview && (
                <div style={{ marginBottom: '1rem' }}>
                    <img src={preview} alt="Preview" style={{ maxWidth: '100%', maxHeight: '300px', borderRadius: '0.5rem' }} />
                </div>
            )}

            <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: 'inline-block' }}
            />
        </div>
    );
};

export default ImageUploadZone;
