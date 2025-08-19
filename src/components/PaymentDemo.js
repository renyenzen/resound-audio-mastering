import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navigation from './Navigation';
import Logo from './Logo';

function PaymentDemo() {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const plans = [
    {
      id: 'free',
      name: 'Free Tier',
      price: '$0',
      period: '',
      features: [
        'Unlimited Previews',
        '1 Free Basic Download',
        'Basic Features'
      ],
      color: '#6b7280',
      popular: false
    },
    {
      id: 'basic',
      name: 'Basic Unlimited',
      price: '$10',
      period: '/month',
      features: [
        'Unlimited Basic Masters',
        'High-Quality WAV Downloads',
        'Priority Processing'
      ],
      color: '#10b981',
      popular: false
    },
    {
      id: 'premium',
      name: 'Premium Unlimited',
      price: '$15',
      period: '/month',
      features: [
        'Unlimited Premium Masters',
        'High-Quality WAV Downloads',
        'All Advanced Features',
        'Priority Support'
      ],
      color: '#f59e0b',
      popular: true
    }
  ];

  const handlePayment = async (plan) => {
    setSelectedPlan(plan);
    setLoading(true);

    // Simulate payment processing
    setTimeout(() => {
      setLoading(false);
      setPaymentSuccess(true);
    }, 2000);
  };

  const resetDemo = () => {
    setSelectedPlan(null);
    setPaymentSuccess(false);
    setLoading(false);
  };

  if (paymentSuccess) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#111827' }}>
        {/* Navigation */}
        <Navigation />
        
        <div style={{ padding: '48px 16px' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
          {/* RESOUND Logo */}
          <div style={{ marginBottom: '48px', display: 'flex', justifyContent: 'center' }}>
            <Logo size={80} showText={true} />
          </div>

          {/* Success Message */}
          <div style={{ backgroundColor: '#1f2937', borderRadius: '12px', padding: '48px', border: '1px solid #374151' }}>
            <div style={{ fontSize: '64px', marginBottom: '24px' }}>🎉</div>
            <h2 style={{ fontSize: '32px', fontWeight: 'bold', color: 'white', marginBottom: '16px' }}>
              Payment Successful!
            </h2>
            <p style={{ color: '#9ca3af', fontSize: '18px', marginBottom: '32px' }}>
              Welcome to RESOUND {selectedPlan?.name}! Your subscription is now active.
            </p>
            
            <div style={{ backgroundColor: '#374151', borderRadius: '8px', padding: '24px', marginBottom: '32px' }}>
              <h3 style={{ color: 'white', fontSize: '20px', marginBottom: '16px' }}>Subscription Details</h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ color: '#d1d5db' }}>Plan:</span>
                <span style={{ color: 'white', fontWeight: '600' }}>{selectedPlan?.name}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ color: '#d1d5db' }}>Price:</span>
                <span style={{ color: 'white', fontWeight: '600' }}>{selectedPlan?.price}{selectedPlan?.period}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#d1d5db' }}>Status:</span>
                <span style={{ color: '#10b981', fontWeight: '600' }}>Active</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
              <Link 
                to="/dashboard" 
                style={{ 
                  backgroundColor: '#3b82f6', 
                  color: 'white', 
                  padding: '12px 24px', 
                  borderRadius: '8px', 
                  textDecoration: 'none', 
                  fontWeight: '600',
                  transition: 'all 0.3s ease'
                }}
              >
                Go to Dashboard
              </Link>
              <button 
                onClick={resetDemo}
                style={{ 
                  backgroundColor: '#374151', 
                  color: 'white', 
                  padding: '12px 24px', 
                  borderRadius: '8px', 
                  border: '1px solid #4b5563', 
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                Try Another Plan
              </button>
            </div>
          </div>
        </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#111827' }}>
      {/* Navigation */}
      <Navigation />
      
      <div style={{ padding: '48px 16px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          {/* RESOUND Logo */}
          <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'center' }}>
            <Logo size={80} showText={true} />
          </div>
          
          <h2 style={{ fontSize: '36px', fontWeight: 'bold', color: 'white', marginBottom: '16px' }}>
            Choose Your Plan
          </h2>
          <p style={{ color: '#9ca3af', fontSize: '18px', maxWidth: '600px', margin: '0 auto' }}>
            Select the perfect plan for your audio mastering needs. Upgrade or downgrade anytime.
          </p>
          
          {/* Navigation */}
          <div style={{ marginTop: '24px' }}>
            <Link to="/" style={{ color: '#3b82f6', textDecoration: 'none', fontSize: '16px', fontWeight: '500' }}>
              ← Back to Home
            </Link>
          </div>
        </div>

        {/* Pricing Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '24px', marginBottom: '48px', maxWidth: '1000px', margin: '0 auto' }}>
          {plans.map((plan) => {
            const getIcon = (planId) => {
              switch(planId) {
                case 'free': return '🎁';
                case 'basic': return '💎';
                case 'premium': return '👑';
                default: return '🎵';
              }
            };

            const getButtonColor = (planId) => {
              switch(planId) {
                case 'free': return '#3b82f6';
                case 'basic': return '#10b981';
                case 'premium': return '#f59e0b';
                default: return '#6b7280';
              }
            };

            const getButtonText = (planId) => {
              switch(planId) {
                case 'free': return 'Start for Free';
                case 'basic': return 'Subscribe Now';
                case 'premium': return 'Subscribe Now';
                default: return 'Get Started';
              }
            };

            return (
              <div 
                key={plan.id}
                style={{ 
                  backgroundColor: '#1e293b', 
                  borderRadius: '16px', 
                  padding: '32px 24px', 
                  border: plan.popular ? `3px solid ${plan.color}` : '2px solid #334155',
                  position: 'relative',
                  transition: 'all 0.3s ease',
                  boxShadow: plan.popular ? `0 0 30px ${plan.color}40` : '0 4px 20px rgba(0,0,0,0.3)',
                  transform: plan.popular ? 'scale(1.05)' : 'scale(1)',
                  zIndex: plan.popular ? 10 : 1
                }}
              >
                {plan.popular && (
                  <div style={{ 
                    position: 'absolute', 
                    top: '-15px', 
                    right: '20px', 
                    backgroundColor: plan.color, 
                    color: 'white', 
                    padding: '8px 20px', 
                    borderRadius: '25px', 
                    fontSize: '12px', 
                    fontWeight: '700',
                    textTransform: 'uppercase',
                    letterSpacing: '1px'
                  }}>
                    MOST POPULAR
                  </div>
                )}
                
                {/* Icon */}
                <div style={{ 
                  textAlign: 'center', 
                  marginBottom: '20px' 
                }}>
                  <div style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    backgroundColor: plan.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto',
                    fontSize: '24px'
                  }}>
                    {getIcon(plan.id)}
                  </div>
                </div>
                
                <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                  <h3 style={{ 
                    fontSize: '22px', 
                    fontWeight: '700', 
                    color: 'white', 
                    marginBottom: '12px',
                    letterSpacing: '0.5px'
                  }}>
                    {plan.name}
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', marginBottom: '16px' }}>
                    <span style={{ 
                      fontSize: '42px', 
                      fontWeight: '800', 
                      color: plan.color,
                      lineHeight: '1'
                    }}>
                      {plan.price}
                    </span>
                    {plan.period && (
                      <span style={{ 
                        color: '#94a3b8', 
                        fontSize: '16px', 
                        marginLeft: '4px',
                        fontWeight: '500'
                      }}>
                        {plan.period}
                      </span>
                    )}
                  </div>
                </div>
                
                <ul style={{ listStyle: 'none', padding: 0, marginBottom: '32px' }}>
                  {plan.features.map((feature, index) => (
                    <li key={index} style={{ 
                      display: 'flex', 
                      alignItems: 'flex-start', 
                      marginBottom: '14px',
                      fontSize: '14px',
                      lineHeight: '1.5'
                    }}>
                      <span style={{ 
                        color: plan.color, 
                        marginRight: '12px', 
                        fontSize: '16px',
                        fontWeight: 'bold',
                        marginTop: '1px'
                      }}>•</span>
                      <span style={{ color: '#e2e8f0', fontWeight: '500' }}>{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <button
                  onClick={() => handlePayment(plan)}
                  disabled={loading && selectedPlan?.id === plan.id}
                  style={{
                    width: '100%',
                    padding: '14px 20px',
                    backgroundColor: loading && selectedPlan?.id === plan.id ? '#6b7280' : getButtonColor(plan.id),
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    fontSize: '16px',
                    fontWeight: '700',
                    cursor: loading && selectedPlan?.id === plan.id ? 'not-allowed' : 'pointer',
                    transition: 'all 0.3s ease',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    boxShadow: `0 4px 15px ${getButtonColor(plan.id)}40`
                  }}
                  onMouseEnter={(e) => {
                    if (!loading || selectedPlan?.id !== plan.id) {
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = `0 6px 20px ${getButtonColor(plan.id)}60`;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!loading || selectedPlan?.id !== plan.id) {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = `0 4px 15px ${getButtonColor(plan.id)}40`;
                    }
                  }}
                >
                  {loading && selectedPlan?.id === plan.id ? 'Processing...' : getButtonText(plan.id)}
                </button>
              </div>
            );
          })}
        </div>

        {/* Demo Notice */}
        <div style={{ 
          backgroundColor: '#1f2937', 
          borderRadius: '8px', 
          padding: '16px', 
          border: '1px solid #374151',
          textAlign: 'center'
        }}>
          <p style={{ color: '#fbbf24', fontSize: '14px', margin: 0 }}>
            🔒 This is a demo. No actual payment will be processed. Real Stripe integration is configured and ready.
          </p>
        </div>
      </div>
      </div>
    </div>
  );
}

export default PaymentDemo;