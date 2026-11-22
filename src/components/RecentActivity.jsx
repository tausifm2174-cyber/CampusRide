import React from 'react';
import { Clock, PlusCircle, CheckCircle2, Bookmark, XCircle, Edit3, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import StatusBadge from './StatusBadge';

/**
 * Reusable RecentActivity Component
 * Formats user's recent rides, bookings, and mutations into an accessible timeline
 */
export default function RecentActivity({
  rides = [],
  bookings = [],
  currentUser = null,
  limit = 5,
  className = ''
}) {
  const userName = currentUser?.name || '';
  const userId = currentUser?.id || '';

  const activities = [];

  // 1. Gather bookings
  (bookings || []).forEach((b) => {
    if (b.passengerId === userId || b.passengerName === userName) {
      if (b.status === 'Cancelled') {
        activities.push({
          id: `book-cancel-${b.id}`,
          timestamp: new Date(b.bookedAt || Date.now() - 3600000),
          title: `Cancelled booking for ${b.route}`,
          meta: `Driver: ${b.driver} • Seat released`,
          type: 'booking-cancel',
          status: 'Cancelled',
          icon: XCircle,
          iconColor: 'var(--rose-600)',
          iconBg: 'var(--rose-100)',
          timeLabel: 'Recent'
        });
      } else {
        activities.push({
          id: `book-active-${b.id}`,
          timestamp: new Date(b.bookedAt || Date.now() - 7200000),
          title: `Joined ride from ${b.route}`,
          meta: `Driver: ${b.driver} • ${b.date}, ${b.time}`,
          type: 'booking-join',
          status: b.status || 'Confirmed',
          icon: Bookmark,
          iconColor: 'var(--accent-600)',
          iconBg: 'var(--accent-50)',
          timeLabel: 'Confirmed'
        });
      }
    }
  });

  // 2. Gather offered rides
  (rides || []).forEach((r) => {
    if (r.driverId === userId || r.driverName === userName) {
      if (r.status === 'Cancelled') {
        activities.push({
          id: `ride-cancel-${r.id}`,
          timestamp: new Date(r.id),
          title: `Cancelled ride: ${r.from} → ${r.to}`,
          meta: `${r.formattedDate || r.date} at ${r.time}`,
          type: 'ride-cancel',
          status: 'Cancelled',
          icon: XCircle,
          iconColor: 'var(--rose-600)',
          iconBg: 'var(--rose-100)',
          timeLabel: 'Cancelled'
        });
      } else {
        activities.push({
          id: `ride-create-${r.id}`,
          timestamp: new Date(r.id),
          title: `Offered ride: ${r.from} → ${r.to}`,
          meta: `${r.bookedSeats || 0} of ${r.seats} seats reserved • ₹${r.contribution}`,
          type: 'ride-create',
          status: r.status || 'Active',
          icon: PlusCircle,
          iconColor: 'var(--emerald-600)',
          iconBg: 'var(--emerald-100)',
          timeLabel: 'Driver'
        });
      }
    }
  });

  // Sort newest first
  activities.sort((a, b) => b.timestamp - a.timestamp);
  const displayedActivities = activities.slice(0, limit);

  if (displayedActivities.length === 0) {
    return (
      <div className={`card ${className}`} style={{ textAlign: 'center', padding: '2rem 1rem' }}>
        <Clock size={32} color="var(--text-light)" style={{ margin: '0 auto 0.75rem' }} />
        <h4 style={{ fontSize: '1rem', color: 'var(--primary-900)', fontWeight: 700 }}>
          No Activity Recorded Yet
        </h4>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
          When you join or offer rides, your recent journey log will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className={`activity-list ${className}`}>
      {displayedActivities.map((item) => {
        const Icon = item.icon;
        return (
          <div key={item.id} className="activity-item card-hover">
            <div className="flex items-center gap-3">
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 'var(--radius-md)',
                  background: item.iconBg,
                  color: item.iconColor,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                <Icon size={20} />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--primary-900)' }}>
                  {item.title}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                  {item.meta}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3" style={{ flexShrink: 0 }}>
              <StatusBadge status={item.status} />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-light)', fontWeight: 600 }}>
                {item.timeLabel}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
