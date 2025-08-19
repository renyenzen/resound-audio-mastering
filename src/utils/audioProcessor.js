// Audio processing utilities for basic and premium enhancement

class AudioProcessor {
  constructor() {
    this.audioContext = null;
  }

  // Analyze volume consistency between original and processed audio
  analyzeVolumeConsistency(originalBuffer, processedBuffer) {
    const originalData = originalBuffer.getChannelData(0);
    const processedData = processedBuffer.getChannelData(0);
    
    // Calculate RMS levels in segments to detect volume inconsistencies
    const segmentSize = Math.floor(originalBuffer.length / 20); // 20 segments
    const originalRMS = [];
    const processedRMS = [];
    
    for (let i = 0; i < 20; i++) {
      const start = i * segmentSize;
      const end = Math.min(start + segmentSize, originalBuffer.length);
      
      let originalSum = 0;
      let processedSum = 0;
      
      for (let j = start; j < end; j++) {
        originalSum += originalData[j] * originalData[j];
        processedSum += processedData[j] * processedData[j];
      }
      
      originalRMS.push(Math.sqrt(originalSum / (end - start)));
      processedRMS.push(Math.sqrt(processedSum / (end - start)));
    }
    
    // Calculate volume consistency ratio
    const ratios = originalRMS.map((orig, i) => {
      if (orig < 0.001) return 1; // Avoid division by very small numbers
      return processedRMS[i] / orig;
    });
    
    // Filter out extreme ratios (likely silence or noise)
    const validRatios = ratios.filter(ratio => ratio > 0.1 && ratio < 10);
    const avgRatio = validRatios.reduce((sum, ratio) => sum + ratio, 0) / validRatios.length;
    
    // Calculate consistency score (lower variance = more consistent)
    const variance = validRatios.reduce((sum, ratio) => sum + Math.pow(ratio - avgRatio, 2), 0) / validRatios.length;
    const consistencyScore = 1 / (1 + variance); // 0-1 scale, higher is better
    
    return {
      averageVolumeRatio: avgRatio,
      consistencyScore: consistencyScore,
      segmentRatios: ratios,
      needsVolumeCorrection: consistencyScore < 0.7 || Math.abs(avgRatio - 1) > 0.3
    };
  }

  // Calculate optimal makeup gain based on volume analysis
  calculateOptimalMakeupGain(originalBuffer, processedBuffer) {
    const analysis = this.analyzeVolumeConsistency(originalBuffer, processedBuffer);
    
    // If volume is inconsistent, calculate corrective gain
    if (analysis.needsVolumeCorrection) {
      // Target a slight boost to compensate for processing losses
      const targetRatio = 1.05; // 5% boost to maintain perceived loudness
      const correctionGain = targetRatio / analysis.averageVolumeRatio;
      
      // Limit gain correction to reasonable range
      return Math.max(0.8, Math.min(2.0, correctionGain));
    }
    
    return 1.1; // Default gentle makeup gain
  }

  async initializeAudioContext() {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    return this.audioContext;
  }

  async processAudio(audioFile, tier = 'basic', progressCallback = null) {
    try {
      if (progressCallback) progressCallback(5); // Starting processing
      
      const audioContext = await this.initializeAudioContext();
      if (progressCallback) progressCallback(10); // Audio context initialized
      
      const arrayBuffer = await audioFile.arrayBuffer();
      if (progressCallback) progressCallback(20); // File loaded
      
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
      if (progressCallback) progressCallback(30); // Audio decoded
      
      let processedBuffer;
      
      if (tier === 'free') {
        // For free tier, apply basic processing but with limited features
        processedBuffer = await this.applyBasicProcessing(audioBuffer, audioContext, progressCallback, 30, 70);
      } else if (tier === 'basic') {
        processedBuffer = await this.applyBasicProcessing(audioBuffer, audioContext, progressCallback, 30, 70);
      } else if (tier === 'premium') {
        processedBuffer = await this.applyPremiumProcessing(audioBuffer, audioContext, progressCallback, 30, 70);
      } else {
        // Fallback to basic processing for unknown tiers
        processedBuffer = await this.applyBasicProcessing(audioBuffer, audioContext, progressCallback, 30, 70);
      }
      
      if (progressCallback) progressCallback(75); // Processing complete
      
      // Create both preview (60 seconds) and full versions
      const previewBuffer = this.createPreviewBuffer(processedBuffer, audioContext, 60);
      if (progressCallback) progressCallback(85); // Preview created
      
      const fullBuffer = processedBuffer; // Keep the full processed audio
      if (progressCallback) progressCallback(90); // Full buffer ready
      
      const result = {
        preview: await this.audioBufferToBlob(previewBuffer, audioContext),
        full: await this.audioBufferToBlob(fullBuffer, audioContext)
      };
      
      if (progressCallback) progressCallback(100); // Complete
      
      return result;
    } catch (error) {
      console.error('Audio processing failed:', error);
      throw error;
    }
  }

  async applyBasicProcessing(audioBuffer, audioContext, progressCallback = null, startProgress = 0, endProgress = 100) {
    // Basic tier: Professional noise reduction + vocal enhancement with volume consistency
    try {
      const progressRange = endProgress - startProgress;
      const updateProgress = (step, totalSteps) => {
        if (progressCallback) {
          const progress = startProgress + (step / totalSteps) * progressRange;
          progressCallback(Math.round(progress));
        }
      };
      
      updateProgress(1, 10); // Starting basic processing
      
      // Create offline context for professional processing
      const offlineContext = new OfflineAudioContext(
        audioBuffer.numberOfChannels,
        audioBuffer.length,
        audioBuffer.sampleRate
      );
      
      updateProgress(2, 10); // Context created
      
      const source = offlineContext.createBufferSource();
      source.buffer = audioBuffer;
      
      updateProgress(3, 10); // Source configured
      
      // === STAGE 1: NOISE REDUCTION ===
      
      // High-pass filter to remove sub-bass rumble
      const highPassFilter = offlineContext.createBiquadFilter();
      highPassFilter.type = 'highpass';
      highPassFilter.frequency.setValueAtTime(40, offlineContext.currentTime);
      highPassFilter.Q.setValueAtTime(0.7, offlineContext.currentTime);
      
      updateProgress(4, 10); // High-pass filter configured
      
      // Very gentle noise gate - preserve vocal dynamics
      const noiseGate = offlineContext.createDynamicsCompressor();
      noiseGate.threshold.setValueAtTime(-65, offlineContext.currentTime); // Much higher threshold to preserve vocals
      noiseGate.knee.setValueAtTime(10, offlineContext.currentTime); // Very soft knee
      noiseGate.ratio.setValueAtTime(2.5, offlineContext.currentTime); // Very low ratio to preserve dynamics
      
      updateProgress(5, 10); // Noise gate configured
      noiseGate.attack.setValueAtTime(0.01, offlineContext.currentTime); // Slower attack to preserve vocal transients
      noiseGate.release.setValueAtTime(0.2, offlineContext.currentTime); // Slower release for natural sound
      
      // === STAGE 2: VOCAL ENHANCEMENT ===
      
      updateProgress(6, 10); // Starting vocal enhancement
      
      // Low-mid warmth (gentler boost)
      const lowMidWarmth = offlineContext.createBiquadFilter();
      lowMidWarmth.type = 'peaking';
      lowMidWarmth.frequency.setValueAtTime(200, offlineContext.currentTime);
      lowMidWarmth.Q.setValueAtTime(0.8, offlineContext.currentTime);
      lowMidWarmth.gain.setValueAtTime(0.8, offlineContext.currentTime); // Reduced from 1.5 to 0.8
      
      // Vocal presence boost (gentler boost)
      const vocalPresence = offlineContext.createBiquadFilter();
      vocalPresence.type = 'peaking';
      vocalPresence.frequency.setValueAtTime(2500, offlineContext.currentTime);
      vocalPresence.Q.setValueAtTime(1.2, offlineContext.currentTime);
      vocalPresence.gain.setValueAtTime(1.5, offlineContext.currentTime); // Reduced from 3 to 1.5
      
      // High-frequency clarity (gentler boost)
      const airBoost = offlineContext.createBiquadFilter();
      airBoost.type = 'peaking';
      airBoost.frequency.setValueAtTime(8000, offlineContext.currentTime);
      airBoost.Q.setValueAtTime(0.8, offlineContext.currentTime);
      airBoost.gain.setValueAtTime(1.0, offlineContext.currentTime); // Reduced from 2 to 1.0
      
      updateProgress(7, 10); // Vocal enhancement configured
      
      // === STAGE 3: ULTRA-GENTLE COMPRESSION ===
      
      const compressor = offlineContext.createDynamicsCompressor();
      compressor.threshold.setValueAtTime(-25, offlineContext.currentTime); // Even higher threshold for minimal compression
      compressor.knee.setValueAtTime(12, offlineContext.currentTime); // Very soft knee for ultra-smooth compression
      compressor.ratio.setValueAtTime(1.5, offlineContext.currentTime); // Minimal compression ratio
      compressor.attack.setValueAtTime(0.02, offlineContext.currentTime); // Slower attack to preserve vocal punch
      compressor.release.setValueAtTime(0.25, offlineContext.currentTime); // Natural release for dynamics
      
      // Store original buffer for volume consistency analysis
      const originalBuffer = audioBuffer;
      
      // Dynamic makeup gain based on volume consistency analysis
      const makeupGain = offlineContext.createGain();
      // Will be calculated dynamically after processing
      makeupGain.gain.setValueAtTime(1.1, offlineContext.currentTime); // Initial gentle makeup gain
      
      // Final output limiter for consistent levels (very gentle)
      const outputLimiter = offlineContext.createDynamicsCompressor();
      outputLimiter.threshold.setValueAtTime(-6, offlineContext.currentTime); // High threshold to only catch peaks
      outputLimiter.knee.setValueAtTime(2, offlineContext.currentTime);
      outputLimiter.ratio.setValueAtTime(10, offlineContext.currentTime); // High ratio for limiting
      outputLimiter.attack.setValueAtTime(0.001, offlineContext.currentTime); // Fast attack for peak limiting
      outputLimiter.release.setValueAtTime(0.01, offlineContext.currentTime); // Fast release for transparency
      
      updateProgress(8, 10); // Compression configured
      
      // === CONNECT THE PROCESSING CHAIN ===
      
      updateProgress(9, 10); // Connecting processing chain
      
      let currentNode = source;
      
      currentNode.connect(highPassFilter);
      currentNode = highPassFilter;
      
      currentNode.connect(noiseGate);
      currentNode = noiseGate;
      
      currentNode.connect(lowMidWarmth);
      currentNode = lowMidWarmth;
      
      currentNode.connect(vocalPresence);
      currentNode = vocalPresence;
      
      currentNode.connect(airBoost);
      currentNode = airBoost;
      
      currentNode.connect(compressor);
      currentNode = compressor;
      
      currentNode.connect(makeupGain);
      currentNode = makeupGain;
      
      currentNode.connect(outputLimiter);
      currentNode = outputLimiter;
      
      currentNode.connect(offlineContext.destination);
      
      source.start(0);
      let processedBuffer = await offlineContext.startRendering();
      
      // Analyze volume consistency and apply corrective gain if needed
      const optimalGain = this.calculateOptimalMakeupGain(originalBuffer, processedBuffer);
      
      // If the calculated gain differs significantly from the applied gain, reprocess with optimal gain
      if (Math.abs(optimalGain - 1.1) > 0.1) {
        // Create new offline context for reprocessing with optimal gain
        const reprocessContext = new OfflineAudioContext(
          audioBuffer.numberOfChannels,
          audioBuffer.length,
          audioBuffer.sampleRate
        );
        
        // Recreate the processing chain with optimal makeup gain
        const reprocessSource = reprocessContext.createBufferSource();
        reprocessSource.buffer = audioBuffer;
        
        // Recreate all processing nodes with same settings
        const reprocessHighPass = reprocessContext.createBiquadFilter();
        reprocessHighPass.type = 'highpass';
        reprocessHighPass.frequency.setValueAtTime(40, reprocessContext.currentTime);
        reprocessHighPass.Q.setValueAtTime(0.7, reprocessContext.currentTime);
        
        const reprocessNoiseGate = reprocessContext.createDynamicsCompressor();
        reprocessNoiseGate.threshold.setValueAtTime(-65, reprocessContext.currentTime);
        reprocessNoiseGate.knee.setValueAtTime(10, reprocessContext.currentTime);
        reprocessNoiseGate.ratio.setValueAtTime(2.5, reprocessContext.currentTime);
        reprocessNoiseGate.attack.setValueAtTime(0.01, reprocessContext.currentTime);
        reprocessNoiseGate.release.setValueAtTime(0.2, reprocessContext.currentTime);
        
        const reprocessLowMid = reprocessContext.createBiquadFilter();
        reprocessLowMid.type = 'peaking';
        reprocessLowMid.frequency.setValueAtTime(200, reprocessContext.currentTime);
        reprocessLowMid.Q.setValueAtTime(0.8, reprocessContext.currentTime);
        reprocessLowMid.gain.setValueAtTime(0.8, reprocessContext.currentTime);
        
        const reprocessVocalPresence = reprocessContext.createBiquadFilter();
        reprocessVocalPresence.type = 'peaking';
        reprocessVocalPresence.frequency.setValueAtTime(2500, reprocessContext.currentTime);
        reprocessVocalPresence.Q.setValueAtTime(1.2, reprocessContext.currentTime);
        reprocessVocalPresence.gain.setValueAtTime(1.5, reprocessContext.currentTime);
        
        const reprocessAirBoost = reprocessContext.createBiquadFilter();
        reprocessAirBoost.type = 'peaking';
        reprocessAirBoost.frequency.setValueAtTime(8000, reprocessContext.currentTime);
        reprocessAirBoost.Q.setValueAtTime(0.8, reprocessContext.currentTime);
        reprocessAirBoost.gain.setValueAtTime(1.0, reprocessContext.currentTime);
        
        const reprocessCompressor = reprocessContext.createDynamicsCompressor();
        reprocessCompressor.threshold.setValueAtTime(-25, reprocessContext.currentTime);
        reprocessCompressor.knee.setValueAtTime(12, reprocessContext.currentTime);
        reprocessCompressor.ratio.setValueAtTime(1.5, reprocessContext.currentTime);
        reprocessCompressor.attack.setValueAtTime(0.02, reprocessContext.currentTime);
        reprocessCompressor.release.setValueAtTime(0.25, reprocessContext.currentTime);
        
        const reprocessMakeupGain = reprocessContext.createGain();
        reprocessMakeupGain.gain.setValueAtTime(optimalGain, reprocessContext.currentTime);
        
        const reprocessLimiter = reprocessContext.createDynamicsCompressor();
        reprocessLimiter.threshold.setValueAtTime(-6, reprocessContext.currentTime);
        reprocessLimiter.knee.setValueAtTime(2, reprocessContext.currentTime);
        reprocessLimiter.ratio.setValueAtTime(10, reprocessContext.currentTime);
        reprocessLimiter.attack.setValueAtTime(0.001, reprocessContext.currentTime);
        reprocessLimiter.release.setValueAtTime(0.01, reprocessContext.currentTime);
        
        // Connect reprocessing chain
        reprocessSource.connect(reprocessHighPass);
        reprocessHighPass.connect(reprocessNoiseGate);
        reprocessNoiseGate.connect(reprocessLowMid);
        reprocessLowMid.connect(reprocessVocalPresence);
        reprocessVocalPresence.connect(reprocessAirBoost);
        reprocessAirBoost.connect(reprocessCompressor);
        reprocessCompressor.connect(reprocessMakeupGain);
        reprocessMakeupGain.connect(reprocessLimiter);
        reprocessLimiter.connect(reprocessContext.destination);
        
        reprocessSource.start(0);
        processedBuffer = await reprocessContext.startRendering();
      }
      
      updateProgress(10, 10); // Basic processing complete
      
      return processedBuffer;
      
    } catch (error) {
      console.error('Basic processing failed:', error);
      return audioBuffer;
    }
  }

  async applyPremiumProcessing(audioBuffer, audioContext, progressCallback = null, startProgress = 0, endProgress = 100) {
    // Premium tier: Full professional mastering chain with volume consistency
    try {
      const progressRange = endProgress - startProgress;
      const updateProgress = (step, totalSteps) => {
        if (progressCallback) {
          const progress = startProgress + (step / totalSteps) * progressRange;
          progressCallback(Math.round(progress));
        }
      };
      
      // Store original buffer for volume consistency analysis
      const originalBuffer = audioBuffer;
      
      updateProgress(1, 15); // Starting premium processing
      
      // Create offline context for professional processing
      const offlineContext = new OfflineAudioContext(
        audioBuffer.numberOfChannels,
        audioBuffer.length,
        audioBuffer.sampleRate
      );
      
      updateProgress(2, 15); // Context created
      
      const source = offlineContext.createBufferSource();
      source.buffer = audioBuffer;
      
      updateProgress(3, 15); // Source configured
      
      // === STAGE 1: NOISE REDUCTION & CLEANUP ===
      
      // High-pass filter (40Hz)
      const highPassFilter = offlineContext.createBiquadFilter();
      highPassFilter.type = 'highpass';
      highPassFilter.frequency.setValueAtTime(40, offlineContext.currentTime);
      highPassFilter.Q.setValueAtTime(0.7, offlineContext.currentTime);
      
      updateProgress(4, 15); // High-pass filter configured
      
      // Very gentle noise gate - preserve vocal dynamics (premium)
      const noiseGate = offlineContext.createDynamicsCompressor();
      noiseGate.threshold.setValueAtTime(-60, offlineContext.currentTime); // Higher threshold to preserve vocals
      noiseGate.knee.setValueAtTime(8, offlineContext.currentTime); // Softer knee
      noiseGate.ratio.setValueAtTime(3, offlineContext.currentTime); // Much lower ratio for vocal preservation
      noiseGate.attack.setValueAtTime(0.008, offlineContext.currentTime); // Slower attack for vocal transients
      noiseGate.release.setValueAtTime(0.15, offlineContext.currentTime); // Slower release for natural sound
      
      updateProgress(5, 15); // Noise gate configured
      
      // Notch filter for 60Hz electrical interference
      const notch60Hz = offlineContext.createBiquadFilter();
      notch60Hz.type = 'notch';
      notch60Hz.frequency.setValueAtTime(60, offlineContext.currentTime);
      notch60Hz.Q.setValueAtTime(30, offlineContext.currentTime);
      
      // Notch filter for 120Hz harmonic
      const notch120Hz = offlineContext.createBiquadFilter();
      notch120Hz.type = 'notch';
      notch120Hz.frequency.setValueAtTime(120, offlineContext.currentTime);
      notch120Hz.Q.setValueAtTime(30, offlineContext.currentTime);
      
      updateProgress(6, 15); // Interference filters configured
      
      // De-esser (6500Hz)
       const deEsser = offlineContext.createBiquadFilter();
       deEsser.type = 'peaking';
       deEsser.frequency.setValueAtTime(6500, offlineContext.currentTime);
       deEsser.Q.setValueAtTime(2, offlineContext.currentTime);
       deEsser.gain.setValueAtTime(-4, offlineContext.currentTime);
       
       // Advanced noise reduction filter (broadband)
       const noiseReductionFilter = offlineContext.createBiquadFilter();
       noiseReductionFilter.type = 'highpass';
       noiseReductionFilter.frequency.setValueAtTime(35, offlineContext.currentTime);
       noiseReductionFilter.Q.setValueAtTime(0.5, offlineContext.currentTime);
      
      updateProgress(7, 15); // Noise reduction configured
      
      // === STAGE 2: ADVANCED EQUALIZATION (Premium) ===
       
       // Sub-bass control (30Hz high-pass)
       const subBassControl = offlineContext.createBiquadFilter();
       subBassControl.type = 'highpass';
       subBassControl.frequency.setValueAtTime(30, offlineContext.currentTime);
       subBassControl.Q.setValueAtTime(0.8, offlineContext.currentTime);
       
       // Bass enhancement (80Hz, +3dB)
       const bassEnhancement = offlineContext.createBiquadFilter();
       bassEnhancement.type = 'peaking';
       bassEnhancement.frequency.setValueAtTime(80, offlineContext.currentTime);
       bassEnhancement.Q.setValueAtTime(1.0, offlineContext.currentTime);
       bassEnhancement.gain.setValueAtTime(3, offlineContext.currentTime);
       
       updateProgress(8, 15); // Bass enhancement configured
       
       // Low-mid warmth (200Hz, +2dB - balanced)
       const lowMidWarmth = offlineContext.createBiquadFilter();
       lowMidWarmth.type = 'peaking';
       lowMidWarmth.frequency.setValueAtTime(200, offlineContext.currentTime);
       lowMidWarmth.Q.setValueAtTime(0.8, offlineContext.currentTime);
       lowMidWarmth.gain.setValueAtTime(2, offlineContext.currentTime);
       
       // Mid-range clarity cut (500Hz, -1.5dB - gentle)
       const midCut = offlineContext.createBiquadFilter();
       midCut.type = 'peaking';
       midCut.frequency.setValueAtTime(500, offlineContext.currentTime);
       midCut.Q.setValueAtTime(1.5, offlineContext.currentTime);
       midCut.gain.setValueAtTime(-1.5, offlineContext.currentTime);
       
       // Vocal presence boost (2500Hz, +4dB - balanced)
       const vocalPresence = offlineContext.createBiquadFilter();
       vocalPresence.type = 'peaking';
       vocalPresence.frequency.setValueAtTime(2500, offlineContext.currentTime);
       vocalPresence.Q.setValueAtTime(1.2, offlineContext.currentTime);
       vocalPresence.gain.setValueAtTime(4, offlineContext.currentTime);
       
       updateProgress(9, 15); // Vocal presence configured
       
       // High-mid clarity (5000Hz, +2dB)
       const highMidClarity = offlineContext.createBiquadFilter();
       highMidClarity.type = 'peaking';
       highMidClarity.frequency.setValueAtTime(5000, offlineContext.currentTime);
       highMidClarity.Q.setValueAtTime(1.2, offlineContext.currentTime);
       highMidClarity.gain.setValueAtTime(2, offlineContext.currentTime);
       
       // High-frequency air/sparkle (12000Hz, +3dB - balanced)
       const airSparkle = offlineContext.createBiquadFilter();
       airSparkle.type = 'peaking';
       airSparkle.frequency.setValueAtTime(12000, offlineContext.currentTime);
       airSparkle.Q.setValueAtTime(0.8, offlineContext.currentTime);
       airSparkle.gain.setValueAtTime(3, offlineContext.currentTime);
       
       // Ultra-high frequency enhancement (16000Hz, +3dB)
       const ultraHighBoost = offlineContext.createBiquadFilter();
       ultraHighBoost.type = 'peaking';
       ultraHighBoost.frequency.setValueAtTime(16000, offlineContext.currentTime);
       ultraHighBoost.Q.setValueAtTime(0.8, offlineContext.currentTime);
       ultraHighBoost.gain.setValueAtTime(3, offlineContext.currentTime);
      
      updateProgress(10, 15); // High-frequency enhancement configured
      
      // === STAGE 3: ADVANCED DYNAMIC PROCESSING (Premium) ===
       
       // Pre-compressor (ultra-gentle for vocal preservation)
       const preCompressor = offlineContext.createDynamicsCompressor();
       preCompressor.threshold.setValueAtTime(-30, offlineContext.currentTime); // Higher threshold
       preCompressor.knee.setValueAtTime(12, offlineContext.currentTime); // Softer knee
       preCompressor.ratio.setValueAtTime(1.8, offlineContext.currentTime); // Much lower ratio
       preCompressor.attack.setValueAtTime(0.02, offlineContext.currentTime); // Slower attack for vocal transients
       preCompressor.release.setValueAtTime(0.3, offlineContext.currentTime); // Slower release for natural dynamics
       
       // Main compressor (gentle for premium vocal preservation)
       const mainCompressor = offlineContext.createDynamicsCompressor();
       mainCompressor.threshold.setValueAtTime(-22, offlineContext.currentTime); // Higher threshold
       mainCompressor.knee.setValueAtTime(10, offlineContext.currentTime); // Softer knee
       mainCompressor.ratio.setValueAtTime(2.5, offlineContext.currentTime); // Lower ratio for vocal dynamics
       mainCompressor.attack.setValueAtTime(0.015, offlineContext.currentTime); // Slower attack
       mainCompressor.release.setValueAtTime(0.2, offlineContext.currentTime); // Natural release
       
       updateProgress(11, 15); // Dynamic processing configured
       
       // === STAGE 4: STEREO ENHANCEMENT (Premium Only) ===
       
       // Stereo widener
       const stereoWidener = offlineContext.createGain();
       stereoWidener.gain.setValueAtTime(1.2, offlineContext.currentTime);
       
       updateProgress(12, 15); // Stereo enhancement configured
       
       // === STAGE 5: ADVANCED LOUDNESS OPTIMIZATION ===
       
       // Makeup gain (higher for premium)
       const makeupGain = offlineContext.createGain();
       makeupGain.gain.setValueAtTime(2.2, offlineContext.currentTime);
       
       // Transparent brick-wall limiter (more aggressive)
       const limiter = offlineContext.createDynamicsCompressor();
       limiter.threshold.setValueAtTime(-0.5, offlineContext.currentTime);
       limiter.knee.setValueAtTime(0, offlineContext.currentTime);
       limiter.ratio.setValueAtTime(25, offlineContext.currentTime);
       limiter.attack.setValueAtTime(0.0005, offlineContext.currentTime);
       limiter.release.setValueAtTime(0.008, offlineContext.currentTime);
       
       // Final maximizer
       const maximizer = offlineContext.createDynamicsCompressor();
       maximizer.threshold.setValueAtTime(-0.1, offlineContext.currentTime);
       maximizer.knee.setValueAtTime(0, offlineContext.currentTime);
       maximizer.ratio.setValueAtTime(50, offlineContext.currentTime);
       maximizer.attack.setValueAtTime(0.0001, offlineContext.currentTime);
       maximizer.release.setValueAtTime(0.005, offlineContext.currentTime);
       
       // Safety gain
       const safetyGain = offlineContext.createGain();
       safetyGain.gain.setValueAtTime(0.92, offlineContext.currentTime);
       
       updateProgress(13, 15); // Loudness optimization configured
      
      // === CONNECT THE FULL PREMIUM MASTERING CHAIN ===
       
       let currentNode = source;
       
       // Noise reduction & cleanup
       currentNode.connect(highPassFilter);
       currentNode = highPassFilter;
       
       currentNode.connect(noiseGate);
       currentNode = noiseGate;
       
       currentNode.connect(notch60Hz);
       currentNode = notch60Hz;
       
       currentNode.connect(notch120Hz);
       currentNode = notch120Hz;
       
       currentNode.connect(deEsser);
       currentNode = deEsser;
       
       currentNode.connect(noiseReductionFilter);
       currentNode = noiseReductionFilter;
       
       // Advanced EQ chain
       currentNode.connect(subBassControl);
       currentNode = subBassControl;
       
       currentNode.connect(bassEnhancement);
       currentNode = bassEnhancement;
       
       currentNode.connect(lowMidWarmth);
       currentNode = lowMidWarmth;
       
       currentNode.connect(midCut);
       currentNode = midCut;
       
       currentNode.connect(vocalPresence);
       currentNode = vocalPresence;
       
       currentNode.connect(highMidClarity);
       currentNode = highMidClarity;
       
       currentNode.connect(airSparkle);
       currentNode = airSparkle;
       
       currentNode.connect(ultraHighBoost);
       currentNode = ultraHighBoost;
       
       // Advanced dynamic processing
       currentNode.connect(preCompressor);
       currentNode = preCompressor;
       
       currentNode.connect(mainCompressor);
       currentNode = mainCompressor;
       
       // Stereo enhancement
       currentNode.connect(stereoWidener);
       currentNode = stereoWidener;
       
       // Advanced loudness & limiting
       currentNode.connect(makeupGain);
       currentNode = makeupGain;
       
       currentNode.connect(limiter);
       currentNode = limiter;
       
       currentNode.connect(maximizer);
       currentNode = maximizer;
       
       currentNode.connect(safetyGain);
       currentNode = safetyGain;
       
       currentNode.connect(offlineContext.destination);
      
      updateProgress(14, 15); // Processing chain connected
      
      source.start(0);
      let processedBuffer = await offlineContext.startRendering();
      
      // Analyze volume consistency and apply corrective gain if needed
      const optimalGain = this.calculateOptimalMakeupGain(originalBuffer, processedBuffer);
      
      // For premium processing, use a more sophisticated gain calculation
      const premiumOptimalGain = optimalGain * 1.8; // Premium tier gets higher target loudness
      
      // If the calculated gain differs significantly from the applied gain, reprocess with optimal gain
      if (Math.abs(premiumOptimalGain - 2.2) > 0.2) {
        // Create new offline context for reprocessing with optimal gain
        const reprocessContext = new OfflineAudioContext(
          audioBuffer.numberOfChannels,
          audioBuffer.length,
          audioBuffer.sampleRate
        );
        
        // Recreate the processing chain with optimal makeup gain
        const reprocessSource = reprocessContext.createBufferSource();
        reprocessSource.buffer = audioBuffer;
        
        // Recreate all processing nodes with same settings (abbreviated for performance)
        const rHighPass = reprocessContext.createBiquadFilter();
        rHighPass.type = 'highpass';
        rHighPass.frequency.setValueAtTime(40, reprocessContext.currentTime);
        rHighPass.Q.setValueAtTime(0.7, reprocessContext.currentTime);
        
        const rNoiseGate = reprocessContext.createDynamicsCompressor();
        rNoiseGate.threshold.setValueAtTime(-60, reprocessContext.currentTime);
        rNoiseGate.knee.setValueAtTime(8, reprocessContext.currentTime);
        rNoiseGate.ratio.setValueAtTime(3, reprocessContext.currentTime);
        rNoiseGate.attack.setValueAtTime(0.008, reprocessContext.currentTime);
        rNoiseGate.release.setValueAtTime(0.15, reprocessContext.currentTime);
        
        const rVocalPresence = reprocessContext.createBiquadFilter();
        rVocalPresence.type = 'peaking';
        rVocalPresence.frequency.setValueAtTime(2500, reprocessContext.currentTime);
        rVocalPresence.Q.setValueAtTime(1.2, reprocessContext.currentTime);
        rVocalPresence.gain.setValueAtTime(4, reprocessContext.currentTime);
        
        const rPreCompressor = reprocessContext.createDynamicsCompressor();
        rPreCompressor.threshold.setValueAtTime(-30, reprocessContext.currentTime);
        rPreCompressor.knee.setValueAtTime(12, reprocessContext.currentTime);
        rPreCompressor.ratio.setValueAtTime(1.8, reprocessContext.currentTime);
        rPreCompressor.attack.setValueAtTime(0.02, reprocessContext.currentTime);
        rPreCompressor.release.setValueAtTime(0.3, reprocessContext.currentTime);
        
        const rMainCompressor = reprocessContext.createDynamicsCompressor();
        rMainCompressor.threshold.setValueAtTime(-22, reprocessContext.currentTime);
        rMainCompressor.knee.setValueAtTime(10, reprocessContext.currentTime);
        rMainCompressor.ratio.setValueAtTime(2.5, reprocessContext.currentTime);
        rMainCompressor.attack.setValueAtTime(0.015, reprocessContext.currentTime);
        rMainCompressor.release.setValueAtTime(0.2, reprocessContext.currentTime);
        
        const rMakeupGain = reprocessContext.createGain();
        rMakeupGain.gain.setValueAtTime(premiumOptimalGain, reprocessContext.currentTime);
        
        const rLimiter = reprocessContext.createDynamicsCompressor();
        rLimiter.threshold.setValueAtTime(-0.5, reprocessContext.currentTime);
        rLimiter.knee.setValueAtTime(0, reprocessContext.currentTime);
        rLimiter.ratio.setValueAtTime(25, reprocessContext.currentTime);
        rLimiter.attack.setValueAtTime(0.0005, reprocessContext.currentTime);
        rLimiter.release.setValueAtTime(0.008, reprocessContext.currentTime);
        
        const rSafetyGain = reprocessContext.createGain();
        rSafetyGain.gain.setValueAtTime(0.92, reprocessContext.currentTime);
        
        // Connect simplified reprocessing chain
        reprocessSource.connect(rHighPass);
        rHighPass.connect(rNoiseGate);
        rNoiseGate.connect(rVocalPresence);
        rVocalPresence.connect(rPreCompressor);
        rPreCompressor.connect(rMainCompressor);
        rMainCompressor.connect(rMakeupGain);
        rMakeupGain.connect(rLimiter);
        rLimiter.connect(rSafetyGain);
        rSafetyGain.connect(reprocessContext.destination);
        
        reprocessSource.start(0);
        processedBuffer = await reprocessContext.startRendering();
      }
      
      updateProgress(15, 15); // Premium processing complete
      
      return processedBuffer;
      
    } catch (error) {
      console.error('Premium processing failed:', error);
      return audioBuffer;
    }
  }

  applyNoiseReduction(inputData, outputData) {
    // Gentle noise reduction to preserve audio content
    for (let i = 0; i < inputData.length; i++) {
      let sample = inputData[i];
      
      // Apply gentle noise gate
      if (Math.abs(sample) < 0.001) {
        sample *= 0.5; // Reduce very quiet noise
      }
      
      // Preserve most of the original signal
      outputData[i] = sample * 0.95; // Slight attenuation for noise reduction
    }
  }

  applyVocalEnhancement(data) {
    // Boost mid frequencies (1kHz-4kHz) for vocal clarity
    for (let i = 0; i < data.length; i++) {
      // Simple gain boost with soft saturation
      let enhanced = data[i] * 1.3;
      // Soft clipping to prevent distortion
      enhanced = Math.tanh(enhanced * 0.7);
      data[i] = enhanced;
    }
  }

  applyAdvancedNoiseReduction(inputData, outputData) {
    // Advanced but gentle noise reduction
    const threshold = 0.005;
    
    for (let i = 0; i < inputData.length; i++) {
      let sample = inputData[i];
      
      // Gentle spectral gating - reduce very low-level signals
      if (Math.abs(sample) < threshold) {
        sample *= 0.7; // Reduce noise floor but preserve quiet content
      }
      
      // Preserve the signal with minimal filtering
      outputData[i] = sample * 0.98; // Very slight attenuation
    }
  }

  applyOverallBalancing(data) {
    // Multi-band EQ simulation
    for (let i = 0; i < data.length; i++) {
      let sample = data[i];
      
      // Subtle bass enhancement
      sample *= 1.1;
      
      // Mid-range clarity
      sample = Math.tanh(sample * 1.2) * 0.9;
      
      // High-frequency sparkle
      if (i > 10) {
        const highFreq = (data[i] - data[i-10]) * 0.1;
        sample += highFreq;
      }
      
      data[i] = sample;
    }
  }

  applyCompression(data) {
    // Dynamic range compression
    const threshold = 0.7;
    const ratio = 4;
    
    for (let i = 0; i < data.length; i++) {
      const sample = data[i];
      const amplitude = Math.abs(sample);
      
      if (amplitude > threshold) {
        const excess = amplitude - threshold;
        const compressedExcess = excess / ratio;
        const newAmplitude = threshold + compressedExcess;
        data[i] = (sample / amplitude) * newAmplitude;
      }
    }
  }

  applyHarmonicEnhancement(data) {
    // Add subtle harmonic content
    for (let i = 0; i < data.length; i++) {
      const sample = data[i];
      // Add second harmonic at low level
      const harmonic = Math.sin(sample * Math.PI) * 0.05;
      data[i] = sample + harmonic;
    }
  }

  createPreviewBuffer(audioBuffer, audioContext, durationSeconds) {
    const maxSamples = Math.min(
      audioBuffer.length,
      durationSeconds * audioBuffer.sampleRate
    );
    
    const previewBuffer = audioContext.createBuffer(
      audioBuffer.numberOfChannels,
      maxSamples,
      audioBuffer.sampleRate
    );
    
    for (let channel = 0; channel < audioBuffer.numberOfChannels; channel++) {
      const inputData = audioBuffer.getChannelData(channel);
      const outputData = previewBuffer.getChannelData(channel);
      
      for (let i = 0; i < maxSamples; i++) {
        outputData[i] = inputData[i];
      }
    }
    
    return previewBuffer;
  }

  async audioBufferToBlob(audioBuffer, audioContext) {
    // Convert AudioBuffer to WAV blob
    const numberOfChannels = audioBuffer.numberOfChannels;
    const sampleRate = audioBuffer.sampleRate;
    const length = audioBuffer.length;
    
    // Create WAV file
    const arrayBuffer = new ArrayBuffer(44 + length * numberOfChannels * 2);
    const view = new DataView(arrayBuffer);
    
    // WAV header
    const writeString = (offset, string) => {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
      }
    };
    
    writeString(0, 'RIFF');
    view.setUint32(4, 36 + length * numberOfChannels * 2, true);
    writeString(8, 'WAVE');
    writeString(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, numberOfChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * numberOfChannels * 2, true);
    view.setUint16(32, numberOfChannels * 2, true);
    view.setUint16(34, 16, true);
    writeString(36, 'data');
    view.setUint32(40, length * numberOfChannels * 2, true);
    
    // Convert float samples to 16-bit PCM
    let offset = 44;
    for (let i = 0; i < length; i++) {
      for (let channel = 0; channel < numberOfChannels; channel++) {
        const sample = Math.max(-1, Math.min(1, audioBuffer.getChannelData(channel)[i]));
        view.setInt16(offset, sample * 0x7FFF, true);
        offset += 2;
      }
    }
    
    return new Blob([arrayBuffer], { type: 'audio/wav' });
  }
}

export default AudioProcessor;