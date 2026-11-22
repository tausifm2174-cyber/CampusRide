import React, { useState } from 'react';
import {
  User,
  GraduationCap,
  Mail,
  Phone,
  Car,
  Star,
  ShieldCheck,
  CheckCircle2,
  Edit2,
  Save,
  X
} from 'lucide-react';
import PageHeader from '../components/PageHeader';
import Sidebar from '../components/Sidebar';
import Button from '../components/Button';
import FormInput from '../components/FormInput';
import SelectInput from '../components/SelectInput';
import useAuth from '../hooks/useAuth';
import useRides from '../hooks/useRides';
import useNotification from '../hooks/useNotification';

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const { rides, bookings } = useRides();
  const { showNotification } = useNotification();

  const [isEditing, setIsEditing] = useState(false);
  const [saveAlert, setSaveAlert] = useState('');

  const [editForm, setEditForm] = useState({
    name: user?.name || '',
    course: user?.course || '',
    year: user?.year || '',
    phone: user?.phone || '',
    vehicle: user?.vehicle || ''
  });

  // Calculate dynamic stats
  const offeredCount = (rides || []).filter(
    (r) => r.driverId === user?.id || r.driverName === user?.name
  ).length;

  const bookedCount = (bookings || []).filter(
    (b) => (b.passengerId === user?.id || b.passengerName === user?.name) && b.status !== 'Cancelled'
  ).length;

  const totalTrips = offeredCount + bookedCount;
  const estimatedSavings = bookedCount * 65;
  const co2Offset = (totalTrips * 3.2).toFixed(1);

  const handleStartEdit = () => {
    setEditForm({
      name: user?.name || '',
      course: user?.course || '',
      year: user?.year || '',
      phone: user?.phone || '',
      vehicle: user?.vehicle || ''
    });
    setIsEditing(true);
    setSaveAlert('');
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    updateProfile(editForm);
    setIsEditing(false);
    showNotification('✓ Profile information updated successfully', 'success');
  };

  return (
    <div className="profile-page">
      <PageHeader
        title="Student Profile"
        description="Verified college credentials, vehicle registration, and student mobility stats."
        actions={
          !isEditing && (
            <Button
              variant="secondary"
              size="sm"
              onClick={handleStartEdit}
              icon={<Edit2 size={14} />}
            >
              Edit Profile
            </Button>
          )
        }
      />

      <div className="container" style={{ marginBottom: '4rem' }}>
        <div className="portal-layout">
          <div className="portal-sidebar">
            <Sidebar />
          </div>

          <div className="portal-content flex flex-col gap-6">
            {/* Feedback Alert */}
            {saveAlert && (
              <div className="alert-banner alert-success" role="alert">
                <CheckCircle2 size={18} />
                <div style={{ flex: 1 }}>{saveAlert}</div>
                <Button variant="subtle" size="sm" onClick={() => setSaveAlert('')}>
                  Dismiss
                </Button>
              </div>
            )}

            {/* Main Profile Info Card with Student Driver Image */}
            <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1.5rem', marginBottom: '1.5rem' }}>
                <img
                  src={user?.avatar || '/assets/student-driver.jpg'}
                  alt={user?.name}
                  style={{
                    width: 100,
                    height: 100,
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '3px solid var(--accent-500)',
                    boxShadow: 'var(--shadow-md)'
                  }}
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h2 style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--primary-900)' }}>
                      {user?.name}
                    </h2>
                    <span className="status-badge badge-active flex items-center gap-1">
                      <ShieldCheck size={14} /> Verified {user?.role || 'STUDENT'}
                    </span>
                  </div>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '0.2rem' }}>
                    Student USN: <strong>{user?.studentId}</strong> • {user?.course} ({user?.year})
                  </p>
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      backgroundColor: '#fef3c7',
                      color: '#b45309',
                      padding: '0.25rem 0.6rem',
                      borderRadius: 'var(--radius-sm)',
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      marginTop: '0.5rem'
                    }}
                  >
                    <Star size={13} fill="#b45309" color="#b45309" />
                    <span>{user?.rating || 4.8} Star Rating</span>
                    <span style={{ color: '#92400e', fontWeight: 500, marginLeft: 4 }}>
                      • {user?.ridesCompleted || 14} rides completed
                    </span>
                  </div>
                </div>
              </div>

              {/* Editing Form or Static Display */}
              {isEditing ? (
                <form onSubmit={handleSaveProfile}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                    <FormInput
                      label="Student Name"
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      required
                    />
                    <FormInput
                      label="Mobile Phone"
                      value={editForm.phone}
                      onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                      required
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                    <FormInput
                      label="Course / Engineering Department"
                      value={editForm.course}
                      onChange={(e) => setEditForm({ ...editForm, course: e.target.value })}
                      required
                    />
                    <SelectInput
                      label="Academic Year"
                      value={editForm.year}
                      onChange={(e) => setEditForm({ ...editForm, year: e.target.value })}
                      options={[
                        { value: '1st Year', label: '1st Year' },
                        { value: '2nd Year', label: '2nd Year' },
                        { value: '3rd Year', label: '3rd Year' },
                        { value: '4th Year', label: '4th Year' }
                      ]}
                      required
                    />
                  </div>

                  <FormInput
                    label="Registered Vehicle Details"
                    value={editForm.vehicle}
                    onChange={(e) => setEditForm({ ...editForm, vehicle: e.target.value })}
                    placeholder="e.g. Maruti Suzuki Swift (White) • KA 05 MC 3321"
                    helpText="Vehicle details appear to co-riders when you publish rides"
                  />

                  <div className="flex gap-2" style={{ marginTop: '1.5rem', justifyContent: 'flex-end' }}>
                    <Button variant="secondary" size="sm" onClick={() => setIsEditing(false)} icon={<X size={14} />}>
                      Cancel
                    </Button>
                    <Button variant="accent" size="sm" type="submit" icon={<Save size={14} />}>
                      Save Changes
                    </Button>
                  </div>
                </form>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
                  <div className="flex items-start gap-3">
                    <GraduationCap size={20} color="var(--primary-600)" style={{ marginTop: 2 }} />
                    <div>
                      <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>
                        College Institution
                      </div>
                      <div style={{ fontWeight: 600, color: 'var(--primary-900)' }}>
                        {user?.college}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <User size={20} color="var(--primary-600)" style={{ marginTop: 2 }} />
                    <div>
                      <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>
                        Course & Academic Year
                      </div>
                      <div style={{ fontWeight: 600, color: 'var(--primary-900)' }}>
                        {user?.course} ({user?.year})
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Mail size={20} color="var(--primary-600)" style={{ marginTop: 2 }} />
                    <div>
                      <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>
                        College Email Address
                      </div>
                      <div style={{ fontWeight: 600, color: 'var(--primary-900)' }}>
                        {user?.email}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Phone size={20} color="var(--primary-600)" style={{ marginTop: 2 }} />
                    <div>
                      <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>
                        Mobile Contact
                      </div>
                      <div style={{ fontWeight: 600, color: 'var(--primary-900)' }}>
                        {user?.phone}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3" style={{ gridColumn: '1 / -1' }}>
                    <Car size={20} color="var(--accent-600)" style={{ marginTop: 2 }} />
                    <div>
                      <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>
                        Registered Vehicle
                      </div>
                      <div style={{ fontWeight: 600, color: 'var(--primary-900)' }}>
                        {user?.vehicle}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Mobility Stats Card */}
            <div className="card">
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1.25rem', color: 'var(--primary-900)' }}>
                Campus Impact & Travel Stats
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
                <div style={{ background: 'var(--bg-main)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Total Trips</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary-900)' }}>
                    {totalTrips}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginTop: '0.2rem' }}>
                    {offeredCount} offered • {bookedCount} joined
                  </div>
                </div>

                <div style={{ background: 'var(--bg-main)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Estimated Fuel Savings</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--emerald-600)' }}>
                    ₹{estimatedSavings}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginTop: '0.2rem' }}>
                    Shared travel economy
                  </div>
                </div>

                <div style={{ background: 'var(--bg-main)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Carbon Footprint Offset</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent-600)' }}>
                    {co2Offset} kg
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginTop: '0.2rem' }}>
                    CO₂ avoided by pooling (Est.)
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
