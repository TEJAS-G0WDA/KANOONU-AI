import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Volume2, VolumeX, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import { askQuestion } from '../api';

function AILawyer() {
  const { language, t } = useLanguage();
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hello! I\'m your AI Legal Assistant. I can help you with legal questions, explain legal concepts, and guide you through legal procedures. How can I assist you today?'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [sessionTime, setSessionTime] = useState(0);
  const [sessionActive, setSessionActive] = useState(true);
  const [backendConnected, setBackendConnected] = useState(true);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const speakingIntervalRef = useRef(null);
  const sessionTimerRef = useRef(null);

  // Check backend connection on mount
  useEffect(() => {
    const checkBackend = async () => {
      try {
        // Try a simple request to check if backend is running
        const response = await fetch('http://localhost:5000/ask', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ question: 'test', language: 'english' })
        });
        setBackendConnected(true);
      } catch (error) {
        setBackendConnected(false);
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: '⚠️ Backend server is not running. Please start the Flask backend on http://localhost:5000 for the AI lawyer to work. You can still use other features of the application.'
        }]);
      }
    };
    checkBackend();
  }, []);

  // Session timer (1 minute = 60 seconds)
  useEffect(() => {
    if (sessionActive) {
      sessionTimerRef.current = setInterval(() => {
        setSessionTime(prev => {
          if (prev >= 60) {
            setSessionActive(false);
            setMessages(prev => [...prev, {
              role: 'assistant',
              content: 'Your free 1-minute session has ended. For extended consultation, please book an appointment with one of our expert lawyers. Thank you for using Kanoonu AI!'
            }]);
            return 60;
          }
          return prev + 1;
        });
      }, 1000);
    }

    return () => {
      if (sessionTimerRef.current) {
        clearInterval(sessionTimerRef.current);
      }
    };
  }, [sessionActive]);

  // Map language code to backend format
  const mapLanguageToBackend = (langCode) => {
    const langMap = {
      'en-IN': 'english',
      'hi-IN': 'hindi',
      'kn-IN': 'kannada',
    };
    return langMap[langCode] || 'english';
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading || !sessionActive) return;

    const userMessage = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const backendLanguage = mapLanguageToBackend(language);
      const response = await askQuestion(userMessage, backendLanguage);
      const aiResponse = response.answer;
      setMessages((prev) => [...prev, { role: 'assistant', content: aiResponse }]);
    } catch (error) {
      console.error('AI Lawyer error:', error);
      let errorMessage = 'Sorry, I encountered an error. Please try again.';
      
      // Check if backend is not running
      if (error.code === 'ECONNREFUSED' || error.message?.includes('Network Error') || error.message?.includes('Failed to fetch')) {
        errorMessage = 'Unable to connect to the server. Please make sure the backend is running on http://localhost:5000. The AI lawyer requires the backend to be active.';
      }
      
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: errorMessage,
        },
      ]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const speakText = (text) => {
    if (!('speechSynthesis' in window)) return;
    
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language;
    utterance.rate = 0.9;
    utterance.pitch = 1;
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    
    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const remainingTime = 60 - sessionTime;

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 text-white p-6 shadow-2xl">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Bot className="h-8 w-8" />
            </motion.div>
            <div>
              <h1 className="font-heading text-2xl font-bold">AI Legal Assistant</h1>
              <p className="text-amber-100 text-sm">Free 1-minute consultation</p>
              {!backendConnected && (
                <p className="text-red-200 text-xs mt-1">⚠️ Backend not connected</p>
              )}
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-amber-100">Time Remaining</div>
            <div className="text-2xl font-mono font-bold">
              {remainingTime > 0 ? formatTime(remainingTime) : '00:00'}
            </div>
            {remainingTime <= 10 && remainingTime > 0 && (
              <p className="text-xs text-red-200 mt-1">Session ending soon!</p>
            )}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
        <div className="max-w-4xl mx-auto space-y-6">
          <AnimatePresence mode="popLayout">
            {messages.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-6 py-4 ${
                    message.role === 'user'
                      ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg'
                      : 'bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 text-gray-900 shadow-lg border border-amber-200/40'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {message.role === 'assistant' && (
                      <Bot className="h-5 w-5 text-amber-600 mt-1 flex-shrink-0" />
                    )}
                    {message.role === 'user' && (
                      <User className="h-5 w-5 text-white mt-1 flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                      {message.role === 'assistant' && (
                        <div className="mt-3 flex items-center gap-2">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => isSpeaking ? stopSpeaking() : speakText(message.content)}
                            className="text-xs px-3 py-1 rounded-lg bg-gradient-to-r from-amber-600 to-orange-600 text-white hover:shadow-md transition-all flex items-center gap-1"
                          >
                            {isSpeaking ? <VolumeX className="h-3 w-3" /> : <Volume2 className="h-3 w-3" />}
                            {isSpeaking ? 'Stop' : 'Read Aloud'}
                          </motion.button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {loading && (
            <div className="flex justify-start">
              <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 rounded-2xl px-6 py-4 shadow-lg border border-amber-200/40">
                <div className="flex items-center space-x-3">
                  <Loader2 className="h-5 w-5 text-amber-600 animate-spin" />
                  <span className="text-gray-700">AI is thinking...</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="bg-white border-t border-amber-200 p-4 shadow-2xl">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={sessionActive ? (backendConnected ? "Ask your legal question..." : "Backend not running. Please start Flask server.") : "Session ended. Please book an appointment."}
            disabled={loading || !sessionActive || !backendConnected}
            className="flex-1 px-4 py-3 border border-amber-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSend}
            disabled={loading || !input.trim() || !sessionActive}
            className="p-3 bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 text-white rounded-xl hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </motion.button>
        </div>
        {!sessionActive && (
          <p className="text-center text-sm text-red-600 mt-2">
            Your free session has ended. <a href="/lawyers" className="underline font-semibold">Book an appointment</a> for extended consultation.
          </p>
        )}
      </div>
    </div>
  );
}

export default AILawyer;

