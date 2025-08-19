import React from 'react';
import { useNavigate } from 'react-router-dom';

const ConversionBanner = ({ 
  isAnonymous = true, 
  onSignUp, 
  onBasicSubscribe, 
  onPremiumSubscribe 
}) => {
  const navigate = useNavigate();

  const title = isAnonymous ? 'Ready to download your enhanced track?' : 'Enjoy unlimited downloads?';
  const subtitle = isAnonymous 
    ? 'Sign up now to get 1 free basic enhanced track download!' 
    : 'Subscribe to our plans starting at $10/month for unlimited access.';

  const handleSignUp = () => {
    if (onSignUp) {
      onSignUp();
    } else {
      navigate('/signup');
    }
  };

  const handleBasicSubscribe = () => {
    if (onBasicSubscribe) {
      onBasicSubscribe();
    } else {
      navigate('/payment-demo');
    }
  };

  const handlePremiumSubscribe = () => {
    if (onPremiumSubscribe) {
      onPremiumSubscribe();
    } else {
      navigate('/payment-demo');
    }
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '16px',
      boxShadow: '0 -4px 6px -1px rgba(0, 0, 0, 0.1)',
      zIndex: 1000,
      borderTop: '1px solid rgba(255, 255, 255, 0.1)'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ flex: 1, minWidth: '200px' }}>
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600', color: 'white' }}>
            {title}
          </h3>
          <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: 'rgba(255, 255, 255, 0.9)' }}>
            {subtitle}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          {isAnonymous ? (
            <button 
              onClick={handleSignUp}
              style={{
                padding: '12px 24px',
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'background-color 0.3s ease',
                fontSize: '14px'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#2563eb'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#3b82f6'}
            >
              Sign Up Free
            </button>
          ) : (
            <>
              <button 
                onClick={handleBasicSubscribe}
                style={{
                  padding: '12px 16px',
                  backgroundColor: '#10b981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'background-color 0.3s ease',
                  fontSize: '14px'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#059669'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#10b981'}
              >
                Basic $10/month
              </button>
              <button 
                onClick={handlePremiumSubscribe}
                style={{
                  padding: '12px 16px',
                  backgroundColor: '#f59e0b',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'background-color 0.3s ease',
                  fontSize: '14px'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#d97706'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#f59e0b'}
              >
                Premium $15/month
              </button>
            </>
          )}
          <button 
            style={{
              padding: '12px 16px',
              backgroundColor: 'transparent',
              color: 'rgba(255, 255, 255, 0.7)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '8px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              fontSize: '14px'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
              e.target.style.color = 'white';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent';
              e.target.style.color = 'rgba(255, 255, 255, 0.7)';
            }}
            onClick={() => {
              // Hide banner temporarily
              const banner = document.querySelector('[data-conversion-banner]');
              if (banner) {
                banner.style.display = 'none';
              }
            }}
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConversionBanner;