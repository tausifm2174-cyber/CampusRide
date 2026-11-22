import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Car, Calendar, Clock } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import SearchBar from '../components/SearchBar';
import FilterPanel from '../components/FilterPanel';
import RideCard from '../components/RideCard';
import EmptyState from '../components/EmptyState';
import ConfirmDialog from '../components/ConfirmDialog';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { getAvailableSeats } from '../data/mockRides';
import useRides from '../hooks/useRides';
import useAuth from '../hooks/useAuth';
import useNotification from '../hooks/useNotification';

export default function FindRide() {
  const navigate = useNavigate();
  const { rides, joinRide } = useRides();
  const { user, isAuthenticated } = useAuth();
  const { showNotification } = useNotification();

  const [isLoading, setIsLoading] = useState(false);

  // SearchBar state
  const [searchParams, setSearchParams] = useState({
    from: '',
    to: '',
    date: '',
    time: '',
    seats: '1'
  });

  const [activeFilter, setActiveFilter] = useState({
    from: '',
    to: '',
    date: '',
    time: '',
    seats: '1'
  });

  // FilterPanel state (Refine & Sort)
  const defaultPanelFilters = {
    maxPrice: 150,
    vehicleType: 'all',
    minSeats: 1,
    sortBy: 'earliest'
  };
  const [panelFilters, setPanelFilters] = useState(defaultPanelFilters);

  const [selectedRideToJoin, setSelectedRideToJoin] = useState(null);

  const handleFieldChange = (field, value) => {
    setSearchParams((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSearch = (submittedValues) => {
    setIsLoading(true);
    setActiveFilter({ ...submittedValues });
    setTimeout(() => {
      setIsLoading(false);
    }, 350);
  };

  const handlePanelFilterChange = (key, value) => {
    setPanelFilters((prev) => ({
      ...prev,
      [key]: value
    }));
  };

  const handleReset = () => {
    setIsLoading(true);
    const emptySearch = { from: '', to: '', date: '', time: '', seats: '1' };
    setSearchParams(emptySearch);
    setActiveFilter(emptySearch);
    setPanelFilters(defaultPanelFilters);
    showNotification('Search filters have been reset to default', 'info');
    setTimeout(() => {
      setIsLoading(false);
    }, 250);
  };

  const parseTimeToMinutes = (timeStr) => {
    if (!timeStr) return null;
    const clean = timeStr.trim().toUpperCase();
    const isPM = clean.includes('PM');
    const isAM = clean.includes('AM');
    const parts = clean.replace(/[APM]/g, '').trim().split(':');
    if (parts.length < 2) return null;
    let hours = parseInt(parts[0], 10);
    const mins = parseInt(parts[1], 10) || 0;
    if (isPM && hours < 12) hours += 12;
    if (isAM && hours === 12) hours = 0;
    return hours * 60 + mins;
  };

  // Filter and sort rides dynamically from React state
  const filteredAndSortedRides = (rides || [])
    .filter((ride) => {
      if (ride.status === 'Cancelled') return false;

      // 1. Location match
      const fromQuery = activeFilter.from.trim().toLowerCase();
      const toQuery = activeFilter.to.trim().toLowerCase();

      if (fromQuery && !ride.from.toLowerCase().includes(fromQuery)) {
        return false;
      }
      if (toQuery && !ride.to.toLowerCase().includes(toQuery)) {
        return false;
      }

      // 2. Date match
      if (activeFilter.date && ride.date !== activeFilter.date) {
        return false;
      }

      // 3. Time match
      if (activeFilter.time) {
        const searchMinutes = parseTimeToMinutes(activeFilter.time);
        const rideMinutes = parseTimeToMinutes(ride.time);
        if (searchMinutes !== null && rideMinutes !== null) {
          if (rideMinutes < searchMinutes - 30) {
            return false;
          }
        }
      }

      // 4. Seats requirement (higher of search bar or filter panel)
      const requestedSeats = Math.max(
        parseInt(activeFilter.seats, 10) || 1,
        panelFilters.minSeats || 1
      );
      const availableSeats = getAvailableSeats(ride);
      if (availableSeats < requestedSeats) {
        return false;
      }

      // 5. Max price contribution filter
      if (ride.contribution > panelFilters.maxPrice) {
        return false;
      }

      // 6. Vehicle type filter
      if (panelFilters.vehicleType !== 'all') {
        const vType = (ride.vehicleType || '').toLowerCase();
        if (!vType.includes(panelFilters.vehicleType.toLowerCase())) {
          return false;
        }
      }

      return true;
    })
    .sort((a, b) => {
      switch (panelFilters.sortBy) {
        case 'price-asc':
          return a.contribution - b.contribution;
        case 'price-desc':
          return b.contribution - a.contribution;
        case 'seats-desc':
          return getAvailableSeats(b) - getAvailableSeats(a);
        case 'rating-desc':
          return (Number(b.rating) || 0) - (Number(a.rating) || 0);
        case 'earliest':
        default: {
          const aMins = parseTimeToMinutes(a.time) || 0;
          const bMins = parseTimeToMinutes(b.time) || 0;
          return aMins - bMins;
        }
      }
    });

  const count = filteredAndSortedRides.length;
  const countText = count === 0 ? 'No rides found' : count === 1 ? '1 ride found' : `${count} rides found`;

  const handleOpenJoinDialog = (ride) => {
    if (!isAuthenticated) {
      showNotification('Please log in with your student account to join a campus ride', 'warning');
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
      showNotification(
        `✓ Seat reserved for ${selectedRideToJoin.from} → ${selectedRideToJoin.to}. View in Bookings!`,
        'success'
      );
      setSelectedRideToJoin(null);
    }
  };

  return (
    <div className="find-ride-page">
      <PageHeader
        title="Find a Campus Ride"
        description="Search for fellow students travelling your route, apply multi-criteria filters, and reserve your seat."
        badge={<span className="status-badge badge-active">{countText}</span>}
      />

      <div className="container" style={{ marginBottom: '4rem' }}>
        {/* Dynamic Search Controls */}
        <SearchBar
          values={searchParams}
          onChange={handleFieldChange}
          onSearch={handleSearch}
        />

        {/* Advanced Multi-Criteria Filter & Sort Panel */}
        <FilterPanel
          filters={panelFilters}
          onChangeFilter={handlePanelFilterChange}
          onReset={handleReset}
          totalResultsCount={count}
        />

        {/* Dynamic Results Display or Skeleton */}
        {isLoading ? (
          <LoadingSkeleton count={3} type="card" />
        ) : count > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
            {filteredAndSortedRides.map((ride) => (
              <RideCard
                key={ride.id}
                ride={ride}
                onJoinClick={handleOpenJoinDialog}
                currentUserId={user?.id}
                currentUserName={user?.name}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No rides found"
            description="No scheduled rides match your criteria. Try adjusting your locations or reset filters to see all rides."
            actionLabel="Reset Filters"
            onAction={handleReset}
          />
        )}
      </div>

      {/* Confirmation Dialog for Joining Ride */}
      <ConfirmDialog
        isOpen={Boolean(selectedRideToJoin)}
        title="Join this ride?"
        message="Please review the trip summary before confirming your seat reservation:"
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
              <div style={{ fontSize: '0.8rem', color: 'var(--accent-600)', fontWeight: 600 }}>
                Passenger: {user?.name || 'Current Student'} (1 seat reserved)
              </div>
            </div>
          )
        }
        confirmLabel="Confirm Booking"
        cancelLabel="Cancel"
        confirmVariant="accent"
        onConfirm={handleConfirmJoin}
        onCancel={() => setSelectedRideToJoin(null)}
        icon={<Car size={22} color="var(--accent-600)" />}
      />
    </div>
  );
}
