import React from 'react';
import { Clock } from 'lucide-react';
import { cn, formatTime } from '../../lib/utils';

export function TimeSlots({ availableSlots, selectedTime, onTimeSelect }) {
    if (!availableSlots || availableSlots.length === 0) {
        return (
            <div className="card text-center py-8">
                <Clock className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">No hay horarios disponibles para esta fecha</p>
            </div>
        );
    }

    return (
        <div className="card">
            <h3 className="text-lg font-display font-bold mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-gold-500" />
                Selecciona un horario
            </h3>

            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                {availableSlots.map((time) => (
                    <button
                        key={time}
                        onClick={() => onTimeSelect(time)}
                        className={cn(
                            "px-4 py-3 rounded-lg font-medium transition-all duration-200 border-2",
                            selectedTime === time
                                ? "bg-gold-500 text-white border-gold-500 shadow-lg scale-105"
                                : "bg-white border-gray-200 hover:border-gold-400 hover:bg-gold-50"
                        )}
                    >
                        {formatTime(time)}
                    </button>
                ))}
            </div>
        </div>
    );
}
