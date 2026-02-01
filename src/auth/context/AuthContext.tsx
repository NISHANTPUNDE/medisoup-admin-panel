import React, { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../../utils/Axios';
import { toast } from 'react-toastify';

interface User {
    id: string;
    username: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    role: 'superadmin' | 'admin' | 'user';
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (username: string, password: string, role: 'admin' | 'superadmin') => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper to get initial state from localStorage
const getInitialUser = (): User | null => {
    try {
        const storedUser = localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : null;
    } catch {
        return null;
    }
};

const getInitialToken = (): string | null => {
    return localStorage.getItem('token');
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(getInitialUser);
    const [token, setToken] = useState<string | null>(getInitialToken);
    const navigate = useNavigate();

    const login = async (username: string, password: string, role: 'admin' | 'superadmin') => {
        try {
            const endpoint = role === 'superadmin' ? '/api/superadmin/login' : '/api/admin/login';
            const response: any = await apiService.post(endpoint, { username, password });
            
            const { token: authToken, user: userData } = response;
            
            if (!authToken || !userData) {
                throw new Error('Invalid response from server');
            }
            
            // Store in localStorage
            localStorage.setItem('token', authToken);
            localStorage.setItem('user', JSON.stringify({ ...userData, role }));
            
            // Update state
            setToken(authToken);
            setUser({ ...userData, role });
            
            toast.success('Login successful');
            navigate('/admins');
        } catch (error: any) {
            toast.error(error.message || 'Login failed');
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
        toast.info('Logged out successfully');
        navigate('/');
    };

    const value: AuthContextType = {
        user,
        token,
        login,
        logout,
        isAuthenticated: !!token
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
