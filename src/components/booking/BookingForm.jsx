import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, ChevronLeft, Check } from 'lucide-react';
import { useBooking } from '../../hooks/useBooking';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../common/Toast';
import { Calendar } from './Calendar';
import { TimeSlots } from './TimeSlots';
import { BarberSelection } from './BarberSelection';
import { ServiceSelection } from './ServiceSelection';
import { formatDate, formatTime, formatPrice, isValidEmail, isValidPhone, getWhatsAppURL, sendAutomaticWhatsApp } from '../../lib/utils';

const STEPS = {
    SERVICES: 0,
    BARBER: 1,
    DATE: 2,
    TIME: 3,
    CONTACT: 4,
    CONFIRMATION: 5
};

export function BookingForm() {
    const [currentStep, setCurrentStep] = useState(STEPS.SERVICES);
    const [contactInfo, setContactInfo] = useState({
        name: '',
        email: '',
        phone: ''
    });
    const [errors, setErrors] = useState({});

    const {
        barbers,
        services,
        selectedDate,
        selectedTime,
        selectedBarber,
        selectedServices,
        setSelectedDate,
        setSelectedTime,
        setSelectedBarber,
        setSelectedServices,
        getAvailableSlots,
        createAppointment,
        getTotalPrice,
        getTotalDuration
    } = useBooking();

    const { user } = useAuth();
    const toast = useToast();
    const navigate = useNavigate();

    const availableSlots = selectedDate && selectedBarber
        ? getAvailableSlots(selectedDate, selectedBarber)
        : [];

    const selectedBarberData = barbers.find(b => b.id === selectedBarber);

    const handleServiceToggle = (serviceId) => {
        setSelectedServices(prev =>
            prev.includes(serviceId)
                ? prev.filter(id => id !== serviceId)
                : [...prev, serviceId]
        );
    };

    const validateContact = () => {
        const newErrors = {};

        if (!contactInfo.name.trim()) {
            newErrors.name = 'El nombre es requerido';
        }

        if (!contactInfo.email.trim()) {
            newErrors.email = 'El email es requerido';
        } else if (!isValidEmail(contactInfo.email)) {
            newErrors.email = 'Email inválido';
        }

        if (!contactInfo.phone.trim()) {
            newErrors.phone = 'El teléfono es requerido';
        } else if (!isValidPhone(contactInfo.phone)) {
            newErrors.phone = 'Teléfono inválido (debe ser un celular colombiano)';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (currentStep === STEPS.SERVICES && selectedServices.length === 0) {
            toast.warning('Por favor selecciona al menos un servicio');
            return;
        }

        if (currentStep === STEPS.BARBER && !selectedBarber) {
            toast.warning('Por favor selecciona un barbero');
            return;
        }

        if (currentStep === STEPS.DATE && !selectedDate) {
            toast.warning('Por favor selecciona una fecha');
            return;
        }

        if (currentStep === STEPS.TIME && !selectedTime) {
            toast.warning('Por favor selecciona un horario');
            return;
        }

        if (currentStep === STEPS.CONTACT) {
            if (!validateContact()) {
                return;
            }
        }

        setCurrentStep(prev => prev + 1);
    };

    const handleBack = () => {
        setCurrentStep(prev => prev - 1);
    };

    const handleConfirm = async () => {
        const appointmentData = {
            date: selectedDate,
            time: selectedTime,
            barberId: selectedBarber,
            services: selectedServices,
            clientName: user?.name || contactInfo.name,
            clientEmail: user?.email || contactInfo.email,
            clientPhone: user?.phone || contactInfo.phone,
            userId: user?.id || null
        };

        const result = await createAppointment(appointmentData);

        if (result.success) {
            toast.success('¡Cita reservada exitosamente!');

            // Preparar y enviar confirmación por WhatsApp
            const resolvedServices = selectedServices.map(id => services.find(s => s.id === id)).filter(Boolean);
            const whatsappData = {
                date: selectedDate,
                time: selectedTime,
                barberName: selectedBarberData?.name,
                services: resolvedServices,
                totalPrice: getTotalPrice(),
                clientName: appointmentData.clientName,
                clientPhone: appointmentData.clientPhone
            };

            // Intento de envío automático vía CallMeBot
            sendAutomaticWhatsApp(whatsappData).then(res => {
                if (!res.success && res.error === 'API Key missing') {
                    // Si no hay API Key, usamos el fallback manual para no romper el flujo
                    const whatsappURL = getWhatsAppURL(whatsappData);
                    window.open(whatsappURL, '_blank');
                }
            });

            setTimeout(() => {
                navigate('/');
            }, 2000);
        } else {
            toast.error('Error al reservar la cita. Por favor intenta de nuevo.');
        }
    };

    // Auto-fill contact info if user is logged in
    React.useEffect(() => {
        if (user && currentStep === STEPS.CONTACT) {
            setContactInfo({
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || ''
            });
        }
    }, [user, currentStep]);

    const renderStep = () => {
        switch (currentStep) {
            case STEPS.SERVICES:
                return (
                    <ServiceSelection
                        services={services}
                        selectedServices={selectedServices}
                        onServiceToggle={handleServiceToggle}
                    />
                );

            case STEPS.BARBER:
                return (
                    <BarberSelection
                        barbers={barbers}
                        selectedBarber={selectedBarber}
                        onBarberSelect={(id) => {
                            setSelectedBarber(id);
                            // Optional: auto-advance or just let user click next
                        }}
                    />
                );

            case STEPS.DATE:
                return (
                    <Calendar
                        selectedDate={selectedDate}
                        onDateSelect={setSelectedDate}
                    />
                );

            case STEPS.TIME:
                return (
                    <TimeSlots
                        availableSlots={availableSlots}
                        selectedTime={selectedTime}
                        onTimeSelect={setSelectedTime}
                    />
                );

            case STEPS.CONTACT:
                return (
                    <div className="card max-w-md mx-auto">
                        <h3 className="text-lg font-display font-bold mb-4">
                            Información de contacto
                        </h3>

                        <div className="space-y-4">
                            <div>
                                <label className="label">Nombre completo</label>
                                <input
                                    type="text"
                                    value={contactInfo.name}
                                    onChange={(e) => setContactInfo(prev => ({ ...prev, name: e.target.value }))}
                                    className="input-field"
                                    placeholder="Juan Pérez"
                                    disabled={!!user?.name}
                                />
                                {errors.name && (
                                    <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                                )}
                            </div>

                            <div>
                                <label className="label">Email</label>
                                <input
                                    type="email"
                                    value={contactInfo.email}
                                    onChange={(e) => setContactInfo(prev => ({ ...prev, email: e.target.value }))}
                                    className="input-field"
                                    placeholder="juan@example.com"
                                    disabled={!!user?.email}
                                />
                                {errors.email && (
                                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                                )}
                            </div>

                            <div>
                                <label className="label">Teléfono</label>
                                <input
                                    type="tel"
                                    value={contactInfo.phone}
                                    onChange={(e) => setContactInfo(prev => ({ ...prev, phone: e.target.value }))}
                                    className="input-field"
                                    placeholder="3001234567"
                                    disabled={!!user?.phone}
                                />
                                {errors.phone && (
                                    <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                                )}
                            </div>
                        </div>
                    </div>
                );

            case STEPS.CONFIRMATION:
                if (!selectedBarberData || !selectedDate || !selectedTime) {
                    return (
                        <div className="text-center py-12">
                            <p className="text-gray-600">Cargando detalles de la reserva...</p>
                        </div>
                    );
                }
                return (
                    <div className="card max-w-2xl mx-auto">
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Check className="w-8 h-8 text-green-600" />
                            </div>
                            <h3 className="text-2xl font-display font-bold mb-2">
                                Confirma tu reserva
                            </h3>
                            <p className="text-gray-600">
                                Revisa los detalles de tu cita antes de confirmar
                            </p>
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between py-3 border-b">
                                <span className="text-gray-600">Fecha:</span>
                                <span className="font-semibold">{formatDate(selectedDate)}</span>
                            </div>

                            <div className="flex justify-between py-3 border-b">
                                <span className="text-gray-600">Hora:</span>
                                <span className="font-semibold">{formatTime(selectedTime)}</span>
                            </div>

                            <div className="flex justify-between py-3 border-b">
                                <span className="text-gray-600">Barbero:</span>
                                <span className="font-semibold">{selectedBarberData?.name}</span>
                            </div>

                            <div className="py-3 border-b">
                                <div className="text-gray-600 mb-2">Servicios:</div>
                                <div className="space-y-1">
                                    {selectedServices.map(serviceId => {
                                        const service = services.find(s => s.id === serviceId);
                                        return (
                                            <div key={serviceId} className="flex justify-between text-sm">
                                                <span>{service?.name}</span>
                                                <span className="text-gold-600">{formatPrice(service?.price)}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="flex justify-between py-3 border-b">
                                <span className="text-gray-600">Duración estimada:</span>
                                <span className="font-semibold">{getTotalDuration()} minutos</span>
                            </div>

                            <div className="flex justify-between py-3 text-lg font-display font-bold">
                                <span>Total:</span>
                                <span className="text-gold-600">{formatPrice(getTotalPrice())}</span>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="text-sm text-gray-600 mb-1">Contacto:</div>
                                <div className="text-sm font-medium">{contactInfo.name}</div>
                                <div className="text-sm text-gray-600">{contactInfo.email}</div>
                                <div className="text-sm text-gray-600">{contactInfo.phone}</div>
                            </div>
                        </div>

                        <button
                            onClick={handleConfirm}
                            className="btn-primary w-full mt-6"
                        >
                            Confirmar Reserva
                        </button>
                    </div>
                );

            default:
                return null;
        }
    };

    const stepTitles = [
        'Selecciona los servicios',
        'Selecciona tu barbero',
        'Selecciona la fecha',
        'Selecciona el horario',
        'Información de contacto',
        'Confirmación'
    ];

    return (
        <div className="max-w-4xl mx-auto">
            {/* Progress bar */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-2">
                    <h2 className="text-2xl font-display font-bold">
                        {stepTitles[currentStep]}
                    </h2>
                    <span className="text-sm text-gray-600">
                        Paso {currentStep + 1} de {stepTitles.length}
                    </span>
                </div>

                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-gold transition-all duration-500"
                        style={{ width: `${((currentStep + 1) / stepTitles.length) * 100}%` }}
                    />
                </div>
            </div>

            {/* Step content */}
            <div className="mb-8 animate-fade-in">
                {renderStep()}
            </div>

            {/* Navigation buttons */}
            {currentStep !== STEPS.CONFIRMATION && (
                <div className="flex items-center justify-between">
                    <button
                        onClick={handleBack}
                        disabled={currentStep === STEPS.SERVICES}
                        className="btn-outline flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <ChevronLeft className="w-5 h-5" />
                        Anterior
                    </button>

                    <button
                        onClick={handleNext}
                        className="btn-primary flex items-center gap-2"
                    >
                        Siguiente
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            )}
        </div>
    );
}
