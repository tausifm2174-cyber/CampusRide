import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Search,
  PlusCircle,
  Car,
  Bookmark,
  History,
  User,
  ShieldCheck,
  Menu,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

/**
 * Reusable Responsive Sidebar Component for Portal / Dashboard Navigation
 * On desktop: full persistent sidebar
 * On mobile/tablet: collapsible toggle button to prevent pushing page content down
 */
export default function Sidebar({ className = '' }) {
  const [mobileExpanded, setMobileExpanded] = useState(false);
  const location = useLocation();

  const navItems = [
    { to: '/dashboard', label: 'Overview', icon: LayoutDashboard },
    { to: '/find-ride', label: 'Find a Ride', icon: Search },
    { to: '/offer-ride', label: 'Offer a Ride', icon: PlusCircle },
    { to: '/my-rides', label: 'My Offered Rides', icon: Car },
    { to: '/bookings', label: 'My Bookings', icon: Bookmark },
    { to: '/history', label: 'Trip History', icon: History },
    { to: '/profile', label: 'Profile & Vehicle', icon: User }
  ];

  const currentItem = navItems.find((item) => item.to === location.pathname) || navItems[0];
  const CurrentIcon = currentItem.icon;

  const handleLinkClick = () => {
    setMobileExpanded(false);
  };

  return (
    <aside className={`sidebar ${className}`} aria-label="Portal Navigation Area">
      {/* Mobile Collapsible Toggle (Visible only on mobile/tablet <= 900px) */}
      <div className="sidebar-mobile-toggle-wrapper">
        <button
          type="button"
          className="sidebar-mobile-toggle-btn"
          onClick={() => setMobileExpanded(!mobileExpanded)}
          aria-expanded={mobileExpanded}
          aria-controls="portal-nav-menu"
          aria-label="Toggle student navigation menu"
        >
          <div className="flex items-center gap-2">
            <Menu size={18} color="var(--accent-600)" />
            <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>Student Menu:</span>
            <span className="sidebar-current-label flex items-center gap-1">
              <CurrentIcon size={15} />
              {currentItem.label}
            </span>
          </div>
          {mobileExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
      </div>

      {/* Main Sidebar Card (Always visible on desktop, conditionally expanded on mobile) */}
      <div
        id="portal-nav-menu"
        className={`sidebar-content-card card ${mobileExpanded ? 'mobile-expanded' : ''}`}
      >
        <div className="sidebar-header-desktop">
          <span className="sidebar-header-tag">
            Student Menu
          </span>
        </div>

        <nav aria-label="Portal Navigation Links">
          <div className="sidebar-links-list">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={handleLinkClick}
                  className={({ isActive }) => `
                    sidebar-nav-link
                    ${isActive ? 'sidebar-nav-active' : ''}
                  `}
                >
                  <Icon size={18} className="sidebar-nav-icon" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </div>
        </nav>

        <div className="sidebar-verified-box">
          <div className="flex items-center gap-2" style={{ color: 'var(--accent-700)', fontWeight: 700, fontSize: '0.825rem' }}>
            <ShieldCheck size={16} />
            <span>SJBIT Student Verified</span>
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem', lineHeight: 1.4 }}>
            CampusRide ID verified with institution email.
          </p>
        </div>
      </div>
    </aside>
  );
}
