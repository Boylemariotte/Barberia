import React from 'react';
import { useBooking } from '../hooks/useBooking';
import { ImageIcon, Scissors, Info } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Catalogue() {
    const { catalogueItems } = useBooking();

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
                        Catálogo de <span className="text-gradient">Estilos</span>
                    </h1>
                    <p className="text-gray-600 text-lg">
                        Explora nuestra selección de cortes y estilos para encontrar tu próximo look.
                        Úsalos como referencia cuando vengas a tu cita.
                    </p>
                </div>

                {catalogueItems.length === 0 ? (
                    <div className="max-w-md mx-auto bg-white rounded-2xl p-12 text-center shadow-soft border border-gray-100">
                        <ImageIcon className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                        <h3 className="text-xl font-display font-bold text-gray-800 mb-2">Próximamente</h3>
                        <p className="text-gray-600 mb-6">Estamos preparando nuestra galería de estilos. ¡Vuelve pronto!</p>
                        <Link to="/booking" className="btn-primary inline-flex items-center gap-2">
                            <Scissors className="w-5 h-5" />
                            Reservar mi Cita
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {catalogueItems.map((item) => (
                            <div
                                key={item.id}
                                className="group bg-white rounded-2xl overflow-hidden shadow-soft hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                            >
                                <div className="relative aspect-[4/5] overflow-hidden">
                                    <img
                                        src={item.photo}
                                        alt={item.title}
                                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                                        <div className="text-white">
                                            <p className="text-sm font-medium text-gold-400 mb-1">Corte Seleccionado</p>
                                            <h3 className="text-xl font-display font-bold leading-tight">{item.title}</h3>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-4 border-t border-gray-100 flex justify-between items-center">
                                    <h3 className="text-gray-900 font-display font-bold truncate pr-4">{item.title}</h3>
                                    <div className="bg-gray-50 p-2 rounded-lg text-gold-600">
                                        <Info className="w-5 h-5" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Reservation CTA */}
                <div className="mt-20 bg-gradient-dark rounded-3xl p-8 md:p-12 text-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-gold-500/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-gold-500/10 rounded-full -ml-32 -mb-32 blur-3xl"></div>

                    <div className="relative z-10 max-w-2xl mx-auto">
                        <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-6">
                            ¿Encontraste el estilo que buscabas?
                        </h2>
                        <p className="text-gray-300 text-lg mb-8">
                            Nuestros barberos expertos están listos para hacerlo realidad.
                        </p>
                        <Link to="/booking" className="btn-primary px-8 py-4 text-lg">
                            Reservar Ahora
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
