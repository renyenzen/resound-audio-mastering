import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Droplet, Crown, Gift } from 'lucide-react';
import Logo from './Logo';
import Navigation from './Navigation';

const LandingPage = () => {
  const navigate = useNavigate();

  const handleTierSelect = (tier) => {
    // Navigate to the audio processing flow with the selected tier
    navigate('/upload', { state: { selectedTier: tier } });
  };

  // Define tier-specific colors
  const tierColors = {
    free: {
      primary: '#60a5fa', // blue-400
      secondary: '#3b82f6', // blue-500
      light: '#dbeafe', // blue-100
      border: '#93c5fd' // blue-300
    },
    basic: {
      primary: '#10b981', // emerald-500
      secondary: '#059669', // emerald-600
      light: '#d1fae5', // emerald-100
      border: '#34d399' // emerald-400
    },
    premium: {
      primary: '#f59e0b', // amber-500
      secondary: '#d97706', // amber-600
      light: '#fef3c7', // amber-100
      border: '#fbbf24' // amber-400
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#111827', 
      color: 'white',
      backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url("https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed'
    }}>
      {/* Header */}
      <header style={{ padding: '16px 0', borderBottom: '1px solid #374151' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Logo size={60} showText={true} />
          </div>
          
          <nav style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
            <Link 
              to="/login" 
              style={{ 
                color: '#9ca3af', 
                textDecoration: 'none', 
                fontSize: '16px',
                transition: 'color 0.3s ease'
              }}
              onMouseEnter={(e) => e.target.style.color = 'white'}
              onMouseLeave={(e) => e.target.style.color = '#9ca3af'}
            >
              Sign In
            </Link>
            <Link 
              to="/signup" 
              style={{ 
                backgroundColor: '#3b82f6', 
                color: 'white', 
                padding: '8px 16px', 
                borderRadius: '6px', 
                textDecoration: 'none',
                fontSize: '16px',
                fontWeight: '500',
                transition: 'background-color 0.3s ease'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#2563eb'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#3b82f6'}
            >
              Sign Up
            </Link>
          </nav>
        </div>
      </header>

      {/* Navigation */}
      <Navigation />

      {/* Main Content - Tier Selection */}
      <main style={{ padding: '80px 16px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
          {/* Hero Section */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
            <Logo size={120} showText={false} />
          </div>
          <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: 'white', marginBottom: '8px', letterSpacing: '0.05em' }}>
            RESOUND
          </h1>
          <h2 style={{ fontSize: '36px', fontWeight: 'bold', color: 'white', marginBottom: '8px' }}>
            Instantly Perfect Your Sound
          </h2>
          <p style={{ fontSize: '24px', color: '#9ca3af', marginBottom: '32px', fontWeight: '300' }}>
            Unlimited Master. One Low Price.
          </p>
          
          {/* Subheading */}
          <h2 style={{ fontSize: '20px', color: '#d1d5db', marginBottom: '32px' }}>
            Upload your track to experience the power of AI mastering. Start for free.
          </h2>
          
          {/* Call-to-Action Button */}
          <button 
            onClick={() => navigate('/upload')}
            style={{
              backgroundColor: '#3b82f6',
              color: 'white',
              fontSize: '18px',
              fontWeight: '600',
              padding: '16px 32px',
              borderRadius: '12px',
              border: 'none',
              cursor: 'pointer',
              marginBottom: '64px',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => { e.target.style.backgroundColor = '#2563eb'; }}
            onMouseLeave={(e) => { e.target.style.backgroundColor = '#3b82f6'; }}
          >
            Upload Your Track & Start for Free
          </button>
          
          {/* Subscription Tiers */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '24px', maxWidth: '1200px', margin: '0 auto' }}>
            {/* Free Tier */}
            <div 
              onClick={() => handleTierSelect('free')}
              style={{ backgroundColor: '#1f2937', border: `1px solid ${tierColors.free.border}`, borderRadius: '12px', padding: '32px', cursor: 'pointer', transition: 'all 0.3s ease' }}
              onMouseEnter={(e) => { e.target.style.borderColor = tierColors.free.primary; e.target.style.boxShadow = `0 10px 15px -3px rgba(96, 165, 250, 0.2)`; }}
              onMouseLeave={(e) => { e.target.style.borderColor = tierColors.free.border; e.target.style.boxShadow = 'none'; }}
            >
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
                <div style={{ width: '64px', height: '64px', backgroundColor: tierColors.free.primary, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Gift style={{ width: '32px', height: '32px', color: 'white' }} />
                </div>
              </div>
              
              <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: 'white', marginBottom: '16px' }}>Free Tier</h3>
              
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: tierColors.free.primary, marginBottom: '16px' }}>$0</div>
              
              <ul style={{ color: '#d1d5db', lineHeight: '1.8', textAlign: 'left', listStyle: 'none', padding: 0, marginBottom: '24px' }}>
                <li style={{ marginBottom: '8px' }}>• Unlimited Previews</li>
                <li style={{ marginBottom: '8px' }}>• 1 Free Basic Download</li>
                <li style={{ marginBottom: '8px' }}>• Basic Features</li>
              </ul>
              
              <button style={{
                backgroundColor: tierColors.free.primary,
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '8px',
                fontWeight: '600',
                cursor: 'pointer',
                width: '100%',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => { e.target.style.backgroundColor = tierColors.free.secondary; }}
              onMouseLeave={(e) => { e.target.style.backgroundColor = tierColors.free.primary; }}
              >
                Start for Free
              </button>
            </div>
            
            {/* Basic Tier */}
            <div 
              onClick={() => handleTierSelect('basic')}
              style={{ backgroundColor: '#1f2937', border: `1px solid ${tierColors.basic.border}`, borderRadius: '12px', padding: '32px', cursor: 'pointer', transition: 'all 0.3s ease' }}
              onMouseEnter={(e) => { e.target.style.borderColor = tierColors.basic.primary; e.target.style.boxShadow = `0 10px 15px -3px rgba(16, 185, 129, 0.2)`; }}
              onMouseLeave={(e) => { e.target.style.borderColor = tierColors.basic.border; e.target.style.boxShadow = 'none'; }}
            >
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
                <div style={{ width: '64px', height: '64px', backgroundColor: tierColors.basic.primary, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Droplet style={{ width: '32px', height: '32px', color: 'white' }} />
                </div>
              </div>
              
              <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: 'white', marginBottom: '16px' }}>Basic Unlimited</h3>
              
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: tierColors.basic.primary, marginBottom: '16px' }}>$10<span style={{ fontSize: '16px', fontWeight: 'normal', color: '#d1d5db' }}>/month</span></div>
              
              <ul style={{ color: '#d1d5db', lineHeight: '1.8', textAlign: 'left', listStyle: 'none', padding: 0, marginBottom: '24px' }}>
                <li style={{ marginBottom: '8px' }}>• Unlimited Basic Masters</li>
                <li style={{ marginBottom: '8px' }}>• High-Quality WAV & FLAC Downloads</li>
                <li style={{ marginBottom: '8px' }}>• Priority Processing</li>
              </ul>
              
              <button style={{
                backgroundColor: tierColors.basic.primary,
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '8px',
                fontWeight: '600',
                cursor: 'pointer',
                width: '100%',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => { e.target.style.backgroundColor = tierColors.basic.secondary; }}
              onMouseLeave={(e) => { e.target.style.backgroundColor = tierColors.basic.primary; }}
              >
                Subscribe Now
              </button>
            </div>
            
            {/* Premium Tier */}
            <div 
              onClick={() => handleTierSelect('premium')}
              style={{ backgroundColor: '#1f2937', border: `2px solid ${tierColors.premium.primary}`, borderRadius: '12px', padding: '32px', cursor: 'pointer', transition: 'all 0.3s ease', position: 'relative', overflow: 'hidden' }}
              onMouseEnter={(e) => { e.target.style.borderColor = tierColors.premium.secondary; e.target.style.boxShadow = `0 10px 15px -3px rgba(245, 158, 11, 0.3)`; }}
              onMouseLeave={(e) => { e.target.style.borderColor = tierColors.premium.primary; e.target.style.boxShadow = 'none'; }}
            >
              {/* Premium Badge */}
              <div style={{ position: 'absolute', top: '16px', right: '16px', backgroundColor: tierColors.premium.primary, color: 'white', fontSize: '12px', fontWeight: 'bold', padding: '4px 8px', borderRadius: '9999px' }}>
                MOST POPULAR
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
                <div style={{ width: '64px', height: '64px', backgroundColor: tierColors.premium.primary, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Crown style={{ width: '32px', height: '32px', color: 'white' }} />
                </div>
              </div>
              
              <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: 'white', marginBottom: '16px' }}>Premium Unlimited</h3>
              
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: tierColors.premium.primary, marginBottom: '16px' }}>$15<span style={{ fontSize: '16px', fontWeight: 'normal', color: '#d1d5db' }}>/month</span></div>
              
              <ul style={{ color: '#d1d5db', lineHeight: '1.8', textAlign: 'left', listStyle: 'none', padding: 0, marginBottom: '24px' }}>
                <li style={{ marginBottom: '8px' }}>• Unlimited Premium Masters</li>
                <li style={{ marginBottom: '8px' }}>• High-Quality WAV & FLAC Downloads</li>
                <li style={{ marginBottom: '8px' }}>• All Advanced Features</li>
                <li style={{ marginBottom: '8px' }}>• Priority Support</li>
              </ul>
              
              <button style={{
                backgroundColor: tierColors.premium.primary,
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '8px',
                fontWeight: '600',
                cursor: 'pointer',
                width: '100%',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => { e.target.style.backgroundColor = tierColors.premium.secondary; }}
              onMouseLeave={(e) => { e.target.style.backgroundColor = tierColors.premium.primary; }}
              >
                Subscribe Now
              </button>
            </div>
          </div>
          
          {/* Features */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px', marginTop: '80px' }}>
            <div style={{ backgroundColor: '#1f2937', padding: '32px', borderRadius: '12px', border: '1px solid #374151' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎵</div>
              <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: 'white', marginBottom: '16px' }}>AI-Powered</h3>
              <p style={{ color: '#9ca3af', fontSize: '16px' }}>
                Advanced machine learning algorithms analyze and enhance your audio automatically.
              </p>
            </div>
            
            <div style={{ backgroundColor: '#1f2937', padding: '32px', borderRadius: '12px', border: '1px solid #374151' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚡</div>
              <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: 'white', marginBottom: '16px' }}>Lightning Fast</h3>
              <p style={{ color: '#9ca3af', fontSize: '16px' }}>
                Get professional mastering results in seconds, not hours. Perfect for tight deadlines.
              </p>
            </div>
            
            <div style={{ backgroundColor: '#1f2937', padding: '32px', borderRadius: '12px', border: '1px solid #374151' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎯</div>
              <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: 'white', marginBottom: '16px' }}>Studio Quality</h3>
              <p style={{ color: '#9ca3af', fontSize: '16px' }}>
                Professional-grade mastering that rivals expensive studio equipment and engineers.
              </p>
            </div>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer style={{ padding: '48px 16px', borderTop: '1px solid #374151', marginTop: '80px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
          <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: '#3b82f6', letterSpacing: '2px', marginBottom: '16px' }}>
            RESOUND
          </h3>
          <p style={{ color: '#9ca3af', fontSize: '14px' }}>
            © 2024 RESOUND. Professional audio mastering powered by AI.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;