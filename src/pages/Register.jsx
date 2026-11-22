import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, AlertCircle, CheckCircle2 } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import FormInput from '../components/FormInput';
import SelectInput from '../components/SelectInput';
import Button from '../components/Button';
import useAuth from '../hooks/useAuth';
import useNotification from '../hooks/useNotification';

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { showNotification } = useNotification();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    studentId: '',
    college: 'SJB Institute of Technology',
    course: 'Computer Science Engineering',
    year: '2nd Year',
    role: 'STUDENT',
    password: ''
  });

  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    if (generalError) {
      setGeneralError('');
    }
  };

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Full name is required';
    if (!formData.email.trim()) {
      errs.email = 'Email address is required';
    } else if (!formData.email.includes('@')) {
      errs.email = 'Please enter a valid email address';
    }
    if (!formData.studentId.trim()) errs.studentId = 'USN / Student ID is required';
    if (!formData.password || formData.password.length < 6) {
      errs.password = 'Password must be at least 6 characters long';
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

    const result = register({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      studentId: formData.studentId,
      college: formData.college,
      course: formData.course,
      year: formData.year,
      role: 'STUDENT'
    });

    if (result.success) {
      showNotification('✓ Account created successfully! Welcome to CampusRide.', 'success');
      navigate('/dashboard', { replace: true });
    } else {
      setGeneralError(result.error || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="register-page">
      <PageHeader
        title="Student Registration"
        description="Join the trusted campus ride-sharing network with your student credentials."
      />

      <div className="container" style={{ maxWidth: '520px', marginBottom: '4rem' }}>
        {generalError && (
          <div className="alert-banner alert-danger" role="alert">
            <AlertCircle size={18} />
            <div>{generalError}</div>
          </div>
        )}

        <div className="card">
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--accent-50)',
                color: 'var(--accent-600)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '0.75rem'
              }}
            >
              <UserPlus size={24} />
            </div>
            <h2 style={{ fontSize: '1.35rem', color: 'var(--primary-900)' }}>
              Create Your CampusRide Account
            </h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              Connect with fellow students for daily commutes
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <FormInput
              label="Full Name"
              name="name"
              placeholder="e.g. Shreya Sharma"
              value={formData.name}
              onChange={handleChange}
              required
              error={errors.name}
            />

            <FormInput
              label="Email Address"
              name="email"
              type="email"
              placeholder="e.g. shreya@example.com"
              value={formData.email}
              onChange={handleChange}
              required
              error={errors.email}
            />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <FormInput
                label="Student USN / ID"
                name="studentId"
                placeholder="1JB24CS099"
                value={formData.studentId}
                onChange={handleChange}
                required
                error={errors.studentId}
              />

              <SelectInput
                label="Course / Branch"
                name="course"
                value={formData.course}
                onChange={handleChange}
                options={[
                  { value: 'Computer Science Engineering', label: 'CSE' },
                  { value: 'Information Science', label: 'ISE' },
                  { value: 'Electronics & Communication', label: 'ECE' },
                  { value: 'Mechanical Engineering', label: 'ME' },
                  { value: 'Civil Engineering', label: 'Civil' }
                ]}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <SelectInput
                label="Academic Year"
                name="year"
                value={formData.year}
                onChange={handleChange}
                options={[
                  { value: '1st Year', label: '1st Year' },
                  { value: '2nd Year', label: '2nd Year' },
                  { value: '3rd Year', label: '3rd Year' },
                  { value: '4th Year', label: '4th Year' }
                ]}
                required
              />

              <FormInput
                label="Password (min 6 chars)"
                name="password"
                type="password"
                placeholder="••••••"
                value={formData.password}
                onChange={handleChange}
                required
                error={errors.password}
              />
            </div>

            <div style={{ marginTop: '1.5rem' }}>
              <Button type="submit" variant="accent" fullWidth size="lg">
                Register & Enter Dashboard
              </Button>
            </div>
          </form>

          <div style={{ textAlign: 'center', marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-subtle)', fontSize: '0.875rem' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Already have a student account? </span>
            <Link to="/login" style={{ color: 'var(--accent-600)', fontWeight: 600 }}>
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
