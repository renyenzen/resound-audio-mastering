import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import SelectionScreen from './components/SelectionScreen';
import UploadScreen from './components/UploadScreen';
import PreviewScreen from './components/PreviewScreen';
import Header from './components/Header';
import Login from './components/Login';
import Signup from './components/Signup';
import PaymentDemo from './components/PaymentDemo';
import LandingPage from './components/LandingPage';
import AudioProcessingFlow from './components/AudioProcessingFlow';
import AudioProcessor from './utils/audioProcessor';

// Protected Route Component
function ProtectedRoute({ children }) {
  const { currentUser } = useAuth();
  return currentUser ? children : <Navigate to="/login" />;
}

// Main App Component
function AppContent() {
  const [appState, setAppState] = useState('selection'); // 'selection', 'upload', 'preview'
  const [selectedTier, setSelectedTier] = useState(null); // 'basic' or 'premium'
  const [uploadedFile, setUploadedFile] = useState(null);
  const [processedAudio, setProcessedAudio] = useState(null);
  const { currentUser, logout } = useAuth(); // Get current user from Firebase
  const [userSubscription, setUserSubscription] = useState({
    tier: 'free', // 'free', 'basic', 'premium'
    freeDownloadsUsed: 0, // Track free downloads used
    maxFreeDownloads: 1 // Maximum free downloads allowed
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);

  const handleTierSelection = (tier) => {
    setSelectedTier(tier);
    setAppState('upload');
  };

  const handleFileUpload = (file) => {
    setUploadedFile(file);
  };

  const handleProcessTrack = async () => {
    setIsProcessing(true);
    setProcessingProgress(0);
    
    try {
      const audioProcessor = new AudioProcessor();
      
      // Simulate progress updates during processing
      const progressInterval = setInterval(() => {
        setProcessingProgress(prev => {
          if (prev >= 95) {
            clearInterval(progressInterval);
            return 95; // Keep at 95% until processing completes
          }
          return prev + Math.random() * 15; // Random increments for realistic feel
        });
      }, 200);
      
      // Process audio based on selected tier
      const processedAudio = await audioProcessor.processAudio(uploadedFile, selectedTier);
      
      // Complete the progress
      clearInterval(progressInterval);
      setProcessingProgress(100);
      
      // Small delay to show 100% completion
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setProcessedAudio({
        original: URL.createObjectURL(uploadedFile),
        processed: URL.createObjectURL(processedAudio.preview), // Use preview for playback
        processedFull: URL.createObjectURL(processedAudio.full), // Use full for download
        filename: uploadedFile.name,
        format: 'WAV',
        sampleRate: '44.1kHz',
        bitDepth: '16-bit',
        cost: selectedTier === 'premium' ? 10 : 5
      });
      setAppState('preview');
    } catch (error) {
      console.error('Audio processing failed:', error);
      setProcessingProgress(0); // Reset progress on error
      // Fallback to original file if processing fails
      setProcessedAudio({
        original: URL.createObjectURL(uploadedFile),
        processed: URL.createObjectURL(uploadedFile),
        processedFull: URL.createObjectURL(uploadedFile),
        filename: uploadedFile.name,
        format: 'WAV',
        sampleRate: '44.1kHz',
        bitDepth: '16-bit',
        cost: selectedTier === 'premium' ? 10 : 5
      });
      setAppState('preview');
    } finally {
      setIsProcessing(false);
      // Reset progress when processing is complete
      setTimeout(() => setProcessingProgress(0), 1000);
    }
  };

  const handleSignUp = () => {
    // Redirect to signup page - Firebase handles authentication
    // This is now handled by the Signup component
    // Reset free downloads for new user
    setUserSubscription(prev => ({
      ...prev,
      freeDownloadsUsed: 0
    }));
  };

  const handleSignOut = async () => {
    try {
      await logout();
      setUserSubscription({
        tier: 'free',
        freeDownloadsUsed: 0,
        maxFreeDownloads: 1
      });
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleDownload = (tier) => {
    // Check if user is signed in first
    if (!currentUser) {
      const shouldSignUp = window.confirm(
        'You need to sign up to download tracks.\n\n' +
        'Sign up now to get 1 free basic enhanced track download!\n\n' +
        'Click OK to sign up, or Cancel to continue browsing.'
      );
      
      if (shouldSignUp) {
        handleSignUp();
        // After sign up, proceed with download
        setTimeout(() => {
          handleDownload(tier);
        }, 100);
      }
      return;
    }

    const canDownload = checkDownloadPermission(tier);
    
    if (!canDownload.allowed) {
      alert(canDownload.message);
      return;
    }
    
    // Show confirmation dialog
    const confirmed = window.confirm(
      `Download ${tier} enhanced track?\n\n` +
      `${getDownloadMessage(tier)}\n\n` +
      `Click OK to proceed with download.`
    );
    
    if (!confirmed) {
      return;
    }
    
    // Update subscription state if using free download
    if (userSubscription.tier === 'free' && tier === 'basic') {
      setUserSubscription(prev => ({
        ...prev,
        freeDownloadsUsed: prev.freeDownloadsUsed + 1
      }));
    }
    
    // Create download link
    const link = document.createElement('a');
    link.href = processedAudio.processedFull;
    link.download = `${tier}_enhanced_${processedAudio.filename}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    alert('Download started successfully!');
  };
  
  const checkDownloadPermission = (tier) => {
    const { tier: userTier, freeDownloadsUsed, maxFreeDownloads } = userSubscription || { tier: 'free', freeDownloadsUsed: 0, maxFreeDownloads: 1 };
    
    if (userTier === 'premium') {
      return { allowed: true, message: '' };
    }
    
    if (userTier === 'basic') {
      if (tier === 'basic') {
        return { allowed: true, message: '' };
      } else {
        return { allowed: false, message: 'Upgrade to Premium to download premium tracks!' };
      }
    }
    
    if (userTier === 'free') {
      if (tier === 'premium') {
        return { allowed: false, message: 'Subscribe to download premium tracks!' };
      }
      
      if (freeDownloadsUsed >= maxFreeDownloads) {
        return { allowed: false, message: 'You have used your free download. Subscribe to continue downloading!' };
      }
      
      return { allowed: true, message: '' };
    }
    
    return { allowed: false, message: 'Unknown subscription tier' };
  };
  
  const getDownloadMessage = (tier) => {
    const { tier: userTier, freeDownloadsUsed, maxFreeDownloads } = userSubscription;
    
    if (userTier === 'premium') {
      return `Premium subscriber - unlimited ${tier} downloads`;
    }
    
    if (userTier === 'basic') {
      return `Basic subscriber - unlimited basic downloads`;
    }
    
    if (userTier === 'free' && tier === 'basic') {
      const remaining = maxFreeDownloads - freeDownloadsUsed;
      return `Free tier - ${remaining} free download${remaining === 1 ? '' : 's'} remaining`;
    }
    
    return 'Download information';
  };

  const handleProcessAnother = () => {
    setAppState('selection');
    setSelectedTier(null);
    setUploadedFile(null);
    setProcessedAudio(null);
    setIsProcessing(false);
  };

  const renderCurrentScreen = () => {
    switch (appState) {
      case 'selection':
        return <SelectionScreen onTierSelect={handleTierSelection} />;
      case 'upload':
        return (
          <UploadScreen
            selectedTier={selectedTier}
            userSubscription={userSubscription}
            uploadedFile={uploadedFile}
            onFileUpload={handleFileUpload}
            onProcessTrack={handleProcessTrack}
            isProcessing={isProcessing}
            processingProgress={processingProgress}
            isAuthenticated={!!currentUser}
          />
        );
      case 'preview':
        return (
          <PreviewScreen
            processedAudio={processedAudio}
            userSubscription={userSubscription}
            selectedTier={selectedTier}
            isAuthenticated={!!currentUser}
            user={currentUser}
            onDownload={handleDownload}
            onProcessAnother={handleProcessAnother}
            onSignUp={handleSignUp}
          />
        );
      default:
        return <SelectionScreen onTierSelect={handleTierSelection} />;
    }
  };

  // Conversion banner logic
  const shouldShowBanner = () => {
    const { tier, freeDownloadsUsed, maxFreeDownloads } = userSubscription || { tier: 'free', freeDownloadsUsed: 0, maxFreeDownloads: 1 };
    // Show banner for authenticated free users who used their downloads, or for anonymous users on preview
    return (currentUser && tier === 'free' && freeDownloadsUsed >= maxFreeDownloads) || 
           (!currentUser && appState === 'preview');
  };

  const ConversionBanner = () => {
    if (!shouldShowBanner()) return null;
    
    const isAnonymous = !currentUser;
    const title = isAnonymous ? 'Ready to download your enhanced track?' : 'Enjoy unlimited downloads?';
    const subtitle = isAnonymous 
      ? 'Sign up now to get 1 free basic enhanced track download!' 
      : 'Subscribe to our plans starting at $10/month for unlimited access.';
    
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
                onMouseLeave={(e) => e.target.style.backgroundColor = '#10b981'}>
                Sign Up Free
              </button>
            ) : (
              <>
                <button style={{
                  padding: '12px 24px',
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
                onMouseLeave={(e) => e.target.style.backgroundColor = '#10b981'}>
                  Basic $10/month
                </button>
                <button style={{
                  padding: '12px 24px',
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
                onMouseLeave={(e) => e.target.style.backgroundColor = '#f59e0b'}>
                  Premium $15/month
                </button>
              </>
            )}
            <button style={{
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
              document.querySelector('[data-conversion-banner]').style.display = 'none';
            }}>
              ×
            </button>
          </div>
        </div>
      </div>
    );
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
      <Header 
        userSubscription={userSubscription} 
        isAuthenticated={!!currentUser}
        user={currentUser}
        onSignUp={() => {}} // Will be handled by routing
        onSignOut={() => {}} // Will be handled by auth context
      />
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 16px', paddingBottom: shouldShowBanner() ? '120px' : '32px' }}>
        {renderCurrentScreen()}
      </main>
      <div data-conversion-banner>
        <ConversionBanner />
      </div>
    </div>
  );
}

// Main App Component with Router and Auth Provider
function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/payment-demo" element={<PaymentDemo />} />
          <Route path="/upload" element={<AudioProcessingFlow />} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <AppContent />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
