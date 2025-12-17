import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';

function EditDisease() {
    const { slug } = useParams();
    const navigate = useNavigate();
    const isNew = !slug;

    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        analysisType: 'form',
        hasPrescriptionUpload: false,
        icon: '',
        modelPath: '',
        scriptPath: '',
        scriptInterface: JSON.stringify({ type: 'json_arg', argsTemplate: [] }, null, 2),
        formSchema: JSON.stringify([], null, 2)
    });

    const [loading, setLoading] = useState(!isNew);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!isNew) {
            const fetchData = async () => {
                try {
                    const res = await api.get(`/predict/configs/${slug}`);
                    if (res.data.success) {
                        const d = res.data.data;
                        setFormData({
                            name: d.name,
                            slug: d.slug,
                            analysisType: d.analysisType,
                            hasPrescriptionUpload: d.hasPrescriptionUpload,
                            icon: d.icon,
                            modelPath: d.modelPath || '',
                            scriptPath: d.scriptPath || '',
                            scriptInterface: JSON.stringify(d.scriptInterface || {}, null, 2),
                            formSchema: JSON.stringify(d.formSchema || [], null, 2)
                        });
                    }
                } catch (err) {
                    setError("Failed to load disease config");
                } finally {
                    setLoading(false);
                }
            };
            fetchData();
        }
    }, [slug, isNew]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        let parsedInterface, parsedSchema;
        try {
            parsedInterface = JSON.parse(formData.scriptInterface);
        } catch (err) {
            setError(`Invalid JSON in Script Interface: ${err.message}`);
            return;
        }

        try {
            parsedSchema = JSON.parse(formData.formSchema);
        } catch (err) {
            setError(`Invalid JSON in Form Schema: ${err.message}`);
            return;
        }

        try {
            const payload = {
                ...formData,
                scriptInterface: parsedInterface,
                formSchema: parsedSchema
            };

            if (isNew) {
                await api.post('/admin/configs', payload);
            } else {
                await api.put(`/admin/configs/${slug}`, payload);
            }
            navigate('/admin');
        } catch (err) {
            console.error(err);
            setError("Operation failed. Check API logs.");
        }
    };

    if (loading) return <div className="container">Loading...</div>;

    return (
        <div className="container" style={{ marginTop: '2rem' }}>
            <h1>{isNew ? 'Add New Disease' : `Edit ${formData.name}`}</h1>
            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '800px' }}>
                <input
                    placeholder="Disease Name"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    required
                />
                <input
                    placeholder="Slug (URL friendly)"
                    value={formData.slug}
                    onChange={e => setFormData({ ...formData, slug: e.target.value })}
                    required
                    disabled={!isNew}
                />
                <div style={{ display: 'flex', gap: '1rem', background: 'white', padding: '1rem' }}>
                    <label>
                        <input
                            type="radio"
                            checked={formData.analysisType === 'form'}
                            onChange={() => setFormData({ ...formData, analysisType: 'form' })}
                        /> Form Based
                    </label>
                    <label>
                        <input
                            type="radio"
                            checked={formData.analysisType === 'image'}
                            onChange={() => setFormData({ ...formData, analysisType: 'image' })}
                        /> Image Based
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            checked={formData.hasPrescriptionUpload}
                            onChange={e => setFormData({ ...formData, hasPrescriptionUpload: e.target.checked })}
                        /> Has Prescription Upload?
                    </label>
                </div>

                <input placeholder="Model Path (e.g., ./dynamic/ML/models/foo.pkl)" value={formData.modelPath} onChange={e => setFormData({ ...formData, modelPath: e.target.value })} />
                <input placeholder="Script Path (e.g., ./dynamic/ML/predict_foo.py)" value={formData.scriptPath} onChange={e => setFormData({ ...formData, scriptPath: e.target.value })} />

                <div style={{ background: 'white', padding: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Form Schema (JSON Array)</label>
                    <textarea
                        rows={10}
                        value={formData.formSchema}
                        onChange={e => setFormData({ ...formData, formSchema: e.target.value })}
                        style={{ width: '100%', fontFamily: 'monospace' }}
                    />
                </div>

                <div style={{ background: 'white', padding: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Script Interface (JSON Object)</label>
                    <textarea
                        rows={5}
                        value={formData.scriptInterface}
                        onChange={e => setFormData({ ...formData, scriptInterface: e.target.value })}
                        style={{ width: '100%', fontFamily: 'monospace' }}
                    />
                </div>

                <button className="btn btn-primary" type="submit">Save Configuration</button>
            </form>
        </div>
    );
}

export default EditDisease;
