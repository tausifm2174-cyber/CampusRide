import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import FormInput from '../components/FormInput';
import SelectInput from '../components/SelectInput';
import Button from '../components/Button';
import useAuth from '../hooks/useAuth';
import useRides from '../hooks/useRides';
import useNotification from '../hooks/useNotification';

export default function OfferRide() {
  const { user } = useAuth();
  const { addRide } = useRides();
  const { showNotification } = useNotification();
  const navigate = useNavigate();

  const initialFormState = {
    from: '',
    to: '',
    date: '',
    departureTime: '',
    availableSeats: '3',
    contribution: '50',
    vehicleType: 'Car (Sedan)',
    vehicleModel: user?.vehicle?.split('•')[0]?.trim() || '',
    notes: ''
  };

  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});

  const vehicleTypeOptions = [
    { value: 'Car (Sedan)', label: 'Car (Sedan)' },
    { value: 'Car (Hatchback)', label: 'Car (Hatchback)' },
    { value: 'Car (Compact SUV)', label: 'Car (Compact SUV)' },
    { value: 'Car (Electric EV)', label: 'Electric Car (EV)' },
    { value: 'Bike / Scooter', label: 'Motorcycle / Scooter' },
    { value: 'Electric Two-Wheeler', label: 'Electric Two-Wheeler' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const errs = {};
    const fromVal = formData.from.trim();
    const toVal = formData.to.trim();

    if (!fromVal) {
      errs.from = 'From (pickup location) is required';
    }
    if (!toVal) {
      errs.to = 'To (destination) is required';
    }
    if (fromVal && toVal && fromVal.toLowerCase() === toVal.toLowerCase()) {
      errs.to = 'From and To cannot be the same location';
    }
    if (!formData.date) {
      errs.date = 'Date is required';
    }
    if (!formData.departureTime) {
      errs.departureTime = 'Departure time is required';
    }

    const seatsNum = parseInt(formData.availableSeats, 10);
    if (!seatsNum || seatsNum <= 0) {
      errs.availableSeats = 'Seats must be greater than 0';
    }

    if (formData.contribution === '' || Number(formData.contribution) < 0) {
      errs.contribution = 'Contribution cannot be negative';
    }

    if (!formData.vehicleType) {
      errs.vehicleType = 'Vehicle type is required';
    }
    if (!formData.vehicleModel.trim()) {
      errs.vehicleModel = 'Vehicle model is required (e.g. Swift, Tiago, Activa)';
    }

    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      showNotification('Please correct the highlighted form errors', 'warning');
      return;
    }

    // Format display date
    let formattedDate = formData.date;
    try {
      const d = new Date(formData.date + 'T00:00:00');
      formattedDate = d.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      formattedDate = formData.date;
    }

    // Format departure time
    let formattedTime = formData.departureTime;
    if (formattedTime.includes(':')) {
      const [hours, mins] = formattedTime.split(':');
      const hourNum = parseInt(hours, 10);
      const ampm = hourNum >= 12 ? 'PM' : 'AM';
      const formattedHour = hourNum % 12 || 12;
      formattedTime = `${String(formattedHour).padStart(2, '0')}:${mins} ${ampm}`;
    }

    // Build new ride associated with the authenticated user
    const newRide = {
      id: Date.now(),
      driverId: user?.id || 'u-1',
      driverName: user?.name || 'Tausif M',
      driverAvatar: user?.avatar || '/assets/student-driver.jpg',
      college: user?.college || 'SJB Institute of Technology',
      department: user?.course ? `${user.course}, ${user.year}` : 'Student Driver',
      from: formData.from.trim(),
      to: formData.to.trim(),
      pickupPoint: formData.from.trim(),
      dropoffPoint: formData.to.trim(),
      date: formData.date,
      formattedDate,
      time: formattedTime,
      seats: parseInt(formData.availableSeats, 10),
      bookedSeats: 0,
      contribution: Number(formData.contribution),
      vehicleType: formData.vehicleType,
      vehicleModel: formData.vehicleModel.trim(),
      vehicleNumber: user?.vehicle ? user.vehicle.split('•')[1]?.trim() || 'KA 05 MC 3321' : 'KA 05 MC 3321',
      rating: user?.rating || 4.8,
      reviewCount: user?.ridesCompleted || 5,
      verifiedStudent: true,
      features: ['AC', 'Verified Student Driver', 'Non-Smoking'],
      notes: formData.notes.trim() || 'No additional notes specified.',
      status: 'Active'
    };

    addRide(newRide);
    showNotification(`✓ Ride published successfully: ${newRide.from} → ${newRide.to}`, 'success');
    navigate('/my-rides');
  };

  const handleReset = () => {
    setFormData(initialFormState);
    setErrors({});
  };

  return (
    <div className="offer-ride-page">
      <PageHeader
        title="Offer a Campus Ride"
        description="Share your empty car or bike seats with fellow students heading your way."
      />

      <div className="container" style={{ maxWidth: '800px', marginBottom: '4rem' }}>
        <div className="card">
          <div style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h2 style={{ fontSize: '1.35rem', color: 'var(--primary-900)', fontWeight: 800 }}>
                Ride Publishing Form
              </h2>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                Authenticated Driver: <strong>{user?.name}</strong> • {user?.course}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <img
                src={user?.avatar || '/assets/student-driver.jpg'}
                alt={user?.name}
                style={{ width: 38, height: 38, borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--accent-500)' }}
              />
              <span className="status-badge badge-active">DRIVER</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <div className="form-row-2col">
              <FormInput
                label="From (Pickup Location)"
                name="from"
                placeholder="e.g. Yelahanka Mother Dairy"
                value={formData.from}
                onChange={handleInputChange}
                required
                error={errors.from}
                helpText="Specify landmark or transit stop"
              />

              <FormInput
                label="To (Destination Campus / Stop)"
                name="to"
                placeholder="e.g. SJBIT Campus Main Gate"
                value={formData.to}
                onChange={handleInputChange}
                required
                error={errors.to}
                helpText="Specify college gate or campus building"
              />
            </div>

            <div className="form-row-3col">
              <FormInput
                label="Date"
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                required
                error={errors.date}
              />

              <FormInput
                label="Departure Time"
                type="time"
                name="departureTime"
                value={formData.departureTime}
                onChange={handleInputChange}
                required
                error={errors.departureTime}
              />

              <FormInput
                label="Available Seats"
                type="number"
                min="1"
                max="8"
                name="availableSeats"
                value={formData.availableSeats}
                onChange={handleInputChange}
                required
                error={errors.availableSeats}
              />
            </div>

            <div className="form-row-2col">
              <FormInput
                label="Contribution (₹ per passenger)"
                type="number"
                min="0"
                step="5"
                name="contribution"
                value={formData.contribution}
                onChange={handleInputChange}
                required
                error={errors.contribution}
                helpText="Suggested: ₹30 to ₹60 for campus commute"
              />

              <SelectInput
                label="Vehicle Type"
                name="vehicleType"
                value={formData.vehicleType}
                onChange={handleInputChange}
                options={vehicleTypeOptions}
                required
                error={errors.vehicleType}
              />
            </div>

            <FormInput
              label="Vehicle Model & Details"
              name="vehicleModel"
              placeholder="e.g. Maruti Suzuki Swift (White) - KA 05 MC 3321"
              value={formData.vehicleModel}
              onChange={handleInputChange}
              required
              error={errors.vehicleModel}
              helpText="Vehicle make, model, and colour helps students identify your ride"
            />

            <div className="form-group">
              <label htmlFor="notes" className="form-label">
                Additional Notes (Optional)
              </label>
              <textarea
                id="notes"
                name="notes"
                rows={3}
                className="form-textarea"
                placeholder="e.g. Leaving on time. Extra helmet available for bike. AC enabled."
                value={formData.notes}
                onChange={handleInputChange}
              />
            </div>

            <div style={{ marginTop: '1.75rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'flex-end', gap: '1rem', flexWrap: 'wrap' }}>
              <Button variant="secondary" onClick={handleReset} type="button">
                Clear Form
              </Button>
              <Button
                variant="accent"
                type="submit"
                icon={<PlusCircle size={18} />}
              >
                Publish Ride
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
