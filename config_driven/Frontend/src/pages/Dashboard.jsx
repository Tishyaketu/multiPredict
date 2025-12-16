import { useEffect, useState } from 'react';
import api from '../utils/api';
import DiseaseCard from '../components/DiseaseCard';

function Dashboard() {
    const [configs, setConfigs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchConfigs = async () => {
            try {
                const res = await api.get('/predict/configs');
                // Structure: { success: true, data: { diseases: [...] } }
                if (res.data.success) {
                    setConfigs(res.data.data);
                }
            } catch (err) {
                console.error("Failed to fetch configs", err);
            } finally {
                setLoading(false);
            }
        };

        fetchConfigs();
    }, []);

    if (loading) return <div className="container" style={{ marginTop: '2rem' }}>Loading...</div>;

    return (
        <div className="container" style={{ marginTop: '2rem' }}>
            <h1 style={{ marginBottom: '1.5rem' }}>Available Analyses</h1>
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                gap: '1.5rem'
            }}>
                {configs.map(config => (
                    <DiseaseCard key={config._id} config={config} />
                ))}
            </div>
        </div>
    );
}

export default Dashboard;
