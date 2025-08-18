import React, { useState, useRef, useEffect, createContext, useContext } from 'react';
import { Play, Pause, Download, RotateCcw, AlertCircle } from 'lucide-react';

// Context for managing exclusive audio playback
const AudioPlaybackContext = createContext();

const AudioPlaybackProvider = ({ children }) => {
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);
  
  const playAudio = (audioId) => {
    setCurrentlyPlaying(audioId);
  };
  
  const stopAudio = () => {
    setCurrentlyPlaying(null);
  };
  
  return (
    <AudioPlaybackContext.Provider value={{ currentlyPlaying, playAudio, stopAudio }}>
      {children}
    </AudioPlaybackContext.Provider>
  );
};

const AudioPlayer = ({ title, src, isImproved = false, tierColors = null, audioId }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);
  const { currentlyPlaying, playAudio, stopAudio } = useContext(AudioPlaybackContext);
  
  // Effect to handle exclusive playback
  useEffect(() => {
    if (currentlyPlaying !== audioId && isPlaying) {
      // Another audio is playing, pause this one
      if (audioRef.current) {
        audioRef.current.pause();
        setIsPlaying(false);
      }
    }
  }, [currentlyPlaying, audioId, isPlaying]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
        stopAudio();
      } else {
        // Stop any other playing audio
        playAudio(audioId);
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const currentTime = audioRef.current.currentTime;
      // Limit preview to 60 seconds
      if (currentTime >= 60) {
        audioRef.current.pause();
        audioRef.current.currentTime = 60;
        setIsPlaying(false);
        setCurrentTime(60);
      } else {
        setCurrentTime(currentTime);
      }
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      // Limit duration display to 60 seconds for preview
      const actualDuration = audioRef.current.duration;
      setDuration(Math.min(actualDuration, 60));
    }
  };

  const handleSeek = (e) => {
    if (audioRef.current) {
      const rect = e.currentTarget.getBoundingClientRect();
      const percent = (e.clientX - rect.left) / rect.width;
      const newTime = percent * duration;
      // Ensure seeking doesn't go beyond 60 seconds
      const limitedTime = Math.min(newTime, 60);
      audioRef.current.currentTime = limitedTime;
      setCurrentTime(limitedTime);
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  const enhancedColor = tierColors ? tierColors.primary : '#3b82f6';
  const borderColor = isImproved ? (tierColors ? tierColors.border : '#3b82f6') : '#374151';

  return (
    <div style={{
      backgroundColor: '#1f2937',
      border: `1px solid ${borderColor}`,
      borderRadius: '16px',
      padding: '32px',
      boxShadow: isImproved && tierColors ? `0 0 20px rgba(${tierColors.primary === '#10b981' ? '16, 185, 129' : '245, 158, 11'}, 0.1)` : '0 4px 12px rgba(0, 0, 0, 0.1)'
    }}>
      <div style={{ marginBottom: '24px' }}>
        {isImproved && (
          <div style={{ marginBottom: '12px' }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '6px 12px',
              backgroundColor: enhancedColor,
              color: 'white',
              fontSize: '12px',
              fontWeight: 'bold',
              borderRadius: '9999px',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              ENHANCED
            </span>
          </div>
        )}
        <h3 style={{ 
          fontSize: '20px', 
          fontWeight: '600', 
          color: 'white', 
          margin: 0,
          lineHeight: '1.2'
        }}>{title}</h3>
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        <button
          onClick={togglePlay}
          style={{
            width: '64px',
            height: '64px',
            backgroundColor: isImproved && tierColors ? tierColors.primary : '#3b82f6',
            color: 'white',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.3s ease',
            border: 'none',
            cursor: 'pointer',
            boxShadow: `0 8px 20px rgba(${isImproved && tierColors ? (tierColors.primary === '#10b981' ? '16, 185, 129' : '245, 158, 11') : '59, 130, 246'}, 0.3)`
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'scale(1.05)';
            e.target.style.boxShadow = `0 12px 24px rgba(${isImproved && tierColors ? (tierColors.primary === '#10b981' ? '16, 185, 129' : '245, 158, 11') : '59, 130, 246'}, 0.4)`;
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'scale(1)';
            e.target.style.boxShadow = `0 8px 20px rgba(${isImproved && tierColors ? (tierColors.primary === '#10b981' ? '16, 185, 129' : '245, 158, 11') : '59, 130, 246'}, 0.3)`;
          }}
        >
          {isPlaying ? (
            <Pause style={{ width: '24px', height: '24px', color: 'white' }} />
          ) : (
            <Play style={{ width: '24px', height: '24px', color: 'white', marginLeft: '2px' }} />
          )}
        </button>
        
        <div style={{ flex: 1 }}>
          <div 
            style={{
              width: '100%',
              height: '12px',
              backgroundColor: '#374151',
              borderRadius: '9999px',
              cursor: 'pointer',
              position: 'relative',
              overflow: 'hidden'
            }}
            onClick={handleSeek}
          >
            <div 
              style={{
                height: '100%',
                background: isImproved && tierColors ? 
                  `linear-gradient(90deg, ${tierColors.primary}, ${tierColors.secondary})` : 
                  'linear-gradient(90deg, #3b82f6, #1d4ed8)',
                borderRadius: '9999px',
                transition: 'all 0.2s ease',
                width: `${progressPercent}%`,
                boxShadow: `0 0 8px rgba(${isImproved && tierColors ? (tierColors.primary === '#10b981' ? '16, 185, 129' : '245, 158, 11') : '59, 130, 246'}, 0.4)`
              }}
            />
          </div>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            fontSize: '14px', 
            color: '#9ca3af', 
            marginTop: '8px',
            fontWeight: '500'
          }}>
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
      </div>
      
      <audio
        ref={audioRef}
        src={src}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => setIsPlaying(false)}
      />
    </div>
  );
};

const PreviewScreen = ({ processedAudio, userSubscription, selectedTier, isAuthenticated, user, onDownload, onProcessAnother, onSignUp }) => {
  const isPremium = selectedTier === 'premium';
  const { tier, freeDownloadsUsed, maxFreeDownloads } = userSubscription;
  
  // Helper function to determine download button state and text
  const getDownloadButtonInfo = () => {
    // If user is not authenticated, show sign-up prompt
    if (!isAuthenticated) {
      return {
        enabled: false,
        text: selectedTier === 'basic' ? 'Sign Up to Download Basic Track' : 'Sign Up to Download Premium Track',
        showSignUp: true,
        showUpgrade: false
      };
    }

    const remainingFreeDownloads = maxFreeDownloads - freeDownloadsUsed;
    
    if (selectedTier === 'basic') {
      switch (tier) {
        case 'free':
          if (remainingFreeDownloads > 0) {
            return {
              enabled: true,
              text: 'Download Your Free Basic Track',
              showSignUp: false,
              showUpgrade: false
            };
          } else {
            return {
              enabled: false,
              text: 'Subscribe to Download',
              showSignUp: false,
              showUpgrade: true
            };
          }
        case 'basic':
        case 'premium':
          return {
            enabled: true,
            text: 'Download Basic Track',
            showSignUp: false,
            showUpgrade: false
          };
        default:
          return { enabled: false, text: 'Download Basic Track', showSignUp: false, showUpgrade: false };
      }
    } else { // premium
      switch (tier) {
        case 'free':
        case 'basic':
          return {
            enabled: false,
            text: 'Upgrade to Download Premium',
            showSignUp: false,
            showUpgrade: true
          };
        case 'premium':
          return {
            enabled: true,
            text: 'Download Premium Track',
            showSignUp: false,
            showUpgrade: false
          };
        default:
          return { enabled: false, text: 'Download Premium Track', showSignUp: false, showUpgrade: false };
      }
    }
  };
  
  const downloadInfo = getDownloadButtonInfo();
  
  // Define tier-specific colors
  const tierColors = {
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
  
  const currentColors = isPremium ? tierColors.premium : tierColors.basic;

  return (
    <AudioPlaybackProvider>
      <div style={{ maxWidth: '896px', margin: '0 auto' }}>
      {/* Header with Tier Indicator */}
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <div style={{ marginBottom: '16px' }}>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            padding: '8px 16px',
            backgroundColor: currentColors.primary,
            color: 'white',
            fontSize: '14px',
            fontWeight: 'bold',
            borderRadius: '9999px',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            {isPremium ? '✨ Premium' : '🎵 Basic'}
          </span>
        </div>
        <h1 style={{ 
          fontSize: '36px', 
          fontWeight: 'bold', 
          color: currentColors.border, 
          marginBottom: '16px', 
          margin: 0 
        }}>Preview & Download</h1>
        <p style={{ fontSize: '20px', color: '#d1d5db', margin: 0 }}>
          Compare your original track with the {isPremium ? 'premium AI-mastered' : 'AI-enhanced'} version and get ready for a professional listening experience.
        </p>
      </div>

      {/* Audio Players */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '32px' }}>
        <AudioPlayer 
          title="Original Track" 
          src={processedAudio.original}
          audioId="original"
        />
        <AudioPlayer 
          title={`${isPremium ? 'Premium' : 'Basic'} Enhanced Track`}
          src={processedAudio.processed} 
          isImproved={true}
          tierColors={currentColors}
          audioId="enhanced"
        />
      </div>

      {/* Download Section */}
      <div style={{ 
        backgroundColor: '#1f2937', 
        border: `1px solid ${currentColors.border}`, 
        borderRadius: '12px', 
        padding: '24px',
        boxShadow: `0 0 20px rgba(${isPremium ? '251, 191, 36' : '52, 211, 153'}, 0.1)`
      }}>
        <h2 style={{ 
          fontSize: '24px', 
          fontWeight: 'bold', 
          color: currentColors.border, 
          marginBottom: '16px', 
          margin: 0 
        }}>Download {isPremium ? 'Premium' : 'Basic'} Enhanced Track</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
          {/* File Details */}
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: '500', color: 'white', marginBottom: '12px', margin: 0 }}>File Specifications</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', color: '#d1d5db' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Format:</span>
                <span style={{ fontWeight: '500' }}>{processedAudio.format}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Sample Rate:</span>
                <span style={{ fontWeight: '500' }}>{processedAudio.sampleRate}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Bit Depth:</span>
                <span style={{ fontWeight: '500' }}>{processedAudio.bitDepth}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Filename:</span>
                <span style={{ fontWeight: '500', color: '#60a5fa' }}>{processedAudio.filename}</span>
              </div>
            </div>
          </div>
          
          {/* Download Actions */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            {!downloadInfo.enabled && downloadInfo.showSignUp && (
              <div style={{ marginBottom: '16px', padding: '16px', backgroundColor: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10b981' }}>
                  <AlertCircle style={{ width: '20px', height: '20px' }} />
                  <span style={{ fontWeight: '500' }}>Sign Up Required</span>
                </div>
                <p style={{ color: '#34d399', fontSize: '14px', marginTop: '4px', margin: 0 }}>
                  Sign up now to get 1 free basic enhanced track download! No credit card required.
                </p>
              </div>
            )}
            
            {!downloadInfo.enabled && downloadInfo.showUpgrade && (
              <div style={{ marginBottom: '16px', padding: '16px', backgroundColor: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.3)', borderRadius: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#60a5fa' }}>
                  <AlertCircle style={{ width: '20px', height: '20px' }} />
                  <span style={{ fontWeight: '500' }}>Subscription Required</span>
                </div>
                <p style={{ color: '#93c5fd', fontSize: '14px', marginTop: '4px', margin: 0 }}>
                  {tier === 'free' && selectedTier === 'basic' && freeDownloadsUsed >= maxFreeDownloads
                    ? 'You have used your free download. Subscribe to continue downloading!'
                    : tier === 'free' && selectedTier === 'premium'
                    ? 'Subscribe to download premium tracks!'
                    : tier === 'basic' && selectedTier === 'premium'
                    ? 'Upgrade to Premium to download premium tracks!'
                    : 'Subscription required for downloads.'}
                </p>
              </div>
            )}
            
            <button
              onClick={downloadInfo.enabled ? () => onDownload(selectedTier) : downloadInfo.showSignUp ? onSignUp : undefined}
              disabled={!downloadInfo.enabled && !downloadInfo.showSignUp}
              style={{
                width: '100%',
                padding: '16px 24px',
                borderRadius: '12px',
                fontWeight: '500',
                fontSize: '18px',
                transition: 'all 0.3s ease',
                border: 'none',
                cursor: (!downloadInfo.enabled && !downloadInfo.showSignUp) ? 'not-allowed' : 'pointer',
                backgroundColor: downloadInfo.showSignUp ? '#10b981' : (!downloadInfo.enabled ? '#374151' : currentColors.primary),
                color: (!downloadInfo.enabled && !downloadInfo.showSignUp) ? '#9ca3af' : 'white'
              }}
              onMouseEnter={(e) => {
                if (downloadInfo.enabled) {
                  e.target.style.backgroundColor = currentColors.secondary;
                  e.target.style.boxShadow = `0 10px 15px -3px rgba(${isPremium ? '251, 191, 36' : '52, 211, 153'}, 0.25)`;
                } else if (downloadInfo.showSignUp) {
                  e.target.style.backgroundColor = '#059669';
                  e.target.style.boxShadow = '0 10px 15px -3px rgba(16, 185, 129, 0.25)';
                }
              }}
              onMouseLeave={(e) => {
                if (downloadInfo.enabled) {
                  e.target.style.backgroundColor = currentColors.primary;
                  e.target.style.boxShadow = 'none';
                } else if (downloadInfo.showSignUp) {
                  e.target.style.backgroundColor = '#10b981';
                  e.target.style.boxShadow = 'none';
                }
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <Download style={{ width: '20px', height: '20px' }} />
                <span>{downloadInfo.text}</span>
              </div>
            </button>
            
            {!downloadInfo.enabled && downloadInfo.showUpgrade && (
              <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {tier === 'free' && (
                  <>
                    <button style={{ width: '100%', padding: '12px 24px', backgroundColor: '#10b981', color: 'white', borderRadius: '12px', fontWeight: '500', transition: 'background-color 0.3s ease', border: 'none', cursor: 'pointer' }}
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#059669'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = '#10b981'}>
                      Subscribe to Basic ($10/month)
                    </button>
                    <button style={{ width: '100%', padding: '12px 24px', backgroundColor: '#f59e0b', color: 'white', borderRadius: '12px', fontWeight: '500', transition: 'background-color 0.3s ease', border: 'none', cursor: 'pointer' }}
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#d97706'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = '#f59e0b'}>
                      Subscribe to Premium ($15/month)
                    </button>
                  </>
                )}
                {tier === 'basic' && selectedTier === 'premium' && (
                  <button style={{ width: '100%', padding: '12px 24px', backgroundColor: '#f59e0b', color: 'white', borderRadius: '12px', fontWeight: '500', transition: 'background-color 0.3s ease', border: 'none', cursor: 'pointer' }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#d97706'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = '#f59e0b'}>
                    Upgrade to Premium ($15/month)
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Process Another Track */}
      <div style={{ marginTop: '32px', textAlign: 'center' }}>
        <button
          onClick={onProcessAnother}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 24px',
            backgroundColor: '#374151',
            color: 'white',
            borderRadius: '12px',
            fontWeight: '500',
            transition: 'background-color 0.3s ease',
            border: 'none',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#4b5563'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#374151'}
        >
          <RotateCcw style={{ width: '20px', height: '20px' }} />
          <span>Process Another Track</span>
        </button>
      </div>
      </div>
    </AudioPlaybackProvider>
  );
};

export default PreviewScreen;