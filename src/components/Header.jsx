import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Car, Menu, X, LogOut, LogIn, UserPlus } from 'lucide-react';
import Button from './Button';
import useAuth from '../hooks/useAuth';
import useNotification from '../hooks/useNotification';

/**
 * Reusable Header Component
 * Adapts navigation based on AuthContext state (Authenticated vs Guest)
 * Fully responsive with accessible mobile drawer, keyboard close, and backdrop
 */
export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const { showNotification } = useNotification();
  const navigate = useNavigate();

  const closeMenu = () => setMobileMenuOpen(false);

  // Close on Escape key and lock body scroll on mobile
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        closeMenu();
      }
    };

    if (mobileMenuOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  const handleLogout = () => {
    logout();
    closeMenu();
    showNotification('Logged out successfully. See you on the next ride!', 'info');
    navigate('/');
  };

  return (
    <>
      <header className="header">
        <div className="container">
          <div className="header-inner">
            {/* Logo & Brand */}
            <Link to="/" className="logo" onClick={closeMenu} aria-label="CampusRide Home">
              <div className="logo-badge">
                <Car size={20} strokeWidth={2.5} />
              </div>
              <span>Campus<span style={{ color: 'var(--accent-600)' }}>Ride</span></span>
            </Link>

            {/* Desktop Navigation Links */}
            <nav aria-label="Main Navigation">
              <ul className="nav-links">
                <li>
                  <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                    Home
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/find-ride" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                    Find Ride
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/offer-ride" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                    Offer Ride
                  </NavLink>
                </li>

                {isAuthenticated && (
                  <>
                    <li>
                      <NavLink to="/dashboard" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                        Dashboard
                      </NavLink>
                    </li>
                    <li>
                      <NavLink to="/my-rides" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                        My Rides
                      </NavLink>
                    </li>
                    <li>
                      <NavLink to="/bookings" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                        Bookings
                      </NavLink>
                    </li>
                    <li>
                      <NavLink to="/history" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                        History
                      </NavLink>
                    </li>
                  </>
                )}
              </ul>
            </nav>

            {/* Desktop Auth / User Action Buttons */}
            <div className="nav-actions">
              {isAuthenticated ? (
                <div className="flex items-center gap-3">
                  <Link
                    to="/profile"
                    className="flex items-center gap-2 user-profile-chip"
                    title="View Profile"
                  >
                    <img
                      src={user.avatar || '/assets/student-driver.jpg'}
                      alt={user.name}
                      className="user-profile-avatar"
                    />
                    <span>{user.name.split(' ')[0]}</span>
                  </Link>

                  <Button
                    variant="subtle"
                    size="sm"
                    onClick={handleLogout}
                    icon={<LogOut size={15} />}
                    title="Log Out"
                  >
                    Logout
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Button variant="subtle" size="sm" to="/login" icon={<LogIn size={15} />}>
                    Login
                  </Button>
                  <Button variant="accent" size="sm" to="/register" icon={<UserPlus size={15} />}>
                    Register
                  </Button>
                </div>
              )}
            </div>

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              className="mobile-menu-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-nav-drawer"
            >
              {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div id="mobile-nav-drawer" className="mobile-menu-open">
            <div className="mobile-menu-links">
              <NavLink to="/" className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`} onClick={closeMenu}>
                Home
              </NavLink>
              <NavLink to="/find-ride" className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`} onClick={closeMenu}>
                Find a Ride
              </NavLink>
              <NavLink to="/offer-ride" className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`} onClick={closeMenu}>
                Offer a Ride
              </NavLink>

              {isAuthenticated ? (
                <>
                  <div className="mobile-nav-divider" />
                  <NavLink to="/dashboard" className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`} onClick={closeMenu}>
                    Dashboard
                  </NavLink>
                  <NavLink to="/my-rides" className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`} onClick={closeMenu}>
                    My Offered Rides
                  </NavLink>
                  <NavLink to="/bookings" className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`} onClick={closeMenu}>
                    My Bookings
                  </NavLink>
                  <NavLink to="/history" className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`} onClick={closeMenu}>
                    Trip History
                  </NavLink>
                  <NavLink to="/profile" className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`} onClick={closeMenu}>
                    Student Profile ({user.name.split(' ')[0]})
                  </NavLink>

                  <div className="mobile-nav-footer">
                    <Button variant="secondary" size="md" fullWidth onClick={handleLogout} icon={<LogOut size={16} />}>
                      Log Out ({user.name})
                    </Button>
                  </div>
                </>
              ) : (
                <div className="mobile-nav-auth-buttons">
                  <Button variant="secondary" size="md" fullWidth to="/login" onClick={closeMenu}>
                    Login
                  </Button>
                  <Button variant="accent" size="md" fullWidth to="/register" onClick={closeMenu}>
                    Register
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Mobile Drawer Backdrop Overlay */}
      {mobileMenuOpen && (
        <div
          className="mobile-backdrop-overlay"
          onClick={closeMenu}
          aria-hidden="true"
        />
      )}
    </>
  );
}
