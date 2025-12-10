import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";

const Dashboard = () => {
    return (
        <div className="dashboard-container">
            <Navbar />
            <div className="content">
                <h1>Welcome to Multi-Predict</h1>
                <p>Select a prediction tool below:</p>

                <div className="card-grid">
                    <div className="card">
                        <h3>Heart Disease</h3>
                        <p>Predict heart disease risk using clinical data.</p>
                        <Link to="/predict/heart" className="btn-link">Start Analysis</Link>
                    </div>
                    <div className="card">
                        <h3>Diabetes</h3>
                        <p>Predict diabetes likelihood.</p>
                        <Link to="/predict/diabetes" className="btn-link">Start Analysis</Link>
                    </div>
                    <div className="card">
                        <h3>Breast Cancer</h3>
                        <p>Upload ultrasound images for analysis.</p>
                        <Link to="/predict/breast" className="btn-link">Start Analysis</Link>
                    </div>
                    <div className="card">
                        <h3>Lung Cancer</h3>
                        <p>Upload CT scan images for classification.</p>
                        <Link to="/predict/lung" className="btn-link">Start Analysis</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
