import { useState, useRef, useEffect } from 'react';
import { Send, Mic, Loader2, ChevronDown, Volume2, VolumeX } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { askQuestion } from '../api';
import useSpeechAssistant from '../hooks/useSpeechAssistant';
import { useLanguage } from '../contexts/LanguageContext';

function Chatbot() {
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [readAloud, setReadAloud] = useState(false);
  const [messageVoiceLang, setMessageVoiceLang] = useState({}); // index -> 'en-IN' | 'hi-IN' | 'kn-IN'
  const [thinkingTime, setThinkingTime] = useState(0);
  const [messageResponseTimes, setMessageResponseTimes] = useState({}); // index -> response time in seconds
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);
  const speakingIntervalRef = useRef(null);
  const thinkingTimerRef = useRef(null);

  const {
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
    supportedLanguages,
  } = useSpeechAssistant();


  // Map language code to backend format
  const mapLanguageToBackend = (langCode) => {
    const langMap = {
      'en-IN': 'english',
      'hi-IN': 'hindi',
      'kn-IN': 'kannada',
    };
    return langMap[langCode] || 'english';
  };

  // Detect and handle voice commands
  const detectVoiceCommand = (text) => {
    const lowerText = text.toLowerCase().trim();
    
    // Case law search commands
    const caseLawPatterns = [
      /search case law (?:about|for|on) (.+)/i,
      /find case law (?:about|for|on) (.+)/i,
      /case law (?:about|for|on) (.+)/i,
      /search cases (?:about|for|on) (.+)/i,
    ];
    
    for (const pattern of caseLawPatterns) {
      const match = text.match(pattern);
      if (match) {
        const query = match[1].trim();
        return { type: 'caseLaw', query };
      }
    }
    
    // Lawyer search commands
    const lawyerPatterns = [
      /find lawyers? (?:for|specializing in|who handle) (.+)/i,
      /search lawyers? (?:for|specializing in|who handle) (.+)/i,
      /lawyers? (?:for|specializing in|who handle) (.+)/i,
      /find (?:a |an )?lawyer (?:for|specializing in|who handles?) (.+)/i,
      /need (?:a |an )?lawyer (?:for|specializing in|who handles?) (.+)/i,
    ];
    
    for (const pattern of lawyerPatterns) {
      const match = text.match(pattern);
      if (match) {
        const query = match[1].trim();
        return { type: 'lawyers', query };
      }
    }
    
    return null;
  };

  // Handle voice command execution
  const executeVoiceCommand = (command) => {
    if (command.type === 'caseLaw') {
      // Navigate to case law search with query
      navigate(`/case-law-search?q=${encodeURIComponent(command.query)}`);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `Searching case law for: "${command.query}". Redirecting you to the case law search page...`,
        },
      ]);
    } else if (command.type === 'lawyers') {
      // Navigate to lawyers page
      navigate('/lawyers');
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `Finding lawyers for: "${command.query}". Redirecting you to the lawyers page...`,
        },
      ]);
    }
  };

  // Auto-send when transcript is received and recognition ends
  useEffect(() => {
    if (transcript && !isListening && transcript.trim() && !loading) {
      console.log('Auto-sending transcript:', transcript);
      
      // Auto-send the message after a short delay
      const timer = setTimeout(async () => {
        const userMessage = transcript.trim();
        setInput(''); // Clear input
        setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
        
        // Check for voice commands first
        const command = detectVoiceCommand(userMessage);
        if (command) {
          executeVoiceCommand(command);
          return;
        }

        // If not a voice command, proceed with normal AI chat
        setLoading(true);
        setThinkingTime(0);
        stopSpeaking();

        // Start timer
        const startTime = Date.now();
        thinkingTimerRef.current = setInterval(() => {
          setThinkingTime(((Date.now() - startTime) / 1000).toFixed(1));
        }, 100);

        try {
          const backendLanguage = mapLanguageToBackend(selectedLanguage);
          const response = await askQuestion(userMessage, backendLanguage);
          const aiResponse = response.answer;
          
          // Calculate final time from actual elapsed time
          const finalTime = (Date.now() - startTime) / 1000;
          
          setMessages((prev) => {
            const newMessages = [...prev, { role: 'assistant', content: aiResponse }];
            const newMessageIndex = newMessages.length - 1;
            
            // Store the response time for this message
            setMessageResponseTimes((prevTimes) => ({
              ...prevTimes,
              [newMessageIndex]: finalTime,
            }));
            
            // Speak the AI response after a short delay (only if read aloud is enabled)
            if (readAloud) {
              setTimeout(() => {
                setIsSpeaking(true);
                const langToUse = messageVoiceLang[newMessageIndex] || selectedLanguage;
                speakText(aiResponse, langToUse);
                
                // Clear any existing interval
                if (speakingIntervalRef.current) {
                  clearInterval(speakingIntervalRef.current);
                }
                
                // Reset speaking state after speech completes
                speakingIntervalRef.current = setInterval(() => {
                  if (!window.speechSynthesis.speaking) {
                    setIsSpeaking(false);
                    if (speakingIntervalRef.current) {
                      clearInterval(speakingIntervalRef.current);
                      speakingIntervalRef.current = null;
                    }
                  }
                }, 100);
              }, 500);
            }
            
            return newMessages;
          });
        } catch (error) {
          console.error('Error in auto-send:', error);
          setMessages((prev) => [
            ...prev,
            {
              role: 'assistant',
              content: 'Sorry, I encountered an error. Please try again.',
            },
          ]);
        } finally {
          setLoading(false);
          if (thinkingTimerRef.current) {
            clearInterval(thinkingTimerRef.current);
            thinkingTimerRef.current = null;
          }
        }
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [transcript, isListening, loading, selectedLanguage, stopSpeaking, speakText, readAloud, messageVoiceLang, messages.length]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowLanguageDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (speakingIntervalRef.current) {
        clearInterval(speakingIntervalRef.current);
      }
      if (thinkingTimerRef.current) {
        clearInterval(thinkingTimerRef.current);
      }
      stopSpeaking();
    };
  }, [stopSpeaking]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleMicClick = () => {
    if (isListening) {
      // Stop listening and send if we have transcript
      stopListening();
      // Give a moment for transcript to finalize
      setTimeout(() => {
        if (transcript && transcript.trim()) {
          // Transcript will auto-send via useEffect
        }
      }, 500);
    } else {
      if (loading || isSpeaking) {
        return; // Disable mic while AI is processing or speaking
      }
      // Clear any previous transcript
      setInput('');
      startListening();
    }
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    
    // Check for voice commands first
    const command = detectVoiceCommand(userMessage);
    if (command) {
      executeVoiceCommand(command);
      return;
    }

    // If not a voice command, proceed with normal AI chat
    setLoading(true);
    setThinkingTime(0);
    stopSpeaking();

    // Start timer
    const startTime = Date.now();
    thinkingTimerRef.current = setInterval(() => {
      setThinkingTime(((Date.now() - startTime) / 1000).toFixed(1));
    }, 100);

    try {
      const backendLanguage = mapLanguageToBackend(selectedLanguage);
      const response = await askQuestion(userMessage, backendLanguage);
      const aiResponse = response.answer;
      
      // Calculate final time from actual elapsed time
      const finalTime = (Date.now() - startTime) / 1000;
      
      setMessages((prev) => {
        const newMessages = [...prev, { role: 'assistant', content: aiResponse }];
        const newMessageIndex = newMessages.length - 1;
        
        // Store the response time for this message
        setMessageResponseTimes((prevTimes) => ({
          ...prevTimes,
          [newMessageIndex]: finalTime,
        }));
        
        // Speak the AI response after a short delay (only if read aloud is enabled)
        if (readAloud) {
          setTimeout(() => {
            setIsSpeaking(true);
            const langToUse = messageVoiceLang[newMessageIndex] || selectedLanguage;
            speakText(aiResponse, langToUse);
            
            // Clear any existing interval
            if (speakingIntervalRef.current) {
              clearInterval(speakingIntervalRef.current);
            }
            
            // Reset speaking state after speech completes
            speakingIntervalRef.current = setInterval(() => {
              if (!window.speechSynthesis.speaking) {
                setIsSpeaking(false);
                if (speakingIntervalRef.current) {
                  clearInterval(speakingIntervalRef.current);
                  speakingIntervalRef.current = null;
                }
              }
            }, 100);
          }, 500);
        }
        
        return newMessages;
      });
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Sorry, I encountered an error. Please try again.',
        },
      ]);
    } finally {
      setLoading(false);
      if (thinkingTimerRef.current) {
        clearInterval(thinkingTimerRef.current);
        thinkingTimerRef.current = null;
      }
      inputRef.current?.focus();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleLanguageSelect = (langCode) => {
    setLanguage(langCode); // Update global language first
    setSelectedLanguage(langCode); // Then update speech assistant language
    setShowLanguageDropdown(false);
  };
  
  // Sync speech assistant language when global language changes
  useEffect(() => {
    setSelectedLanguage(language);
  }, [language, setSelectedLanguage]);

  const currentLanguage = supportedLanguages.find(lang => lang.code === selectedLanguage);

  const getMessageLang = (idx) => messageVoiceLang[idx] || selectedLanguage;
  const setMessageLang = (idx, code) => {
    setMessageVoiceLang((prev) => ({ ...prev, [idx]: code }));
  };

  const speakMessage = (msgText, idx) => {
    // Stop any ongoing speech then speak this specific message
    stopSpeaking();
    const lang = getMessageLang(idx);
    setIsSpeaking(true);
    speakText(msgText, lang);

    // Clear any existing interval
    if (speakingIntervalRef.current) {
      clearInterval(speakingIntervalRef.current);
    }
    // Reset speaking state after speech completes
    speakingIntervalRef.current = setInterval(() => {
      if (!window.speechSynthesis.speaking) {
        setIsSpeaking(false);
        if (speakingIntervalRef.current) {
          clearInterval(speakingIntervalRef.current);
          speakingIntervalRef.current = null;
        }
      }
    }, 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 flex flex-col relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute w-96 h-96 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
          animate={{
            x: [0, 100, 0],
            y: [0, 100, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
        <motion.div
          className="absolute w-96 h-96 bg-amber-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
          animate={{
            x: [0, -100, 0],
            y: [0, -100, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: 'linear',
          }}
          style={{ top: '50%', left: '50%' }}
        />
      </div>

      <div className="max-w-4xl mx-auto w-full flex flex-col h-screen relative z-10">
        {/* Header */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="glass-strong bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 text-white p-6 shadow-2xl border-b border-white/20"
        >
          <div className="flex justify-between items-start">
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center gap-3 mb-2">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="text-3xl"
                >
                  ⚖️
                </motion.div>
                <h1 className="font-heading text-3xl font-bold">{t('chat.title')}</h1>
              </div>
              <p className="text-amber-100 flex items-center gap-2">
                <motion.span
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="inline-block w-2 h-2 bg-green-400 rounded-full"
                />
                {t('chat.online')}
              </p>
            </motion.div>
          </div>
          
          {/* Browser Support Warning */}
          <AnimatePresence>
            {(!isSupported || supportError) && supportError && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 bg-yellow-500/20 border border-yellow-400/50 rounded-lg p-3 text-sm backdrop-blur-md"
              >
                <p className="text-yellow-100">{supportError}</p>
                {supportError.includes('Network') && (
                  <p className="text-yellow-200 text-xs mt-2">
                    💡 Tip: Speech recognition requires an internet connection. Make sure you're connected to the internet.
                  </p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
          <AnimatePresence mode="popLayout">
            {messages.length === 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="text-center text-gray-500 mt-12"
              >
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-5xl mb-4"
                >
                  👋
                </motion.div>
                <p className="text-xl mb-2 font-semibold gradient-text">{t('chat.welcome')}</p>
                <p className="text-gray-600 mb-4">{t('chat.welcomeDesc')}</p>
                <div className="mt-4 p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-200/40">
                  <p className="text-sm font-semibold text-gray-700 mb-2">🎤 Voice Commands:</p>
                  <ul className="text-xs text-gray-600 space-y-1 text-left">
                    <li>• "Search case law about [topic]"</li>
                    <li>• "Find lawyers for [specialty]"</li>
                  </ul>
                </div>
              </motion.div>
            )}
            
            {messages.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className={`max-w-[80%] rounded-2xl px-6 py-4 ${
                    message.role === 'user'
                      ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg'
                      : 'bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 text-gray-900 shadow-lg border border-amber-200/40 backdrop-blur-sm'
                  }`}
                >
                  <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                  {message.role === 'assistant' && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="mt-3 space-y-2"
                    >
                      {/* Response Time Display */}
                      {messageResponseTimes[index] !== undefined && (
                        <div className="text-xs text-gray-500 font-medium flex items-center gap-1">
                          <span>⏱️</span>
                          <span>Response time: {messageResponseTimes[index].toFixed(1)}s</span>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-2 flex-wrap">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => speakMessage(message.content, index)}
                          className="text-xs inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-gradient-to-r from-amber-600 to-orange-600 text-white hover:from-amber-700 hover:to-orange-700 transition-all shadow-md"
                          title={t('chat.readAloud')}
                        >
                          <Volume2 className="h-3 w-3" /> {t('chat.readAloud')}
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => { stopSpeaking(); setIsSpeaking(false); }}
                          className="text-xs inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                          title={t('chat.stop')}
                        >
                          <VolumeX className="h-3 w-3" /> {t('chat.stop')}
                        </motion.button>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              </motion.div>
            ))}
          </AnimatePresence>

          <AnimatePresence>
            {loading && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex justify-start"
              >
                <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 rounded-2xl px-6 py-4 shadow-lg border border-amber-200/40 backdrop-blur-sm">
                  <div className="flex items-center space-x-3">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    >
                      <Loader2 className="h-5 w-5 text-amber-600" />
                    </motion.div>
                    <div className="flex flex-col">
                      <span className="text-gray-700 font-medium">{t('chat.thinking')}</span>
                      <span className="text-xs text-gray-500 mt-1">{thinkingTime}s</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Listening Indicator */}
          <AnimatePresence>
            {isListening && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex justify-center"
              >
                <motion.div
                  animate={{
                    scale: [1, 1.1, 1],
                    boxShadow: [
                      '0 0 0 0 rgba(239, 68, 68, 0.7)',
                      '0 0 0 10px rgba(239, 68, 68, 0)',
                      '0 0 0 0 rgba(239, 68, 68, 0)',
                    ],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                  }}
                  className="bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-2xl px-6 py-4 flex flex-col items-center space-y-2 shadow-2xl max-w-2xl w-full"
                >
                  <div className="flex items-center space-x-2">
                    <motion.div
                      animate={{ scale: [1, 1.5, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className="w-3 h-3 bg-white rounded-full"
                    />
                    <span className="font-medium">{t('chat.listening')}</span>
                    {detectedLanguage && (
                      <span className="text-xs opacity-90">
                        ({supportedLanguages.find(l =>
                          detectedLanguage.toLowerCase().includes(l.code.split('-')[0]) ||
                          l.code === detectedLanguage
                        )?.label || 'Detecting...'})
                      </span>
                    )}
                  </div>
                  {/* Show live transcript */}
                  {(transcript || interimTranscript) && (
                    <div className="w-full bg-white/20 rounded-lg p-3 mt-2 backdrop-blur-sm">
                      <p className="text-white text-sm">
                        {transcript}
                        {transcript && interimTranscript && ' '}
                        <span className="opacity-70 italic">{interimTranscript}</span>
                      </p>
                    </div>
                  )}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="glass-strong border-t border-white/20 p-4 shadow-2xl"
        >
          <div className="flex items-center space-x-3">
            {/* Mic Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleMicClick}
              disabled={loading || isSpeaking || !isSupported}
              className={`p-3 rounded-xl transition-all duration-200 flex items-center justify-center ${
                isListening
                  ? 'bg-gradient-to-r from-red-500 to-pink-600 text-white shadow-lg'
                  : isSupported
                  ? 'text-gray-600 hover:text-amber-600 hover:bg-white/50 glass-soft'
                  : 'text-gray-300 cursor-not-allowed'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
              title={
                !isSupported
                  ? supportError || 'Voice input not supported'
                  : isListening
                  ? 'Stop listening'
                  : 'Start voice input'
              }
            >
              <motion.div
                animate={isListening ? { scale: [1, 1.2, 1] } : {}}
                transition={{ duration: 0.5, repeat: isListening ? Infinity : 0 }}
              >
                <Mic className="h-5 w-5" />
              </motion.div>
            </motion.button>
            
            <motion.input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={t('chat.placeholder')}
              className="flex-1 px-4 py-3 bg-gradient-to-br from-amber-50/80 via-orange-50/80 to-rose-50/80 backdrop-blur-md border border-amber-200/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
              disabled={loading || isListening}
              whileFocus={{ scale: 1.02 }}
            />
            
            {/* Stop Speaking Button */}
            <AnimatePresence>
              {isSpeaking && (
                <motion.button
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => {
                    stopSpeaking();
                    setIsSpeaking(false);
                    if (speakingIntervalRef.current) {
                      clearInterval(speakingIntervalRef.current);
                      speakingIntervalRef.current = null;
                    }
                  }}
                  className="p-3 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl hover:shadow-lg transition-all shadow-md"
                  title={t('chat.stop')}
                >
                  <VolumeX className="h-5 w-5" />
                </motion.button>
              )}
            </AnimatePresence>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSend}
              disabled={loading || !input.trim() || isListening}
              className="p-3 bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 text-white rounded-xl hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg"
            >
              {loading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                >
                  <Loader2 className="h-5 w-5" />
                </motion.div>
              ) : (
                <Send className="h-5 w-5" />
              )}
            </motion.button>
          </div>
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-3">
              <motion.label
                whileHover={{ scale: 1.05 }}
                className="inline-flex items-center gap-2 text-xs text-gray-700 cursor-pointer select-none"
              >
                <input
                  type="checkbox"
                  checked={readAloud}
                  onChange={(e) => setReadAloud(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                />
                <span className="font-medium">{t('chat.readAloud')}</span>
                <span className="text-gray-500">({currentLanguage?.label})</span>
              </motion.label>
              <AnimatePresence>
                {isSpeaking && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="flex items-center space-x-2 text-xs text-orange-600"
                  >
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      <Volume2 className="h-4 w-4" />
                    </motion.div>
                    <span className="font-medium">{t('chat.speaking')}</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <p className="text-xs text-gray-500">
              {t('chat.tip')}
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Chatbot;
