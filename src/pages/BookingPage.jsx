import React from 'react';
import { BookingForm } from '../components/booking/BookingForm';

export function BookingPage() {
    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-display font-bold mb-4">
                        Reserva tu Cita
                    </h1>
                    <p className="text-gray-600 text-lg">
                        Sigue los pasos para agendar tu cita con nosotros
                    </p>
                </div>

                <BookingForm />
            </div>
        </div>
    );
}
