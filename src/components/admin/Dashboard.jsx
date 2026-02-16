import React from 'react';
import { Calendar, Users, DollarSign, Clock } from 'lucide-react';
import { useBooking } from '../../hooks/useBooking';
import { formatDate, formatTime, formatPrice, isToday } from '../../lib/utils';

export function Dashboard() {
    const { appointments, barbers, services } = useBooking();

    // Filter today's appointments
    const todayAppointments = appointments.filter(apt =>
        isToday(apt.date) && apt.status !== 'cancelled'
    );

    // Calculate statistics
    const totalAppointments = appointments.filter(apt => apt.status !== 'cancelled').length;
    const completedAppointments = appointments.filter(apt => apt.status === 'completed').length;
    const todayRevenue = todayAppointments.reduce((total, apt) => {
        const aptServices = apt.services.map(serviceId =>
            services.find(s => s.id === serviceId)
        );
        return total + aptServices.reduce((sum, service) => sum + (service?.price || 0), 0);
    }, 0);

    const stats = [
        {
            label: 'Citas Hoy',
            value: todayAppointments.length,
            icon: Calendar,
            color: 'bg-blue-500'
        },
        {
            label: 'Total Citas',
            value: totalAppointments,
            icon: Clock,
            color: 'bg-green-500'
        },
        {
            label: 'Completadas',
            value: completedAppointments,
            icon: Users,
            color: 'bg-purple-500'
        },
        {
            label: 'Ingresos Hoy',
            value: formatPrice(todayRevenue),
            icon: DollarSign,
            color: 'bg-gold-500'
        }
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-display font-bold mb-2">Dashboard</h1>
                <p className="text-gray-600">Resumen de actividad y estadísticas</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <div key={index} className="card">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                                    <p className="text-2xl font-display font-bold">{stat.value}</p>
                                </div>
                                <div className={`${stat.color} p-3 rounded-lg`}>
                                    <Icon className="w-6 h-6 text-white" />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Today's Appointments */}
            <div className="card">
                <h2 className="text-xl font-display font-bold mb-4">Citas de Hoy</h2>

                {todayAppointments.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        No hay citas programadas para hoy
                    </div>
                ) : (
                    <div className="space-y-3">
                        {todayAppointments
                            .sort((a, b) => a.time.localeCompare(b.time))
                            .map(apt => {
                                const barber = barbers.find(b => String(b.id) === String(apt.barberId));
                                const aptServices = apt.services.map(serviceId =>
                                    services.find(s => s.id === serviceId)
                                );
                                const total = aptServices.reduce((sum, service) => sum + (service?.price || 0), 0);

                                return (
                                    <div
                                        key={apt.id}
                                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="bg-gold-500 text-white px-3 py-2 rounded-lg font-semibold">
                                                {formatTime(apt.time)}
                                            </div>
                                            <div>
                                                <p className="font-semibold">{apt.clientName}</p>
                                                <p className="text-sm text-gray-600">
                                                    {barber?.name} • {aptServices.map(s => s?.name).join(', ')}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-gold-600">{formatPrice(total)}</p>
                                            <p className="text-sm text-gray-600">{apt.clientPhone}</p>
                                        </div>
                                    </div>
                                );
                            })}
                    </div>
                )}
            </div>

            {/* Barbers Overview */}
            <div className="card">
                <h2 className="text-xl font-display font-bold mb-4">Barberos</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {barbers.map(barber => {
                        const barberAppointments = todayAppointments.filter(apt => String(apt.barberId) === String(barber.id));
                        return (
                            <div key={barber.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                <img
                                    src={barber.photo}
                                    alt={barber.name}
                                    className="w-12 h-12 rounded-full object-cover"
                                />
                                <div>
                                    <p className="font-semibold text-sm">{barber.name}</p>
                                    <p className="text-xs text-gray-600">
                                        {barberAppointments.length} citas hoy
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
