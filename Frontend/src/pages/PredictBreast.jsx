import { useState } from 'react';
import Navbar from '../components/Navbar';
import ResultModal from '../components/ResultModal';
import api from '../utils/api';

const PredictBreast = () => {
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!image) {
            setError("Please upload an image.");
            return;
        }

        setLoading(true);
        setError(null);

        const formData = new FormData();
        formData.append("image", image);

        try {
            const res = await api.post('/predict/breast', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setResult(res.data.data);
        } catch (err) {
            setError("Prediction failed. Please check inputs.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="dashboard-container">
            <Navbar />
            <div className="content">
                <h1>Breast Cancer Prediction (Ultrasound)</h1>

                <form onSubmit={handleSubmit} className="prediction-form upload-form">
                    <div className="upload-section">
                        <label className="file-upload-label">
                            <input type="file" accept="image/*" onChange={handleFileChange} />
                            {preview ? (
                                <img src={preview} alt="Preview" className="image-preview" />
                            ) : (
                                <span>Click to Upload Ultrasound Image</span>
                            )}
                        </label>
                    </div>
                    {error && <p className="error">{error}</p>}
                    <button type="submit" disabled={loading || !image} className="btn-primary">
                        {loading ? "Analyzing..." : "Analyze Image"}
                    </button>
                </form>

                {result && (
                    <ResultModal
                        result={result}
                        type="Breast Cancer"
                        onClose={() => setResult(null)}
                    />
                )}
            </div>
        </div>
    );
};

export default PredictBreast;
