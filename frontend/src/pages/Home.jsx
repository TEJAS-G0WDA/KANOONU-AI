import { Link } from 'react-router-dom';
import { MessageCircle, Search, Users, Scale, Shield, Brain, FileText, Play } from 'lucide-react';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

function Home() {
  const { t } = useLanguage();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const features = [
    {
      icon: <Brain className="h-8 w-8" />,
      title: t('home.features.ai.title'),
      description: t('home.features.ai.desc'),
      color: 'from-amber-500 to-orange-600',
    },
    {
      icon: <Search className="h-8 w-8" />,
      title: t('home.features.search.title'),
      description: t('home.features.search.desc'),
      color: 'from-orange-500 to-rose-600',
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: t('home.features.lawyers.title'),
      description: t('home.features.lawyers.desc'),
      color: 'from-rose-500 to-pink-600',
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: t('home.features.trusted.title'),
      description: t('home.features.trusted.desc'),
      color: 'from-amber-600 to-yellow-600',
    },
  ];

  const contributors = ['Tejas', 'Nishanth', 'Mohith', 'Shroumith'];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Hero Section */}
      <section className="relative text-white py-20 md:py-32 overflow-hidden min-h-screen flex items-center">
        {/* Animated Justice Statue Background */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Mouse parallax wrapper */}
          <motion.div
            style={{
              x: mousePosition.x / 40,
              y: mousePosition.y / 40,
            }}
            transition={{
              type: 'spring',
              stiffness: 50,
              damping: 30,
            }}
            className="absolute inset-0"
          >
            {/* Main animated background image */}
            <motion.div
              className="absolute high-quality-bg"
              style={{
                backgroundImage: 'url(/images/justice.jpg)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                width: '120%',
                height: '120%',
                top: '-10%',
                left: '-10%',
                backgroundColor: '#1a1a1a', // Fallback color
                filter: 'brightness(1.1) contrast(1.2) saturate(1.15)',
                WebkitFilter: 'brightness(1.1) contrast(1.2) saturate(1.15)',
              }}
              animate={{
                scale: [1.08, 1.15, 1.08],
                x: [0, 15, -15, 0],
                y: [0, -8, 8, 0],
              }}
              transition={{
                scale: {
                  duration: 25,
                  repeat: Infinity,
                  ease: 'easeInOut',
                },
                x: {
                  duration: 20,
                  repeat: Infinity,
                  ease: 'easeInOut',
                },
                y: {
                  duration: 18,
                  repeat: Infinity,
                  ease: 'easeInOut',
                },
              }}
            />
          </motion.div>
          
          {/* Dark overlay for text readability - reduced opacity for clarity */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/25 to-black/45"
            animate={{
              opacity: [0.35, 0.45, 0.35],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
          
          {/* Additional gradient overlay for better text contrast - lighter */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/35" />
          
          {/* Subtle light rays effect - reduced for clarity */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent"
            animate={{
              rotate: [0, 360],
              scale: [1, 1.4, 1],
            }}
            transition={{
              duration: 35,
              repeat: Infinity,
              ease: 'linear',
            }}
            style={{
              transformOrigin: 'center center',
            }}
          />
        </div>
        
        {/* Content Container */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <motion.div
            className="text-center"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <motion.div
              variants={itemVariants}
              className="flex justify-center mb-6"
            >
              <motion.div
                animate={{
                  y: [0, -10, 0],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="relative"
              >
                {/* Neon glow effect */}
                <motion.div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: 'radial-gradient(circle, rgba(100, 150, 255, 0.4), transparent 70%)',
                    filter: 'blur(30px)',
                    boxShadow: '0 0 40px rgba(100, 150, 255, 0.6), 0 0 60px rgba(150, 100, 255, 0.4)',
                  }}
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.6, 0.9, 0.6],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />
                <Scale 
                  className="h-20 w-20 md:h-24 md:w-24 relative z-10 text-white" 
                  style={{
                    filter: 'drop-shadow(0 0 10px rgba(100, 150, 255, 0.9)) drop-shadow(0 0 20px rgba(150, 100, 255, 0.7)) drop-shadow(0 0 30px rgba(100, 200, 255, 0.5))',
                  }}
                />
              </motion.div>
            </motion.div>
            <motion.h1
              variants={itemVariants}
              className="font-heading text-5xl md:text-7xl lg:text-8xl font-bold mb-6 text-white"
              style={{
                background: 'linear-gradient(135deg, #ffffff 0%, rgba(100, 200, 255, 1) 30%, rgba(150, 100, 255, 1) 70%, #ffffff 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                textShadow: '0 4px 20px rgba(0, 0, 0, 0.9), 0 2px 10px rgba(0, 0, 0, 0.7), 0 0 40px rgba(100, 200, 255, 0.8), 0 0 60px rgba(150, 100, 255, 0.6)',
                filter: 'drop-shadow(0 0 20px rgba(100, 200, 255, 0.5))',
              }}
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                textShadow: [
                  '0 4px 20px rgba(0, 0, 0, 0.9), 0 2px 10px rgba(0, 0, 0, 0.7), 0 0 40px rgba(100, 200, 255, 0.8), 0 0 60px rgba(150, 100, 255, 0.6)',
                  '0 4px 20px rgba(0, 0, 0, 0.9), 0 2px 10px rgba(0, 0, 0, 0.7), 0 0 50px rgba(100, 200, 255, 1), 0 0 70px rgba(150, 100, 255, 0.8)',
                  '0 4px 20px rgba(0, 0, 0, 0.9), 0 2px 10px rgba(0, 0, 0, 0.7), 0 0 40px rgba(100, 200, 255, 0.8), 0 0 60px rgba(150, 100, 255, 0.6)',
                ],
              }}
              transition={{
                backgroundPosition: {
                  duration: 5,
                  repeat: Infinity,
                  ease: 'linear',
                },
                textShadow: {
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                },
              }}
            >
              {t('home.title')}
            </motion.h1>
            <motion.p
              variants={itemVariants}
              className="text-xl md:text-3xl text-white mb-8 max-w-3xl mx-auto font-medium drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]"
              style={{
                textShadow: '0 2px 15px rgba(0, 0, 0, 0.9), 0 1px 5px rgba(0, 0, 0, 0.8), 0 0 20px rgba(100, 150, 255, 0.4)',
              }}
            >
              {t('home.subtitle')}
            </motion.p>
            <motion.p
              variants={itemVariants}
              className="text-lg md:text-xl text-white mb-12 max-w-2xl mx-auto drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]"
              style={{
                textShadow: '0 2px 12px rgba(0, 0, 0, 0.9), 0 1px 4px rgba(0, 0, 0, 0.7), 0 0 15px rgba(100, 150, 255, 0.3)',
              }}
            >
              {t('home.description')}
            </motion.p>
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              {/* Start Chat Button - Primary with Neon Effect */}
              <motion.div
                whileHover={{ scale: 1.08, y: -5 }}
                whileTap={{ scale: 0.95 }}
                className="relative group"
              >
                <Link
                  to="/chat"
                  className="relative text-lg px-8 py-4 inline-flex items-center justify-center font-semibold text-white rounded-xl overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, rgba(100, 150, 255, 0.9), rgba(150, 100, 255, 0.9), rgba(100, 200, 255, 0.9))',
                    boxShadow: '0 0 20px rgba(100, 150, 255, 0.6), 0 0 40px rgba(150, 100, 255, 0.4), inset 0 0 20px rgba(255, 255, 255, 0.1)',
                    border: '2px solid rgba(100, 150, 255, 0.8)',
                  }}
                >
                  {/* Animated gradient overlay */}
                  <motion.div
                    className="absolute inset-0"
                    style={{
                      background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)',
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
                  {/* Sparkling particles */}
                  {[...Array(6)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-1 h-1 bg-white rounded-full"
                      style={{
                        left: `${20 + i * 12}%`,
                        top: '50%',
                        boxShadow: '0 0 4px white, 0 0 8px rgba(100, 150, 255, 0.8)',
                      }}
                      animate={{
                        y: [0, -15, 0],
                        opacity: [0, 1, 0],
                        scale: [0, 1.5, 0],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        delay: i * 0.2,
                        ease: 'easeInOut',
                      }}
                    />
                  ))}
                  <MessageCircle className="h-5 w-5 mr-2 relative z-10" />
                  <span className="relative z-10">{t('home.startChat')}</span>
                </Link>
              </motion.div>

              {/* Find Lawyers Button */}
              <motion.div
                whileHover={{ scale: 1.08, y: -5 }}
                whileTap={{ scale: 0.95 }}
                className="relative group"
              >
                <Link
                  to="/lawyers"
                  className="relative text-lg px-8 py-4 inline-flex items-center justify-center font-semibold text-white rounded-xl overflow-hidden backdrop-blur-md"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.1))',
                    boxShadow: '0 0 20px rgba(100, 150, 255, 0.4), inset 0 0 20px rgba(255, 255, 255, 0.1)',
                    border: '2px solid rgba(100, 150, 255, 0.6)',
                  }}
                >
                  <motion.div
                    className="absolute inset-0"
                    whileHover={{
                      background: 'linear-gradient(135deg, rgba(100, 150, 255, 0.2), rgba(150, 100, 255, 0.2))',
                      boxShadow: '0 0 25px rgba(100, 150, 255, 0.6)',
                    }}
                    transition={{ duration: 0.3 }}
                  />
                  <Users className="h-5 w-5 mr-2 relative z-10" />
                  <span className="relative z-10">{t('home.findLawyers')}</span>
                </Link>
              </motion.div>

              {/* Document Templates Button */}
              <motion.div
                whileHover={{ scale: 1.08, y: -5 }}
                whileTap={{ scale: 0.95 }}
                className="relative group"
              >
                <Link
                  to="/document-templates"
                  className="relative text-lg px-8 py-4 inline-flex items-center justify-center font-semibold text-white rounded-xl overflow-hidden backdrop-blur-md"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.1))',
                    boxShadow: '0 0 20px rgba(100, 150, 255, 0.4), inset 0 0 20px rgba(255, 255, 255, 0.1)',
                    border: '2px solid rgba(100, 150, 255, 0.6)',
                  }}
                >
                  <motion.div
                    className="absolute inset-0"
                    whileHover={{
                      background: 'linear-gradient(135deg, rgba(100, 150, 255, 0.2), rgba(150, 100, 255, 0.2))',
                      boxShadow: '0 0 25px rgba(100, 150, 255, 0.6)',
                    }}
                    transition={{ duration: 0.3 }}
                  />
                  <FileText className="h-5 w-5 mr-2 relative z-10" />
                  <span className="relative z-10">Document Templates</span>
                </Link>
              </motion.div>

              {/* Video Tutorials Button */}
              <motion.div
                whileHover={{ scale: 1.08, y: -5 }}
                whileTap={{ scale: 0.95 }}
                className="relative group"
              >
                <Link
                  to="/video-tutorials"
                  className="relative text-lg px-8 py-4 inline-flex items-center justify-center font-semibold text-white rounded-xl overflow-hidden backdrop-blur-md"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.1))',
                    boxShadow: '0 0 20px rgba(100, 150, 255, 0.4), inset 0 0 20px rgba(255, 255, 255, 0.1)',
                    border: '2px solid rgba(100, 150, 255, 0.6)',
                  }}
                >
                  <motion.div
                    className="absolute inset-0"
                    whileHover={{
                      background: 'linear-gradient(135deg, rgba(100, 150, 255, 0.2), rgba(150, 100, 255, 0.2))',
                      boxShadow: '0 0 25px rgba(100, 150, 255, 0.6)',
                    }}
                    transition={{ duration: 0.3 }}
                  />
                  <Play className="h-5 w-5 mr-2 relative z-10" />
                  <span className="relative z-10">Video Tutorials</span>
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
        
        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white/30 rounded-full"
            animate={{
              y: [0, -100, 0],
              x: [0, Math.random() * 100 - 50],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </section>

      {/* Why Kanoonu AI Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        {/* Animated Background Elements - Dark Neon Theme */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Dark base background */}
          <div className="absolute inset-0 bg-gradient-to-br from-black/90 via-slate-900/95 to-black/90" />
          
          {/* Animated neon gradient background */}
          <motion.div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(135deg, rgba(100, 150, 255, 0.1) 0%, rgba(150, 100, 255, 0.12) 25%, rgba(100, 200, 255, 0.1) 50%, rgba(150, 100, 255, 0.12) 75%, rgba(100, 150, 255, 0.1) 100%)',
              backgroundSize: '200% 200%',
            }}
            animate={{
              backgroundPosition: ['0% 0%', '100% 100%'],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              repeatType: 'reverse',
              ease: 'linear',
            }}
          />
          
          {/* Floating geometric shapes - Neon theme */}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={`shape-${i}`}
              className="absolute rounded-full"
              style={{
                width: `${120 + i * 60}px`,
                height: `${120 + i * 60}px`,
                background: i % 2 === 0 
                  ? `radial-gradient(circle, rgba(100, 150, 255, 0.25), rgba(150, 100, 255, 0.15))`
                  : `radial-gradient(circle, rgba(150, 100, 255, 0.2), rgba(100, 200, 255, 0.15))`,
                left: `${5 + i * 12}%`,
                top: `${15 + (i % 3) * 28}%`,
                filter: 'blur(40px)',
                boxShadow: i % 2 === 0 
                  ? '0 0 40px rgba(100, 150, 255, 0.3)'
                  : '0 0 40px rgba(150, 100, 255, 0.3)',
              }}
              animate={{
                y: [0, -40, 0],
                x: [0, 30, 0],
                scale: [1, 1.3, 1],
                rotate: [0, 180, 360],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{
                duration: 10 + i * 2,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: i * 0.4,
              }}
            />
          ))}
          
          {/* Animated light rays - more visible */}
          <motion.div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, transparent 50%, rgba(251, 191, 36, 0.1) 100%)',
              transformOrigin: 'top left',
            }}
            animate={{
              rotate: [0, 360],
              scale: [1, 1.6, 1],
            }}
            transition={{
              duration: 30,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
          
          {/* Additional animated orbs */}
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={`orb-${i}`}
              className="absolute rounded-full"
              style={{
                width: `${200 + i * 100}px`,
                height: `${200 + i * 100}px`,
                background: `radial-gradient(circle, rgba(251, 146, 60, 0.2), transparent 70%)`,
                left: `${20 + i * 20}%`,
                top: `${10 + i * 25}%`,
                filter: 'blur(60px)',
              }}
              animate={{
                scale: [1, 1.4, 1],
                opacity: [0.2, 0.4, 0.2],
                x: [0, 50, 0],
                y: [0, -30, 0],
              }}
              transition={{
                duration: 15 + i * 3,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: i * 1.5,
              }}
            />
          ))}
          
          {/* Floating particles - Neon theme */}
          {[...Array(25)].map((_, i) => (
            <motion.div
              key={`particle-${i}`}
              className="absolute rounded-full"
              style={{
                width: `${2 + Math.random() * 3}px`,
                height: `${2 + Math.random() * 3}px`,
                background: i % 3 === 0 
                  ? 'rgba(100, 150, 255, 0.8)'
                  : i % 3 === 1
                  ? 'rgba(150, 100, 255, 0.8)'
                  : 'rgba(100, 200, 255, 0.8)',
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                boxShadow: i % 3 === 0
                  ? '0 0 8px rgba(100, 150, 255, 0.8), 0 0 12px rgba(100, 150, 255, 0.6)'
                  : i % 3 === 1
                  ? '0 0 8px rgba(150, 100, 255, 0.8), 0 0 12px rgba(150, 100, 255, 0.6)'
                  : '0 0 8px rgba(100, 200, 255, 0.8), 0 0 12px rgba(100, 200, 255, 0.6)',
              }}
              animate={{
                y: [0, -120, 0],
                x: [0, Math.random() * 60 - 30, 0],
                opacity: [0, 1, 0],
                scale: [0, 1.5, 0],
              }}
              transition={{
                duration: Math.random() * 5 + 4,
                repeat: Infinity,
                delay: Math.random() * 3,
                ease: 'easeInOut',
              }}
            />
          ))}
          
          {/* Animated mesh gradient overlay - Neon theme */}
          <motion.div
            className="absolute inset-0 opacity-30"
            style={{
              background: `
                radial-gradient(circle at 20% 30%, rgba(100, 150, 255, 0.2) 0%, transparent 50%),
                radial-gradient(circle at 80% 70%, rgba(150, 100, 255, 0.18) 0%, transparent 50%),
                radial-gradient(circle at 50% 50%, rgba(100, 200, 255, 0.15) 0%, transparent 50%)
              `,
            }}
            animate={{
              opacity: [0.25, 0.35, 0.25],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
          
          {/* Neon border effect */}
          <motion.div
            className="absolute top-0 left-0 right-0 h-[2px]"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(100, 150, 255, 0.8), rgba(150, 100, 255, 0.8), rgba(100, 150, 255, 0.8), transparent)',
              boxShadow: '0 0 10px rgba(100, 150, 255, 0.6)',
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
          
          {/* Wave effect - Neon theme */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-40"
            style={{
              background: 'linear-gradient(to top, rgba(100, 150, 255, 0.2), transparent)',
            }}
            animate={{
              y: [0, -25, 0],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <motion.h2
              className="font-heading text-4xl md:text-5xl font-bold mb-4 text-white"
              style={{
                textShadow: '0 0 20px rgba(100, 150, 255, 0.8), 0 0 40px rgba(150, 100, 255, 0.6), 0 4px 8px rgba(0, 0, 0, 0.8)',
                background: 'linear-gradient(135deg, #ffffff 0%, rgba(100, 150, 255, 0.9) 50%, rgba(150, 100, 255, 0.9) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                backgroundSize: '200% 200%',
              }}
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                textShadow: [
                  '0 0 20px rgba(100, 150, 255, 0.8), 0 0 40px rgba(150, 100, 255, 0.6), 0 4px 8px rgba(0, 0, 0, 0.8)',
                  '0 0 30px rgba(100, 150, 255, 1), 0 0 50px rgba(150, 100, 255, 0.8), 0 4px 8px rgba(0, 0, 0, 0.8)',
                  '0 0 20px rgba(100, 150, 255, 0.8), 0 0 40px rgba(150, 100, 255, 0.6), 0 4px 8px rgba(0, 0, 0, 0.8)',
                ],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              {t('home.whyTitle')}
            </motion.h2>
            <motion.p
              className="text-lg text-white/90 max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              style={{
                textShadow: '0 2px 10px rgba(0, 0, 0, 0.8), 0 0 15px rgba(100, 150, 255, 0.4)',
              }}
            >
              {t('home.whySubtitle')}
            </motion.p>
          </motion.div>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ 
                  scale: 1.08, 
                  y: -15,
                  rotateY: 5,
                }}
                className="card-hover group relative overflow-hidden backdrop-blur-md shadow-lg rounded-xl p-6 border"
                style={{
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
                  borderColor: 'rgba(100, 150, 255, 0.4)',
                  boxShadow: '0 0 20px rgba(100, 150, 255, 0.2), inset 0 0 20px rgba(255, 255, 255, 0.05)',
                }}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ 
                  duration: 0.6,
                  delay: index * 0.1,
                  type: 'spring',
                  stiffness: 100,
                }}
              >
                {/* Animated neon background gradient */}
                <motion.div
                  className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-500"
                  style={{
                    background: 'linear-gradient(135deg, rgba(100, 150, 255, 0.3), rgba(150, 100, 255, 0.3))',
                    boxShadow: 'inset 0 0 30px rgba(100, 150, 255, 0.2)',
                  }}
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 5, 0],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />
                
                {/* Glowing neon border effect */}
                <motion.div
                  className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100"
                  style={{
                    border: '2px solid rgba(100, 150, 255, 0.6)',
                    boxShadow: '0 0 20px rgba(100, 150, 255, 0.5), inset 0 0 20px rgba(150, 100, 255, 0.2)',
                  }}
                  animate={{
                    opacity: [0, 0.6, 0],
                    boxShadow: [
                      '0 0 20px rgba(100, 150, 255, 0.5)',
                      '0 0 30px rgba(100, 150, 255, 0.7)',
                      '0 0 20px rgba(100, 150, 255, 0.5)',
                    ],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />
                
                {/* Icon with neon animation */}
                <motion.div
                  className="relative mb-4 transform group-hover:scale-110 transition-transform duration-300"
                  style={{
                    color: 'rgba(100, 150, 255, 0.9)',
                    filter: 'drop-shadow(0 0 8px rgba(100, 150, 255, 0.8)) drop-shadow(0 0 12px rgba(150, 100, 255, 0.6))',
                  }}
                  whileHover={{
                    rotate: [0, -10, 10, 0],
                    scale: 1.2,
                    filter: 'drop-shadow(0 0 12px rgba(100, 150, 255, 1)) drop-shadow(0 0 18px rgba(150, 100, 255, 0.8))',
                  }}
                  transition={{
                    type: 'spring',
                    stiffness: 200,
                  }}
                >
                  {feature.icon}
                </motion.div>
                
                <motion.h3
                  className="font-heading text-xl font-bold text-white mb-2 relative z-10"
                  style={{
                    textShadow: '0 2px 8px rgba(0, 0, 0, 0.8), 0 0 10px rgba(100, 150, 255, 0.4)',
                  }}
                  whileHover={{ x: 5 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  {feature.title}
                </motion.h3>
                <motion.p
                  className="text-white/80 relative z-10"
                  style={{
                    textShadow: '0 1px 4px rgba(0, 0, 0, 0.8)',
                  }}
                  whileHover={{ x: 5 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  {feature.description}
                </motion.p>
                
                {/* Animated neon bottom border */}
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-1"
                  style={{
                    background: 'linear-gradient(90deg, rgba(100, 150, 255, 0.8), rgba(150, 100, 255, 0.8))',
                    boxShadow: '0 0 10px rgba(100, 150, 255, 0.6)',
                  }}
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  whileHover={{ scaleX: 1.1 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.6,
                    delay: index * 0.1 + 0.3,
                    type: 'spring',
                    stiffness: 100,
                  }}
                />
                
                {/* Floating neon sparkle effect */}
                <motion.div
                  className="absolute top-4 right-4 w-2 h-2 rounded-full opacity-0 group-hover:opacity-100"
                  style={{
                    background: 'rgba(100, 150, 255, 0.9)',
                    boxShadow: '0 0 8px rgba(100, 150, 255, 0.8), 0 0 12px rgba(150, 100, 255, 0.6)',
                  }}
                  animate={{
                    scale: [0, 1.5, 0],
                    rotate: [0, 180, 360],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: index * 0.2,
                  }}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Contributors Section - Neon Theme */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        {/* Dark neon background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-black/90 via-slate-900/95 to-black/90" />
          
          {/* Animated neon gradient */}
          <motion.div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(135deg, rgba(100, 150, 255, 0.08) 0%, rgba(150, 100, 255, 0.1) 50%, rgba(100, 150, 255, 0.08) 100%)',
              backgroundSize: '200% 200%',
            }}
            animate={{
              backgroundPosition: ['0% 0%', '100% 100%'],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              repeatType: 'reverse',
              ease: 'linear',
            }}
          />
          
          {/* Floating neon particles */}
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={`contrib-particle-${i}`}
              className="absolute rounded-full"
              style={{
                width: `${2 + Math.random() * 2}px`,
                height: `${2 + Math.random() * 2}px`,
                background: i % 2 === 0 
                  ? 'rgba(100, 150, 255, 0.7)'
                  : 'rgba(150, 100, 255, 0.7)',
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                boxShadow: '0 0 6px rgba(100, 150, 255, 0.6)',
              }}
              animate={{
                y: [0, -80, 0],
                x: [0, Math.random() * 40 - 20, 0],
                opacity: [0, 1, 0],
                scale: [0, 1.2, 0],
              }}
              transition={{
                duration: Math.random() * 4 + 3,
                repeat: Infinity,
                delay: Math.random() * 2,
                ease: 'easeInOut',
              }}
            />
          ))}
          
          {/* Neon border effect */}
          <motion.div
            className="absolute top-0 left-0 right-0 h-[2px]"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(100, 150, 255, 0.8), rgba(150, 100, 255, 0.8), rgba(100, 150, 255, 0.8), transparent)',
              boxShadow: '0 0 10px rgba(100, 150, 255, 0.6)',
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
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <motion.h2
              className="font-heading text-3xl md:text-4xl font-bold mb-8 text-white"
              style={{
                textShadow: '0 0 20px rgba(100, 150, 255, 0.8), 0 0 40px rgba(150, 100, 255, 0.6), 0 4px 8px rgba(0, 0, 0, 0.8)',
                background: 'linear-gradient(135deg, #ffffff 0%, rgba(100, 150, 255, 0.9) 50%, rgba(150, 100, 255, 0.9) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                backgroundSize: '200% 200%',
              }}
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                textShadow: [
                  '0 0 20px rgba(100, 150, 255, 0.8), 0 0 40px rgba(150, 100, 255, 0.6), 0 4px 8px rgba(0, 0, 0, 0.8)',
                  '0 0 30px rgba(100, 150, 255, 1), 0 0 50px rgba(150, 100, 255, 0.8), 0 4px 8px rgba(0, 0, 0, 0.8)',
                  '0 0 20px rgba(100, 150, 255, 0.8), 0 0 40px rgba(150, 100, 255, 0.6), 0 4px 8px rgba(0, 0, 0, 0.8)',
                ],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              {t('home.developedBy')}
            </motion.h2>
            <motion.div
              className="flex flex-wrap justify-center gap-4"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {contributors.map((contributor, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ scale: 1.15, y: -5, rotate: [0, -5, 5, 0] }}
                  whileTap={{ scale: 0.95 }}
                  className="relative px-6 py-3 text-white rounded-full font-semibold overflow-hidden cursor-pointer"
                  style={{
                    background: 'linear-gradient(135deg, rgba(100, 150, 255, 0.9), rgba(150, 100, 255, 0.9), rgba(100, 200, 255, 0.9))',
                    boxShadow: '0 0 20px rgba(100, 150, 255, 0.6), 0 0 40px rgba(150, 100, 255, 0.4), inset 0 0 20px rgba(255, 255, 255, 0.1)',
                    border: '2px solid rgba(100, 150, 255, 0.8)',
                  }}
                >
                  {/* Animated shimmer effect */}
                  <motion.div
                    className="absolute inset-0"
                    style={{
                      background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)',
                    }}
                    animate={{
                      x: ['-100%', '100%'],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'linear',
                      delay: index * 0.2,
                    }}
                  />
                  
                  {/* Sparkling particles */}
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-1 h-1 bg-white rounded-full"
                      style={{
                        left: `${30 + i * 20}%`,
                        top: '50%',
                        boxShadow: '0 0 4px white, 0 0 8px rgba(100, 150, 255, 0.8)',
                      }}
                      animate={{
                        y: [0, -10, 0],
                        opacity: [0, 1, 0],
                        scale: [0, 1.2, 0],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        delay: i * 0.3 + index * 0.1,
                        ease: 'easeInOut',
                      }}
                    />
                  ))}
                  
                  <span className="relative z-10">{contributor}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

export default Home;
