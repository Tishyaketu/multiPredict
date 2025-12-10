import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
    const { user, logout } = useAuth();

    return (
        <nav className="navbar">
            <div className="logo">
                <Link to="/">Multi-Predict</Link>
            </div>
            <ul className="nav-links">
                {user ? (
                    <>
                        <li><Link to="/dashboard">Dashboard</Link></li>
                        <li className="user-info">Hello, {user.fullName}</li>
                        <li><button onClick={logout} className="logout-btn">Logout</button></li>
                    </>
                ) : (
                    <>
                        <li><Link to="/login">Login</Link></li>
                        <li><Link to="/register">Register</Link></li>
                    </>
                )}
            </ul>
        </nav>
    );
};

export default Navbar;
