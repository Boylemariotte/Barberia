import React from 'react';
import { Check } from 'lucide-react';
import { cn, formatPrice } from '../../lib/utils';
import * as Icons from 'lucide-react';

export function ServiceSelection({ services, selectedServices, onServiceToggle }) {
    const getIcon = (iconName) => {
        const iconMap = {
            scissors: Icons.Scissors,
            razor: Icons.Sparkles,
            package: Icons.Package,
            sparkles: Icons.Sparkles,
            palette: Icons.Palette,
            star: Icons.Star
        };

        const IconComponent = iconMap[iconName] || Icons.Scissors;
        return <IconComponent className="w-6 h-6" />;
    };

    const isSelected = (serviceId) => selectedServices.includes(serviceId);

    const totalPrice = selectedServices.reduce((total, serviceId) => {
        const service = services.find(s => s.id === serviceId);
        return total + (service?.price || 0);
    }, 0);

    const totalDuration = selectedServices.reduce((total, serviceId) => {
        const service = services.find(s => s.id === serviceId);
        return total + (service?.duration || 0);
    }, 0);

    return (
        <div className="card">
            <h3 className="text-lg font-display font-bold mb-4">
                Selecciona los servicios
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {services.map((service) => {
                    const selected = isSelected(service.id);

                    return (
                        <button
                            key={service.id}
                            onClick={() => onServiceToggle(service.id)}
                            className={cn(
                                "relative flex items-start gap-4 p-4 rounded-xl border-2 transition-all duration-300 text-left",
                                selected
                                    ? "border-gold-500 bg-gold-50 shadow-lg"
                                    : "border-gray-200 hover:border-gold-300 hover:shadow-md"
                            )}
                        >
                            {/* Icon */}
                            <div className={cn(
                                "flex-shrink-0 p-3 rounded-lg",
                                selected ? "bg-gold-500 text-white" : "bg-gray-100 text-gray-600"
                            )}>
                                {getIcon(service.icon)}
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                                <h4 className="font-display font-bold text-dark-900 mb-1">
                                    {service.name}
                                </h4>

                                <p className="text-sm text-gray-600 mb-2">
                                    {service.description}
                                </p>

                                <div className="flex items-center gap-3 text-sm">
                                    <span className="font-bold text-gold-600">
                                        {formatPrice(service.price)}
                                    </span>
                                    <span className="text-gray-500">
                                        {service.duration} min
                                    </span>
                                </div>
                            </div>

                            {/* Check mark */}
                            {selected && (
                                <div className="absolute top-3 right-3 bg-gold-500 text-white rounded-full p-1">
                                    <Check className="w-4 h-4" />
                                </div>
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Summary */}
            {selectedServices.length > 0 && (
                <div className="border-t pt-4">
                    <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-gray-600">Servicios seleccionados:</span>
                        <span className="font-semibold">{selectedServices.length}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-gray-600">Duración total:</span>
                        <span className="font-semibold">{totalDuration} minutos</span>
                    </div>
                    <div className="flex items-center justify-between text-lg font-display font-bold">
                        <span>Total:</span>
                        <span className="text-gold-600">{formatPrice(totalPrice)}</span>
                    </div>
                </div>
            )}
        </div>
    );
}
