import React, { createContext, useState, useEffect } from 'react';
import { barbers, services, businessHours, slotDuration, sampleAppointments } from '../data/mockData';
import { generateTimeSlots, getDayOfWeek } from '../lib/utils';

export const BookingContext = createContext();

export function BookingProvider({ children }) {
    const [appointments, setAppointments] = useState([]);
    const [barbersList, setBarbersList] = useState([]);
    const [servicesList, setServicesList] = useState([]);
    const [hoursConfig, setHoursConfig] = useState({});
    const [catalogueItems, setCatalogueItems] = useState([]);

    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);
    const [selectedBarber, setSelectedBarber] = useState(null);
    const [selectedServices, setSelectedServices] = useState([]);

    // Load data from localStorage on mount
    useEffect(() => {
        // Appointments
        const storedAppointments = localStorage.getItem('appointments');
        if (storedAppointments) {
            setAppointments(JSON.parse(storedAppointments));
        } else {
            setAppointments(sampleAppointments);
            localStorage.setItem('appointments', JSON.stringify(sampleAppointments));
        }

        // Barbers
        const storedBarbers = localStorage.getItem('barbers');
        if (storedBarbers) {
            setBarbersList(JSON.parse(storedBarbers));
        } else {
            setBarbersList(barbers);
            localStorage.setItem('barbers', JSON.stringify(barbers));
        }

        // Services
        const storedServices = localStorage.getItem('services');
        if (storedServices) {
            setServicesList(JSON.parse(storedServices));
        } else {
            setServicesList(services);
            localStorage.setItem('services', JSON.stringify(services));
        }

        // Business Hours
        const storedHours = localStorage.getItem('businessHours');
        if (storedHours) {
            setHoursConfig(JSON.parse(storedHours));
        } else {
            setHoursConfig(businessHours);
            localStorage.setItem('businessHours', JSON.stringify(businessHours));
        }

        // Catalogue
        const storedCatalogue = localStorage.getItem('catalogue');
        if (storedCatalogue) {
            setCatalogueItems(JSON.parse(storedCatalogue));
        }
    }, []);

    // Save appointments to localStorage whenever they change
    useEffect(() => {
        if (appointments.length > 0) {
            localStorage.setItem('appointments', JSON.stringify(appointments));
        }
    }, [appointments]);

    // Save other data to localStorage
    useEffect(() => {
        if (barbersList.length > 0) localStorage.setItem('barbers', JSON.stringify(barbersList));
    }, [barbersList]);

    useEffect(() => {
        if (servicesList.length > 0) localStorage.setItem('services', JSON.stringify(servicesList));
    }, [servicesList]);

    useEffect(() => {
        if (Object.keys(hoursConfig).length > 0) localStorage.setItem('businessHours', JSON.stringify(hoursConfig));
    }, [hoursConfig]);

    useEffect(() => {
        localStorage.setItem('catalogue', JSON.stringify(catalogueItems));
    }, [catalogueItems]);

    // Update Functions
    const updateServices = (newServices) => {
        setServicesList(newServices);
        return { success: true };
    };

    const updateBarbers = (newBarbers) => {
        setBarbersList(newBarbers);
        return { success: true };
    };

    const updateBusinessHours = (newHours) => {
        setHoursConfig(newHours);
        return { success: true };
    };

    const addCatalogueItem = (item) => {
        const newItem = {
            id: `cat-${Date.now()}`,
            ...item,
            createdAt: new Date().toISOString()
        };
        setCatalogueItems(prev => [newItem, ...prev]);
        return { success: true };
    };

    const deleteCatalogueItem = (id) => {
        setCatalogueItems(prev => prev.filter(item => item.id !== id));
        return { success: true };
    };

    // Get available time slots for a specific date and barber
    const getAvailableSlots = (date, barberId) => {
        if (!date) return [];

        const dayOfWeek = getDayOfWeek(date);
        const hours = hoursConfig[dayOfWeek];

        if (!hours) return [];

        const allSlots = generateTimeSlots(hours.open, hours.close, slotDuration);

        // Filter out booked slots
        const bookedSlots = appointments
            .filter(apt =>
                apt.date === date &&
                String(apt.barberId) === String(barberId) &&
                apt.status !== 'cancelled'
            )
            .map(apt => apt.time);

        return allSlots.filter(slot => !bookedSlots.includes(slot));
    };

    // Get appointments for a specific date
    const getAppointmentsByDate = (date) => {
        return appointments.filter(apt => apt.date === date && apt.status !== 'cancelled');
    };

    // Get appointments for a specific barber
    const getAppointmentsByBarber = (barberId) => {
        return appointments.filter(apt => apt.barberId === barberId && apt.status !== 'cancelled');
    };

    // Create a new appointment
    const createAppointment = (appointmentData) => {
        const newAppointment = {
            id: `apt-${Date.now()}`,
            ...appointmentData,
            status: 'confirmed',
            createdAt: new Date().toISOString()
        };

        setAppointments(prev => [...prev, newAppointment]);

        // Reset booking state
        resetBooking();

        return { success: true, appointment: newAppointment };
    };

    // Update appointment status
    const updateAppointmentStatus = (appointmentId, status) => {
        setAppointments(prev =>
            prev.map(apt =>
                apt.id === appointmentId ? { ...apt, status } : apt
            )
        );

        return { success: true };
    };

    // Cancel appointment
    const cancelAppointment = (appointmentId) => {
        return updateAppointmentStatus(appointmentId, 'cancelled');
    };

    // Complete appointment
    const completeAppointment = (appointmentId) => {
        return updateAppointmentStatus(appointmentId, 'completed');
    };

    // Reset booking state
    const resetBooking = () => {
        setSelectedDate(null);
        setSelectedTime(null);
        setSelectedBarber(null);
        setSelectedServices([]);
    };

    // Get total price for selected services
    const getTotalPrice = () => {
        return selectedServices.reduce((total, serviceId) => {
            const service = servicesList.find(s => s.id === serviceId);
            return total + (service?.price || 0);
        }, 0);
    };

    // Get total duration for selected services
    const getTotalDuration = () => {
        return selectedServices.reduce((total, serviceId) => {
            const service = servicesList.find(s => s.id === serviceId);
            return total + (service?.duration || 0);
        }, 0);
    };

    const value = {
        // Data
        barbers: barbersList,
        services: servicesList,
        appointments,
        businessHours: hoursConfig,

        // Booking state
        selectedDate,
        selectedTime,
        selectedBarber,
        selectedServices,
        setSelectedDate,
        setSelectedTime,
        setSelectedBarber,
        setSelectedServices,

        // Functions
        getAvailableSlots,
        getAppointmentsByDate,
        getAppointmentsByBarber,
        createAppointment,
        updateAppointmentStatus,
        cancelAppointment,
        completeAppointment,
        resetBooking,
        getTotalPrice,
        getTotalDuration,
        updateServices,
        updateBarbers,
        updateBusinessHours,
        catalogueItems,
        addCatalogueItem,
        deleteCatalogueItem
    };

    return (
        <BookingContext.Provider value={value}>
            {children}
        </BookingContext.Provider>
    );
}
