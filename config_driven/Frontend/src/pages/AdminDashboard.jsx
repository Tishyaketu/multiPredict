import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';

function AdminDashboard() {
    const [diseases, setDiseases] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDiseases();
    }, []);

    const fetchDiseases = async () => {
        try {
            const res = await api.get('/predict/configs'); // Re-use public endpoint for listing
            if (res.data.success) {
                setDiseases(res.data.data);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (slug) => {
        if (!window.confirm(`Are you sure you want to delete ${slug}?`)) return;
        try {
            await api.delete(`/admin/configs/${slug}`);
            fetchDiseases();
        } catch (err) {
            alert("Failed to delete. Check permissions.");
        }
    };

    if (loading) return <div className="container">Loading...</div>;

    return (
        <div className="container" style={{ marginTop: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h1>Admin Panel</h1>
                <Link to="/admin/new" className="btn btn-primary">Add New Disease</Link>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white' }}>
                <thead>
                    <tr style={{ borderBottom: '2px solid #e2e8f0', textAlign: 'left' }}>
                        <th style={{ padding: '1rem' }}>Name</th>
                        <th style={{ padding: '1rem' }}>Slug</th>
                        <th style={{ padding: '1rem' }}>Type</th>
                        <th style={{ padding: '1rem' }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {diseases.map(d => (
                        <tr key={d._id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                            <td style={{ padding: '1rem' }}>{d.name}</td>
                            <td style={{ padding: '1rem' }}>{d.slug}</td>
                            <td style={{ padding: '1rem' }}>{d.analysisType}</td>
                            <td style={{ padding: '1rem' }}>
                                <Link to={`/admin/edit/${d.slug}`} className="btn" style={{ marginRight: '0.5rem', background: '#e2e8f0' }}>Edit</Link>
                                <button onClick={() => handleDelete(d.slug)} className="btn" style={{ background: '#fee2e2', color: '#991b1b' }}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default AdminDashboard;
