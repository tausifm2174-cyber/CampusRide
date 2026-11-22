import React, { useState } from 'react';
import { SlidersHorizontal, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';
import Button from './Button';

/**
 * Reusable FilterPanel Component
 * Handles multi-criteria filtering and sorting with clean event delegation
 * Fully responsive: Collapsible on mobile viewports, fully expanded on desktop
 */
export default function FilterPanel({
  filters,
  onChangeFilter,
  onReset,
  totalResultsCount = 0,
  className = ''
}) {
  const [mobileExpanded, setMobileExpanded] = useState(false);

  const vehicleTypes = [
    { value: 'all', label: 'All Vehicles' },
    { value: 'sedan', label: 'Sedan' },
    { value: 'hatchback', label: 'Hatchback' },
    { value: 'suv', label: 'Compact SUV' },
    { value: 'electric', label: 'Electric EV' },
    { value: 'bike', label: 'Bike / Two-Wheeler' }
  ];

  const sortOptions = [
    { value: 'earliest', label: 'Departure: Earliest First' },
    { value: 'price-asc', label: 'Price: Low → High' },
    { value: 'price-desc', label: 'Price: High → Low' },
    { value: 'seats-desc', label: 'Seats: Most Available' },
    { value: 'rating-desc', label: 'Rating: Highest First' }
  ];

  const isFiltered = Boolean(
    (filters.maxPrice && filters.maxPrice < 150) ||
    (filters.vehicleType && filters.vehicleType !== 'all') ||
    (filters.minSeats && filters.minSeats > 1) ||
    (filters.sortBy && filters.sortBy !== 'earliest')
  );

  return (
    <div className={`filter-panel card ${className}`}>
      {/* Header Bar */}
      <div className="filter-panel-header">
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={18} color="var(--accent-600)" />
          <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--primary-900)' }}>
            Refine & Sort Rides
          </h3>
          {isFiltered && (
            <span className="status-badge badge-active" style={{ fontSize: '0.72rem', padding: '0.15rem 0.5rem' }}>
              Filtered
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          <span className="filter-results-counter">
            Showing <strong>{totalResultsCount}</strong> ride{totalResultsCount === 1 ? '' : 's'}
          </span>

          <Button
            variant="subtle"
            size="sm"
            onClick={onReset}
            icon={<RefreshCw size={13} />}
          >
            Reset
          </Button>

          {/* Mobile Collapse Toggle Button */}
          <button
            type="button"
            className="filter-mobile-toggle-btn"
            onClick={() => setMobileExpanded(!mobileExpanded)}
            aria-expanded={mobileExpanded}
            aria-label="Toggle filter controls"
          >
            {mobileExpanded ? (
              <span className="flex items-center gap-1">
                <span>Hide Filters</span>
                <ChevronUp size={16} />
              </span>
            ) : (
              <span className="flex items-center gap-1">
                <span>Filters</span>
                <ChevronDown size={16} />
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Controls Grid (Always visible on desktop, toggleable on mobile) */}
      <div className={`filter-controls-grid ${mobileExpanded ? 'filter-mobile-open' : ''}`}>
        {/* Maximum Contribution Filter */}
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label htmlFor="filter-max-price" className="form-label" style={{ fontSize: '0.8125rem' }}>
            <span>Max Contribution: ₹{filters.maxPrice || 100}</span>
          </label>
          <input
            id="filter-max-price"
            type="range"
            min="20"
            max="150"
            step="5"
            value={filters.maxPrice || 100}
            onChange={(e) => onChangeFilter('maxPrice', Number(e.target.value))}
            className="price-range-slider"
            aria-label="Filter maximum contribution per passenger in rupees"
          />
          <div className="flex justify-between" style={{ fontSize: '0.72rem', color: 'var(--text-light)', marginTop: '0.2rem' }}>
            <span>₹20</span>
            <span>₹85</span>
            <span>₹150</span>
          </div>
        </div>

        {/* Vehicle Type Filter */}
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label htmlFor="filter-vehicle" className="form-label" style={{ fontSize: '0.8125rem' }}>
            Vehicle Type
          </label>
          <select
            id="filter-vehicle"
            className="form-select"
            style={{ padding: '0.55rem 0.75rem', fontSize: '0.875rem' }}
            value={filters.vehicleType || 'all'}
            onChange={(e) => onChangeFilter('vehicleType', e.target.value)}
          >
            {vehicleTypes.map((v) => (
              <option key={v.value} value={v.value}>
                {v.label}
              </option>
            ))}
          </select>
        </div>

        {/* Minimum Seats Filter */}
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label htmlFor="filter-min-seats" className="form-label" style={{ fontSize: '0.8125rem' }}>
            Min Available Seats
          </label>
          <select
            id="filter-min-seats"
            className="form-select"
            style={{ padding: '0.55rem 0.75rem', fontSize: '0.875rem' }}
            value={filters.minSeats || 1}
            onChange={(e) => onChangeFilter('minSeats', Number(e.target.value))}
          >
            <option value="1">At least 1 seat</option>
            <option value="2">At least 2 seats</option>
            <option value="3">At least 3 seats</option>
            <option value="4">4+ seats</option>
          </select>
        </div>

        {/* Sort Order Selector */}
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label htmlFor="filter-sort" className="form-label" style={{ fontSize: '0.8125rem' }}>
            Sort By
          </label>
          <select
            id="filter-sort"
            className="form-select"
            style={{ padding: '0.55rem 0.75rem', fontSize: '0.875rem', fontWeight: 600, color: 'var(--primary-900)' }}
            value={filters.sortBy || 'earliest'}
            onChange={(e) => onChangeFilter('sortBy', e.target.value)}
          >
            {sortOptions.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
