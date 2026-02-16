import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Calendar, Users, Settings, Scissors, Image as ImageIcon } from 'lucide-react';
import { cn } from '../../lib/utils';

export function Sidebar() {
    const location = useLocation();

    const menuItems = [
        {
            path: '/admin',
            label: 'Dashboard',
            icon: LayoutDashboard
        },
        {
            path: '/admin/appointments',
            label: 'Citas',
            icon: Calendar
        },
        {
            path: '/admin/barbers',
            label: 'Barberos',
            icon: Users
        },
        {
            path: '/admin/catalogue',
            label: 'Catálogo',
            icon: ImageIcon
        },
        {
            path: '/admin/settings',
            label: 'Configuración',
            icon: Settings
        }
    ];

    return (
        <aside className="w-64 bg-gradient-dark text-white min-h-screen p-6">
            {/* Logo */}
            <div className="flex items-center space-x-2 mb-8">
                <div className="bg-gold-500 p-2 rounded-lg">
                    <Scissors className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-display font-bold text-gradient">
                    Admin Panel
                </span>
            </div>

            {/* Navigation */}
            <nav className="space-y-2">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;

                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={cn(
                                "flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200",
                                isActive
                                    ? "bg-gold-500 text-white shadow-lg"
                                    : "hover:bg-dark-800 text-gray-300 hover:text-white"
                            )}
                        >
                            <Icon className="w-5 h-5" />
                            <span className="font-medium">{item.label}</span>
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
}
