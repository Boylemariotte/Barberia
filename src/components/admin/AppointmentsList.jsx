import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Check, X, Calendar, Plus } from 'lucide-react';
import { useBooking } from '../../hooks/useBooking';
import { useToast } from '../common/Toast';
import { formatDate, formatTime, formatPrice, cn } from '../../lib/utils';

export function AppointmentsList() {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [dateFilter, setDateFilter] = useState('all');

    const { appointments, barbers, services, completeAppointment, cancelAppointment } = useBooking();
    const toast = useToast();

    const handleComplete = async (appointmentId) => {
        const result = await completeAppointment(appointmentId);
        if (result.success) {
            toast.success('Cita marcada como completada');
        }
    };

    const handleCancel = async (appointmentId) => {
        if (window.confirm('¿Estás seguro de cancelar esta cita?')) {
            const result = await cancelAppointment(appointmentId);
            if (result.success) {
                toast.success('Cita cancelada');
            }
        }
    };

    // Filter appointments
    const filteredAppointments = appointments.filter(apt => {
        const matchesSearch = apt.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            apt.clientEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
            apt.clientPhone.includes(searchTerm);

        const matchesStatus = statusFilter === 'all' || apt.status === statusFilter;

        let matchesDate = true;
        if (dateFilter === 'today') {
            matchesDate = apt.date === new Date().toISOString().split('T')[0];
        } else if (dateFilter === 'upcoming') {
            matchesDate = new Date(apt.date) >= new Date();
        } else if (dateFilter === 'past') {
            matchesDate = new Date(apt.date) < new Date();
        }

        return matchesSearch && matchesStatus && matchesDate;
    });

    const statusColors = {
        confirmed: 'bg-blue-100 text-blue-800',
        completed: 'bg-green-100 text-green-800',
        cancelled: 'bg-red-100 text-red-800'
    };

    const statusLabels = {
        confirmed: 'Confirmada',
        completed: 'Completada',
        cancelled: 'Cancelada'
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-display font-bold mb-2">Gestión de Citas</h1>
                    <p className="text-gray-600">Administra todas las citas de la barbería</p>
                </div>
                <Link to="/booking" className="btn-primary flex items-center gap-2">
                    <Plus className="w-5 h-5" />
                    Nueva Cita
                </Link>
            </div>

            {/* Filters */}
            <div className="card">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Buscar por nombre, email o teléfono..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="input-field pl-10"
                        />
                    </div>

                    {/* Status Filter */}
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="input-field"
                    >
                        <option value="all">Todos los estados</option>
                        <option value="confirmed">Confirmadas</option>
                        <option value="completed">Completadas</option>
                        <option value="cancelled">Canceladas</option>
                    </select>

                    {/* Date Filter */}
                    <select
                        value={dateFilter}
                        onChange={(e) => setDateFilter(e.target.value)}
                        className="input-field"
                    >
                        <option value="all">Todas las fechas</option>
                        <option value="today">Hoy</option>
                        <option value="upcoming">Próximas</option>
                        <option value="past">Pasadas</option>
                    </select>
                </div>
            </div>

            {/* Appointments List */}
            <div className="card">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-display font-bold">
                        Citas ({filteredAppointments.length})
                    </h2>
                </div>

                {filteredAppointments.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                        <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                        <p>No se encontraron citas</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {filteredAppointments
                            .sort((a, b) => {
                                const dateCompare = b.date.localeCompare(a.date);
                                if (dateCompare !== 0) return dateCompare;
                                return b.time.localeCompare(a.time);
                            })
                            .map(apt => {
                                const barber = barbers.find(b => String(b.id) === String(apt.barberId));
                                const aptServices = apt.services.map(serviceId =>
                                    services.find(s => s.id === serviceId)
                                );
                                const total = aptServices.reduce((sum, service) => sum + (service?.price || 0), 0);

                                return (
                                    <div
                                        key={apt.id}
                                        className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                                    >
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h3 className="font-semibold text-lg">{apt.clientName}</h3>
                                                    <span className={cn(
                                                        "px-2 py-1 rounded-full text-xs font-semibold",
                                                        statusColors[apt.status]
                                                    )}>
                                                        {statusLabels[apt.status]}
                                                    </span>
                                                </div>
                                                <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                                                    <div>📅 {formatDate(apt.date)}</div>
                                                    <div>🕐 {formatTime(apt.time)}</div>
                                                    <div>💈 {barber?.name}</div>
                                                    <div>💰 {formatPrice(total)}</div>
                                                    <div>📧 {apt.clientEmail}</div>
                                                    <div>📱 {apt.clientPhone}</div>
                                                </div>
                                                <div className="mt-2">
                                                    <span className="text-sm text-gray-600">Servicios: </span>
                                                    <span className="text-sm font-medium">
                                                        {aptServices.map(s => s?.name).join(', ')}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            {apt.status === 'confirmed' && (
                                                <div className="flex gap-2 ml-4">
                                                    <button
                                                        onClick={() => handleComplete(apt.id)}
                                                        className="p-2 bg-green-100 text-green-600 hover:bg-green-200 rounded-lg transition-colors"
                                                        title="Marcar como completada"
                                                    >
                                                        <Check className="w-5 h-5" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleCancel(apt.id)}
                                                        className="p-2 bg-red-100 text-red-600 hover:bg-red-200 rounded-lg transition-colors"
                                                        title="Cancelar cita"
                                                    >
                                                        <X className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                    </div>
                )}
            </div>
        </div>
    );
}
