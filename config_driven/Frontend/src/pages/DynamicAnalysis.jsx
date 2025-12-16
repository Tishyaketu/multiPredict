import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import DynamicForm from '../components/DynamicForm';
import ImageUploadZone from '../components/ImageUploadZone';
import PrescriptionUpload from '../components/PrescriptionUpload';
import ResultModal from '../components/ResultModal';

function DynamicAnalysis() {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [config, setConfig] = useState(null);
    const [loadingConfig, setLoadingConfig] = useState(true);

    const [analyzing, setAnalyzing] = useState(false);
    const [result, setResult] = useState(null);
    const [fileToUpload, setFileToUpload] = useState(null);
    const [formInitialValues, setFormInitialValues] = useState({});

    useEffect(() => {
        const fetchConfig = async () => {
            try {
                const res = await api.get('/predict/configs');
                if (res.data.success) {
                    const found = res.data.data.find(d => d.slug === slug);
                    if (found) {
                        setConfig(found);
                    } else {
                        console.error("Disease not found");
                        navigate('/');
                    }
                }
            } catch (err) {
                console.error("Error fetching config", err);
            } finally {
                setLoadingConfig(false);
            }
        };
        fetchConfig();
    }, [slug, navigate]);

    const handlePrescriptionData = (data) => {
        // data is the extracted object
        setFormInitialValues(data);
    };

    const handleAnalysis = async (formDataOrEvent) => {
        setAnalyzing(true);
        try {
            let res;
            if (config.analysisType === 'image') {
                if (!fileToUpload) {
                    alert("Please select an image");
                    setAnalyzing(false);
                    return;
                }
                const formData = new FormData();
                formData.append('file', fileToUpload);
                res = await api.post(`/predict/${slug}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            } else {
                // Form submission
                res = await api.post(`/predict/${slug}`, formDataOrEvent);
            }

            if (res.data.success) {
                // { prediction: 0/1, label: ..., confidence: ... }
                setResult(res.data.data);
            }
        } catch (err) {
            console.error("Analysis failed", err);
            alert("Analysis failed. See console.");
        } finally {
            setAnalyzing(false);
        }
    };

    if (loadingConfig) return <div className="container">Loading configuration...</div>;
    if (!config) return null;

    return (
        <div className="container" style={{ marginTop: '2rem', paddingBottom: '3rem' }}>
            <h1 style={{ marginBottom: '1.5rem' }}>{config.name}</h1>

            {/* 1. Prescription Upload (Optional) */}
            {config.hasPrescriptionUpload && (
                <PrescriptionUpload
                    onDataExtracted={handlePrescriptionData}
                    diseaseSlug={slug} // Not used by component but good for context
                />
            )}

            {/* 2. Main Input Area */}
            <div style={{ background: 'white', padding: '2rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0' }}>
                {config.analysisType === 'image' ? (
                    <>
                        <ImageUploadZone onFileSelect={setFileToUpload} />
                        <button
                            onClick={handleAnalysis}
                            className="btn btn-primary"
                            disabled={analyzing || !fileToUpload}
                            style={{ width: '100%', marginTop: '1rem' }}
                        >
                            {analyzing ? 'Analyzing Image...' : 'Run Analysis'}
                        </button>
                    </>
                ) : (
                    <DynamicForm
                        schema={config.formSchema}
                        onSubmit={handleAnalysis}
                        loading={analyzing}
                        initialValues={formInitialValues}
                    />
                )}
            </div>

            <ResultModal
                result={result}
                onClose={() => setResult(null)}
                onReset={() => {
                    setResult(null);
                    setFileToUpload(null);
                    setFormInitialValues({});
                }}
                diseaseName={config.name}
            />
        </div>
    );
}

export default DynamicAnalysis;
