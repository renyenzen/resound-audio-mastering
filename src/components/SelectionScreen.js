import React from 'react';
import { Crown, Gift, Zap } from 'lucide-react';
import Logo from './Logo';

const SelectionScreen = ({ onTierSelect, hidePricing = false }) => {
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
    <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
      {/* Logo */}
      <div style={{ marginBottom: '48px', display: 'flex', justifyContent: 'center' }}>
        <Logo size={120} showText={true} />
      </div>
      
      {/* Hero Section */}
      <h1 style={{ fontSize: '56px', fontWeight: 'bold', color: 'white', marginBottom: '32px', lineHeight: '1.1' }}>
        Instantly Perfect Your Audio
      </h1>
      
      {/* Subheading */}
      <h2 style={{ fontSize: '36px', fontWeight: 'bold', color: '#d1d5db', marginBottom: '48px' }}>
        Choose Your Processing Level
      </h2>
      
      {/* Call-to-Action Button */}
      <button 
        onClick={() => onTierSelect('free')}
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
      <div style={{ display: 'grid', gridTemplateColumns: hidePricing ? '1fr 1fr' : '1fr 1fr 1fr', gap: '24px', maxWidth: hidePricing ? '800px' : '1200px', margin: '0 auto' }}>
        {/* Show Free Tier only when pricing is not hidden */}
        {!hidePricing && (
          <div 
            onClick={() => onTierSelect('free')}
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
        )}
        
        {/* Basic Tier */}
        <div 
          onClick={() => onTierSelect('basic')}
          style={{ backgroundColor: '#1f2937', border: `1px solid ${tierColors.basic.border}`, borderRadius: '12px', padding: hidePricing ? '48px 32px' : '32px', cursor: 'pointer', transition: 'all 0.3s ease', textAlign: 'center' }}
          onMouseEnter={(e) => { e.target.style.borderColor = tierColors.basic.primary; e.target.style.boxShadow = `0 10px 15px -3px rgba(16, 185, 129, 0.2)`; }}
          onMouseLeave={(e) => { e.target.style.borderColor = tierColors.basic.border; e.target.style.boxShadow = 'none'; }}
        >
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: hidePricing ? '32px' : '24px' }}>
             <div style={{ width: hidePricing ? '80px' : '64px', height: hidePricing ? '80px' : '64px', backgroundColor: tierColors.basic.primary, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
               <Zap style={{ width: hidePricing ? '40px' : '32px', height: hidePricing ? '40px' : '32px', color: 'white' }} />
             </div>
           </div>
          
          <h3 style={{ fontSize: hidePricing ? '36px' : '24px', fontWeight: 'bold', color: 'white', marginBottom: hidePricing ? '32px' : '16px' }}>{hidePricing ? 'Basic' : 'Basic Unlimited'}</h3>
          
          {!hidePricing && (
            <>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: tierColors.basic.primary, marginBottom: '16px' }}>$10<span style={{ fontSize: '16px', fontWeight: 'normal', color: '#d1d5db' }}>/month</span></div>
              
              <ul style={{ color: '#d1d5db', lineHeight: '1.8', textAlign: 'left', listStyle: 'none', padding: 0, marginBottom: '24px' }}>
                <li style={{ marginBottom: '8px' }}>• Unlimited Basic Masters</li>
                <li style={{ marginBottom: '8px' }}>• High-Quality WAV & FLAC Downloads</li>
                <li style={{ marginBottom: '8px' }}>• Priority Processing</li>
              </ul>
            </>
          )}
          
          <button style={{
            backgroundColor: tierColors.basic.primary,
            color: 'white',
            border: 'none',
            padding: hidePricing ? '16px 32px' : '12px 24px',
            borderRadius: '8px',
            fontWeight: '600',
            cursor: 'pointer',
            width: '100%',
            fontSize: hidePricing ? '24px' : '16px',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => { e.target.style.backgroundColor = tierColors.basic.secondary; }}
          onMouseLeave={(e) => { e.target.style.backgroundColor = tierColors.basic.primary; }}
          >
            {hidePricing ? 'Select Basic' : 'Subscribe Now'}
          </button>
        </div>
        
        {/* Premium Tier */}
        <div 
          onClick={() => onTierSelect('premium')}
          style={{ backgroundColor: '#1f2937', border: `2px solid ${tierColors.premium.primary}`, borderRadius: '12px', padding: hidePricing ? '48px 32px' : '32px', cursor: 'pointer', transition: 'all 0.3s ease', position: 'relative', overflow: 'hidden', textAlign: 'center' }}
          onMouseEnter={(e) => { e.target.style.borderColor = tierColors.premium.secondary; e.target.style.boxShadow = `0 10px 15px -3px rgba(245, 158, 11, 0.3)`; }}
          onMouseLeave={(e) => { e.target.style.borderColor = tierColors.premium.primary; e.target.style.boxShadow = 'none'; }}
        >
          {/* Premium Badge */}
          {!hidePricing && (
            <div style={{ position: 'absolute', top: '16px', right: '16px', backgroundColor: tierColors.premium.primary, color: 'white', fontSize: '12px', fontWeight: 'bold', padding: '4px 8px', borderRadius: '9999px' }}>
              MOST POPULAR
            </div>
          )}
          
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: hidePricing ? '32px' : '24px' }}>
            <div style={{ width: hidePricing ? '80px' : '64px', height: hidePricing ? '80px' : '64px', backgroundColor: tierColors.premium.primary, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Crown style={{ width: hidePricing ? '40px' : '32px', height: hidePricing ? '40px' : '32px', color: 'white' }} />
            </div>
          </div>
          
          <h3 style={{ fontSize: hidePricing ? '36px' : '24px', fontWeight: 'bold', color: 'white', marginBottom: hidePricing ? '32px' : '16px' }}>{hidePricing ? 'Premium' : 'Premium Unlimited'}</h3>
          
          {!hidePricing && (
            <>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: tierColors.premium.primary, marginBottom: '16px' }}>$15<span style={{ fontSize: '16px', fontWeight: 'normal', color: '#d1d5db' }}>/month</span></div>
              
              <ul style={{ color: '#d1d5db', lineHeight: '1.8', textAlign: 'left', listStyle: 'none', padding: 0, marginBottom: '24px' }}>
                <li style={{ marginBottom: '8px' }}>• Unlimited Premium Masters</li>
                <li style={{ marginBottom: '8px' }}>• High-Quality WAV & FLAC Downloads</li>
                <li style={{ marginBottom: '8px' }}>• All Advanced Features</li>
                <li style={{ marginBottom: '8px' }}>• Priority Support</li>
              </ul>
            </>
          )}
          
          <button style={{
            backgroundColor: tierColors.premium.primary,
            color: 'white',
            border: 'none',
            padding: hidePricing ? '16px 32px' : '12px 24px',
            borderRadius: '8px',
            fontWeight: '600',
            cursor: 'pointer',
            width: '100%',
            fontSize: hidePricing ? '24px' : '16px',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => { e.target.style.backgroundColor = tierColors.premium.secondary; }}
          onMouseLeave={(e) => { e.target.style.backgroundColor = tierColors.premium.primary; }}
          >
            {hidePricing ? 'Select Premium' : 'Subscribe Now'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SelectionScreen;