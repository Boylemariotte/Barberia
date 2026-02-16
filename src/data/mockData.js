// Mock data for the barbershop application

export const barbers = [
    {
        id: 1,
        name: "Carlos Mendoza",
        specialty: "Cortes Clásicos y Modernos",
        photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
        rating: 4.9,
        experience: "8 años",
        description: "Especialista en cortes clásicos y fade moderno"
    },
    {
        id: 2,
        name: "Miguel Ángel Torres",
        specialty: "Barbería Tradicional",
        photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
        rating: 4.8,
        experience: "12 años",
        description: "Experto en afeitado clásico y barba"
    },
    {
        id: 3,
        name: "Diego Ramírez",
        specialty: "Diseños y Estilos Creativos",
        photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop",
        rating: 4.9,
        experience: "6 años",
        description: "Creativo con diseños únicos y tendencias"
    },
    {
        id: 4,
        name: "Andrés Vargas",
        specialty: "Coloración y Tintes",
        photo: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop",
        rating: 4.7,
        experience: "10 años",
        description: "Especialista en color y tratamientos capilares"
    }
];

export const services = [
    {
        id: 1,
        name: "Corte de Cabello",
        description: "Corte profesional adaptado a tu estilo con lavado incluido",
        price: 25000,
        duration: 30,
        icon: "scissors"
    },
    {
        id: 2,
        name: "Arreglo de Barba",
        description: "Perfilado, hidratación y arreglo de barba con navaja",
        price: 15000,
        duration: 20,
        icon: "razor"
    },
    {
        id: 3,
        name: "Corte + Barba",
        description: "Combo completo: corte de cabello y arreglo de barba",
        price: 35000,
        duration: 50,
        icon: "package"
    },
    {
        id: 4,
        name: "Afeitado Clásico",
        description: "Afeitado tradicional con toalla caliente y espuma premium",
        price: 20000,
        duration: 30,
        icon: "sparkles"
    },
    {
        id: 5,
        name: "Tinte de Cabello",
        description: "Coloración profesional y cubrimiento de canas",
        price: 45000,
        duration: 60,
        icon: "palette"
    },
    {
        id: 6,
        name: "Limpieza Facial",
        description: "Exfoliación y mascarilla hidratante para caballero",
        price: 30000,
        duration: 40,
        icon: "star"
    }
];

export const businessHours = {
    monday: { open: "09:00", close: "19:00" },
    tuesday: { open: "09:00", close: "19:00" },
    wednesday: { open: "09:00", close: "19:00" },
    thursday: { open: "09:00", close: "19:00" },
    friday: { open: "09:00", close: "20:00" },
    saturday: { open: "08:00", close: "19:00" },
    sunday: { open: "09:00", close: "14:00" }
};

export const slotDuration = 30; // minutes

// Sample appointments for demonstration
const today = new Date().toISOString().split('T')[0];
const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

export const sampleAppointments = [
    {
        id: "apt-1",
        barberId: 1,
        clientName: "Juan Pérez",
        clientEmail: "juan@example.com",
        clientPhone: "3001234567",
        date: today,
        time: "10:00",
        services: [1, 2],
        status: "confirmed",
        createdAt: new Date().toISOString()
    },
    {
        id: "apt-2",
        barberId: 2,
        clientName: "Pedro González",
        clientEmail: "pedro@example.com",
        clientPhone: "3009876543",
        date: today,
        time: "14:30",
        services: [3],
        status: "confirmed",
        createdAt: new Date().toISOString()
    },
    {
        id: "apt-3",
        barberId: 3,
        clientName: "Luis Martínez",
        clientEmail: "luis@example.com",
        clientPhone: "3005551234",
        date: tomorrow,
        time: "09:00",
        services: [1],
        status: "confirmed",
        createdAt: new Date().toISOString()
    },
    {
        id: "apt-4",
        barberId: 1,
        clientName: "Carlos Ruiz",
        clientEmail: "carlos@example.com",
        clientPhone: "3011112233",
        date: tomorrow,
        time: "11:30",
        services: [4],
        status: "confirmed",
        createdAt: new Date().toISOString()
    },
    {
        id: "apt-5",
        barberId: 4,
        clientName: "Andrés Bello",
        clientEmail: "andres@example.com",
        clientPhone: "3104445566",
        date: yesterday,
        time: "15:00",
        services: [1, 6],
        status: "completed",
        createdAt: new Date(Date.now() - 172800000).toISOString()
    }
];

// Admin credentials (in production, this would be handled by backend)
export const adminCredentials = {
    email: "admin@barberia.com",
    password: "admin123"
};
