import { createContext, useContext, useState, useEffect } from "react";
import api from "../utils/api";

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [admin, setAdmin] = useState(null);
    const [loading, setLoading] = useState(true);

    // Check if user or admin is logged in on mount
    useEffect(() => {
        const checkAuth = async () => {
            try {
                // Try to fetch user
                const userRes = await api.get("/users/current-user");
                if (userRes.data.success) {
                    setUser(userRes.data.data);
                }
            } catch (error) {
                setUser(null);
            }

            try {
                // Try to fetch admin
                const adminRes = await api.get("/admin-auth/current-admin");
                if (adminRes.data.success) {
                    setAdmin(adminRes.data.data);
                }
            } catch (error) {
                setAdmin(null);
            } finally {
                setLoading(false);
            }
        };
        checkAuth();
    }, []);

    const login = async (email, password) => {
        const res = await api.post("/users/login", { email, password });
        if (res.data.success) {
            setUser(res.data.data.user);
            return res.data;
        }
    };

    const register = async (fullName, email, password) => {
        const res = await api.post("/users/register", { fullName, email, password });
        return res.data;
    };

    const logout = async () => {
        try {
            await api.post("/users/logout");
            setUser(null);
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    const adminLogin = async (email, password) => {
        const res = await api.post("/admin-auth/login", { email, password });
        if (res.data.success) {
            setAdmin(res.data.data.admin);
            return res.data;
        }
    };

    const adminRegister = async (fullName, email, password) => {
        const res = await api.post("/admin-auth/register", { fullName, email, password });
        return res.data;
    };

    const adminLogout = async () => {
        try {
            await api.post("/admin-auth/logout");
            setAdmin(null);
        } catch (error) {
            console.error("Admin logout failed", error);
        }
    };

    const value = {
        user,
        admin,
        loading,
        login,
        register,
        logout,
        adminLogin,
        adminRegister,
        adminLogout
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
