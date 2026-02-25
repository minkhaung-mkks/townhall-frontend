import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const checkAuth = async () => {
        const result = await authAPI.getProfile();
        if (result.data) {
            setUser(result.data);
        } else {
            setUser(null);
        }
        setLoading(false);
    };

    useEffect(() => {
        checkAuth();
    }, []);

    const login = async (email, password) => {
        const result = await authAPI.login(email, password);
        if (result.data) {
            await checkAuth();
            return { success: true };
        }
        return { success: false, error: result.error };
    };

    const logout = async () => {
        await authAPI.logout();
        setUser(null);
    };

    const value = {
        user,
        loading,
        login,
        logout,
        checkAuth,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
