import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import Navigation from './Navigation';
import Logo from './Logo';

function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    if (password !== passwordConfirm) {
      return setError('Passwords do not match');
    }

    try {
      setError('');
      setLoading(true);
      await signup(email, password);
      navigate('/dashboard');
    } catch (error) {
      setError('Failed to create an account: ' + error.message);
    }

    setLoading(false);
  }

  async function handleGoogleSignup() {
    try {
      setError('');
      setLoading(true);
      await loginWithGoogle();
      navigate('/dashboard');
    } catch (error) {
      setError('Failed to sign up with Google: ' + error.message);
    }

    setLoading(false);
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#111827' }}>
      {/* Navigation */}
      <Navigation />
      
      <div style={{ minHeight: 'calc(100vh - 60px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 16px' }}>
      <div style={{ maxWidth: '400px', width: '100%', backgroundColor: '#1f2937', borderRadius: '12px', padding: '32px', border: '1px solid #374151' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          {/* RESOUND Logo */}
          <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'center' }}>
            <Logo size={80} showText={true} />
          </div>
          
          <h2 style={{ fontSize: '32px', fontWeight: 'bold', color: 'white', marginBottom: '8px' }}>
            Join RESOUND
          </h2>
          <p style={{ color: '#9ca3af', fontSize: '16px' }}>
            Create your account to start mastering
          </p>
          
          {/* Navigation to Landing Page */}
          <div style={{ marginTop: '16px' }}>
            <Link to="/" style={{ color: '#3b82f6', textDecoration: 'none', fontSize: '14px', fontWeight: '500' }}>
              ← Back to Home
            </Link>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {error && (
            <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '12px', borderRadius: '8px', fontSize: '14px' }}>
              {error}
            </div>
          )}
          
          <div>
            <label style={{ display: 'block', color: '#d1d5db', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
              Email Address
            </label>
            <input
              id="email-address"
              name="email"
              type="email"
              autoComplete="email"
              required
              style={{
                width: '100%',
                padding: '12px 16px',
                backgroundColor: '#374151',
                border: '1px solid #4b5563',
                borderRadius: '8px',
                color: 'white',
                fontSize: '16px',
                outline: 'none',
                transition: 'all 0.3s ease'
              }}
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={(e) => { e.target.style.borderColor = '#3b82f6'; e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)'; }}
              onBlur={(e) => { e.target.style.borderColor = '#4b5563'; e.target.style.boxShadow = 'none'; }}
            />
          </div>
          
          <div>
            <label style={{ display: 'block', color: '#d1d5db', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              style={{
                width: '100%',
                padding: '12px 16px',
                backgroundColor: '#374151',
                border: '1px solid #4b5563',
                borderRadius: '8px',
                color: 'white',
                fontSize: '16px',
                outline: 'none',
                transition: 'all 0.3s ease'
              }}
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={(e) => { e.target.style.borderColor = '#3b82f6'; e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)'; }}
              onBlur={(e) => { e.target.style.borderColor = '#4b5563'; e.target.style.boxShadow = 'none'; }}
            />
          </div>
          
          <div>
            <label style={{ display: 'block', color: '#d1d5db', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
              Confirm Password
            </label>
            <input
              id="password-confirm"
              name="password-confirm"
              type="password"
              autoComplete="new-password"
              required
              style={{
                width: '100%',
                padding: '12px 16px',
                backgroundColor: '#374151',
                border: '1px solid #4b5563',
                borderRadius: '8px',
                color: 'white',
                fontSize: '16px',
                outline: 'none',
                transition: 'all 0.3s ease'
              }}
              placeholder="Confirm your password"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              onFocus={(e) => { e.target.style.borderColor = '#3b82f6'; e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)'; }}
              onBlur={(e) => { e.target.style.borderColor = '#4b5563'; e.target.style.boxShadow = 'none'; }}
            />
          </div>

          <button
            disabled={loading}
            type="submit"
            style={{
              width: '100%',
              padding: '12px 16px',
              backgroundColor: loading ? '#6b7280' : '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              marginTop: '8px'
            }}
            onMouseEnter={(e) => { if (!loading) e.target.style.backgroundColor = '#2563eb'; }}
            onMouseLeave={(e) => { if (!loading) e.target.style.backgroundColor = '#3b82f6'; }}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>

          <div style={{ position: 'relative', textAlign: 'center', margin: '20px 0' }}>
            <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: '1px', backgroundColor: '#4b5563' }}></div>
            <span style={{ backgroundColor: '#1f2937', color: '#9ca3af', padding: '0 16px', fontSize: '14px' }}>or</span>
          </div>

          <button
            disabled={loading}
            type="button"
            onClick={handleGoogleSignup}
            style={{
              width: '100%',
              padding: '12px 16px',
              backgroundColor: loading ? '#6b7280' : '#374151',
              color: 'white',
              border: '1px solid #4b5563',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
            onMouseEnter={(e) => { if (!loading) e.target.style.backgroundColor = '#4b5563'; }}
            onMouseLeave={(e) => { if (!loading) e.target.style.backgroundColor = '#374151'; }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            {loading ? 'Creating Account...' : 'Continue with Google'}
          </button>

          <div style={{ textAlign: 'center', marginTop: '24px' }}>
            <span style={{ color: '#9ca3af', fontSize: '14px' }}>
              Already have an account?{' '}
              <Link to="/login" style={{ color: '#3b82f6', textDecoration: 'none', fontWeight: '500' }}>
                Sign in
              </Link>
            </span>
          </div>
        </form>
      </div>
      </div>
    </div>
  );
}

export default Signup;