import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
    const { user, logout } = useAuth();

    return (
        <nav style={{ background: 'white', borderBottom: '1px solid #e2e8f0', padding: '1rem' }}>
            <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Link to="/" style={{ fontWeight: 'bold', fontSize: '1.25rem' }}>Multi-Predict</Link>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    {user ? (
                        <>
                            <Link to="/" className="btn">Dashboard</Link>
                            <Link to="/activity" className="btn">Activity</Link>
                            <span style={{ margin: '0 0.5rem', color: '#cbd5e1' }}>|</span>
                            <span style={{ fontWeight: 500 }}>{user.fullName}</span>
                            <button onClick={logout} className="btn" style={{ background: '#f1f5f9', marginLeft: '0.5rem' }}>Logout</button>
                        </>
                    ) : (
                        <Link to="/login" className="btn btn-primary">Login</Link>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
