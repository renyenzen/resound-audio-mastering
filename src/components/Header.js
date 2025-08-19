import React from 'react';
import { User, Crown, Star } from 'lucide-react';
import Logo from './Logo';
import Navigation from './Navigation';

const Header = ({ userSubscription, isAuthenticated, user, onSignUp, onSignOut }) => {
  const getSubscriptionDisplay = () => {
    const { tier, freeDownloadsUsed, maxFreeDownloads } = userSubscription;
    
    switch (tier) {
      case 'premium':
        return {
          icon: <Crown style={{ width: '20px', height: '20px', color: '#f59e0b' }} />,
          text: 'Premium Unlimited',
          bgColor: '#374151'
        };
      case 'basic':
        return {
          icon: <Star style={{ width: '20px', height: '20px', color: '#10b981' }} />,
          text: 'Basic Unlimited',
          bgColor: '#374151'
        };
      case 'free':
      default:
        const remaining = maxFreeDownloads - freeDownloadsUsed;
        return {
          icon: <User style={{ width: '20px', height: '20px', color: '#60a5fa' }} />,
          text: `Free Tier (${remaining} download${remaining === 1 ? '' : 's'} left)`,
          bgColor: '#374151'
        };
    }
  };
  
  const subscriptionInfo = getSubscriptionDisplay();
  
  return (
    <>
      <header style={{ backgroundColor: '#1f2937', borderBottom: '1px solid #374151', padding: '16px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Logo size={40} showText={false} />
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {isAuthenticated ? (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: subscriptionInfo.bgColor, padding: '8px 12px', borderRadius: '8px' }}>
                  {subscriptionInfo.icon}
                  <span style={{ color: 'white', fontWeight: '500' }}>{subscriptionInfo.text}</span>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ color: '#d1d5db', fontSize: '14px' }}>Welcome, {user?.name || 'User'}</span>
                  <button 
                    onClick={onSignOut}
                    style={{
                      backgroundColor: 'transparent',
                      border: '1px solid #374151',
                      color: '#d1d5db',
                      padding: '8px 16px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '500',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = '#374151';
                      e.target.style.color = 'white';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = 'transparent';
                      e.target.style.color = '#d1d5db';
                    }}>
                    Sign Out
                  </button>
                </div>
              </>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ color: '#9ca3af', fontSize: '14px' }}>Anonymous User - Preview Only</span>
                <button 
                  onClick={onSignUp}
                  style={{
                    backgroundColor: '#10b981',
                    border: 'none',
                    color: 'white',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#059669';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = '#10b981';
                  }}>
                  Sign Up Free
                </button>
              </div>
            )}
          </div>
        </div>
      </header>
      <Navigation isAuthenticated={isAuthenticated} />
    </>
  );
};

export default Header;