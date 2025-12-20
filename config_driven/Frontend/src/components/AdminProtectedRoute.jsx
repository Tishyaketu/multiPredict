import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AdminProtectedRoute = () => {
    const { admin, loading } = useAuth();

    if (loading) return <div>Loading...</div>;

    // If not an authenticated admin, redirect to admin login
    return admin ? <Outlet /> : <Navigate to="/admin/login" replace />;
};

export default AdminProtectedRoute;
