import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Upload, User, CreditCard } from 'lucide-react';

const Navigation = ({ isAuthenticated = false }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const navigationItems = [
    {
      id: 'home',
      label: 'Home',
      path: '/',
      icon: <Home style={{ width: '18px', height: '18px' }} />,
      public: true
    },
    {
      id: 'upload',
      label: 'Process Audio',
      path: '/upload',
      icon: <Upload style={{ width: '18px', height: '18px' }} />,
      public: true
    },
    {
      id: 'dashboard',
      label: 'Dashboard',
      path: '/dashboard',
      icon: <User style={{ width: '18px', height: '18px' }} />,
      public: false
    },
    {
      id: 'payment',
      label: 'Pricing',
      path: '/payment-demo',
      icon: <CreditCard style={{ width: '18px', height: '18px' }} />,
      public: true
    }
  ];

  const filteredItems = navigationItems.filter(item => {
    if (!item.public && !isAuthenticated) return false;
    if (item.hideWhenAuthenticated && isAuthenticated) return false;
    return true;
  });

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <nav style={{
      backgroundColor: '#1f2937',
      borderBottom: '1px solid #374151',
      padding: '0 16px'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        gap: '4px'
      }}>
        {filteredItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleNavigation(item.path)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 16px',
              backgroundColor: isActive(item.path) ? '#374151' : 'transparent',
              color: isActive(item.path) ? '#10b981' : '#d1d5db',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'all 0.3s ease',
              borderBottom: isActive(item.path) ? '2px solid #10b981' : '2px solid transparent'
            }}
            onMouseEnter={(e) => {
              if (!isActive(item.path)) {
                e.target.style.backgroundColor = '#374151';
                e.target.style.color = 'white';
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive(item.path)) {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.color = '#d1d5db';
              }
            }}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default Navigation;