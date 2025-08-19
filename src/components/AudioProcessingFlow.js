import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import UploadScreen from './UploadScreen';
import PreviewScreen from './PreviewScreen';
import SelectionScreen from './SelectionScreen';
import Header from './Header';
import ConversionBanner from './ConversionBanner';
import AudioProcessor from '../utils/audioProcessor';

const AudioProcessingFlow = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentScreen, setCurrentScreen] = useState(location.state?.selectedTier ? 'upload' : 'selection');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [processedAudio, setProcessedAudio] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [selectedTier, setSelectedTier] = useState(location.state?.selectedTier || null);
  
  // Handle tier selection
  const handleTierSelection = (tier) => {
    setSelectedTier(tier);
    setCurrentScreen('upload');
  };
  
  // Initialize audio processor
  const audioProcessor = new AudioProcessor();

  const handleFileUpload = async (file) => {
    setUploadedFile(file);
    setIsProcessing(true);
    setProcessingProgress(0);
    
    try {
      // Progress callback function
      const progressCallback = (progress) => {
        setProcessingProgress(Math.min(100, Math.max(0, progress)));
      };
      
      // Process audio with real audio processing
      const result = await audioProcessor.processAudio(file, selectedTier, progressCallback);
      
      // Create processed audio result
      const processedAudioResult = {
        originalFile: file,
        originalUrl: URL.createObjectURL(file),
        processedUrl: URL.createObjectURL(result.preview), // Preview version (60 seconds)
        tier: selectedTier,
        downloadUrl: selectedTier === 'free' ? null : URL.createObjectURL(result.full) // Full version for download
      };
      
      setProcessedAudio(processedAudioResult);
      setCurrentScreen('preview');
    } catch (error) {
      console.error('Processing failed:', error);
      // Show error state or fallback
      alert('Audio processing failed. Please try again with a different file.');
    } finally {
      setIsProcessing(false);
      setProcessingProgress(0);
    }
  };

  const handleBackToUpload = () => {
    setCurrentScreen('upload');
    setUploadedFile(null);
    setProcessedAudio(null);
    setIsProcessing(false);
    setProcessingProgress(0);
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case 'selection':
        return (
          <SelectionScreen
            onTierSelect={handleTierSelection}
            hidePricing={true}
          />
        );
      case 'upload':
        return (
          <UploadScreen
            selectedTier={selectedTier}
            onFileUpload={handleFileUpload}
            isProcessing={isProcessing}
            processingProgress={processingProgress}
            onBack={handleBackToHome}
          />
        );
      case 'preview':
        return (
          <PreviewScreen
            processedAudio={processedAudio}
            userSubscription={{ tier: selectedTier || 'free', freeDownloadsUsed: 0, maxFreeDownloads: 1 }}
            selectedTier={selectedTier}
            isAuthenticated={false}
            user={null}
            onDownload={(tier) => {
              // Handle download logic here
              console.log('Download requested for tier:', tier);
            }}
            onProcessAnother={handleBackToUpload}
            onSignUp={() => navigate('/signup')}
          />
        );
      default:
        return null;
    }
  };

  const shouldShowBanner = () => {
    // Show conversion banner for free tier users
    return selectedTier === 'free' && currentScreen === 'preview';
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
        userSubscription={{ tier: selectedTier || 'free', freeDownloadsUsed: 0, maxFreeDownloads: 1 }}
        isAuthenticated={false}
        user={null}
        onSignUp={() => navigate('/signup')}
        onSignOut={() => {}}
      />
      <main style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        padding: '32px 16px', 
        paddingBottom: shouldShowBanner() ? '120px' : '32px' 
      }}>
        {renderCurrentScreen()}
      </main>
      {shouldShowBanner() && (
        <div data-conversion-banner>
          <ConversionBanner />
        </div>
      )}
    </div>
  );
};

export default AudioProcessingFlow;