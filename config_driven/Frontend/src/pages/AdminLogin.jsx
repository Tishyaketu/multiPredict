import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

function AdminLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { adminLogin } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await adminLogin(email, password);
            navigate('/admin');
        } catch (err) {
            setError(err.response?.data?.message || 'Admin Login failed. Check credentials.');
        }
    };

    return (
        <div className="container" style={{ marginTop: '4rem', maxWidth: '400px' }}>
            <h1 style={{ color: '#b91c1c' }}>Admin Login</h1>
            <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>Access the administrative panel</p>
            {error && <p style={{ color: 'red', marginBottom: '1rem' }}>{error}</p>}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <input
                    type="email"
                    placeholder="Admin Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={{ padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0' }}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={{ padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0' }}
                />
                <button type="submit" className="btn" style={{ background: '#b91c1c', color: 'white', padding: '0.75rem', fontWeight: 'bold' }}>Login as Admin</button>
            </form>
            <p style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                Don't have an admin account? <Link to="/admin/register" style={{ color: '#b91c1c', fontWeight: 'bold' }}>Register Admin</Link>
            </p>
            <p style={{ marginTop: '1rem', textAlign: 'center' }}>
                <Link to="/login" style={{ color: '#64748b', fontSize: '0.875rem' }}>Regular User Login</Link>
            </p>
        </div>
    );
}

export default AdminLogin;
