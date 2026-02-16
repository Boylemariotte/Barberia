import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useBooking } from '../hooks/useBooking';
import { Calendar, Clock, Scissors, XCircle } from 'lucide-react';
import { formatTime, formatDate, formatPrice, cn } from '../lib/utils';
import { useToast } from '../components/common/Toast';

export function MyAppointments() {
    const { user } = useAuth();
    const { appointments, barbers, services, cancelAppointment } = useBooking();
    const toast = useToast();

    // Filter appointments for the current user
    const userAppointments = appointments.filter(apt => apt.clientEmail === user?.email);

    const handleCancel = async (id) => {
        if (window.confirm('¿Estás seguro de que deseas cancelar esta cita?')) {
            const result = await cancelAppointment(id);
            if (result.success) {
                toast.success('Cita cancelada correctamente');
            }
        }
    };

    if (!user) {
        return (
            <div className="container mx-auto px-4 py-20 text-center">
                <h2 className="text-2xl font-display font-bold mb-4 text-dark-900">Debes iniciar sesión</h2>
                <p className="text-gray-600 mb-8">Por favor, inicia sesión para ver tus citas.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-3xl font-display font-bold">Mis Citas</h1>
                            <p className="text-gray-600">Historial y gestión de tus servicios</p>
                        </div>
                        <Link to="/booking" className="btn-primary">
                            Agendar Nueva Cita
                        </Link>
                    </div>

                    {userAppointments.length === 0 ? (
                        <div className="card text-center py-16">
                            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-xl font-display font-bold mb-2">No tienes citas programadas</h3>
                            <p className="text-gray-600 mb-8">¿Qué tal si agendas una ahora?</p>
                            <Link to="/booking" className="btn-primary inline-block">
                                Reservar mi primera cita
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {userAppointments
                                .sort((a, b) => new Date(b.date + 'T' + b.time) - new Date(a.date + 'T' + a.time))
                                .map((apt) => {
                                    const barber = barbers.find(b => b.id === apt.barberId);
                                    const aptServices = apt.services.map(sId => services.find(s => s.id === sId));
                                    const total = aptServices.reduce((sum, s) => sum + (s?.price || 0), 0);
                                    const isPast = new Date(apt.date) < new Date(new Date().toISOString().split('T')[0]);

                                    return (
                                        <div key={apt.id} className="card hover:shadow-md transition-shadow">
                                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                                <div className="flex items-start gap-4">
                                                    <div className={cn(
                                                        "flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center",
                                                        apt.status === 'confirmed' ? "bg-gold-100 text-gold-600" :
                                                            apt.status === 'completed' ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                                                    )}>
                                                        <Scissors className="w-6 h-6" />
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <h3 className="font-bold text-lg">{barber?.name}</h3>
                                                            <span className={cn(
                                                                "text-xs px-2 py-0.5 rounded-full font-medium",
                                                                apt.status === 'confirmed' ? "bg-gold-500 text-white" :
                                                                    apt.status === 'completed' ? "bg-green-500 text-white" : "bg-red-500 text-white"
                                                            )}>
                                                                {apt.status === 'confirmed' ? 'Confirmada' :
                                                                    apt.status === 'completed' ? 'Completada' : 'Cancelada'}
                                                            </span>
                                                        </div>
                                                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-600">
                                                            <div className="flex items-center gap-1">
                                                                <Calendar className="w-4 h-4" />
                                                                {formatDate(apt.date)}
                                                            </div>
                                                            <div className="flex items-center gap-1">
                                                                <Clock className="w-4 h-4" />
                                                                {formatTime(apt.time)}
                                                            </div>
                                                        </div>
                                                        <p className="text-sm text-gray-600 mt-2">
                                                            <span className="font-medium">Servicios:</span> {aptServices.map(s => s?.name).join(', ')}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-between md:flex-col md:items-end gap-4">
                                                    <div className="text-xl font-display font-bold text-gold-600">
                                                        {formatPrice(total)}
                                                    </div>
                                                    {apt.status === 'confirmed' && !isPast && (
                                                        <button
                                                            onClick={() => handleCancel(apt.id)}
                                                            className="flex items-center gap-2 text-red-500 hover:text-red-700 text-sm font-medium transition-colors"
                                                        >
                                                            <XCircle className="w-4 h-4" />
                                                            Cancelar Cita
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
