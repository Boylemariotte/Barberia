import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn, UserPlus, Mail, Lock, User, Phone, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../components/common/Toast';

export function Login() {
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        name: '',
        phone: ''
    });
    const [loading, setLoading] = useState(false);

    const { login, register } = useAuth();
    const toast = useToast();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (isLogin) {
                const result = await login(formData.email, formData.password, isAdmin);
                if (result.success) {
                    toast.success(`¡Bienvenido ${result.user.name || 'de nuevo'}!`);
                    navigate(isAdmin ? '/admin' : '/');
                } else {
                    toast.error(result.error);
                }
            } else {
                const result = await register(formData);
                if (result.success) {
                    toast.success('¡Cuenta creada exitosamente!');
                    navigate('/');
                } else {
                    toast.error(result.error);
                }
            }
        } catch (error) {
            toast.error('Ocurrió un error. Por favor intenta de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-gold-900 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="card animate-scale-in">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-display font-bold mb-2">
                            {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
                        </h1>
                        <p className="text-gray-600">
                            {isLogin
                                ? 'Accede a tu cuenta para gestionar tus citas'
                                : 'Regístrate para reservar tus citas más fácilmente'}
                        </p>
                    </div>

                    {/* Admin toggle (only for login) */}
                    {isLogin && (
                        <div className="flex items-center justify-center gap-4 mb-6">
                            <button
                                type="button"
                                onClick={() => setIsAdmin(false)}
                                className={`px-4 py-2 rounded-lg font-medium transition-all ${!isAdmin
                                    ? 'bg-gold-500 text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                Cliente
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsAdmin(true)}
                                className={`px-4 py-2 rounded-lg font-medium transition-all ${isAdmin
                                    ? 'bg-gold-500 text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                Administrador
                            </button>
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {!isLogin && (
                            <>
                                <div>
                                    <label className="label">Nombre completo</label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="input-field pl-10"
                                            placeholder="Juan Pérez"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="label">Teléfono</label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className="input-field pl-10"
                                            placeholder="3001234567"
                                            required
                                        />
                                    </div>
                                </div>
                            </>
                        )}

                        <div>
                            <label className="label">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="input-field pl-10"
                                    placeholder="tu@email.com"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="label">Contraseña</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="input-field pl-10 pr-10"
                                    placeholder="••••••••"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        {isLogin && (
                            <div className="text-right">
                                <button
                                    type="button"
                                    className="text-sm text-gold-600 hover:text-gold-700 font-medium"
                                >
                                    ¿Olvidaste tu contraseña?
                                </button>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {loading ? (
                                <span>Procesando...</span>
                            ) : (
                                <>
                                    {isLogin ? <LogIn className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
                                    {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
                                </>
                            )}
                        </button>
                    </form>

                    {/* Toggle */}
                    <div className="mt-6 text-center">
                        <p className="text-gray-600">
                            {isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}
                            {' '}
                            <button
                                onClick={() => setIsLogin(!isLogin)}
                                className="text-gold-600 hover:text-gold-700 font-semibold"
                            >
                                {isLogin ? 'Regístrate aquí' : 'Inicia sesión'}
                            </button>
                        </p>
                    </div>

                    {/* Back to home */}
                    <div className="mt-4 text-center">
                        <Link to="/" className="text-sm text-gray-500 hover:text-gray-700">
                            Volver al inicio
                        </Link>
                    </div>
                </div>

                {/* Admin credentials hint */}
                {isLogin && isAdmin && (
                    <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
                        <p className="font-semibold mb-1">Credenciales de prueba (Admin):</p>
                        <p>Email: admin@barberia.com</p>
                        <p>Contraseña: admin123</p>
                    </div>
                )}
            </div>
        </div>
    );
}
