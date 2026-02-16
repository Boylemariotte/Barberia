import React, { useState } from 'react';
import { Plus, Trash, Image as ImageIcon, Upload } from 'lucide-react';
import { useBooking } from '../../hooks/useBooking';
import { useToast } from '../common/Toast';
import { Modal } from '../common/Modal';

export function CatalogueManagement() {
    const { catalogueItems, addCatalogueItem, deleteCatalogueItem } = useBooking();
    const toast = useToast();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        photo: ''
    });
    const [previewUrl, setPreviewUrl] = useState('');

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) { // 2MB limit
                toast.warning('La imagen es muy pesada. Máximo 2MB.');
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result;
                setFormData(prev => ({ ...prev, photo: base64String }));
                setPreviewUrl(base64String);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAdd = () => {
        setFormData({ title: '', photo: '' });
        setPreviewUrl('');
        setIsModalOpen(true);
    };

    const handleDelete = (id) => {
        if (window.confirm('¿Estás seguro de eliminar este corte del catálogo?')) {
            deleteCatalogueItem(id);
            toast.success('Corte eliminado del catálogo');
        }
    };

    const handleSave = () => {
        if (!formData.title || !formData.photo) {
            toast.warning('Por favor completa todos los campos');
            return;
        }

        addCatalogueItem(formData);
        toast.success('Corte añadido al catálogo');
        setIsModalOpen(false);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-display font-bold mb-1 md:mb-2">Catálogo de Cortes</h1>
                    <p className="text-sm md:text-base text-gray-600">Administra las fotos que verán tus clientes</p>
                </div>
                <button onClick={handleAdd} className="btn-primary flex items-center justify-center gap-2 w-full sm:w-auto">
                    <Plus className="w-5 h-5" />
                    Añadir al Catálogo
                </button>
            </div>

            {/* Catalogue Grid */}
            {catalogueItems.length === 0 ? (
                <div className="bg-white rounded-2xl p-12 text-center shadow-soft border-2 border-dashed border-gray-200">
                    <ImageIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-display font-bold text-gray-800 mb-2">No hay fotos en el catálogo</h3>
                    <p className="text-gray-600 mb-6">Sube fotos de tus mejores trabajos para que tus clientes se inspiren.</p>
                    <button onClick={handleAdd} className="btn-secondary">
                        Subir mi primera foto
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {catalogueItems.map(item => (
                        <div key={item.id} className="card group overflow-hidden p-0 relative">
                            <img
                                src={item.photo}
                                alt={item.title}
                                className="w-full h-64 object-cover transform group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                                <h4 className="text-white font-display font-bold text-lg mb-4">{item.title}</h4>
                                <button
                                    onClick={() => handleDelete(item.id)}
                                    className="w-full py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                                >
                                    <Trash className="w-4 h-4" />
                                    Eliminar
                                </button>
                            </div>
                            <div className="p-4 bg-white block group-hover:hidden">
                                <h4 className="text-gray-900 font-display font-bold truncate">{item.title}</h4>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal for Add */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Añadir al Catálogo"
            >
                <div className="space-y-4">
                    <div>
                        <label className="label">Título / Estilo</label>
                        <input
                            type="text"
                            className="input-field"
                            placeholder="Ej: Fade Moderno con Barba"
                            value={formData.title}
                            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                        />
                    </div>

                    <div>
                        <label className="label">Foto del Corte</label>
                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-gold-500 transition-colors cursor-pointer relative">
                            <input
                                type="file"
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                            <div className="space-y-1 text-center">
                                {previewUrl ? (
                                    <img src={previewUrl} alt="Preview" className="mx-auto h-32 w-32 object-cover rounded-lg mb-2" />
                                ) : (
                                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                                )}
                                <div className="flex text-sm text-gray-600">
                                    <span className="relative cursor-pointer bg-white rounded-md font-medium text-gold-600 hover:text-gold-500">
                                        Subir un archivo
                                    </span>
                                    <p className="pl-1 text-gray-500">o arrastra y suelta</p>
                                </div>
                                <p className="text-xs text-gray-500">
                                    PNG, JPG, GIF hasta 2MB
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button onClick={handleSave} className="btn-secondary flex-1">
                            Añadir al Catálogo
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
