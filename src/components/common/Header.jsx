import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Scissors, User, LogOut, Calendar } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { user, logout, isAdmin } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
        setMobileMenuOpen(false);
    };

    return (
        <header className="bg-gradient-dark text-white shadow-lg sticky top-0 z-50">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2 group">
                        <div className="bg-gold-500 p-2 rounded-lg transform group-hover:rotate-12 transition-transform duration-300">
                            <Scissors className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-2xl font-display font-bold text-gradient">
                            Barbería Elite
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-6">
                        <Link to="/" className="hover:text-gold-400 transition-colors font-medium">
                            Inicio
                        </Link>
                        <Link to="/booking" className="hover:text-gold-400 transition-colors font-medium">
                            Reservar Cita
                        </Link>
                        <Link to="/catalogue" className="hover:text-gold-400 transition-colors font-medium">
                            Catálogo
                        </Link>

                        {user ? (
                            <>
                                {isAdmin ? (
                                    <Link
                                        to="/admin"
                                        className="hover:text-gold-400 transition-colors font-medium"
                                    >
                                        Panel Admin
                                    </Link>
                                ) : (
                                    <Link
                                        to="/my-appointments"
                                        className="hover:text-gold-400 transition-colors font-medium flex items-center space-x-1"
                                    >
                                        <Calendar className="w-4 h-4" />
                                        <span>Mis Citas</span>
                                    </Link>
                                )}
                                <div className="flex items-center space-x-3">
                                    <div className="flex items-center space-x-2">
                                        <User className="w-5 h-5 text-gold-400" />
                                        <span className="text-sm">{user.name || user.email}</span>
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center space-x-1 text-sm hover:text-gold-400 transition-colors"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        <span>Salir</span>
                                    </button>
                                </div>
                            </>
                        ) : (
                            <Link
                                to="/login"
                                className="btn-primary"
                            >
                                Iniciar Sesión
                            </Link>
                        )}
                    </nav>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden p-2 hover:bg-dark-800 rounded-lg transition-colors"
                    >
                        {mobileMenuOpen ? (
                            <X className="w-6 h-6" />
                        ) : (
                            <Menu className="w-6 h-6" />
                        )}
                    </button>
                </div>

                {/* Mobile Navigation */}
                {mobileMenuOpen && (
                    <nav className="md:hidden py-4 border-t border-dark-700 animate-slide-down">
                        <div className="flex flex-col space-y-3">
                            <Link
                                to="/"
                                className="px-4 py-2 hover:bg-dark-800 rounded-lg transition-colors"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Inicio
                            </Link>
                            <Link
                                to="/booking"
                                className="px-4 py-2 hover:bg-dark-800 rounded-lg transition-colors"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Reservar Cita
                            </Link>
                            <Link
                                to="/catalogue"
                                className="px-4 py-2 hover:bg-dark-800 rounded-lg transition-colors"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Catálogo
                            </Link>

                            {user ? (
                                <>
                                    {isAdmin ? (
                                        <Link
                                            to="/admin"
                                            className="px-4 py-2 hover:bg-dark-800 rounded-lg transition-colors"
                                            onClick={() => setMobileMenuOpen(false)}
                                        >
                                            Panel Admin
                                        </Link>
                                    ) : (
                                        <Link
                                            to="/my-appointments"
                                            className="px-4 py-2 hover:bg-dark-800 rounded-lg transition-colors"
                                            onClick={() => setMobileMenuOpen(false)}
                                        >
                                            Mis Citas
                                        </Link>
                                    )}
                                    <div className="px-4 py-2 border-t border-dark-700">
                                        <div className="flex items-center space-x-2 mb-2">
                                            <User className="w-5 h-5 text-gold-400" />
                                            <span className="text-sm">{user.name || user.email}</span>
                                        </div>
                                        <button
                                            onClick={handleLogout}
                                            className="flex items-center space-x-1 text-sm hover:text-gold-400 transition-colors"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            <span>Cerrar Sesión</span>
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <Link
                                    to="/login"
                                    className="mx-4 btn-primary text-center"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Iniciar Sesión
                                </Link>
                            )}
                        </div>
                    </nav>
                )}
            </div>
        </header>
    );
}
