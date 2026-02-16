import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { BookingProvider } from './context/BookingContext';
import { ToastProvider } from './components/common/Toast';
import { Header } from './components/common/Header';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { BookingPage } from './pages/BookingPage';
import { MyAppointments } from './pages/MyAppointments';
import { AdminPanel } from './pages/AdminPanel';
import { Catalogue } from './pages/Catalogue';
import { Dashboard } from './components/admin/Dashboard';
import { AppointmentsList } from './components/admin/AppointmentsList';
import { BarberManagement } from './components/admin/BarberManagement';
import { Settings } from './components/admin/Settings';
import { CatalogueManagement } from './components/admin/CatalogueManagement';

function App() {
    return (
        <BrowserRouter>
            <ToastProvider>
                <AuthProvider>
                    <BookingProvider>
                        <Routes>
                            {/* Public routes */}
                            <Route path="/login" element={<Login />} />

                            {/* Routes with header */}
                            <Route path="/*" element={
                                <>
                                    <Header />
                                    <Routes>
                                        <Route path="/" element={<Home />} />
                                        <Route path="/catalogue" element={<Catalogue />} />
                                        <Route path="/booking" element={<BookingPage />} />
                                        <Route path="/my-appointments" element={<MyAppointments />} />

                                        {/* Admin routes */}
                                        <Route path="/admin" element={<AdminPanel><Dashboard /></AdminPanel>} />
                                        <Route path="/admin/appointments" element={<AdminPanel><AppointmentsList /></AdminPanel>} />
                                        <Route path="/admin/barbers" element={<AdminPanel><BarberManagement /></AdminPanel>} />
                                        <Route path="/admin/catalogue" element={<AdminPanel><CatalogueManagement /></AdminPanel>} />
                                        <Route path="/admin/settings" element={<AdminPanel><Settings /></AdminPanel>} />
                                    </Routes>
                                </>
                            } />
                        </Routes>
                    </BookingProvider>
                </AuthProvider>
            </ToastProvider>
        </BrowserRouter>
    );
}

export default App;
