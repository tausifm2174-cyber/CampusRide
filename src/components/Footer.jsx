import React from 'react';
import { Link } from 'react-router-dom';
import { Car, ShieldCheck, Leaf } from 'lucide-react';

/**
 * Reusable Footer Component
 */
export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link to="/" className="logo" style={{ color: '#ffffff' }}>
              <div className="logo-badge">
                <Car size={20} strokeWidth={2.5} />
              </div>
              <span>Campus<span style={{ color: 'var(--accent-400)' }}>Ride</span></span>
            </Link>
            <p>
              Your Campus. Your Route. Your Ride. A modern student mobility platform helping college students travel together safely, affordably, and sustainably.
            </p>
            <div className="flex items-center gap-2" style={{ marginTop: '1rem', color: 'var(--accent-400)', fontSize: '0.85rem' }}>
              <ShieldCheck size={16} />
              <span>Campus verified student community</span>
            </div>
          </div>

          <div>
            <h4 className="footer-title">Explore</h4>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/find-ride">Find a Ride</Link></li>
              <li><Link to="/offer-ride">Offer a Ride</Link></li>
              <li><Link to="/dashboard">Dashboard</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="footer-title">Student Portal</h4>
            <ul className="footer-links">
              <li><Link to="/my-rides">My Offered Rides</Link></li>
              <li><Link to="/bookings">My Bookings</Link></li>
              <li><Link to="/history">Trip History</Link></li>
              <li><Link to="/profile">Student Profile</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="footer-title">Campus Routes</h4>
            <ul className="footer-links">
              <li><Link to="/find-ride">Yelahanka → SJBIT</Link></li>
              <li><Link to="/find-ride">Yeshwanthpur → SJBIT</Link></li>
              <li><Link to="/find-ride">Nagarbhavi → SJBIT</Link></li>
              <li><Link to="/find-ride">Peenya → SJBIT</Link></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <div>
            &copy; 2026 CampusRide. Built for React JS formative assessment.
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1" style={{ color: 'var(--accent-400)' }}>
              <Leaf size={14} /> Eco-friendly student commuting
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
