import { useEffect, useState } from 'react';
import api from '../utils/api';

function ActivityLog() {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const res = await api.get('/predict/logs');
                if (res.data.success) {
                    setLogs(res.data.data);
                }
            } catch (err) {
                console.error("Failed to fetch logs", err);
            } finally {
                setLoading(false);
            }
        };
        fetchLogs();
    }, []);

    if (loading) return <div className="container" style={{ marginTop: '2rem' }}>Loading logs...</div>;

    return (
        <div className="container" style={{ marginTop: '2rem' }}>
            <h1 style={{ marginBottom: '1.5rem' }}>Your Activity</h1>
            {logs.length === 0 ? (
                <p>No activity recorded yet.</p>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {logs.map(log => (
                        <div key={log._id} style={{
                            padding: '1rem',
                            background: 'white',
                            border: '1px solid #e2e8f0',
                            borderRadius: '0.5rem',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <div>
                                <h3 style={{ fontSize: '1.1rem' }}>{log.diseaseConfig?.name || log.diseaseSlug}</h3>
                                <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
                                    {new Date(log.createdAt).toLocaleString()}
                                </p>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <p style={{ fontWeight: 'bold', color: log.result?.prediction === 0 ? '#166534' : '#991b1b' }}>
                                    {log.result?.label || (log.result?.prediction === 0 ? "Healthy/Negative" : "Positive")}
                                </p>
                                <p style={{ fontSize: '0.8rem' }}>
                                    Confidence: {log.result?.confidence !== undefined && log.result?.confidence !== null
                                        ? (log.result.confidence * 100).toFixed(1) + '%'
                                        : 'N/A'}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default ActivityLog;
