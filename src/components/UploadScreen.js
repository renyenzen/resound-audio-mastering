import React, { useRef, useState } from 'react';
import { Upload, Music, X, Loader2 } from 'lucide-react';

const UploadScreen = ({ selectedTier, userSubscription, uploadedFile, onFileUpload, onProcessTrack, isProcessing, processingProgress = 0, isAuthenticated = false }) => {
  const fileInputRef = useRef(null);
  const [isDragOver, setIsDragOver] = useState(false);
  
  // Define tier-specific colors matching PreviewScreen
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
  
  const isPremium = selectedTier === 'premium';
  const currentColors = isPremium ? tierColors.premium : tierColors.basic;
  
  // Helper function to get button text based on subscription and tier
  const getProcessButtonText = () => {
    // For anonymous users, show preview-focused text
    if (!isAuthenticated) {
      return selectedTier === 'basic' 
        ? 'Process Basic (Preview - Sign Up to Download)'
        : 'Process Premium (Preview - Sign Up to Download)';
    }
    
    const { tier, freeDownloadsUsed, maxFreeDownloads } = userSubscription;
    const remainingFreeDownloads = maxFreeDownloads - freeDownloadsUsed;
    
    if (selectedTier === 'basic') {
      switch (tier) {
        case 'free':
          return remainingFreeDownloads > 0 
            ? `Process Basic (${remainingFreeDownloads} Free Download${remainingFreeDownloads === 1 ? '' : 's'} Remaining)`
            : 'Process Basic (Download Requires Upgrade)';
        case 'basic':
          return 'Process Basic (Unlimited Downloads)';
        case 'premium':
          return 'Process Basic (Included in Your Plan)';
        default:
          return 'Process Basic';
      }
    } else { // premium
      switch (tier) {
        case 'free':
        case 'basic':
          return 'Process Premium (Upgrade to Download)';
        case 'premium':
          return 'Process Premium (Unlimited Downloads)';
        default:
          return 'Process Premium';
      }
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('audio/')) {
        onFileUpload(file);
      }
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('audio/')) {
      onFileUpload(file);
    }
  };

  const handleRemoveFile = () => {
    onFileUpload(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div style={{ maxWidth: '672px', margin: '0 auto' }}>
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
        }}>Upload Your Track</h1>
        <p style={{ fontSize: '20px', color: '#d1d5db', margin: 0 }}>
          Drag and drop your audio file or click to upload it for {isPremium ? 'premium AI mastering' : 'AI enhancement'}.
        </p>
      </div>

      {/* Upload Area */}
      {!uploadedFile ? (
        <div
          style={{
            border: '2px dashed',
            borderColor: isDragOver ? currentColors.border : '#4b5563',
            backgroundColor: isDragOver ? `rgba(${isPremium ? '251, 191, 36' : '52, 211, 153'}, 0.1)` : 'transparent',
            borderRadius: '12px',
            padding: '48px',
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          onMouseEnter={(e) => {
            if (!isDragOver) {
              e.target.style.borderColor = currentColors.border;
              e.target.style.backgroundColor = `rgba(${isPremium ? '251, 191, 36' : '52, 211, 153'}, 0.05)`;
            }
          }}
          onMouseLeave={(e) => {
            if (!isDragOver) {
              e.target.style.borderColor = '#4b5563';
              e.target.style.backgroundColor = 'transparent';
            }
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '64px', height: '64px', backgroundColor: currentColors.primary, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Upload style={{ width: '32px', height: '32px', color: 'white' }} />
            </div>
            <div>
              <p style={{ fontSize: '18px', fontWeight: '500', color: 'white', marginBottom: '8px' }}>
                Drop your audio file here
              </p>
              <p style={{ color: '#9ca3af' }}>
                or <span style={{ color: currentColors.border, textDecoration: 'underline' }}>click to browse</span>
              </p>
            </div>
            <p style={{ fontSize: '14px', color: '#6b7280' }}>
              Supports MP3, WAV, FLAC, and other audio formats
            </p>
          </div>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="audio/*"
            onChange={handleFileSelect}
            style={{ display: 'none' }}
          />
        </div>
      ) : (
        /* File Display */
        <div style={{ 
          backgroundColor: '#1f2937', 
          border: `1px solid ${currentColors.border}`, 
          borderRadius: '12px', 
          padding: '24px',
          boxShadow: `0 0 20px rgba(${isPremium ? '251, 191, 36' : '52, 211, 153'}, 0.1)`
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '48px', height: '48px', backgroundColor: currentColors.primary, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Music style={{ width: '24px', height: '24px', color: 'white' }} />
              </div>
              <div>
                <h3 style={{ color: 'white', fontWeight: '500', margin: 0 }}>{uploadedFile.name}</h3>
                <p style={{ color: '#9ca3af', fontSize: '14px', margin: 0 }}>{formatFileSize(uploadedFile.size)}</p>
                <p style={{ color: currentColors.border, fontSize: '12px', margin: 0, fontWeight: '500' }}>
                  Ready for {isPremium ? 'Premium' : 'Basic'} Processing
                </p>
              </div>
            </div>
            <button
              onClick={handleRemoveFile}
              style={{ padding: '8px', color: '#9ca3af', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', transition: 'color 0.3s ease' }}
              onMouseEnter={(e) => e.target.style.color = '#ef4444'}
              onMouseLeave={(e) => e.target.style.color = '#9ca3af'}
            >
              <X style={{ width: '20px', height: '20px' }} />
            </button>
          </div>
        </div>
      )}

      {/* Process Button */}
      <div style={{ marginTop: '32px', textAlign: 'center' }}>
        <button
          onClick={onProcessTrack}
          disabled={!uploadedFile || isProcessing}
          style={{
            padding: '16px 32px',
            borderRadius: '12px',
            fontWeight: '500',
            fontSize: '18px',
            transition: 'all 0.3s ease',
            border: 'none',
            cursor: (!uploadedFile || isProcessing) ? 'not-allowed' : 'pointer',
            backgroundColor: (!uploadedFile || isProcessing) ? '#374151' : currentColors.primary,
            color: (!uploadedFile || isProcessing) ? '#9ca3af' : 'white'
          }}
          onMouseEnter={(e) => {
            if (!(!uploadedFile || isProcessing)) {
              e.target.style.backgroundColor = currentColors.secondary;
              e.target.style.boxShadow = `0 10px 15px -3px rgba(${isPremium ? '251, 191, 36' : '52, 211, 153'}, 0.25)`;
            }
          }}
          onMouseLeave={(e) => {
            if (!(!uploadedFile || isProcessing)) {
              e.target.style.backgroundColor = currentColors.primary;
              e.target.style.boxShadow = 'none';
            }
          }}
        >
          {isProcessing ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Loader2 style={{ width: '20px', height: '20px', animation: 'spin 1s linear infinite' }} />
              <span>Processing...</span>
            </div>
          ) : (
            getProcessButtonText()
          )}
        </button>
        
        {/* Subscription Model Explanation */}
        {!isProcessing && (
          <div style={{ marginTop: '16px', textAlign: 'center' }}>
            <p style={{ color: '#9ca3af', fontSize: '14px', lineHeight: '1.5' }}>
              {!isAuthenticated 
                ? 'Preview your enhanced track for free. Sign up to download and get 1 free basic download!'
                : 'All subscriptions include unlimited downloads. Free users get one basic download.'}
            </p>
          </div>
        )}
        
        {/* Progress Bar */}
        {isProcessing && (
          <div style={{ marginTop: '24px' }}>
            <div style={{ marginBottom: '8px', textAlign: 'center' }}>
              <span style={{ color: currentColors.border, fontSize: '14px', fontWeight: '500' }}>
                Processing {isPremium ? 'Premium' : 'Basic'} Enhancement... {Math.round(processingProgress)}%
              </span>
            </div>
            <div style={{
              width: '100%',
              height: '8px',
              backgroundColor: '#374151',
              borderRadius: '4px',
              overflow: 'hidden'
            }}>
              <div style={{
                width: `${processingProgress}%`,
                height: '100%',
                backgroundColor: currentColors.primary,
                borderRadius: '4px',
                transition: 'width 0.3s ease',
                boxShadow: `0 0 10px rgba(${isPremium ? '251, 191, 36' : '52, 211, 153'}, 0.5)`
              }} />
            </div>
            <div style={{ marginTop: '8px', textAlign: 'center' }}>
              <span style={{ color: '#9ca3af', fontSize: '12px' }}>
                {processingProgress < 30 ? 'Analyzing audio...' :
                 processingProgress < 60 ? 'Applying enhancements...' :
                 processingProgress < 90 ? 'Finalizing processing...' :
                 'Almost done...'}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadScreen;