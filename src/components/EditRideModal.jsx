import React, { useState, useEffect } from 'react';
import { X, Edit3, AlertCircle } from 'lucide-react';
import FormInput from './FormInput';
import SelectInput from './SelectInput';
import Button from './Button';

/**
 * Reusable EditRideModal Component
 * Validates changes and strictly prevents seats < bookedSeats
 */
export default function EditRideModal({
  isOpen,
  ride,
  onSave,
  onClose
}) {
  const [formData, setFormData] = useState({
    from: '',
    to: '',
    date: '',
    time: '',
    seats: 3,
    contribution: 50,
    vehicleType: 'Car (Sedan)',
    vehicleModel: '',
    notes: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (ride) {
      setFormData({
        from: ride.from || '',
        to: ride.to || '',
        date: ride.date || '',
        time: ride.time || '',
        seats: ride.seats || 3,
        contribution: ride.contribution || 0,
        vehicleType: ride.vehicleType || 'Car (Sedan)',
        vehicleModel: ride.vehicleModel || '',
        notes: ride.notes || ''
      });
      setErrors({});
    }
  }, [ride, isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !ride) return null;

  const bookedSeats = Number(ride.bookedSeats) || 0;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const errs = {};
    if (!formData.from.trim()) errs.from = 'Pickup location is required';
    if (!formData.to.trim()) errs.to = 'Destination is required';
    if (formData.from.trim().toLowerCase() === formData.to.trim().toLowerCase()) {
      errs.to = 'Destination cannot be the same as pickup';
    }
    if (!formData.date) errs.date = 'Date is required';
    if (!formData.time) errs.time = 'Time is required';

    const seatsNum = parseInt(formData.seats, 10);
    if (!seatsNum || seatsNum <= 0) {
      errs.seats = 'Seats must be greater than 0';
    } else if (seatsNum < bookedSeats) {
      errs.seats = `Total seats cannot be less than current booked seats (${bookedSeats})`;
    }

    if (formData.contribution === '' || Number(formData.contribution) < 0) {
      errs.contribution = 'Contribution cannot be negative';
    }
    if (!formData.vehicleModel.trim()) {
      errs.vehicleModel = 'Vehicle model is required';
    }

    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const updated = {
      ...ride,
      from: formData.from.trim(),
      to: formData.to.trim(),
      date: formData.date,
      time: formData.time,
      seats: parseInt(formData.seats, 10),
      contribution: Number(formData.contribution),
      vehicleType: formData.vehicleType,
      vehicleModel: formData.vehicleModel.trim(),
      notes: formData.notes.trim()
    };

    onSave(updated);
  };

  const vehicleOptions = [
    { value: 'Car (Sedan)', label: 'Car (Sedan)' },
    { value: 'Car (Hatchback)', label: 'Car (Hatchback)' },
    { value: 'Car (Compact SUV)', label: 'Car (Compact SUV)' },
    { value: 'Car (Electric EV)', label: 'Electric Car (EV)' },
    { value: 'Bike / Scooter', label: 'Motorcycle / Scooter' },
    { value: 'Electric Two-Wheeler', label: 'Electric Two-Wheeler' }
  ];

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="edit-ride-title">
      <div className="modal-card" style={{ maxWidth: '600px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="flex items-center gap-2">
            <Edit3 size={20} color="var(--accent-600)" />
            <h3 id="edit-ride-title" className="modal-title">Edit Published Ride</h3>
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close dialog"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="modal-body flex flex-col gap-3">
            {bookedSeats > 0 && (
              <div
                style={{
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--amber-100)',
                  color: 'var(--amber-700)',
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  marginBottom: '0.5rem'
                }}
              >
                <AlertCircle size={16} />
                <span>
                  <strong>Note:</strong> This ride already has <strong>{bookedSeats}</strong> booked seat{bookedSeats > 1 ? 's' : ''}. Total seats cannot be reduced below {bookedSeats}.
                </span>
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <FormInput
                label="From"
                name="from"
                value={formData.from}
                onChange={handleChange}
                required
                error={errors.from}
              />
              <FormInput
                label="To"
                name="to"
                value={formData.to}
                onChange={handleChange}
                required
                error={errors.to}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <FormInput
                label="Date"
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                error={errors.date}
              />
              <FormInput
                label="Time"
                type="text"
                name="time"
                placeholder="e.g. 08:00 AM"
                value={formData.time}
                onChange={handleChange}
                required
                error={errors.time}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <FormInput
                label="Total Seats"
                type="number"
                min={bookedSeats || 1}
                name="seats"
                value={formData.seats}
                onChange={handleChange}
                required
                error={errors.seats}
                helpText={`Minimum allowed: ${bookedSeats || 1}`}
              />
              <FormInput
                label="Contribution (₹)"
                type="number"
                min="0"
                name="contribution"
                value={formData.contribution}
                onChange={handleChange}
                required
                error={errors.contribution}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <SelectInput
                label="Vehicle Type"
                name="vehicleType"
                value={formData.vehicleType}
                onChange={handleChange}
                options={vehicleOptions}
                required
              />
              <FormInput
                label="Vehicle Model"
                name="vehicleModel"
                value={formData.vehicleModel}
                onChange={handleChange}
                required
                error={errors.vehicleModel}
              />
            </div>

            <div className="form-group">
              <label htmlFor="edit-notes" className="form-label">
                Additional Notes
              </label>
              <textarea
                id="edit-notes"
                name="notes"
                rows={2}
                className="form-textarea"
                value={formData.notes}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="modal-footer">
            <Button variant="secondary" onClick={onClose} type="button">
              Cancel
            </Button>
            <Button variant="accent" type="submit">
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
