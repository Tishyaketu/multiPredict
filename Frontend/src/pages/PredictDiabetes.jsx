import { useState } from 'react';
import Navbar from '../components/Navbar';
import ResultModal from '../components/ResultModal';
import PrescriptionUpload from '../components/PrescriptionUpload';
import api from '../utils/api';

const PredictDiabetes = () => {
    const [formData, setFormData] = useState({
        Pregnancies: '', Glucose: '', BloodPressure: '', SkinThickness: '',
        Insulin: '', BMI: '', DiabetesPedigreeFunction: '', Age: ''
    });
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleDataExtracted = (data) => {
        const newFormData = { ...formData };
        Object.keys(data).forEach(key => {
            if (data[key] !== null && data[key] !== undefined) {
                newFormData[key] = data[key];
            }
        });
        setFormData(newFormData);
        alert("Form filled from prescription data!");
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const payload = {};
            for (let key in formData) {
                payload[key] = parseFloat(formData[key]);
            }

            const res = await api.post('/predict/diabetes', payload);
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
                <h1>Diabetes Prediction</h1>

                <PrescriptionUpload
                    onDataExtracted={handleDataExtracted}
                    endpoint="/predict/diabetes/upload-prescription"
                />

                <form onSubmit={handleSubmit} className="prediction-form">
                    <div className="form-grid">
                        <label>Pregnancies: <input name="Pregnancies" type="number" required value={formData.Pregnancies} onChange={handleChange} /></label>
                        <label>Glucose: <input name="Glucose" type="number" required value={formData.Glucose} onChange={handleChange} /></label>
                        <label>Blood Pressure: <input name="BloodPressure" type="number" required value={formData.BloodPressure} onChange={handleChange} /></label>
                        <label>Skin Thickness: <input name="SkinThickness" type="number" required value={formData.SkinThickness} onChange={handleChange} /></label>
                        <label>Insulin: <input name="Insulin" type="number" required value={formData.Insulin} onChange={handleChange} /></label>
                        <label>BMI: <input name="BMI" type="number" step="0.1" required value={formData.BMI} onChange={handleChange} /></label>
                        <label>Diabetes Pedigree Func: <input name="DiabetesPedigreeFunction" type="number" step="0.001" required value={formData.DiabetesPedigreeFunction} onChange={handleChange} /></label>
                        <label>Age: <input name="Age" type="number" required value={formData.Age} onChange={handleChange} /></label>
                    </div>
                    {error && <p className="error">{error}</p>}
                    <button type="submit" disabled={loading} className="btn-primary">
                        {loading ? "Analyzing..." : "Predict"}
                    </button>
                </form>

                {result && (
                    <ResultModal
                        result={result}
                        type="Diabetes"
                        onClose={() => setResult(null)}
                    />
                )}
            </div>
        </div>
    );
};

export default PredictDiabetes;
