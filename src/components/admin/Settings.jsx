import React, { useState } from 'react';
import { Save, Plus, Edit, Trash } from 'lucide-react';
import { useBooking } from '../../hooks/useBooking';
import { useToast } from '../common/Toast';
import { formatPrice } from '../../lib/utils';

export function Settings() {
    const {
        services,
        businessHours,
        updateBusinessHours,
        updateServices
    } = useBooking();
    const toast = useToast();
    const [hours, setHours] = useState(businessHours);

    const handleSaveHours = () => {
        const result = updateBusinessHours(hours);
        if (result.success) {
            toast.success('Horarios actualizados correctamente');
        }
    };

    const handleDeleteService = (serviceId) => {
        if (window.confirm('¿Estás seguro de eliminar este servicio?')) {
            const newServices = services.filter(s => s.id !== serviceId);
            updateServices(newServices);
            toast.success('Servicio eliminado');
        }
    };

    const days = [
        { key: 'monday', label: 'Lunes' },
        { key: 'tuesday', label: 'Martes' },
        { key: 'wednesday', label: 'Miércoles' },
        { key: 'thursday', label: 'Jueves' },
        { key: 'friday', label: 'Viernes' },
        { key: 'saturday', label: 'Sábado' },
        { key: 'sunday', label: 'Domingo' }
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-display font-bold mb-2">Configuración</h1>
                <p className="text-gray-600">Administra los servicios y horarios de la barbería</p>
            </div>

            {/* Business Hours */}
            <div className="card">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-display font-bold">Horarios de Atención</h2>
                    <button onClick={handleSaveHours} className="btn-primary flex items-center gap-2">
                        <Save className="w-4 h-4" />
                        Guardar Cambios
                    </button>
                </div>

                <div className="space-y-3">
                    {days.map(day => (
                        <div key={day.key} className="flex items-center gap-4">
                            <div className="w-32 font-semibold">{day.label}</div>
                            <div className="flex items-center gap-2 flex-1">
                                <input
                                    type="time"
                                    value={hours[day.key]?.open || '09:00'}
                                    onChange={(e) => setHours(prev => ({
                                        ...prev,
                                        [day.key]: { ...prev[day.key], open: e.target.value }
                                    }))}
                                    className="input-field"
                                />
                                <span className="text-gray-600">a</span>
                                <input
                                    type="time"
                                    value={hours[day.key]?.close || '19:00'}
                                    onChange={(e) => setHours(prev => ({
                                        ...prev,
                                        [day.key]: { ...prev[day.key], close: e.target.value }
                                    }))}
                                    className="input-field"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Services Management */}
            <div className="card">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-display font-bold">Servicios</h2>
                    <button className="btn-primary flex items-center gap-2">
                        <Plus className="w-4 h-4" />
                        Agregar Servicio
                    </button>
                </div>

                <div className="space-y-3">
                    {services.map(service => (
                        <div
                            key={service.id}
                            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                            <div className="flex-1">
                                <h3 className="font-semibold mb-1">{service.name}</h3>
                                <p className="text-sm text-gray-600 mb-2">{service.description}</p>
                                <div className="flex items-center gap-4 text-sm">
                                    <span className="font-bold text-gold-600">{formatPrice(service.price)}</span>
                                    <span className="text-gray-600">{service.duration} minutos</span>
                                </div>
                            </div>

                            <div className="flex gap-2 ml-4">
                                <button className="p-2 bg-blue-100 text-blue-600 hover:bg-blue-200 rounded-lg transition-colors">
                                    <Edit className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => handleDeleteService(service.id)}
                                    className="p-2 bg-red-100 text-red-600 hover:bg-red-200 rounded-lg transition-colors"
                                >
                                    <Trash className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* General Settings */}
            <div className="card">
                <h2 className="text-xl font-display font-bold mb-4">Configuración General</h2>

                <div className="space-y-4">
                    <div>
                        <label className="label">Duración de slots (minutos)</label>
                        <input
                            type="number"
                            defaultValue="30"
                            className="input-field"
                            min="15"
                            step="15"
                        />
                        <p className="text-sm text-gray-500 mt-1">
                            Tiempo mínimo entre citas
                        </p>
                    </div>

                    <div>
                        <label className="label">Email de notificaciones</label>
                        <input
                            type="email"
                            defaultValue="admin@barberia.com"
                            className="input-field"
                            placeholder="email@barberia.com"
                        />
                    </div>

                    <div>
                        <label className="label">Teléfono de contacto</label>
                        <input
                            type="tel"
                            defaultValue="3001234567"
                            className="input-field"
                            placeholder="3001234567"
                        />
                    </div>

                    <button className="btn-primary">
                        <Save className="w-4 h-4 inline mr-2" />
                        Guardar Configuración
                    </button>
                </div>
            </div>
        </div>
    );
}
