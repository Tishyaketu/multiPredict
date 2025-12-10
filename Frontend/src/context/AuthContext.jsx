import { createContext, useContext, useState, useEffect } from "react";
import api from "../utils/api";

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Check if user is logged in on mount
    useEffect(() => {
        const checkUser = async () => {
            try {
                const res = await api.get("/users/current-user");
                if (res.data.success) {
                    setUser(res.data.data);
                }
            } catch (error) {
                // Not logged in or token expired
                console.log("Not logged in");
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        checkUser();
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

    const value = {
        user,
        loading,
        login,
        register,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
