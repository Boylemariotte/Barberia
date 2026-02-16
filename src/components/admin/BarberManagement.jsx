import React, { useState } from 'react';
import { Plus, Edit, Trash, Star } from 'lucide-react';
import { useBooking } from '../../hooks/useBooking';
import { useToast } from '../common/Toast';
import { Modal } from '../common/Modal';

export function BarberManagement() {
    const { barbers, updateBarbers } = useBooking();
    const toast = useToast();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBarber, setEditingBarber] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        specialty: '',
        description: '',
        photo: '',
        experience: '',
        rating: 4.8
    });

    const handleEdit = (barber) => {
        setEditingBarber(barber);
        setFormData({
            name: barber.name,
            specialty: barber.specialty,
            description: barber.description || '',
            photo: barber.photo,
            experience: barber.experience,
            rating: barber.rating
        });
        setIsModalOpen(true);
    };

    const handleAdd = () => {
        setEditingBarber(null);
        setFormData({
            name: '',
            specialty: '',
            description: '',
            photo: '',
            experience: '',
            rating: 4.8
        });
        setIsModalOpen(true);
    };

    const handleDelete = (barberId) => {
        if (window.confirm('¿Estás seguro de eliminar a este barbero?')) {
            const newBarbers = barbers.filter(b => b.id !== barberId);
            updateBarbers(newBarbers);
            toast.success('Barbero eliminado');
        }
    };

    const handleSave = () => {
        if (!formData.name || !formData.specialty || !formData.photo) {
            toast.warning('Por favor completa los campos principales');
            return;
        }

        let newBarbers;
        if (editingBarber) {
            newBarbers = barbers.map(b =>
                String(b.id) === String(editingBarber.id) ? { ...b, ...formData } : b
            );
            toast.success('Barbero actualizado');
        } else {
            const newBarber = {
                id: Date.now(),
                ...formData
            };
            newBarbers = [...barbers, newBarber];
            toast.success('Barbero agregado');
        }

        updateBarbers(newBarbers);
        setIsModalOpen(false);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-display font-bold mb-1 md:mb-2">Gestión de Barberos</h1>
                    <p className="text-sm md:text-base text-gray-600">Administra el equipo de barberos</p>
                </div>
                <button onClick={handleAdd} className="btn-primary flex items-center justify-center gap-2 w-full sm:w-auto">
                    <Plus className="w-5 h-5" />
                    Agregar Barbero
                </button>
            </div>

            {/* Barbers Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {barbers.map(barber => (
                    <div key={barber.id} className="card group">
                        <div className="flex items-start gap-4">
                            <img
                                src={barber.photo}
                                alt={barber.name}
                                className="w-20 h-20 rounded-full object-cover border-4 border-gold-500"
                            />
                            <div className="flex-1 min-w-0">
                                <h3 className="font-display font-bold text-lg mb-1">{barber.name}</h3>
                                <p className="text-sm text-gold-600 font-semibold mb-2">
                                    {barber.specialty}
                                </p>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Star className="w-4 h-4 fill-gold-500 text-gold-500" />
                                    <span>{barber.rating}</span>
                                    <span>•</span>
                                    <span>{barber.experience}</span>
                                </div>
                            </div>
                        </div>

                        <p className="text-sm text-gray-600 mt-4 line-clamp-2">
                            {barber.description}
                        </p>

                        <div className="flex flex-col sm:flex-row gap-2 mt-6">
                            <button
                                onClick={() => handleEdit(barber)}
                                className="flex-1 btn-outline flex items-center justify-center gap-2 text-sm py-2 px-4"
                            >
                                <Edit className="w-4 h-4" />
                                Editar
                            </button>
                            <button
                                onClick={() => handleDelete(barber.id)}
                                className="sm:px-4 py-2 border-2 border-red-500 text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center justify-center"
                            >
                                <Trash className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal for Add/Edit */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingBarber ? 'Editar Barbero' : 'Agregar Barbero'}
            >
                <div className="space-y-4">
                    <div>
                        <label className="label">Nombre</label>
                        <input
                            type="text"
                            className="input-field"
                            placeholder="Nombre del barbero"
                            value={formData.name}
                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        />
                    </div>

                    <div>
                        <label className="label">Especialidad</label>
                        <input
                            type="text"
                            className="input-field"
                            placeholder="Ej: Cortes Clásicos"
                            value={formData.specialty}
                            onChange={(e) => setFormData(prev => ({ ...prev, specialty: e.target.value }))}
                        />
                    </div>

                    <div>
                        <label className="label">Descripción</label>
                        <textarea
                            className="input-field"
                            rows="3"
                            placeholder="Descripción breve"
                            value={formData.description}
                            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        />
                    </div>

                    <div>
                        <label className="label">URL de Foto</label>
                        <input
                            type="url"
                            className="input-field"
                            placeholder="https://..."
                            value={formData.photo}
                            onChange={(e) => setFormData(prev => ({ ...prev, photo: e.target.value }))}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="label">Experiencia</label>
                            <input
                                type="text"
                                className="input-field"
                                placeholder="Ej: 5 años"
                                value={formData.experience}
                                onChange={(e) => setFormData(prev => ({ ...prev, experience: e.target.value }))}
                            />
                        </div>

                        <div>
                            <label className="label">Calificación</label>
                            <input
                                type="number"
                                step="0.1"
                                min="0"
                                max="5"
                                className="input-field"
                                placeholder="4.8"
                                value={formData.rating}
                                onChange={(e) => setFormData(prev => ({ ...prev, rating: parseFloat(e.target.value) }))}
                            />
                        </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button onClick={handleSave} className="btn-secondary flex-1">
                            {editingBarber ? 'Guardar Cambios' : 'Agregar Barbero'}
                        </button>
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="btn-outline flex-1"
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
