import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Calendar, Star, Award, Clock, CheckCircle } from 'lucide-react';
import { barbers } from '../data/mockData';
import { useBooking } from '../hooks/useBooking';

export function Home() {
    const navigate = useNavigate();
    const { setSelectedBarber } = useBooking();

    const handleBarberClick = (barberId) => {
        setSelectedBarber(barberId);
        navigate('/booking');
    };

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="bg-gradient-dark text-white py-20">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <h1 className="text-5xl md:text-6xl font-display font-bold mb-6 text-white animate-fade-in">
                            Tu Estilo, Nuestra{' '}
                            <span className="text-gradient">Pasión</span>
                        </h1>
                        <p className="text-xl text-gray-300 mb-8 animate-slide-up">
                            Reserva tu cita con los mejores barberos de la ciudad.
                            Experiencia premium, resultados excepcionales.
                        </p>
                        <Link
                            to="/booking"
                            className="btn-primary inline-flex items-center gap-2 text-lg animate-scale-in"
                        >
                            <Calendar className="w-6 h-6" />
                            Reservar Cita Ahora
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="py-16 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="text-center p-6 animate-slide-up">
                            <div className="w-16 h-16 bg-gold-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Star className="w-8 h-8 text-gold-600" />
                            </div>
                            <h3 className="text-xl font-display font-bold mb-2">Barberos Expertos</h3>
                            <p className="text-gray-600">
                                Profesionales con años de experiencia y pasión por su trabajo
                            </p>
                        </div>

                        <div className="text-center p-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                            <div className="w-16 h-16 bg-gold-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Clock className="w-8 h-8 text-gold-600" />
                            </div>
                            <h3 className="text-xl font-display font-bold mb-2">Reserva Fácil</h3>
                            <p className="text-gray-600">
                                Sistema de reservas online disponible 24/7 para tu comodidad
                            </p>
                        </div>

                        <div className="text-center p-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                            <div className="w-16 h-16 bg-gold-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <CheckCircle className="w-8 h-8 text-gold-600" />
                            </div>
                            <h3 className="text-xl font-display font-bold mb-2">Calidad Garantizada</h3>
                            <p className="text-gray-600">
                                Productos premium y técnicas modernas para resultados perfectos
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Barbers Showcase */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-display font-bold mb-4">
                            Nuestro Equipo
                        </h2>
                        <p className="text-gray-600 text-lg">
                            Conoce a los profesionales que harán realidad tu estilo
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {barbers.map((barber, index) => (
                            <div
                                key={barber.id}
                                className="card text-center group hover:scale-105 transition-transform duration-300"
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                <div className="relative mb-4">
                                    <img
                                        src={barber.photo}
                                        alt={barber.name}
                                        className="w-32 h-32 rounded-full mx-auto object-cover border-4 border-gold-500 shadow-lg"
                                    />
                                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-gold-500 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                                        <Star className="w-4 h-4 fill-current" />
                                        {barber.rating}
                                    </div>
                                </div>

                                <h3 className="text-xl font-display font-bold mb-1">
                                    {barber.name}
                                </h3>
                                <p className="text-sm text-gold-600 font-semibold mb-2">
                                    {barber.specialty}
                                </p>
                                <div className="flex items-center justify-center gap-1 text-sm text-gray-600 mb-4">
                                    <Award className="w-4 h-4" />
                                    <span>{barber.experience}</span>
                                </div>
                                <button
                                    onClick={() => handleBarberClick(barber.id)}
                                    className="btn-primary w-full py-2 text-sm"
                                >
                                    Reservar Ahora
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-gradient-gold text-white py-16">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-4xl font-display font-bold mb-4 text-white">
                        ¿Listo para tu nuevo look?
                    </h2>
                    <p className="text-xl mb-8 opacity-90">
                        Reserva tu cita ahora y experimenta el mejor servicio de barbería
                    </p>
                    <Link
                        to="/booking"
                        className="btn-secondary inline-flex items-center gap-2 text-lg"
                    >
                        <Calendar className="w-6 h-6" />
                        Reservar Ahora
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-dark-950 text-white py-8">
                <div className="container mx-auto px-4 text-center">
                    <p className="text-gray-400">
                        © 2024 Barbería Elite. Todos los derechos reservados.
                    </p>
                </div>
            </footer>
        </div>
    );
}
