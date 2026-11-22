import React from 'react';
import { Link } from 'react-router-dom';
import {
  Car,
  Bookmark,
  Calendar,
  Clock,
  ArrowRight,
  ShieldCheck,
  PlusCircle,
  Search,
  Users,
  Star
} from 'lucide-react';
import PageHeader from '../components/PageHeader';
import StatisticCard from '../components/StatisticCard';
import Button from '../components/Button';
import Sidebar from '../components/Sidebar';
import RecentActivity from '../components/RecentActivity';
import RoutePreview from '../components/RoutePreview';
import { getAvailableSeats } from '../data/mockRides';
import useAuth from '../hooks/useAuth';
import useRides from '../hooks/useRides';

export default function Dashboard() {
  const { user } = useAuth();
  const { rides, bookings } = useRides();

  const userName = user?.name || 'Tausif M';
  const userId = user?.id || 'u-1';

  // Dynamic calculations from current application state
  const availableRidesCount = (rides || []).filter(
    (r) => r.status !== 'Cancelled' && getAvailableSeats(r) > 0
  ).length;

  const myOfferedRides = (rides || []).filter(
    (r) => r.driverId === userId || r.driverName === userName
  );

  const myBookings = (bookings || []).filter(
    (b) => b.passengerId === userId || b.passengerName === userName
  );

  const activeBookings = myBookings.filter((b) => b.status === 'Confirmed');
  const activeOfferedRides = myOfferedRides.filter((r) => r.status === 'Active');

  // Derive next upcoming trip (either from bookings or offered rides)
  let nextTrip = null;
  if (activeBookings.length > 0) {
    const booking = activeBookings[0];
    const relatedRide = (rides || []).find((r) => r.id === booking.rideId);
    nextTrip = {
      id: booking.rideId,
      from: booking.route.split('→')[0]?.trim() || 'Yelahanka',
      to: booking.route.split('→')[1]?.trim() || 'SJBIT Campus',
      date: booking.date,
      time: booking.time,
      driverName: booking.driver,
      driverAvatar: relatedRide?.driverAvatar || '/assets/student-driver.jpg',
      contribution: booking.contribution,
      availableSeats: relatedRide ? getAvailableSeats(relatedRide) : 1,
      vehicleModel: booking.vehicle || 'Car',
      type: 'PASSENGER'
    };
  } else if (activeOfferedRides.length > 0) {
    const ride = activeOfferedRides[0];
    nextTrip = {
      id: ride.id,
      from: ride.from,
      to: ride.to,
      date: ride.formattedDate || ride.date,
      time: ride.time,
      driverName: `${userName} (You)`,
      driverAvatar: user?.avatar || '/assets/student-driver.jpg',
      contribution: ride.contribution,
      availableSeats: getAvailableSeats(ride),
      vehicleModel: ride.vehicleModel,
      type: 'DRIVER'
    };
  }

  return (
    <div className="dashboard-page">
      <PageHeader
        title={`Welcome back, ${userName.split(' ')[0]}! 👋`}
        description={`Logged in as ${user?.role || 'STUDENT'} • ${user?.course || 'SJBIT'} (${user?.year || '2nd Year'})`}
        badge={
          <span className="status-badge badge-active flex items-center gap-1">
            <ShieldCheck size={14} /> Verified Student
          </span>
        }
        actions={
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" to="/find-ride" icon={<Search size={14} />}>
              Find Ride
            </Button>
            <Button variant="accent" size="sm" to="/offer-ride" icon={<PlusCircle size={14} />}>
              Offer Ride
            </Button>
          </div>
        }
      />

      <div className="container" style={{ marginBottom: '4rem' }}>
        <div className="portal-layout">
          <div className="portal-sidebar">
            <Sidebar />
          </div>

          <div className="portal-content">
            {/* Dynamic Summary Metric Cards */}
            <div className="dashboard-metrics-grid" style={{ marginBottom: '2rem' }}>
              <StatisticCard
                value={availableRidesCount}
                label="Available Rides"
                icon={<Car size={22} />}
                note="Across SJBIT routes"
              />
              <StatisticCard
                value={myOfferedRides.length}
                label="My Offered Rides"
                icon={<Users size={22} />}
                note={`${activeOfferedRides.length} active departures`}
              />
              <StatisticCard
                value={activeBookings.length}
                label="Active Bookings"
                icon={<Bookmark size={22} />}
                note={`${myBookings.length} total reserved`}
              />
              <StatisticCard
                value={user?.rating ? `${Number(user.rating).toFixed(1)} ⭐` : '4.9 ⭐'}
                label="Student Rating"
                icon={<Star size={22} />}
                note="Verified peer score"
              />
            </div>

            {/* Next Upcoming Ride Card with Route Preview */}
            <div style={{ marginBottom: '2.5rem' }}>
              <div className="flex items-center justify-between" style={{ marginBottom: '1rem' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary-900)' }}>
                  Upcoming Ride
                </h2>
                {nextTrip && (
                  <span className="status-badge badge-confirmed">
                    Role: {nextTrip.type}
                  </span>
                )}
              </div>

              {nextTrip ? (
                <div className="upcoming-ride-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', position: 'relative', zIndex: 1 }}>
                    <div>
                      <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--accent-400)', fontWeight: 700 }}>
                        Next Campus Commute
                      </span>
                      <h3 style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '0.25rem', color: '#ffffff' }}>
                        {nextTrip.from} → {nextTrip.to}
                      </h3>
                      <div className="flex items-center gap-4" style={{ marginTop: '0.75rem', color: '#cbd5e1', fontSize: '0.925rem' }}>
                        <span className="flex items-center gap-1">
                          <Calendar size={15} color="var(--accent-400)" />
                          {nextTrip.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={15} color="var(--accent-400)" />
                          {nextTrip.time}
                        </span>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase' }}>Contribution</span>
                      <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'white' }}>₹{nextTrip.contribution}</div>
                    </div>
                  </div>

                  {/* Compact Waypoint Indicator */}
                  <div style={{ marginTop: '1rem', position: 'relative', zIndex: 1 }}>
                    <RoutePreview compact from={nextTrip.from} to={nextTrip.to} />
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginTop: '1.5rem',
                      paddingTop: '1.25rem',
                      borderTop: '1px solid rgba(255, 255, 255, 0.15)',
                      flexWrap: 'wrap',
                      gap: '1rem',
                      position: 'relative',
                      zIndex: 1
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={nextTrip.driverAvatar}
                        alt={nextTrip.driverName}
                        style={{ width: 42, height: 42, borderRadius: '50%', border: '2px solid var(--accent-400)', objectFit: 'cover' }}
                      />
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'white' }}>
                          Driver: {nextTrip.driverName}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                          {nextTrip.vehicleModel} • {nextTrip.availableSeats} seat{nextTrip.availableSeats > 1 ? 's' : ''} left
                        </div>
                      </div>
                    </div>

                    <Button
                      variant="accent"
                      size="sm"
                      to={`/ride/${nextTrip.id}`}
                      icon={<ArrowRight size={15} />}
                      iconPosition="right"
                    >
                      View Ride Details
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="card" style={{ textAlign: 'center', padding: '2.5rem 1.5rem' }}>
                  <p style={{ color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
                    You have no scheduled upcoming rides right now.
                  </p>
                  <div className="flex justify-center gap-3">
                    <Button variant="accent" size="sm" to="/find-ride">
                      Find a Campus Ride
                    </Button>
                    <Button variant="secondary" size="sm" to="/offer-ride">
                      Offer a Ride
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Dynamic Recent Activity Timeline */}
            <div>
              <div className="flex items-center justify-between" style={{ marginBottom: '1rem' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary-900)' }}>
                  Recent Activity
                </h2>
                <Link to="/history" style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--accent-600)' }}>
                  View All History →
                </Link>
              </div>

              <RecentActivity
                rides={rides}
                bookings={bookings}
                currentUser={user}
                limit={4}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
