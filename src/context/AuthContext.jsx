import React, { createContext, useState, useEffect } from 'react';
import { adminCredentials } from '../data/mockData';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Load user from localStorage on mount
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    // Login function
    const login = async (email, password, isAdmin = false) => {
        // TODO: Replace with actual API call
        // const response = await fetch('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });

        if (isAdmin) {
            // Admin login
            if (email === adminCredentials.email && password === adminCredentials.password) {
                const adminUser = {
                    id: 'admin-1',
                    email,
                    role: 'admin',
                    name: 'Administrador'
                };
                setUser(adminUser);
                localStorage.setItem('user', JSON.stringify(adminUser));
                return { success: true, user: adminUser };
            } else {
                return { success: false, error: 'Credenciales incorrectas' };
            }
        } else {
            // Client login - check localStorage for registered users
            const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
            const foundUser = users.find(u => u.email === email && u.password === password);

            if (foundUser) {
                const clientUser = {
                    id: foundUser.id,
                    email: foundUser.email,
                    name: foundUser.name,
                    phone: foundUser.phone,
                    role: 'client'
                };
                setUser(clientUser);
                localStorage.setItem('user', JSON.stringify(clientUser));
                return { success: true, user: clientUser };
            } else {
                return { success: false, error: 'Credenciales incorrectas' };
            }
        }
    };

    // Register function
    const register = async (userData) => {
        // TODO: Replace with actual API call
        // const response = await fetch('/api/auth/register', { method: 'POST', body: JSON.stringify(userData) });

        const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');

        // Check if email already exists
        if (users.find(u => u.email === userData.email)) {
            return { success: false, error: 'El email ya está registrado' };
        }

        const newUser = {
            id: `user-${Date.now()}`,
            ...userData,
            role: 'client',
            createdAt: new Date().toISOString()
        };

        users.push(newUser);
        localStorage.setItem('registeredUsers', JSON.stringify(users));

        const clientUser = {
            id: newUser.id,
            email: newUser.email,
            name: newUser.name,
            phone: newUser.phone,
            role: 'client'
        };

        setUser(clientUser);
        localStorage.setItem('user', JSON.stringify(clientUser));

        return { success: true, user: clientUser };
    };

    // Logout function
    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
    };

    // Password recovery (mock)
    const recoverPassword = async (email) => {
        // TODO: Replace with actual API call
        // const response = await fetch('/api/auth/recover', { method: 'POST', body: JSON.stringify({ email }) });

        return { success: true, message: 'Se ha enviado un enlace de recuperación a tu email' };
    };

    const value = {
        user,
        loading,
        login,
        register,
        logout,
        recoverPassword,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin'
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}
