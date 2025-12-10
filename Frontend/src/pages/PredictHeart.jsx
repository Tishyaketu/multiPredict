import { useState } from 'react';
import Navbar from '../components/Navbar';
import ResultModal from '../components/ResultModal';
import api from '../utils/api';

const PredictHeart = () => {
    const [formData, setFormData] = useState({
        age: '', sex: '1', cp: '0', trestbps: '', chol: '', fbs: '0',
        restecg: '0', thalach: '', exang: '0', oldpeak: '', slope: '0', ca: '0', thal: '0'
    });
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            // Convert to numbers
            const payload = {};
            for (let key in formData) {
                payload[key] = parseFloat(formData[key]);
            }

            const res = await api.post('/predict/heart', payload);
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
                <h1>Heart Disease Prediction</h1>

                <form onSubmit={handleSubmit} className="prediction-form">
                    <div className="form-grid">
                        <label>Age: <input name="age" type="number" required value={formData.age} onChange={handleChange} /></label>
                        <label>Sex (1=Male, 0=Female): <input name="sex" type="number" required value={formData.sex} onChange={handleChange} /></label>
                        <label>Chest Pain (0-3): <input name="cp" type="number" required value={formData.cp} onChange={handleChange} /></label>
                        <label>Resting BP: <input name="trestbps" type="number" required value={formData.trestbps} onChange={handleChange} /></label>
                        <label>Cholesterol: <input name="chol" type="number" required value={formData.chol} onChange={handleChange} /></label>
                        <label>Fasting BS (1/0): <input name="fbs" type="number" required value={formData.fbs} onChange={handleChange} /></label>
                        <label>Rest ECG (0-2): <input name="restecg" type="number" required value={formData.restecg} onChange={handleChange} /></label>
                        <label>Max HR: <input name="thalach" type="number" required value={formData.thalach} onChange={handleChange} /></label>
                        <label>Ex Angina (1/0): <input name="exang" type="number" required value={formData.exang} onChange={handleChange} /></label>
                        <label>Oldpeak: <input name="oldpeak" type="number" step="0.1" required value={formData.oldpeak} onChange={handleChange} /></label>
                        <label>Slope (0-2): <input name="slope" type="number" required value={formData.slope} onChange={handleChange} /></label>
                        <label>CA (0-4): <input name="ca" type="number" required value={formData.ca} onChange={handleChange} /></label>
                        <label>Thal (0-3): <input name="thal" type="number" required value={formData.thal} onChange={handleChange} /></label>
                    </div>
                    {error && <p className="error">{error}</p>}
                    <button type="submit" disabled={loading} className="btn-primary">
                        {loading ? "Analyzing..." : "Predict"}
                    </button>
                </form>

                {result && (
                    <ResultModal
                        result={result}
                        type="Heart Disease"
                        onClose={() => setResult(null)}
                    />
                )}
            </div>
        </div>
    );
};

export default PredictHeart;
