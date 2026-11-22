import React, { useState } from 'react';
import { Eye, Calendar, Clock, AlertTriangle, Star } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import Button from '../components/Button';
import Sidebar from '../components/Sidebar';
import StatusBadge from '../components/StatusBadge';
import ConfirmDialog from '../components/ConfirmDialog';
import RatingModal from '../components/RatingModal';
import EmptyState from '../components/EmptyState';
import useRides from '../hooks/useRides';
import useAuth from '../hooks/useAuth';
import useNotification from '../hooks/useNotification';

export default function Bookings() {
  const { bookings, cancelBooking, rateRide } = useRides();
  const { user } = useAuth();
  const { showNotification } = useNotification();

  const [cancellingBooking, setCancellingBooking] = useState(null);
  const [ratingBooking, setRatingBooking] = useState(null);

  // Filter user's bookings
  const userBookings = (bookings || []).filter(
    (b) => (user && b.passengerId === user.id) || (user && b.passengerName === user.name)
  );

  const handleOpenCancel = (booking) => {
    setCancellingBooking(booking);
  };

  const handleConfirmCancel = () => {
    if (cancellingBooking) {
      cancelBooking(cancellingBooking.id);
      showNotification(`✓ Booking #${cancellingBooking.id} cancelled. 1 seat restored.`, 'info');
      setCancellingBooking(null);
    }
  };

  const handleOpenRating = (booking) => {
    setRatingBooking(booking);
  };

  const handleSubmitRating = (bookingId, rideId, rating, _comment) => {
    rateRide(bookingId, rideId, rating);
    showNotification(`✓ Thank you! Rated ${rating} ⭐ for ${ratingBooking?.driver}`, 'success');
    setRatingBooking(null);
  };

  return (
    <div className="bookings-page">
      <PageHeader
        title="My Booked Rides"
        description="Track your reserved seats with student drivers across campus routes."
        actions={
          <Button variant="accent" size="sm" to="/find-ride">
            Find Another Ride
          </Button>
        }
      />

      <div className="container" style={{ marginBottom: '4rem' }}>
        <div className="portal-layout">
          <div className="portal-sidebar">
            <Sidebar />
          </div>

          <div className="portal-content">
            {userBookings.length > 0 ? (
              <>
                {/* Desktop Table View */}
                <div className="desktop-table-view">
                  <div className="table-responsive">
                    <table className="custom-table">
                      <thead>
                        <tr>
                          <th>Ride Route</th>
                          <th>Driver</th>
                          <th>Date</th>
                          <th>Time</th>
                          <th>Contribution</th>
                          <th>Status</th>
                          <th style={{ textAlign: 'right' }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {userBookings.map((b) => {
                          const isCancelled = b.status === 'Cancelled';
                          const isCompleted = b.status === 'Completed';
                          const hasRated = Boolean(b.ratingGiven);

                          return (
                            <tr key={b.id} style={{ opacity: isCancelled ? 0.7 : 1 }}>
                              <td>
                                <strong style={{ color: 'var(--primary-900)' }}>{b.route}</strong>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                  Pickup: {b.pickup || 'Campus Stop'} • {b.seatsBooked || 1} seat
                                </div>
                              </td>
                              <td>
                                <div style={{ fontWeight: 600 }}>{b.driver}</div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                  {b.vehicle}
                                </div>
                              </td>
                              <td>
                                <div className="flex items-center gap-1">
                                  <Calendar size={13} color="var(--text-muted)" />
                                  <span>{b.date}</span>
                                </div>
                              </td>
                              <td>
                                <div className="flex items-center gap-1">
                                  <Clock size={13} color="var(--text-muted)" />
                                  <span>{b.time}</span>
                                </div>
                              </td>
                              <td>
                                <strong style={{ color: 'var(--primary-900)', fontSize: '0.95rem' }}>
                                  ₹{b.contribution}
                                </strong>
                              </td>
                              <td>
                                <StatusBadge status={b.status} />
                              </td>
                              <td style={{ textAlign: 'right' }}>
                                <div className="flex items-center justify-end gap-1">
                                  <Button
                                    variant="secondary"
                                    size="sm"
                                    to={`/ride/${b.rideId}`}
                                    title="View Ride Details"
                                  >
                                    <Eye size={14} />
                                  </Button>

                                  {isCompleted && !hasRated && (
                                    <Button
                                      variant="accent"
                                      size="sm"
                                      onClick={() => handleOpenRating(b)}
                                      title="Rate Driver"
                                      icon={<Star size={13} fill="currentColor" />}
                                    >
                                      Rate
                                    </Button>
                                  )}

                                  {isCompleted && hasRated && (
                                    <span style={{ fontSize: '0.75rem', color: '#b45309', fontWeight: 700, padding: '0.2rem 0.5rem', background: '#fef3c7', borderRadius: '4px' }}>
                                      Rated {b.ratingGiven} ⭐
                                    </span>
                                  )}

                                  {!isCancelled && !isCompleted && (
                                    <Button
                                      variant="subtle"
                                      size="sm"
                                      onClick={() => handleOpenCancel(b)}
                                      title="Cancel Booking"
                                      style={{ color: 'var(--rose-600)' }}
                                    >
                                      Cancel
                                    </Button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Mobile Cards View */}
                <div className="mobile-cards-view">
                  {userBookings.map((b) => {
                    const isCancelled = b.status === 'Cancelled';
                    const isCompleted = b.status === 'Completed';
                    const hasRated = Boolean(b.ratingGiven);

                    return (
                      <div key={`m-book-${b.id}`} className="mobile-record-card card" style={{ opacity: isCancelled ? 0.8 : 1 }}>
                        <div className="flex items-center justify-between" style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.65rem', marginBottom: '0.75rem' }}>
                          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-600)' }}>
                            Booking #{b.id}
                          </span>
                          <StatusBadge status={b.status} />
                        </div>

                        <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--primary-900)', marginBottom: '0.35rem' }}>
                          {b.route}
                        </div>

                        <div className="flex items-center gap-3" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
                          <span className="flex items-center gap-1">
                            <Calendar size={13} color="var(--text-muted)" />
                            {b.date}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Clock size={13} color="var(--text-muted)" />
                            {b.time}
                          </span>
                        </div>

                        <div className="mobile-stats-row">
                          <div className="mobile-stat-cell">
                            <span className="mobile-stat-label">Driver</span>
                            <span className="mobile-stat-value" style={{ fontSize: '0.875rem' }}>{b.driver}</span>
                          </div>
                          <div className="mobile-stat-cell">
                            <span className="mobile-stat-label">Vehicle</span>
                            <span className="mobile-stat-value" style={{ fontSize: '0.85rem' }}>{b.vehicle}</span>
                          </div>
                          <div className="mobile-stat-cell">
                            <span className="mobile-stat-label">Contribution</span>
                            <span className="mobile-stat-value">₹{b.contribution}</span>
                          </div>
                          <div className="mobile-stat-cell">
                            <span className="mobile-stat-label">Pickup</span>
                            <span className="mobile-stat-value" style={{ fontSize: '0.85rem' }}>{b.pickup || 'Stop'}</span>
                          </div>
                        </div>

                        <div className="mobile-record-actions">
                          <Button
                            variant="secondary"
                            size="sm"
                            to={`/ride/${b.rideId}`}
                            icon={<Eye size={14} />}
                          >
                            View Details
                          </Button>

                          {isCompleted && !hasRated && (
                            <Button
                              variant="accent"
                              size="sm"
                              onClick={() => handleOpenRating(b)}
                              icon={<Star size={13} fill="currentColor" />}
                            >
                              Rate Driver
                            </Button>
                          )}

                          {isCompleted && hasRated && (
                            <span style={{ fontSize: '0.8rem', color: '#b45309', fontWeight: 700, padding: '0.3rem 0.65rem', background: '#fef3c7', borderRadius: 'var(--radius-sm)' }}>
                              Rated {b.ratingGiven} ⭐
                            </span>
                          )}

                          {!isCancelled && !isCompleted && (
                            <Button
                              variant="subtle"
                              size="sm"
                              onClick={() => handleOpenCancel(b)}
                              style={{ color: 'var(--rose-600)' }}
                            >
                              Cancel Booking
                            </Button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            ) : (
              <EmptyState
                title="No active bookings found"
                description={`You (${user?.name}) have not joined any campus rides yet. Search for routes to SJBIT and reserve your seat.`}
                actionLabel="Explore Available Rides"
                actionTo="/find-ride"
              />
            )}
          </div>
        </div>
      </div>

      {/* Cancel Booking Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(cancellingBooking)}
        title="Cancel this booking?"
        message="Are you sure you want to cancel your seat reservation for this ride? The driver will be notified and your seat released."
        details={
          cancellingBooking && (
            <div style={{ fontSize: '0.9rem' }}>
              <strong>{cancellingBooking.route}</strong>
              <div style={{ color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                {cancellingBooking.date} at {cancellingBooking.time} • Driver: {cancellingBooking.driver}
              </div>
              <div style={{ color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                Contribution: ₹{cancellingBooking.contribution} (1 seat)
              </div>
            </div>
          )
        }
        confirmLabel="Cancel Booking"
        cancelLabel="Keep Booking"
        confirmVariant="secondary"
        onConfirm={handleConfirmCancel}
        onCancel={() => setCancellingBooking(null)}
        icon={<AlertTriangle size={22} color="var(--amber-600)" />}
      />

      {/* Driver Rating & Review Modal */}
      <RatingModal
        isOpen={Boolean(ratingBooking)}
        booking={ratingBooking}
        onSubmitRating={handleSubmitRating}
        onClose={() => setRatingBooking(null)}
      />
    </div>
  );
}
