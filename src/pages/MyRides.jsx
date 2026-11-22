import React, { useState } from 'react';
import { PlusCircle, Eye, Edit3, XCircle, Calendar, Clock, AlertTriangle } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import Button from '../components/Button';
import Sidebar from '../components/Sidebar';
import StatusBadge from '../components/StatusBadge';
import ConfirmDialog from '../components/ConfirmDialog';
import EditRideModal from '../components/EditRideModal';
import EmptyState from '../components/EmptyState';
import { getAvailableSeats, getRideStatus } from '../data/mockRides';
import useRides from '../hooks/useRides';
import useAuth from '../hooks/useAuth';
import useNotification from '../hooks/useNotification';

export default function MyRides() {
  const { rides, editRide, cancelRide } = useRides();
  const { user } = useAuth();
  const { showNotification } = useNotification();

  const [editingRide, setEditingRide] = useState(null);
  const [cancellingRide, setCancellingRide] = useState(null);

  // Filter rides belonging to the authenticated user
  const userRides = (rides || []).filter(
    (r) => (user && r.driverId === user.id) || (user && r.driverName === user.name)
  );

  const handleOpenEdit = (ride) => {
    setEditingRide(ride);
  };

  const handleSaveEdit = (updatedRide) => {
    editRide(updatedRide);
    showNotification(`✓ Ride from ${updatedRide.from} to ${updatedRide.to} updated successfully`, 'success');
    setEditingRide(null);
  };

  const handleOpenCancel = (ride) => {
    setCancellingRide(ride);
  };

  const handleConfirmCancel = () => {
    if (cancellingRide) {
      cancelRide(cancellingRide.id);
      showNotification(`Ride #${cancellingRide.id} cancelled. Peers notified.`, 'info');
      setCancellingRide(null);
    }
  };

  return (
    <div className="my-rides-page">
      <PageHeader
        title="My Offered Rides"
        description="Manage the carpool journeys you have published for fellow students."
        actions={
          <Button variant="accent" size="sm" to="/offer-ride" icon={<PlusCircle size={15} />}>
            Publish New Ride
          </Button>
        }
      />

      <div className="container" style={{ marginBottom: '4rem' }}>
        <div className="portal-layout">
          <div className="portal-sidebar">
            <Sidebar />
          </div>

          <div className="portal-content">
            {userRides.length > 0 ? (
              <>
                {/* Desktop Table View (Hidden on mobile) */}
                <div className="desktop-table-view">
                  <div className="table-responsive">
                    <table className="custom-table">
                      <thead>
                        <tr>
                          <th>Route</th>
                          <th>Date</th>
                          <th>Time</th>
                          <th>Total Seats</th>
                          <th>Booked</th>
                          <th>Available</th>
                          <th>Status</th>
                          <th style={{ textAlign: 'right' }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {userRides.map((ride) => {
                          const available = getAvailableSeats(ride);
                          const status = getRideStatus(ride);
                          const isCancelled = status === 'Cancelled';
                          const bookedCount = Number(ride.bookedSeats) || 0;

                          return (
                            <tr key={ride.id} style={{ opacity: isCancelled ? 0.75 : 1 }}>
                              <td>
                                <strong style={{ color: 'var(--primary-900)' }}>
                                  {ride.from} → {ride.to}
                                </strong>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                  ₹{ride.contribution} / seat • {ride.vehicleModel}
                                </div>
                              </td>
                              <td>
                                <div className="flex items-center gap-1">
                                  <Calendar size={13} color="var(--text-muted)" />
                                  <span>{ride.formattedDate || ride.date}</span>
                                </div>
                              </td>
                              <td>
                                <div className="flex items-center gap-1">
                                  <Clock size={13} color="var(--text-muted)" />
                                  <span>{ride.time}</span>
                                </div>
                              </td>
                              <td>
                                <strong>{ride.seats}</strong>
                              </td>
                              <td>
                                <span style={{ color: bookedCount > 0 ? 'var(--primary-600)' : 'var(--text-muted)', fontWeight: 600 }}>
                                  {bookedCount}
                                </span>
                              </td>
                              <td>
                                <strong style={{ color: isCancelled ? 'var(--text-light)' : available > 0 ? 'var(--emerald-600)' : 'var(--rose-600)' }}>
                                  {isCancelled ? '0' : available}
                                </strong>
                              </td>
                              <td>
                                <StatusBadge status={status} />
                              </td>
                              <td style={{ textAlign: 'right' }}>
                                <div className="flex items-center justify-end gap-1">
                                  <Button
                                    variant="secondary"
                                    size="sm"
                                    to={`/ride/${ride.id}`}
                                    title="View Ride"
                                  >
                                    <Eye size={14} />
                                  </Button>

                                  {!isCancelled && (
                                    <>
                                      <Button
                                        variant="subtle"
                                        size="sm"
                                        onClick={() => handleOpenEdit(ride)}
                                        title="Edit Ride"
                                      >
                                        <Edit3 size={14} />
                                      </Button>

                                      <Button
                                        variant="subtle"
                                        size="sm"
                                        onClick={() => handleOpenCancel(ride)}
                                        title="Cancel Ride"
                                        style={{ color: 'var(--rose-600)' }}
                                      >
                                        <XCircle size={14} />
                                      </Button>
                                    </>
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

                {/* Mobile Cards View (Visible only on mobile <= 768px) */}
                <div className="mobile-cards-view">
                  {userRides.map((ride) => {
                    const available = getAvailableSeats(ride);
                    const status = getRideStatus(ride);
                    const isCancelled = status === 'Cancelled';
                    const bookedCount = Number(ride.bookedSeats) || 0;

                    return (
                      <div key={`m-ride-${ride.id}`} className="mobile-record-card card" style={{ opacity: isCancelled ? 0.8 : 1 }}>
                        <div className="flex items-center justify-between" style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.65rem', marginBottom: '0.75rem' }}>
                          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-600)' }}>
                            Offered Ride #{ride.id}
                          </span>
                          <StatusBadge status={status} />
                        </div>

                        <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--primary-900)', marginBottom: '0.4rem' }}>
                          {ride.from} → {ride.to}
                        </div>

                        <div className="flex items-center gap-3" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
                          <span className="flex items-center gap-1">
                            <Calendar size={13} color="var(--text-muted)" />
                            {ride.formattedDate || ride.date}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Clock size={13} color="var(--text-muted)" />
                            {ride.time}
                          </span>
                        </div>

                        <div className="mobile-stats-row">
                          <div className="mobile-stat-cell">
                            <span className="mobile-stat-label">Total Seats</span>
                            <span className="mobile-stat-value">{ride.seats}</span>
                          </div>
                          <div className="mobile-stat-cell">
                            <span className="mobile-stat-label">Booked</span>
                            <span className="mobile-stat-value" style={{ color: bookedCount > 0 ? 'var(--primary-700)' : 'inherit' }}>{bookedCount}</span>
                          </div>
                          <div className="mobile-stat-cell">
                            <span className="mobile-stat-label">Available</span>
                            <span className="mobile-stat-value" style={{ color: isCancelled ? 'var(--text-light)' : available > 0 ? 'var(--emerald-600)' : 'var(--rose-600)' }}>
                              {isCancelled ? '0' : available}
                            </span>
                          </div>
                          <div className="mobile-stat-cell">
                            <span className="mobile-stat-label">Contribution</span>
                            <span className="mobile-stat-value">₹{ride.contribution}</span>
                          </div>
                        </div>

                        <div className="mobile-record-actions">
                          <Button
                            variant="secondary"
                            size="sm"
                            to={`/ride/${ride.id}`}
                            icon={<Eye size={14} />}
                          >
                            View
                          </Button>

                          {!isCancelled && (
                            <>
                              <Button
                                variant="subtle"
                                size="sm"
                                onClick={() => handleOpenEdit(ride)}
                                icon={<Edit3 size={14} />}
                              >
                                Edit
                              </Button>

                              <Button
                                variant="subtle"
                                size="sm"
                                onClick={() => handleOpenCancel(ride)}
                                icon={<XCircle size={14} />}
                                style={{ color: 'var(--rose-600)' }}
                              >
                                Cancel
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            ) : (
              <EmptyState
                title="No rides published yet"
                description={`You (${user?.name}) have not published any campus rides yet. Offer a ride to share travel costs with classmates.`}
                actionLabel="Offer a Ride Now"
                actionTo="/offer-ride"
              />
            )}
          </div>
        </div>
      </div>

      {/* Edit Ride Modal */}
      <EditRideModal
        isOpen={Boolean(editingRide)}
        ride={editingRide}
        onSave={handleSaveEdit}
        onClose={() => setEditingRide(null)}
      />

      {/* Cancel Ride Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(cancellingRide)}
        title="Cancel this ride?"
        message="Students with active bookings may be affected. This will prevent new bookings and mark the ride as cancelled."
        details={
          cancellingRide && (
            <div style={{ fontSize: '0.9rem' }}>
              <strong>{cancellingRide.from} → {cancellingRide.to}</strong>
              <div style={{ color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                {cancellingRide.date} at {cancellingRide.time} • {cancellingRide.bookedSeats || 0} passengers currently booked
              </div>
            </div>
          )
        }
        confirmLabel="Cancel Ride"
        cancelLabel="Keep Ride"
        confirmVariant="secondary"
        onConfirm={handleConfirmCancel}
        onCancel={() => setCancellingRide(null)}
        icon={<AlertTriangle size={22} color="var(--rose-600)" />}
      />
    </div>
  );
}
