import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Sidebar } from '../components/common/Sidebar';
import { useAuth } from '../hooks/useAuth';
import { Menu, Scissors } from 'lucide-react';

export function AdminPanel({ children }) {
    const { isAdmin, loading } = useAuth();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-gold-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Cargando...</p>
                </div>
            </div>
        );
    }

    if (!isAdmin) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="flex min-h-screen bg-gray-50 flex-col lg:flex-row">
            {/* Mobile Header */}
            <header className="lg:hidden bg-gradient-dark text-white p-4 flex items-center justify-between sticky top-0 z-40 shadow-md">
                <div className="flex items-center space-x-2">
                    <div className="bg-gold-500 p-1.5 rounded-lg">
                        <Scissors className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-lg font-display font-bold text-gradient">
                        Admin Panel
                    </span>
                </div>
                <button
                    onClick={() => setIsSidebarOpen(true)}
                    className="p-2 hover:bg-dark-800 rounded-lg transition-colors"
                >
                    <Menu className="w-6 h-6" />
                </button>
            </header>

            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            <main className="flex-1 p-4 md:p-6 lg:p-8">
                {children}
            </main>
        </div>
    );
}

