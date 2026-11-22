import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Calendar,
  Clock,
  Car,
  Star,
  ShieldCheck,
  ArrowLeft,
  AlertCircle
} from 'lucide-react';
import PageHeader from '../components/PageHeader';
import Button from '../components/Button';
import StatusBadge from '../components/StatusBadge';
import ConfirmDialog from '../components/ConfirmDialog';
import EmptyState from '../components/EmptyState';
import RoutePreview from '../components/RoutePreview';
import { getAvailableSeats, getRideStatus } from '../data/mockRides';
import useRides from '../hooks/useRides';
import useAuth from '../hooks/useAuth';
import useNotification from '../hooks/useNotification';

export default function RideDetails() {
  const { id } = useParams();
  const { rides, joinRide } = useRides();
  const { user, isAuthenticated } = useAuth();
  const { showNotification } = useNotification();

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  // Find ride from dynamic state
  const ride = (rides || []).find((r) => String(r.id) === String(id));

  if (!ride) {
    return (
      <div className="container" style={{ padding: '4rem 1.5rem' }}>
        <EmptyState
          title="Ride Not Found"
          description={`We could not find a ride matching ID #${id}. It may have been removed or cancelled.`}
          actionLabel="Browse Available Rides"
          actionTo="/find-ride"
        />
      </div>
    );
  }

  // Dynamic calculations
  const availableSeats = getAvailableSeats(ride);
  const status = getRideStatus(ride);
  const isFull = availableSeats <= 0;
  const isCancelled = status === 'Cancelled';
  const isDriver = user && (user.id === ride.driverId || user.name === ride.driverName);

  const handleJoinClick = () => {
    if (!isAuthenticated) {
      showNotification('Please log in with your college credentials to join a ride', 'warning');
      return;
    }
    if (isDriver) {
      showNotification('You are the host driver of this ride', 'info');
      return;
    }
    setIsConfirmOpen(true);
  };

  const handleConfirmJoin = () => {
    joinRide(ride.id, 1, user);
    showNotification(`✓ Successfully booked 1 seat on ${ride.from} → ${ride.to}`, 'success');
    setIsConfirmOpen(false);
  };

  return (
    <div className="ride-details-page">
      <PageHeader
        title={`${ride.from} → ${ride.to}`}
        description="Comprehensive trip route, driver information, and seat reservations."
        badge={<StatusBadge status={status} />}
        actions={
          <Button variant="secondary" size="sm" to="/find-ride" icon={<ArrowLeft size={15} />}>
            Back to Rides
          </Button>
        }
      />

      <div className="container" style={{ maxWidth: '960px', marginBottom: '4rem' }}>
        {isCancelled && (
          <div className="alert-banner alert-danger" role="alert">
            <AlertCircle size={20} />
            <div>
              <strong>This ride has been cancelled by the driver.</strong> No further seat reservations can be accepted.
            </div>
          </div>
        )}

        <div className="ride-details-grid">
          {/* Left Column: Itinerary, Visual Route & Vehicle Details */}
          <div className="flex flex-col gap-6">
            {/* Visual Route Timeline */}
            <div className="card">
              <div className="flex items-center justify-between" style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.85rem', marginBottom: '1.25rem' }}>
                <span className="status-badge badge-active">Route Waypoints</span>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Ride #{ride.id}
                </span>
              </div>

              {/* Waypoint Timeline Component */}
              <RoutePreview
                from={ride.from}
                to={ride.to}
                pickupPoint={ride.pickupPoint}
                dropoffPoint={ride.dropoffPoint}
                distance="16 km"
                estimatedDuration="35 mins"
              />

              {/* Metrics Grid */}
              <div className="ride-metrics-grid">
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Date</div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--primary-900)' }}>
                    {ride.formattedDate || ride.date}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Departure</div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--primary-900)' }}>
                    {ride.time}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Available Seats</div>
                  <div style={{ fontWeight: 800, fontSize: '0.95rem', color: isFull ? 'var(--rose-600)' : 'var(--emerald-600)' }}>
                    {isCancelled ? '0 (Cancelled)' : isFull ? 'Full (0 left)' : `${availableSeats} of ${ride.seats} available`}
                  </div>
                </div>
              </div>

              {/* Notes */}
              {ride.notes && (
                <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-subtle)' }}>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.35rem', color: 'var(--primary-900)' }}>
                    Driver's Notes
                  </h4>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    "{ride.notes}"
                  </p>
                </div>
              )}
            </div>

            {/* Vehicle Card */}
            <div className="card">
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--primary-900)' }}>
                Vehicle Details
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.9rem' }}>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Type:</span>{' '}
                  <strong>{ride.vehicleType}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Model:</span>{' '}
                  <strong>{ride.vehicleModel}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Registration:</span>{' '}
                  <strong>{ride.vehicleNumber || 'Verified Registration'}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Total Capacity:</span>{' '}
                  <strong>{ride.seats} seats</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Driver & Booking Actions */}
          <div className="flex flex-col gap-6">
            {/* Driver Profile with student image */}
            <div className="card" style={{ textAlign: 'center' }}>
              <img
                src={ride.driverAvatar || '/assets/student-driver.jpg'}
                alt={ride.driverName}
                style={{
                  width: 88,
                  height: 88,
                  borderRadius: '50%',
                  objectFit: 'cover',
                  margin: '0 auto 1rem',
                  border: '3px solid var(--accent-500)',
                  boxShadow: 'var(--shadow-md)'
                }}
              />
              <div className="flex items-center justify-center gap-1">
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--primary-900)' }}>
                  {ride.driverName}
                </h3>
                {ride.verifiedStudent && (
                  <ShieldCheck size={18} color="var(--accent-600)" title="Verified Student" />
                )}
              </div>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                {ride.department || 'Student Driver'}
              </p>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                {ride.college}
              </p>

              {ride.rating && (
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    backgroundColor: '#fef3c7',
                    color: '#b45309',
                    padding: '0.3rem 0.75rem',
                    borderRadius: 'var(--radius-full)',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    marginTop: '0.85rem'
                  }}
                >
                  <Star size={14} fill="#b45309" color="#b45309" />
                  <span>{Number(ride.rating).toFixed(1)}</span>
                  <span style={{ color: '#92400e', fontWeight: 500 }}>
                    ({ride.reviewCount || 1} reviews)
                  </span>
                </div>
              )}
            </div>

            {/* Action Box */}
            <div className="card">
              <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>
                Contribution per Passenger
              </span>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary-900)', fontFamily: 'var(--font-heading)', margin: '0.25rem 0 1rem' }}>
                ₹{ride.contribution}{' '}
                <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-muted)' }}>
                  / seat
                </span>
              </div>

              {isCancelled ? (
                <Button variant="subtle" size="lg" fullWidth disabled>
                  Ride Cancelled
                </Button>
              ) : isDriver ? (
                <div className="flex flex-col gap-2">
                  <div style={{ fontSize: '0.85rem', color: 'var(--accent-700)', background: 'var(--accent-50)', padding: '0.5rem', borderRadius: 'var(--radius-sm)', textAlign: 'center', fontWeight: 600 }}>
                    You are the host driver of this ride
                  </div>
                  <Button variant="secondary" size="lg" fullWidth to="/my-rides">
                    Manage in My Rides
                  </Button>
                </div>
              ) : isFull ? (
                <Button variant="subtle" size="lg" fullWidth disabled>
                  Ride Full
                </Button>
              ) : (
                <Button
                  variant="accent"
                  size="lg"
                  fullWidth
                  onClick={handleJoinClick}
                >
                  Join This Ride
                </Button>
              )}

              <p style={{ fontSize: '0.75rem', color: 'var(--text-light)', textAlign: 'center', marginTop: '0.75rem' }}>
                CampusRide verified student community • Cash or UPI split on arrival
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Join Ride Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isConfirmOpen}
        title="Join this ride?"
        message="Please confirm your seat reservation request for this campus route:"
        details={
          <div className="flex flex-col gap-2" style={{ fontSize: '0.9rem' }}>
            <div style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--primary-900)' }}>
              {ride.from} → {ride.to}
            </div>
            <div className="flex items-center gap-4" style={{ color: 'var(--text-secondary)' }}>
              <span className="flex items-center gap-1">
                <Calendar size={14} /> {ride.formattedDate || ride.date}
              </span>
              <span className="flex items-center gap-1">
                <Clock size={14} /> {ride.time}
              </span>
            </div>
            <div className="flex items-center justify-between" style={{ marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid var(--border-subtle)' }}>
              <span style={{ color: 'var(--text-muted)' }}>Driver: <strong>{ride.driverName}</strong></span>
              <span style={{ fontWeight: 800, color: 'var(--primary-900)', fontSize: '1.05rem' }}>₹{ride.contribution} contribution</span>
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--accent-600)', fontWeight: 600 }}>
              Passenger: {user?.name} (1 seat reserved)
            </div>
          </div>
        }
        confirmLabel="Confirm Booking"
        cancelLabel="Cancel"
        confirmVariant="accent"
        onConfirm={handleConfirmJoin}
        onCancel={() => setIsConfirmOpen(false)}
        icon={<Car size={22} color="var(--accent-600)" />}
      />
    </div>
  );
}
