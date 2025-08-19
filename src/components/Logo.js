import React from 'react';

const Logo = ({ size = 120, showText = true, className = '' }) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center' }} className={className}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Outer circle with gradient */}
        <defs>
          <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#14b8a6" />
            <stop offset="100%" stopColor="#f59e0b" />
          </linearGradient>
          <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor="#000000" floodOpacity="0.3"/>
          </filter>
        </defs>
        
        {/* Wave ripple circles */}
        <circle
          cx="60"
          cy="60"
          r="56"
          fill="none"
          stroke="url(#logoGradient)"
          strokeWidth="4"
          filter="url(#shadow)"
        />
        
        <circle
          cx="60"
          cy="60"
          r="44"
          fill="none"
          stroke="url(#logoGradient)"
          strokeWidth="3"
          opacity="0.8"
        />
        

        
        {/* Center circle */}
        <circle
          cx="60"
          cy="60"
          r="32"
          fill="url(#logoGradient)"
        />
        
        {/* R letter - bold and centered */}
        <text
          x="60"
          y="60"
          fill="#1f2937"
          fontSize="36"
          fontWeight="900"
          fontFamily="system-ui, -apple-system, sans-serif"
          textAnchor="middle"
          dominantBaseline="central"
        >
          R
        </text>
      </svg>
      
      {showText && (
        <div style={{ marginLeft: '12px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: 'white', letterSpacing: '0.05em' }}>
            RESOUND
          </h1>
        </div>
      )}
    </div>
  );
};

export default Logo;