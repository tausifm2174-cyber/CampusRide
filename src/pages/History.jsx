import React from 'react';
import { Calendar, Leaf } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import Sidebar from '../components/Sidebar';
import StatusBadge from '../components/StatusBadge';
import { mockHistory } from '../data/mockRides';
import useAuth from '../hooks/useAuth';
import useRides from '../hooks/useRides';

export default function History() {
  const { user } = useAuth();
  const { rides, bookings } = useRides();

  const userName = user?.name || 'Tausif M';
  const userId = user?.id || 'u-1';

  // Combine dynamic past items with initial history archive
  const completedOrCancelledRides = (rides || [])
    .filter((r) => (r.driverId === userId || r.driverName === userName) && (r.status === 'Completed' || r.status === 'Cancelled'))
    .map((r) => ({
      id: `ride-${r.id}`,
      date: r.formattedDate || r.date,
      route: `${r.from} → ${r.to}`,
      driver: `${userName} (Self)`,
      role: 'Driver',
      farePaid: null,
      fareCollected: (r.bookedSeats || 0) * (r.contribution || 50),
      co2Saved: `${(((r.bookedSeats || 1) * 1.6)).toFixed(1)} kg`,
      status: r.status
    }));

  const pastBookings = (bookings || [])
    .filter((b) => b.passengerId === userId || b.passengerName === userName)
    .map((b) => ({
      id: `booking-${b.id}`,
      date: b.date,
      route: b.route,
      driver: b.driver,
      role: 'Passenger',
      farePaid: b.contribution,
      fareCollected: null,
      co2Saved: '2.8 kg',
      status: b.status
    }));

  const allHistory = [
    ...completedOrCancelledRides,
    ...pastBookings,
    ...mockHistory
  ];

  return (
    <div className="history-page">
      <PageHeader
        title="Ride & Travel History"
        description="Review your past shared commutes, passenger contributions, and ecological milestones."
      />

      <div className="container" style={{ marginBottom: '4rem' }}>
        <div className="portal-layout">
          <div className="portal-sidebar">
            <Sidebar />
          </div>

          <div className="portal-content">
            {/* Desktop Table View */}
            <div className="desktop-table-view">
              <div className="table-responsive">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Route</th>
                      <th>Role</th>
                      <th>Driver / Passenger</th>
                      <th>Fare Amount</th>
                      <th>CO₂ Impact (Est.)</th>
                      <th>Trip Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allHistory.map((item) => (
                      <tr key={item.id}>
                        <td>
                          <div className="flex items-center gap-1">
                            <Calendar size={13} color="var(--text-muted)" />
                            <span>{item.date}</span>
                          </div>
                        </td>
                        <td>
                          <strong style={{ color: 'var(--primary-900)' }}>{item.route}</strong>
                        </td>
                        <td>
                          <span
                            style={{
                              fontSize: '0.75rem',
                              padding: '0.2rem 0.5rem',
                              borderRadius: 'var(--radius-sm)',
                              backgroundColor: item.role === 'Driver' ? 'var(--primary-900)' : 'var(--bg-subtle)',
                              color: item.role === 'Driver' ? '#ffffff' : 'var(--text-primary)',
                              fontWeight: 600
                            }}
                          >
                            {item.role}
                          </span>
                        </td>
                        <td>
                          <div>{item.driver}</div>
                          {item.passengersCount && (
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                              {item.passengersCount} passengers carried
                            </div>
                          )}
                        </td>
                        <td>
                          <strong>
                            ₹{item.farePaid || item.fareCollected || 0}
                          </strong>
                        </td>
                        <td>
                          <span className="flex items-center gap-1" style={{ color: 'var(--emerald-600)', fontSize: '0.85rem' }}>
                            <Leaf size={13} /> {item.co2Saved || '2.5 kg'}
                          </span>
                        </td>
                        <td>
                          <StatusBadge status={item.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile Cards View */}
            <div className="mobile-cards-view">
              {allHistory.map((item) => (
                <div key={`m-hist-${item.id}`} className="mobile-record-card card">
                  <div className="flex items-center justify-between" style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.65rem', marginBottom: '0.75rem' }}>
                    <div className="flex items-center gap-1" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      <Calendar size={13} />
                      <span>{item.date}</span>
                    </div>
                    <StatusBadge status={item.status} />
                  </div>

                  <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--primary-900)', marginBottom: '0.65rem' }}>
                    {item.route}
                  </div>

                  <div className="mobile-stats-row">
                    <div className="mobile-stat-cell">
                      <span className="mobile-stat-label">Role</span>
                      <span
                        style={{
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          padding: '0.15rem 0.4rem',
                          borderRadius: 'var(--radius-sm)',
                          backgroundColor: item.role === 'Driver' ? 'var(--primary-900)' : 'var(--bg-subtle)',
                          color: item.role === 'Driver' ? '#ffffff' : 'var(--text-primary)',
                          display: 'inline-block',
                          marginTop: '0.2rem'
                        }}
                      >
                        {item.role}
                      </span>
                    </div>

                    <div className="mobile-stat-cell">
                      <span className="mobile-stat-label">Driver / Peer</span>
                      <span className="mobile-stat-value" style={{ fontSize: '0.85rem' }}>
                        {item.driver}
                      </span>
                    </div>

                    <div className="mobile-stat-cell">
                      <span className="mobile-stat-label">Fare</span>
                      <span className="mobile-stat-value">₹{item.farePaid || item.fareCollected || 0}</span>
                    </div>

                    <div className="mobile-stat-cell">
                      <span className="mobile-stat-label">CO₂ Saved</span>
                      <span className="mobile-stat-value" style={{ color: 'var(--emerald-600)' }}>
                        {item.co2Saved || '2.5 kg'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: '1rem', textAlign: 'right', fontSize: '0.75rem', color: 'var(--text-light)' }}>
              * CO₂ offset is an estimated demonstration metric based on average private vehicle emission reduction.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
