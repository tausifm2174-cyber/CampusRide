import React from 'react';
import { Calendar, Clock, Users, Car, Star, ArrowRight, ShieldCheck } from 'lucide-react';
import StatusBadge from './StatusBadge';
import Button from './Button';
import { getAvailableSeats, getRideStatus } from '../data/mockRides';

/**
 * Reusable RideCard Component
 * Renders comprehensive ride information passed via props
 * Dynamically computes available seats, driver persona, and conditional actions
 */
export default function RideCard({
  ride,
  onJoinClick = null,
  showJoinButton = true,
  currentUserId = null,
  currentUserName = null,
  className = ''
}) {
  if (!ride) return null;

  // Dynamically calculate available seats & status
  const availableSeats = getAvailableSeats(ride);
  const status = getRideStatus(ride);
  const isFull = availableSeats <= 0;
  const isCancelled = status === 'Cancelled';
  const isElectric = ride.vehicleType?.toLowerCase().includes('electric') || ride.vehicleModel?.toLowerCase().includes('ev');

  // Check if current user is the driver
  const isDriver = (currentUserId && ride.driverId === currentUserId) ||
                   (currentUserName && ride.driverName === currentUserName);

  return (
    <div className={`ride-card card-hover ${className}`} style={{ opacity: isCancelled ? 0.75 : 1 }}>
      {/* Header: Driver info, student image and status badges */}
      <div className="ride-card-header">
        <div className="driver-info">
          <img
            src={ride.driverAvatar || '/assets/student-driver.jpg'}
            alt={ride.driverName}
            className="driver-avatar"
            loading="lazy"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="driver-name">{ride.driverName}</span>
              {ride.verifiedStudent && (
                <ShieldCheck
                  size={15}
                  color="var(--accent-600)"
                  title="Verified Student Driver"
                />
              )}
            </div>
            <div className="driver-dept">{ride.department || ride.college || 'Verified Student Driver'}</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isElectric && <StatusBadge status="Electric" customLabel="Eco Ride" />}
          <StatusBadge status={status} />
          {ride.rating && (
            <div className="driver-rating" title={`${ride.reviewCount || 0} reviews`}>
              <Star size={13} fill="#b45309" color="#b45309" />
              <span>{Number(ride.rating).toFixed(1)}</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Route Section */}
      <div className="route-section">
        <div className="route-main">
          <span>{ride.from}</span>
          <ArrowRight size={18} className="route-arrow" aria-hidden="true" />
          <span>{ride.to}</span>
        </div>

        <div className="route-meta">
          <span className="meta-item">
            <Calendar size={14} color="var(--text-muted)" />
            <span>{ride.formattedDate || ride.date}</span>
          </span>
          <span className="meta-item">
            <Clock size={14} color="var(--text-muted)" />
            <span>{ride.time}</span>
          </span>
          <span className="meta-item">
            <Users size={14} color="var(--text-muted)" />
            <span>
              {isCancelled ? (
                <strong style={{ color: 'var(--rose-600)' }}>Cancelled</strong>
              ) : isFull ? (
                <strong style={{ color: 'var(--rose-600)' }}>Full (0 left)</strong>
              ) : (
                <strong>{availableSeats} seat{availableSeats > 1 ? 's' : ''} available</strong>
              )}
            </span>
          </span>
          <span className="meta-item">
            <Car size={14} color="var(--text-muted)" />
            <span>{ride.vehicleModel || ride.vehicleType}</span>
          </span>
        </div>
      </div>

      {/* Card Footer: Contribution & Action */}
      <div className="ride-card-footer">
        <div className="fare-block">
          <span className="fare-label">Passenger Contribution</span>
          <span className="fare-amount">₹{ride.contribution}</span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            to={`/ride/${ride.id}`}
          >
            View Ride
          </Button>

          {showJoinButton && !isCancelled && (
            isDriver ? (
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: 'var(--accent-700)',
                  background: 'var(--accent-50)',
                  padding: '0.35rem 0.65rem',
                  borderRadius: 'var(--radius-sm)'
                }}
              >
                Your Ride
              </span>
            ) : isFull ? (
              <Button
                variant="subtle"
                size="sm"
                disabled
              >
                Ride Full
              </Button>
            ) : onJoinClick ? (
              <Button
                variant="accent"
                size="sm"
                onClick={() => onJoinClick(ride)}
              >
                Join Ride
              </Button>
            ) : (
              <Button
                variant="accent"
                size="sm"
                to={`/ride/${ride.id}`}
              >
                Join Ride
              </Button>
            )
          )}
        </div>
      </div>
    </div>
  );
}
