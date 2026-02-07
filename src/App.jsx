import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Rooms from './pages/Rooms';
import Reservation from './pages/Reservation';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import FAQ from './pages/FAQ';

import Dashboard from './pages/dashboard/Dashboard';
import MyBookings from './pages/dashboard/MyBookings';
import AdminOverview from './pages/admin/AdminOverview';
import AdminBookings from './pages/admin/AdminBookings';
import AdminHousekeeping from './pages/admin/AdminHousekeeping';
import AdminGuests from './pages/admin/AdminGuests';
import AdminReviews from './pages/admin/AdminReviews';
import AdminRooms from './pages/admin/AdminRooms';
import AdminSettings from './pages/admin/AdminSettings';
import AdminLayout from './pages/admin/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="app">
          <Navbar />
          <main className="main-content">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/faq" element={<FAQ />} />

              {/* Protected Routes - Require Authentication */}
              <Route path="/rooms" element={
                <ProtectedRoute>
                  <Rooms />
                </ProtectedRoute>
              } />
              <Route path="/reservation" element={
                <ProtectedRoute>
                  <Reservation />
                </ProtectedRoute>
              } />
              <Route path="/about" element={
                <ProtectedRoute>
                  <About />
                </ProtectedRoute>
              } />
              <Route path="/contact" element={
                <ProtectedRoute>
                  <Contact />
                </ProtectedRoute>
              } />



              {/* User Dashboard */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }>
                <Route index element={<MyBookings />} />
              </Route>

              {/* Admin Routes */}
              <Route path="/admin" element={
                <ProtectedRoute role="admin">
                  <AdminLayout />
                </ProtectedRoute>
              }>
                <Route index element={<AdminOverview />} />
                <Route path="bookings" element={<AdminBookings />} />
                <Route path="housekeeping" element={<AdminHousekeeping />} />
                <Route path="guests" element={<AdminGuests />} />
                <Route path="reviews" element={<AdminReviews />} />
                <Route path="rooms" element={<AdminRooms />} />
                <Route path="settings" element={<AdminSettings />} />
              </Route>
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </Router >
  );
}

export default App;
