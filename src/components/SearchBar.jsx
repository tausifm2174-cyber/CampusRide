import React from 'react';
import { Search, MapPin, Calendar, Users, Clock } from 'lucide-react';
import Button from './Button';

/**
 * Reusable SearchBar Component for Finding Rides
 */
export default function SearchBar({
  values = { from: '', to: '', date: '', time: '', seats: '1' },
  onChange,
  onSearch,
  locations = ['Yelahanka', 'Yeshwanthpur', 'Nagarbhavi', 'Kengeri', 'Rajajinagar', 'Peenya', 'SJBIT Campus', 'Banashankari', 'RR Nagar'],
  isCompact = false,
  className = ''
}) {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(values);
    }
  };

  return (
    <form className={`search-panel ${className}`} onSubmit={handleSubmit} role="search">
      <div className="search-grid">
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label htmlFor="search-from" className="form-label">
            <span className="flex items-center gap-1">
              <MapPin size={14} color="var(--accent-600)" />
              From
            </span>
          </label>
          <input
            id="search-from"
            type="text"
            list="from-locations"
            className="form-input"
            placeholder="e.g. Yelahanka"
            value={values.from || ''}
            onChange={(e) => onChange && onChange('from', e.target.value)}
          />
          <datalist id="from-locations">
            {locations.map((loc) => (
              <option key={`from-${loc}`} value={loc} />
            ))}
          </datalist>
        </div>

        <div className="form-group" style={{ marginBottom: 0 }}>
          <label htmlFor="search-to" className="form-label">
            <span className="flex items-center gap-1">
              <MapPin size={14} color="var(--rose-500)" />
              To
            </span>
          </label>
          <input
            id="search-to"
            type="text"
            list="to-locations"
            className="form-input"
            placeholder="e.g. SJBIT Campus"
            value={values.to || ''}
            onChange={(e) => onChange && onChange('to', e.target.value)}
          />
          <datalist id="to-locations">
            {locations.map((loc) => (
              <option key={`to-${loc}`} value={loc} />
            ))}
          </datalist>
        </div>

        <div className="form-group" style={{ marginBottom: 0 }}>
          <label htmlFor="search-date" className="form-label">
            <span className="flex items-center gap-1">
              <Calendar size={14} color="var(--primary-600)" />
              Date
            </span>
          </label>
          <input
            id="search-date"
            type="date"
            className="form-input"
            value={values.date || ''}
            onChange={(e) => onChange && onChange('date', e.target.value)}
          />
        </div>

        <div className="form-group" style={{ marginBottom: 0 }}>
          <label htmlFor="search-time" className="form-label">
            <span className="flex items-center gap-1">
              <Clock size={14} color="var(--primary-600)" />
              Time
            </span>
          </label>
          <input
            id="search-time"
            type="time"
            className="form-input"
            value={values.time || ''}
            onChange={(e) => onChange && onChange('time', e.target.value)}
          />
        </div>

        <div className="form-group" style={{ marginBottom: 0 }}>
          <label htmlFor="search-seats" className="form-label">
            <span className="flex items-center gap-1">
              <Users size={14} color="var(--primary-600)" />
              Seats
            </span>
          </label>
          <select
            id="search-seats"
            className="form-select"
            value={values.seats || '1'}
            onChange={(e) => onChange && onChange('seats', e.target.value)}
          >
            <option value="1">1 Seat</option>
            <option value="2">2 Seats</option>
            <option value="3">3 Seats</option>
            <option value="4">4+ Seats</option>
          </select>
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-end' }}>
          <Button
            type="submit"
            variant="accent"
            fullWidth
            icon={<Search size={18} />}
          >
            Search Rides
          </Button>
        </div>
      </div>
    </form>
  );
}
