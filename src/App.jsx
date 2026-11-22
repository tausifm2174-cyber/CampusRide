import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import Notification from './components/Notification';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import FindRide from './pages/FindRide';
import OfferRide from './pages/OfferRide';
import RideDetails from './pages/RideDetails';
import MyRides from './pages/MyRides';
import Bookings from './pages/Bookings';
import History from './pages/History';
import Profile from './pages/Profile';
import EmptyState from './components/EmptyState';

/**
 * CampusRide - Main Application Component
 * Phase 3: Context API, useReducer, Custom Hooks, Protected Routes & Authentication
 */
export default function App() {
  return (
    <div className="app-container">
      {/* Toast Notification Container */}
      <Notification />

      {/* Global Navigation Header (Connected to AuthContext) */}
      <Header />

      {/* Main Routed Content Area */}
      <main className="main-content">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/find-ride" element={<FindRide />} />
          <Route path="/ride/:id" element={<RideDetails />} />

          {/* Protected Routes (Require Student Authentication) */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/offer-ride"
            element={
              <ProtectedRoute>
                <OfferRide />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-rides"
            element={
              <ProtectedRoute>
                <MyRides />
              </ProtectedRoute>
            }
          />
          <Route
            path="/bookings"
            element={
              <ProtectedRoute>
                <Bookings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/history"
            element={
              <ProtectedRoute>
                <History />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* Catch-all 404 Route */}
          <Route
            path="*"
            element={
              <div className="container" style={{ padding: '4rem 0' }}>
                <EmptyState
                  title="Page Not Found"
                  description="The page you are looking for does not exist or has been moved."
                  actionLabel="Back to Home"
                  actionTo="/"
                />
              </div>
            }
          />
        </Routes>
      </main>

      {/* Global Footer */}
      <Footer />
    </div>
  );
}
