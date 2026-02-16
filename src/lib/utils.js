import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility function to merge Tailwind CSS classes
 */
export function cn(...inputs) {
    return twMerge(clsx(inputs));
}

/**
 * Format price in Colombian pesos
 */
export function formatPrice(price) {
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0
    }).format(price);
}

/**
 * Format date to readable string
 */
export function formatDate(date) {
    if (!date) return '';
    return new Intl.DateTimeFormat('es-CO', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }).format(new Date(date));
}

/**
 * Format time to 12-hour format
 */
export function formatTime(time) {
    if (!time) return '';
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
}

/**
 * Generate time slots for a given day
 */
export function generateTimeSlots(startTime, endTime, duration) {
    const slots = [];
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);

    let currentHour = startHour;
    let currentMinute = startMinute;

    while (
        currentHour < endHour ||
        (currentHour === endHour && currentMinute < endMinute)
    ) {
        const timeString = `${String(currentHour).padStart(2, '0')}:${String(currentMinute).padStart(2, '0')}`;
        slots.push(timeString);

        currentMinute += duration;
        if (currentMinute >= 60) {
            currentHour += Math.floor(currentMinute / 60);
            currentMinute = currentMinute % 60;
        }
    }

    return slots;
}

/**
 * Check if a date is today
 */
export function isToday(date) {
    const today = new Date();
    const checkDate = new Date(date);
    return (
        checkDate.getDate() === today.getDate() &&
        checkDate.getMonth() === today.getMonth() &&
        checkDate.getFullYear() === today.getFullYear()
    );
}

/**
 * Get day of week from date
 */
export function getDayOfWeek(date) {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    return days[new Date(date).getDay()];
}

/**
 * Validate email format
 */
export function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Validate Colombian phone number
 */
export function isValidPhone(phone) {
    const phoneRegex = /^3\d{9}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
}
/**
 * WhatsApp Shop Phone Number
 * Change this to the real business phone number
 */
export const BARBERIA_PHONE = '573000000000';

/**
 * CallMeBot API Key
 * Get yours at: https://www.callmebot.com/blog/free-api-whatsapp-messages/
 */
export const CALLMEBOT_API_KEY = 'YOUR_API_KEY_HERE';

/**
 * Send automatic WhatsApp message via CallMeBot
 */
export async function sendAutomaticWhatsApp(appointment) {
    const { date, time, barberName, services, totalPrice, clientName, clientPhone } = appointment;

    if (CALLMEBOT_API_KEY === 'YOUR_API_KEY_HERE') {
        console.warn('CallMeBot API Key no configurada. El mensaje no se enviará automáticamente.');
        return { success: false, error: 'API Key missing' };
    }

    const serviceNames = services.map(s => s.name).join(', ');

    const message = `¡Hola ${clientName}! 👋 Tu cita en *La Barbería* ha sido agendada con éxito.

📅 *Fecha:* ${formatDate(date)}
⏰ *Hora:* ${formatTime(time)}
💈 *Barbero:* ${barberName}
✂️ *Servicios:* ${serviceNames}
💰 *Costo Total:* ${formatPrice(totalPrice)}

¡Te esperamos! 🔥`;

    const encodedMessage = encodeURIComponent(message);

    // Limpiar el número de teléfono
    const cleanPhone = clientPhone.replace(/\s/g, '');
    const finalPhone = cleanPhone.length === 10 ? `57${cleanPhone}` : cleanPhone;

    const url = `https://api.callmebot.com/whatsapp.php?phone=${finalPhone}&text=${encodedMessage}&apikey=${CALLMEBOT_API_KEY}`;

    try {
        // Usamos mode: 'no-cors' porque CallMeBot a veces tiene problemas de CORS desde el navegador,
        // aunque lo ideal es que el servidor responda correctamente.
        await fetch(url, { mode: 'no-cors' });
        return { success: true };
    } catch (error) {
        console.error('Error enviando WhatsApp automático:', error);
        return { success: false, error };
    }
}

/**
 * Generate WhatsApp message URL for manual fallback
 */
export function getWhatsAppURL(appointment) {
    const { date, time, barberName, services, totalPrice, clientName, clientPhone } = appointment;

    const serviceNames = services.map(s => s.name).join(', ');

    const message = `¡Hola ${clientName}! 👋 Tu cita en *La Barbería* ha sido agendada con éxito.

📍 *Detalles de tu reserva:*
📅 *Fecha:* ${formatDate(date)}
⏰ *Hora:* ${formatTime(time)}
💈 *Barbero:* ${barberName}
✂️ *Servicios:* ${serviceNames}
💰 *Costo Total:* ${formatPrice(totalPrice)}

¡Te esperamos para darte el mejor estilo! 🔥`;

    const encodedMessage = encodeURIComponent(message);

    const cleanPhone = clientPhone.replace(/\s/g, '');
    const finalPhone = cleanPhone.length === 10 ? `57${cleanPhone}` : cleanPhone;

    return `https://wa.me/${finalPhone}?text=${encodedMessage}`;
}
