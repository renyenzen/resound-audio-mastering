// Audio processing utilities for basic and premium enhancement

class AudioProcessor {
  constructor() {
    this.audioContext = null;
  }

  async initializeAudioContext() {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    return this.audioContext;
  }

  async processAudio(audioFile, tier = 'basic') {
    try {
      const audioContext = await this.initializeAudioContext();
      const arrayBuffer = await audioFile.arrayBuffer();
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
      
      let processedBuffer;
      
      if (tier === 'basic') {
        processedBuffer = await this.applyBasicProcessing(audioBuffer, audioContext);
      } else if (tier === 'premium') {
        processedBuffer = await this.applyPremiumProcessing(audioBuffer, audioContext);
      }
      
      // Create both preview (60 seconds) and full versions
      const previewBuffer = this.createPreviewBuffer(processedBuffer, audioContext, 60);
      const fullBuffer = processedBuffer; // Keep the full processed audio
      
      return {
        preview: await this.audioBufferToBlob(previewBuffer, audioContext),
        full: await this.audioBufferToBlob(fullBuffer, audioContext)
      };
    } catch (error) {
      console.error('Audio processing failed:', error);
      throw error;
    }
  }

  async applyBasicProcessing(audioBuffer, audioContext) {
    // Basic tier: Professional noise reduction + vocal enhancement
    try {
      // Create offline context for professional processing
      const offlineContext = new OfflineAudioContext(
        audioBuffer.numberOfChannels,
        audioBuffer.length,
        audioBuffer.sampleRate
      );
      
      const source = offlineContext.createBufferSource();
      source.buffer = audioBuffer;
      
      // === STAGE 1: NOISE REDUCTION ===
      
      // High-pass filter to remove sub-bass rumble
      const highPassFilter = offlineContext.createBiquadFilter();
      highPassFilter.type = 'highpass';
      highPassFilter.frequency.setValueAtTime(40, offlineContext.currentTime);
      highPassFilter.Q.setValueAtTime(0.7, offlineContext.currentTime);
      
      // Noise gate for background noise
      const noiseGate = offlineContext.createDynamicsCompressor();
      noiseGate.threshold.setValueAtTime(-45, offlineContext.currentTime);
      noiseGate.knee.setValueAtTime(2, offlineContext.currentTime);
      noiseGate.ratio.setValueAtTime(12, offlineContext.currentTime);
      noiseGate.attack.setValueAtTime(0.002, offlineContext.currentTime);
      noiseGate.release.setValueAtTime(0.05, offlineContext.currentTime);
      
      // === STAGE 2: VOCAL ENHANCEMENT ===
      
      // Low-mid warmth
      const lowMidWarmth = offlineContext.createBiquadFilter();
      lowMidWarmth.type = 'peaking';
      lowMidWarmth.frequency.setValueAtTime(200, offlineContext.currentTime);
      lowMidWarmth.Q.setValueAtTime(0.8, offlineContext.currentTime);
      lowMidWarmth.gain.setValueAtTime(1.5, offlineContext.currentTime);
      
      // Vocal presence boost
      const vocalPresence = offlineContext.createBiquadFilter();
      vocalPresence.type = 'peaking';
      vocalPresence.frequency.setValueAtTime(2500, offlineContext.currentTime);
      vocalPresence.Q.setValueAtTime(1.2, offlineContext.currentTime);
      vocalPresence.gain.setValueAtTime(3, offlineContext.currentTime);
      
      // High-frequency clarity
      const airBoost = offlineContext.createBiquadFilter();
      airBoost.type = 'peaking';
      airBoost.frequency.setValueAtTime(8000, offlineContext.currentTime);
      airBoost.Q.setValueAtTime(0.8, offlineContext.currentTime);
      airBoost.gain.setValueAtTime(2, offlineContext.currentTime);
      
      // === STAGE 3: GENTLE COMPRESSION ===
      
      const compressor = offlineContext.createDynamicsCompressor();
      compressor.threshold.setValueAtTime(-20, offlineContext.currentTime);
      compressor.knee.setValueAtTime(4, offlineContext.currentTime);
      compressor.ratio.setValueAtTime(3, offlineContext.currentTime);
      compressor.attack.setValueAtTime(0.01, offlineContext.currentTime);
      compressor.release.setValueAtTime(0.15, offlineContext.currentTime);
      
      // === CONNECT THE PROCESSING CHAIN ===
      
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
      
      currentNode.connect(offlineContext.destination);
      
      source.start(0);
      return await offlineContext.startRendering();
      
    } catch (error) {
      console.error('Basic processing failed:', error);
      return audioBuffer;
    }
  }

  async applyPremiumProcessing(audioBuffer, audioContext) {
    // Premium tier: Full professional mastering chain
    try {
      // Create offline context for professional processing
      const offlineContext = new OfflineAudioContext(
        audioBuffer.numberOfChannels,
        audioBuffer.length,
        audioBuffer.sampleRate
      );
      
      const source = offlineContext.createBufferSource();
      source.buffer = audioBuffer;
      
      // === STAGE 1: NOISE REDUCTION & CLEANUP ===
      
      // High-pass filter (40Hz)
      const highPassFilter = offlineContext.createBiquadFilter();
      highPassFilter.type = 'highpass';
      highPassFilter.frequency.setValueAtTime(40, offlineContext.currentTime);
      highPassFilter.Q.setValueAtTime(0.7, offlineContext.currentTime);
      
      // Gentle but effective noise gate
      const noiseGate = offlineContext.createDynamicsCompressor();
      noiseGate.threshold.setValueAtTime(-45, offlineContext.currentTime);
      noiseGate.knee.setValueAtTime(4, offlineContext.currentTime);
      noiseGate.ratio.setValueAtTime(12, offlineContext.currentTime);
      noiseGate.attack.setValueAtTime(0.002, offlineContext.currentTime);
      noiseGate.release.setValueAtTime(0.05, offlineContext.currentTime);
      
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
      
      // === STAGE 3: ADVANCED DYNAMIC PROCESSING (Premium) ===
       
       // Pre-compressor (gentle)
       const preCompressor = offlineContext.createDynamicsCompressor();
       preCompressor.threshold.setValueAtTime(-24, offlineContext.currentTime);
       preCompressor.knee.setValueAtTime(8, offlineContext.currentTime);
       preCompressor.ratio.setValueAtTime(2.5, offlineContext.currentTime);
       preCompressor.attack.setValueAtTime(0.01, offlineContext.currentTime);
       preCompressor.release.setValueAtTime(0.2, offlineContext.currentTime);
       
       // Main compressor (balanced for premium)
       const mainCompressor = offlineContext.createDynamicsCompressor();
       mainCompressor.threshold.setValueAtTime(-18, offlineContext.currentTime);
       mainCompressor.knee.setValueAtTime(6, offlineContext.currentTime);
       mainCompressor.ratio.setValueAtTime(4, offlineContext.currentTime);
       mainCompressor.attack.setValueAtTime(0.005, offlineContext.currentTime);
       mainCompressor.release.setValueAtTime(0.12, offlineContext.currentTime);
       
       // === STAGE 4: STEREO ENHANCEMENT (Premium Only) ===
       
       // Stereo widener
       const stereoWidener = offlineContext.createGain();
       stereoWidener.gain.setValueAtTime(1.2, offlineContext.currentTime);
       
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
      
      source.start(0);
      return await offlineContext.startRendering();
      
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