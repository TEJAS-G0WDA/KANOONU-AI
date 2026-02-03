import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Scale, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';

function Navbar() {
  const { t, language, setLanguage } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { path: '/', label: t('nav.home') },
    { path: '/chat', label: t('nav.chat') },
    { path: '/case-law-search', label: t('nav.caseLawSearch') },
    { path: '/lawyers', label: t('nav.lawyers') },
    { path: '/document-templates', label: t('nav.documentTemplates') },
    { path: '/legal-glossary', label: t('nav.legalGlossary') },
    { path: '/video-tutorials', label: t('nav.videoTutorials') },
    { path: '/admin-login', label: t('nav.adminLogin') },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, type: 'spring', stiffness: 100 }}
      className="sticky top-0 z-50 shadow-2xl border-b border-white/10 backdrop-blur-xl relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.85) 0%, rgba(30, 30, 50, 0.9) 50%, rgba(0, 0, 0, 0.85) 100%)',
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.5), 0 0 20px rgba(100, 150, 255, 0.3)',
      }}
    >
      {/* Animated neon border effect */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-[2px]"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(100, 150, 255, 0.8), rgba(150, 100, 255, 0.8), rgba(100, 150, 255, 0.8), transparent)',
          boxShadow: '0 0 10px rgba(100, 150, 255, 0.6), 0 0 20px rgba(150, 100, 255, 0.4)',
        }}
        animate={{
          backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
      
      {/* Sparkling particles */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-blue-400 rounded-full"
          style={{
            left: `${20 + i * 15}%`,
            top: '50%',
            boxShadow: '0 0 6px rgba(100, 150, 255, 0.8), 0 0 12px rgba(150, 100, 255, 0.6)',
          }}
          animate={{
            y: [0, -10, 0],
            opacity: [0, 1, 0],
            scale: [0, 1.5, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.4,
            ease: 'easeInOut',
          }}
        />
      ))}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link to="/" className="flex items-center space-x-2 relative">
              <motion.div
                animate={{ 
                  rotate: [0, 10, -10, 0],
                  filter: ['brightness(1)', 'brightness(1.3)', 'brightness(1)'],
                }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="relative"
              >
                <Scale 
                  className="h-8 w-8 text-white drop-shadow-lg relative z-10" 
                  style={{
                    filter: 'drop-shadow(0 0 8px rgba(100, 150, 255, 0.8)) drop-shadow(0 0 12px rgba(150, 100, 255, 0.6))',
                  }}
                />
                <motion.div
                  className="absolute inset-0 bg-blue-400 rounded-full blur-md opacity-50"
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.3, 0.6, 0.3],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />
              </motion.div>
              <motion.span
                className="font-heading text-xl font-bold text-white drop-shadow-lg relative"
                style={{
                  textShadow: '0 0 10px rgba(100, 150, 255, 0.8), 0 0 20px rgba(150, 100, 255, 0.6), 0 2px 4px rgba(0, 0, 0, 0.8)',
                }}
                animate={{
                  textShadow: [
                    '0 0 10px rgba(100, 150, 255, 0.8), 0 0 20px rgba(150, 100, 255, 0.6), 0 2px 4px rgba(0, 0, 0, 0.8)',
                    '0 0 15px rgba(100, 150, 255, 1), 0 0 25px rgba(150, 100, 255, 0.8), 0 2px 4px rgba(0, 0, 0, 0.8)',
                    '0 0 10px rgba(100, 150, 255, 0.8), 0 0 20px rgba(150, 100, 255, 0.6), 0 2px 4px rgba(0, 0, 0, 0.8)',
                  ],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                Kanoonu AI
              </motion.span>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-3">
            <div className="flex items-center space-x-1">
            {navLinks.map((link, index) => (
              <motion.div
                key={link.path}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link to={link.path}>
                  <motion.div
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 relative overflow-hidden ${
                      isActive(link.path)
                        ? 'text-white'
                        : 'text-white/80 hover:text-white'
                    }`}
                    style={
                      isActive(link.path)
                        ? {
                            background: 'linear-gradient(135deg, rgba(100, 150, 255, 0.3), rgba(150, 100, 255, 0.3))',
                            boxShadow: '0 0 15px rgba(100, 150, 255, 0.5), inset 0 0 15px rgba(150, 100, 255, 0.3)',
                            border: '1px solid rgba(100, 150, 255, 0.5)',
                          }
                        : {}
                    }
                  >
                    {isActive(link.path) && (
                      <motion.div
                        className="absolute inset-0"
                        style={{
                          background: 'linear-gradient(90deg, transparent, rgba(100, 150, 255, 0.4), transparent)',
                        }}
                        animate={{
                          x: ['-100%', '100%'],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: 'linear',
                        }}
                      />
                    )}
                    <span className="relative z-10">{link.label}</span>
                    {!isActive(link.path) && (
                      <motion.div
                        className="absolute inset-0 rounded-xl"
                        whileHover={{
                          background: 'rgba(100, 150, 255, 0.15)',
                          boxShadow: '0 0 10px rgba(100, 150, 255, 0.4)',
                        }}
                        transition={{ duration: 0.3 }}
                      />
                    )}
                  </motion.div>
                </Link>
              </motion.div>
            ))}
            </div>
            
            {/* Language Selector */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setLanguage(language === 'en-IN' ? 'hi-IN' : language === 'hi-IN' ? 'kn-IN' : 'en-IN')}
              className="flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium text-white/80 hover:text-white transition-all duration-300 relative overflow-hidden"
              style={{
                background: 'rgba(100, 150, 255, 0.15)',
                border: '1px solid rgba(100, 150, 255, 0.3)',
              }}
            >
              <Globe className="h-4 w-4" />
              <span>
                {language === 'en-IN' ? 'EN' : language === 'hi-IN' ? 'हिं' : 'ಕನ್ನಡ'}
              </span>
            </motion.button>
          </div>

          {/* Mobile menu button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="md:hidden text-white p-2 rounded-lg hover:bg-white/20 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <AnimatePresence mode="wait">
              {mobileMenuOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X className="h-6 w-6" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu className="h-6 w-6" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden border-t border-white/10 overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.9) 0%, rgba(30, 30, 50, 0.95) 100%)',
            }}
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.path}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <motion.div
                      whileHover={{ x: 5, scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`block px-4 py-3 rounded-xl text-base font-medium transition-all duration-200 ${
                        isActive(link.path)
                          ? 'text-white shadow-md'
                          : 'text-white/80 hover:text-white'
                      }`}
                      style={
                        isActive(link.path)
                          ? {
                              background: 'linear-gradient(135deg, rgba(100, 150, 255, 0.3), rgba(150, 100, 255, 0.3))',
                              boxShadow: '0 0 15px rgba(100, 150, 255, 0.5)',
                              border: '1px solid rgba(100, 150, 255, 0.5)',
                            }
                          : {}
                      }
                    >
                      {link.label}
                    </motion.div>
                  </Link>
                </motion.div>
              ))}
              
              {/* Language Selector for Mobile */}
              <motion.button
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: navLinks.length * 0.05 }}
                whileHover={{ x: 5, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setLanguage(language === 'en-IN' ? 'hi-IN' : language === 'hi-IN' ? 'kn-IN' : 'en-IN')}
                className="flex items-center justify-center space-x-2 px-4 py-3 rounded-xl text-base font-medium text-white/80 hover:text-white transition-all duration-200 w-full"
                style={{
                  background: 'rgba(100, 150, 255, 0.15)',
                  border: '1px solid rgba(100, 150, 255, 0.3)',
                }}
              >
                <Globe className="h-5 w-5" />
                <span>
                  {language === 'en-IN' ? 'English' : language === 'hi-IN' ? 'हिन्दी' : 'ಕನ್ನಡ'}
                </span>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

export default Navbar;
