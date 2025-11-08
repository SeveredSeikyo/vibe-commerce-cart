import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { User } from '../types';
import * as api from '../services/api';

interface AuthContextType {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    login: (credentials: {username: string, password: string}) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));
    const [isLoading, setIsLoading] = useState<boolean>(true);
    
    // Configure axios interceptor
    useEffect(() => {
        const interceptor = api.API.interceptors.request.use(
            (config) => {
                const storedToken = localStorage.getItem('token');
                if (storedToken) {
                    config.headers.Authorization = `Bearer ${storedToken}`;
                }
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );
        return () => {
            api.API.interceptors.request.eject(interceptor);
        };
    }, []);

    const fetchUserFromToken = useCallback((token: string) => {
        try {
            // A more robust implementation would be to have a /me endpoint to verify token and get fresh user data
            const payloadBase64 = token.split('.')[1];
            const decodedPayload = JSON.parse(atob(payloadBase64));
            setUser({ id: decodedPayload.id, username: decodedPayload.username });
        } catch (e) {
            console.error("Failed to decode token:", e);
            logout(); // Clear invalid token
        }
    }, []);

    useEffect(() => {
        if (token) {
            fetchUserFromToken(token);
        }
        setIsLoading(false);
    }, [token, fetchUserFromToken]);

    const login = async (credentials: {username: string, password: string}) => {
        const { token: newToken, user: newUser } = await api.login(credentials);
        localStorage.setItem('token', newToken);
        setToken(newToken);
        setUser(newUser);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, isLoading, login, logout }}>
            {!isLoading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
