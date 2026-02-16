import React from 'react';
import { Star, Award } from 'lucide-react';
import { cn } from '../../lib/utils';

export function BarberSelection({ barbers, selectedBarber, onBarberSelect }) {
    return (
        <div className="card">
            <h3 className="text-lg font-display font-bold mb-4">
                Selecciona tu barbero
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {barbers.map((barber) => (
                    <button
                        key={barber.id}
                        onClick={() => onBarberSelect(barber.id)}
                        className={cn(
                            "flex items-start gap-4 p-4 rounded-xl border-2 transition-all duration-300 text-left",
                            selectedBarber === barber.id
                                ? "border-gold-500 bg-gold-50 shadow-lg scale-105"
                                : "border-gray-200 hover:border-gold-300 hover:shadow-md"
                        )}
                    >
                        {/* Photo */}
                        <div className="flex-shrink-0">
                            <img
                                src={barber.photo}
                                alt={barber.name}
                                className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-md"
                            />
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                            <h4 className="font-display font-bold text-dark-900 mb-1">
                                {barber.name}
                            </h4>

                            <p className="text-sm text-gray-600 mb-2">
                                {barber.specialty}
                            </p>

                            <div className="flex items-center gap-3 text-sm">
                                <div className="flex items-center gap-1 text-gold-600">
                                    <Star className="w-4 h-4 fill-current" />
                                    <span className="font-semibold">{barber.rating}</span>
                                </div>

                                <div className="flex items-center gap-1 text-gray-600">
                                    <Award className="w-4 h-4" />
                                    <span>{barber.experience}</span>
                                </div>
                            </div>

                            {barber.description && (
                                <p className="text-xs text-gray-500 mt-2">
                                    {barber.description}
                                </p>
                            )}
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
}
