import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Car,
  Search,
  PlusCircle,
  Users,
  Compass,
  Leaf,
  ArrowRight,
  Sparkles,
  Calendar,
  Clock,
  ShieldCheck
} from 'lucide-react';
import Button from '../components/Button';
import StatisticCard from '../components/StatisticCard';
import RideCard from '../components/RideCard';
import ConfirmDialog from '../components/ConfirmDialog';
import { mockStats } from '../data/mockRides';
import useRides from '../hooks/useRides';
import useAuth from '../hooks/useAuth';
import useNotification from '../hooks/useNotification';

export default function Home() {
  const navigate = useNavigate();
  const { rides, joinRide } = useRides();
  const { user, isAuthenticated } = useAuth();
  const { showNotification } = useNotification();

  const [selectedRideToJoin, setSelectedRideToJoin] = useState(null);

  // Display available active campus rides
  const sampleFeaturedRides = (rides || [])
    .filter((r) => r.status !== 'Cancelled')
    .slice(0, 3);

  const handleOpenJoin = (ride) => {
    if (!isAuthenticated) {
      showNotification('Please log in with your college credentials to reserve a seat', 'warning');
      navigate('/login');
      return;
    }
    if (user && (ride.driverId === user.id || ride.driverName === user.name)) {
      showNotification('You cannot join your own offered ride as passenger', 'warning');
      return;
    }
    setSelectedRideToJoin(ride);
  };

  const handleConfirmJoin = () => {
    if (selectedRideToJoin) {
      joinRide(selectedRideToJoin.id, 1, user);
      showNotification(`✓ Seat booked on ${selectedRideToJoin.from} → ${selectedRideToJoin.to}. View in Bookings!`, 'success');
      setSelectedRideToJoin(null);
    }
  };

  return (
    <div className="home-page">
      {/* 1. HERO SECTION with subtle campus background */}
      <section className="hero-section">
        <img
          src="/assets/campus-background.jpg"
          alt="College Campus Environment"
          className="hero-bg-image"
        />
        <div className="hero-overlay" />

        <div className="container">
          <div className="hero-content">
            <div className="hero-tag">
              <Sparkles size={14} />
              <span>Campus Mobility Platform • SJBIT Network</span>
            </div>

            <h1 className="hero-title">
              Your Campus.<br />
              <span className="highlight">Your Route.</span><br />
              Your Ride.
            </h1>

            <p className="hero-subtitle">
              Find students travelling your way and share the journey. Cut commute costs, bypass crowded public transit, and travel sustainably with verified peers.
            </p>

            <div className="hero-cta-group">
              <Button
                variant="accent"
                size="lg"
                to="/find-ride"
                icon={<Search size={18} />}
              >
                Find a Ride
              </Button>
              <Button
                variant="outline-white"
                size="lg"
                to="/offer-ride"
                icon={<PlusCircle size={18} />}
              >
                Offer a Ride
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. DEMONSTRATION / PROTOTYPE STATISTICS SECTION */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            <StatisticCard
              value={mockStats.ridesShared}
              label="Rides Shared"
              icon={<Car size={24} />}
              note="Demonstration metric"
            />
            <StatisticCard
              value={mockStats.students}
              label="Students Registered"
              icon={<Users size={24} />}
              note="Across engineering depts"
            />
            <StatisticCard
              value={mockStats.routes}
              label="Active Routes"
              icon={<Compass size={24} />}
              note="Bengaluru transit hubs"
            />
            <StatisticCard
              value={mockStats.co2Saved}
              label="Estimated CO₂ Saved"
              icon={<Leaf size={24} />}
              note="Eco-friendly impact"
            />
          </div>
        </div>
      </section>

      {/* 3. HOW CAMPUSRIDE WORKS SECTION (4-STEP STUDENT JOURNEY) */}
      <section className="how-it-works-section">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Simple & Seamless</span>
            <h2 className="section-title">How CampusRide Works</h2>
            <p className="section-description">
              Carpooling tailored specifically for college routines, flexible lectures, and student budgets.
            </p>
          </div>

          <div className="how-it-works-container">
            {/* Steps Column */}
            <div className="steps-list">
              <div className="step-item">
                <div className="step-number">01</div>
                <div className="step-content">
                  <h3>Find a Route</h3>
                  <p>
                    Search for students travelling along your route. Filter by pickup location, departure time, and college campus.
                  </p>
                </div>
              </div>

              <div className="step-item">
                <div className="step-number">02</div>
                <div className="step-content">
                  <h3>Join & Reserve Seat</h3>
                  <p>
                    Choose a suitable ride and reserve an available seat with verified student drivers from your institution.
                  </p>
                </div>
              </div>

              <div className="step-item">
                <div className="step-number">03</div>
                <div className="step-content">
                  <h3>Share the Journey</h3>
                  <p>
                    Travel together, split fuel expenses, avoid crowded buses, and turn long highway commutes into fun peer hangouts.
                  </p>
                </div>
              </div>

              <div className="step-item">
                <div className="step-number">04</div>
                <div className="step-content">
                  <h3>Rate & Build Trust</h3>
                  <p>
                    Leave 1–5 star reviews for driver punctuality and route safety, keeping our campus carpool network trustworthy.
                  </p>
                </div>
              </div>
            </div>

            {/* Illustration Column with carpool-illustration.png */}
            <div className="illustration-wrapper">
              <img
                src="/assets/carpool-illustration.png"
                alt="Students carpooling together happily to campus"
                className="illustration-img"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 4. BENEFITS SECTION */}
      <section className="benefits-section">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Student-Centered Advantages</span>
            <h2 className="section-title">Why Share Rides on Campus?</h2>
            <p className="section-description">
              Designed to solve common college transit headaches with safety, affordability, and community in mind.
            </p>
          </div>

          <div className="benefits-grid">
            <div className="benefit-card">
              <div className="benefit-icon">💰</div>
              <h3 className="benefit-title">Save Money</h3>
              <p className="benefit-desc">
                Share travel costs with fellow students. Split fuel expenses on everyday campus commutes and keep transport costs minimal.
              </p>
            </div>

            <div className="benefit-card">
              <div className="benefit-icon">🚗</div>
              <h3 className="benefit-title">Travel Together</h3>
              <p className="benefit-desc">
                Find students travelling along similar routes. Turn lonely highway commutes into comfortable, collaborative trips.
              </p>
            </div>

            <div className="benefit-card">
              <div className="benefit-icon">🛣️</div>
              <h3 className="benefit-title">Reduce Traffic</h3>
              <p className="benefit-desc">
                Fewer individual vehicles can mean less congestion around busy campus gates and smoother morning parking.
              </p>
            </div>

            <div className="benefit-card">
              <div className="benefit-icon">🌱</div>
              <h3 className="benefit-title">Reduce Environmental Impact</h3>
              <p className="benefit-desc">
                Shared rides can reduce unnecessary vehicle usage and estimated emissions, contributing directly to a greener campus.
              </p>
            </div>
          </div>

          {/* Student Community Spotlight Card */}
          <div
            style={{
              marginTop: '3.5rem',
              background: 'linear-gradient(135deg, var(--bg-surface) 0%, #f1f5f9 100%)',
              borderRadius: 'var(--radius-xl)',
              border: '1px solid var(--border-subtle)',
              overflow: 'hidden',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              alignItems: 'center',
              boxShadow: 'var(--shadow-md)'
            }}
          >
            <div style={{ padding: '2.5rem' }}>
              <div className="flex items-center gap-2" style={{ marginBottom: '0.75rem' }}>
                <ShieldCheck size={20} color="var(--accent-600)" />
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-600)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Verified SJBIT Student Network
                </span>
              </div>
              <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary-900)', lineHeight: 1.25, marginBottom: '1rem' }}>
                Travel with Confirmed Peers From Your Own Campus
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                Every driver and passenger on CampusRide holds an authenticated university email. Enjoy peace of mind, mutual accountability, and transparent seat splitting on every morning commute.
              </p>
              <div className="flex items-center gap-4 flex-wrap">
                <Button variant="accent" size="sm" to="/register">
                  Join Campus Community
                </Button>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  🎓 Instant USN Verification
                </span>
              </div>
            </div>

            <div style={{ height: '100%', minHeight: '260px', overflow: 'hidden' }}>
              <img
                src="/assets/carpool-students.jpg"
                alt="College students sharing a comfortable carpool"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 5. POPULAR ROUTES PREVIEW */}
      <section style={{ padding: '4.5rem 0', backgroundColor: 'var(--bg-surface)' }}>
        <div className="container">
          <div className="flex items-center justify-between" style={{ marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span className="section-tag">Frequent Commutes</span>
              <h2 className="section-title" style={{ marginBottom: 0 }}>Available Campus Rides Today</h2>
            </div>
            <Button variant="secondary" to="/find-ride" icon={<ArrowRight size={16} />} iconPosition="right">
              View All Rides
            </Button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
            {sampleFeaturedRides.map((ride) => (
              <RideCard
                key={ride.id}
                ride={ride}
                onJoinClick={handleOpenJoin}
                currentUserId={user?.id}
                currentUserName={user?.name}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 6. CALL TO ACTION BANNER */}
      <section style={{ padding: '4rem 0', backgroundColor: 'var(--bg-main)' }}>
        <div className="container">
          <div
            style={{
              background: 'linear-gradient(135deg, var(--primary-900) 0%, var(--primary-700) 100%)',
              color: 'white',
              borderRadius: 'var(--radius-xl)',
              padding: '3.5rem 2.5rem',
              textAlign: 'center',
              boxShadow: 'var(--shadow-xl)'
            }}
          >
            <h2 style={{ color: 'white', fontSize: '2.4rem', marginBottom: '1rem' }}>
              Have an empty seat in your car or bike?
            </h2>
            <p style={{ color: '#cbd5e1', fontSize: '1.1rem', maxWidth: '640px', margin: '0 auto 2rem' }}>
              Publish your schedule in under two minutes, offset your fuel costs, and help fellow students reach lectures on time.
            </p>
            <div className="flex items-center justify-center gap-3" style={{ flexWrap: 'wrap' }}>
              <Button variant="accent" size="lg" to="/offer-ride" icon={<PlusCircle size={18} />}>
                Offer a Ride Now
              </Button>
              <Button variant="outline-white" size="lg" to="/find-ride">
                Explore Routes
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Confirmation Dialog for Home Quick Join */}
      <ConfirmDialog
        isOpen={Boolean(selectedRideToJoin)}
        title="Join this ride?"
        message="Confirm your seat reservation:"
        details={
          selectedRideToJoin && (
            <div className="flex flex-col gap-2" style={{ fontSize: '0.9rem' }}>
              <div style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--primary-900)' }}>
                {selectedRideToJoin.from} → {selectedRideToJoin.to}
              </div>
              <div className="flex items-center gap-4" style={{ color: 'var(--text-secondary)' }}>
                <span className="flex items-center gap-1">
                  <Calendar size={14} /> {selectedRideToJoin.formattedDate || selectedRideToJoin.date}
                </span>
                <span className="flex items-center gap-1">
                  <Clock size={14} /> {selectedRideToJoin.time}
                </span>
              </div>
              <div className="flex items-center justify-between" style={{ marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid var(--border-subtle)' }}>
                <span style={{ color: 'var(--text-muted)' }}>Driver: <strong>{selectedRideToJoin.driverName}</strong></span>
                <span style={{ fontWeight: 800, color: 'var(--primary-900)', fontSize: '1.05rem' }}>₹{selectedRideToJoin.contribution} contribution</span>
              </div>
            </div>
          )
        }
        confirmLabel="Confirm Booking"
        cancelLabel="Cancel"
        confirmVariant="accent"
        onConfirm={handleConfirmJoin}
        onCancel={() => setSelectedRideToJoin(null)}
      />
    </div>
  );
}
