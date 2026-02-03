import { useState, useEffect, useRef, useCallback } from 'react';

// Check if we're on HTTPS or localhost (required for getUserMedia)
const isSecureContext = () => {
  return window.isSecureContext || 
         window.location.protocol === 'https:' || 
         window.location.hostname === 'localhost' ||
         window.location.hostname === '127.0.0.1';
};

const SUPPORTED_LANGUAGES = [
  { code: 'en-IN', label: 'English', flag: '🇬🇧' },
  { code: 'hi-IN', label: 'Hindi', flag: '🇮🇳' },
  { code: 'kn-IN', label: 'Kannada', flag: '🇮🇳' },
];

// Check browser support
const isSpeechRecognitionSupported = () => {
  return (
    'SpeechRecognition' in window ||
    'webkitSpeechRecognition' in window
  );
};

const isSpeechSynthesisSupported = () => {
  return 'speechSynthesis' in window;
};

const useSpeechAssistant = () => {
  const [isListening, setIsListening] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en-IN');
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [detectedLanguage, setDetectedLanguage] = useState(null);
  const [isSupported, setIsSupported] = useState(false);
  const [supportError, setSupportError] = useState('');

  const recognitionRef = useRef(null);
  const synthesisRef = useRef(null);
  const autoStopTimeoutRef = useRef(null);
  const isListeningRef = useRef(false);
  const finalTranscriptRef = useRef('');

  // Initialize speech recognition
  useEffect(() => {
    // Check secure context first
    if (!isSecureContext()) {
      setIsSupported(false);
      setSupportError('Speech recognition requires HTTPS or localhost. Please use a secure connection.');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      setIsSupported(false);
      setSupportError('Speech recognition is not supported in this browser. Please use Chrome or Edge.');
      return;
    }

    if (!isSpeechSynthesisSupported()) {
      setIsSupported(false);
      setSupportError('Speech synthesis is not supported in this browser.');
      return;
    }

    // Check if getUserMedia is available
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setIsSupported(false);
      setSupportError('Microphone access is not available. Please use a modern browser.');
      return;
    }

    setIsSupported(true);
    const recognition = new SpeechRecognition();
    
    // Configure recognition
    recognition.continuous = true; // Keep listening until manually stopped
    recognition.interimResults = true; // Enable interim results to show live transcription
    // Use selected language or default to English for better compatibility
    recognition.lang = selectedLanguage || 'en-IN';
    
    console.log('Initializing speech recognition with language:', recognition.lang);
    
    recognition.onstart = () => {
      console.log('Speech recognition started');
      setIsListening(true);
      isListeningRef.current = true;
      setTranscript('');
      setInterimTranscript('');
      setDetectedLanguage(null);
      finalTranscriptRef.current = '';
      
      // Clear any existing auto-stop timeout
      if (autoStopTimeoutRef.current) {
        clearTimeout(autoStopTimeoutRef.current);
        autoStopTimeoutRef.current = null;
      }
    };

    recognition.onresult = (event) => {
      console.log('Speech recognition result:', event);
      
      let interim = '';
      
      // Process all results - accumulate final results, show latest interim
      for (let i = 0; i < event.results.length; i++) {
        const transcriptPiece = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscriptRef.current += transcriptPiece + ' ';
          console.log('Final piece:', transcriptPiece);
        } else {
          interim += transcriptPiece;
        }
      }
      
      // Update states with accumulated final + current interim
      const combined = finalTranscriptRef.current + interim;
      console.log('Combined transcript:', combined);
      
      setTranscript(finalTranscriptRef.current.trim());
      setInterimTranscript(interim);
      
      // Get detected language from result
      const last = event.results.length - 1;
      const lang = event.results[last][0].language || recognition.lang || null;
      
      if (lang) {
        console.log('Detected language:', lang);
        setDetectedLanguage(lang);
      }
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      
      if (event.error === 'no-speech') {
        // Silent timeout - this is normal, restart recognition to keep listening
        console.log('No speech detected, continuing to listen...');
        // Don't change listening state - recognition will auto-restart via onend
      } else if (event.error === 'not-allowed') {
        setIsListening(false);
        isListeningRef.current = false;
        setSupportError('Microphone permission denied. Please allow microphone access.');
      } else if (event.error === 'aborted') {
        // Recognition was aborted, this is normal when stopping
        console.log('Recognition aborted (normal)');
        setIsListening(false);
        isListeningRef.current = false;
      } else if (event.error === 'network') {
        console.error('Network error in speech recognition');
        // Don't stop immediately on network errors, let it try to recover
        console.log('Network error, will retry...');
      } else {
        console.error('Other recognition error:', event.error);
        setIsListening(false);
        isListeningRef.current = false;
        setSupportError(`Speech recognition error: ${event.error}. Please try again.`);
      }
    };

    recognition.onend = () => {
      console.log('Speech recognition ended, current listening state:', isListeningRef.current);
      
      // If we're still supposed to be listening (not manually stopped), restart
      if (isListeningRef.current) {
        console.log('Recognition ended unexpectedly, restarting...');
        try {
          // Small delay before restart to avoid rapid restart loops
          setTimeout(() => {
            if (isListeningRef.current && recognitionRef.current) {
              recognitionRef.current.start();
            }
          }, 100);
        } catch (error) {
          console.error('Error restarting recognition:', error);
          setIsListening(false);
          isListeningRef.current = false;
        }
      } else {
        // Manual stop
        setIsListening(false);
      }
      
      // Clear auto-stop timeout
      if (autoStopTimeoutRef.current) {
        clearTimeout(autoStopTimeoutRef.current);
        autoStopTimeoutRef.current = null;
      }
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [selectedLanguage]); // Re-initialize when language changes

  // Request microphone permission
  const requestMicrophonePermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // Stop the stream immediately, we just needed permission
      stream.getTracks().forEach(track => track.stop());
      return true;
    } catch (error) {
      console.error('Microphone permission denied:', error);
      setSupportError('Microphone permission denied. Please allow microphone access in your browser settings.');
      return false;
    }
  };

  // Start listening
  const startListening = useCallback(async () => {
    if (!isSupported || !recognitionRef.current) {
      alert(supportError || 'Speech recognition not available');
      return;
    }

    if (isListening) {
      return;
    }

    // Request microphone permission first
    const hasPermission = await requestMicrophonePermission();
    if (!hasPermission) {
      setIsListening(false);
      return;
    }

    try {
      // Update language before starting
      recognitionRef.current.lang = selectedLanguage || 'en-IN';
      console.log('Starting recognition with language:', recognitionRef.current.lang);
      recognitionRef.current.start();
    } catch (error) {
      console.error('Error starting recognition:', error);
      setIsListening(false);
      if (error.message && error.message.includes('already started')) {
        // Recognition already running, stop and restart
        recognitionRef.current.stop();
        setTimeout(() => {
          recognitionRef.current.start();
        }, 100);
      } else if (error.message && error.message.includes('not-allowed')) {
        setSupportError('Microphone permission denied. Please allow microphone access.');
      }
    }
  }, [isSupported, isListening, supportError, selectedLanguage]);

  // Stop listening
  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      console.log('Manually stopping recognition');
      isListeningRef.current = false;
      recognitionRef.current.stop();
      setIsListening(false);
      
      // Clear auto-stop timeout
      if (autoStopTimeoutRef.current) {
        clearTimeout(autoStopTimeoutRef.current);
        autoStopTimeoutRef.current = null;
      }
    }
  }, []);

  // Speak text using Web Speech API
  const speakText = useCallback((text, language = null) => {
    if (!isSpeechSynthesisSupported()) {
      console.warn('Speech synthesis not supported');
      return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    const langToUse = language || selectedLanguage;

    // Set voice parameters
    utterance.lang = langToUse;
    utterance.pitch = 1;
    utterance.rate = 1;
    utterance.volume = 1;

    // Function to find and set voice
    const setVoice = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length === 0) return;

      const target = langToUse.toLowerCase();
      const base = target.split('-')[0]; // 'en', 'hi', 'kn'

      // 1) Exact lang match (e.g., hi-IN, kn-IN)
      let chosen = voices.find(v => v.lang && v.lang.toLowerCase() === target);

      // 2) Base language match (hi, kn)
      if (!chosen) {
        chosen = voices.find(v => v.lang && v.lang.toLowerCase().startsWith(base));
      }

      // 3) Name hints ("Hindi", "Kannada")
      if (!chosen && base === 'hi') {
        chosen = voices.find(v => (v.name || '').toLowerCase().includes('hindi'));
      }
      if (!chosen && base === 'kn') {
        chosen = voices.find(v => (v.name || '').toLowerCase().includes('kannada'));
      }

      // 4) Any Indian locale voice
      if (!chosen) {
        chosen = voices.find(v => (v.lang || '').toLowerCase().includes('-in'));
      }

      // Log what we have for debugging
      try {
        console.log('Available voices:', voices.map(v => ({ name: v.name, lang: v.lang })));
        console.log('Chosen voice:', chosen ? { name: chosen.name, lang: chosen.lang } : null, 'for lang', langToUse);
      } catch (_) {}

      if (chosen) {
        utterance.voice = chosen;
      }

      window.speechSynthesis.speak(utterance);
    };

    // Load voices if not already loaded
    const voices = window.speechSynthesis.getVoices();
    if (voices.length === 0) {
      window.speechSynthesis.onvoiceschanged = setVoice;
    } else {
      setVoice();
    }

    synthesisRef.current = utterance;
  }, [selectedLanguage]);

  // Stop speaking
  const stopSpeaking = useCallback(() => {
    window.speechSynthesis.cancel();
  }, []);

  return {
    isListening,
    selectedLanguage,
    setSelectedLanguage,
    transcript,
    interimTranscript,
    detectedLanguage,
    isSupported,
    supportError,
    startListening,
    stopListening,
    speakText,
    stopSpeaking,
    supportedLanguages: SUPPORTED_LANGUAGES,
  };
};

export default useSpeechAssistant;

