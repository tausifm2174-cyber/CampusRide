import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogIn, AlertCircle } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import FormInput from '../components/FormInput';
import Button from '../components/Button';
import useAuth from '../hooks/useAuth';
import useNotification from '../hooks/useNotification';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { showNotification } = useNotification();

  const [email, setEmail] = useState('tausif@example.com');
  const [password, setPassword] = useState('123456');
  const [errorMessage, setErrorMessage] = useState('');

  // Destination after login (if redirected from ProtectedRoute)
  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email.trim() || !password) {
      setErrorMessage('Please enter both email and password.');
      return;
    }

    const result = login(email, password);

    if (result.success) {
      showNotification(`Welcome back, ${result.user?.name || 'Student'}! 👋`, 'success');
      navigate(from, { replace: true });
    } else {
      setErrorMessage(result.error || 'Invalid email or password.');
    }
  };

  const fillDemoCredentials = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setErrorMessage('');
  };

  return (
    <div className="login-page">
      <PageHeader
        title="Student Login"
        description="Sign in to your verified CampusRide account using your college email address."
      />

      <div className="container" style={{ maxWidth: '460px', marginBottom: '4rem' }}>
        {/* Error notification */}
        {errorMessage && (
          <div className="alert-banner alert-danger" role="alert">
            <AlertCircle size={18} />
            <div>{errorMessage}</div>
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
              <LogIn size={24} />
            </div>
            <h2 style={{ fontSize: '1.35rem', color: 'var(--primary-900)' }}>
              Welcome back to CampusRide
            </h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              Enter your student credentials
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <FormInput
              label="College Email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setErrorMessage('');
              }}
              placeholder="e.g. tausif@example.com"
              required
            />

            <FormInput
              label="Password"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setErrorMessage('');
              }}
              required
            />

            <div style={{ marginTop: '1.5rem' }}>
              <Button type="submit" variant="accent" fullWidth size="lg">
                Sign In to Dashboard
              </Button>
            </div>
          </form>

          {/* Quick Demo Credentials Switcher for Evaluation */}
          <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'var(--bg-main)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>
              Quick Demo Accounts (1-Click Fill)
            </span>
            <div className="flex gap-2" style={{ marginTop: '0.5rem' }}>
              <Button
                variant="secondary"
                size="sm"
                fullWidth
                onClick={() => fillDemoCredentials('tausif@example.com', '123456')}
              >
                Tausif (CS 2nd Yr)
              </Button>
              <Button
                variant="secondary"
                size="sm"
                fullWidth
                onClick={() => fillDemoCredentials('rahul@example.com', '123456')}
              >
                Rahul (IS 3rd Yr)
              </Button>
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-subtle)', fontSize: '0.875rem' }}>
            <span style={{ color: 'var(--text-secondary)' }}>New student to CampusRide? </span>
            <Link to="/register" style={{ color: 'var(--accent-600)', fontWeight: 600 }}>
              Create Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
