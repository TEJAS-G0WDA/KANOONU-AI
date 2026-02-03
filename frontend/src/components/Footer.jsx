import { Link } from 'react-router-dom';
import { Scale } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';

function Footer() {
  const { t } = useLanguage();
  const footerLinks = [
    { path: '/', label: t('nav.home') },
    { path: '/chat', label: t('nav.chat') },
    { path: '/case-law-search', label: t('nav.caseLawSearch') },
    { path: '/lawyers', label: t('nav.lawyers') },
  ];

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="text-white mt-16 border-t border-white/10 backdrop-blur-xl relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.85) 0%, rgba(30, 30, 50, 0.9) 50%, rgba(0, 0, 0, 0.85) 100%)',
        boxShadow: '0 -4px 30px rgba(0, 0, 0, 0.5), 0 0 20px rgba(100, 150, 255, 0.3)',
      }}
    >
      {/* Animated neon border effect at top */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-[2px]"
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
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-blue-400 rounded-full"
          style={{
            left: `${10 + i * 11}%`,
            top: '50%',
            boxShadow: '0 0 6px rgba(100, 150, 255, 0.8), 0 0 12px rgba(150, 100, 255, 0.6)',
          }}
          animate={{
            y: [0, -15, 0],
            opacity: [0, 1, 0],
            scale: [0, 1.5, 0],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            delay: i * 0.3,
            ease: 'easeInOut',
          }}
        />
      ))}
      
      {/* Floating neon orbs */}
      <motion.div
        className="absolute w-40 h-40 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(100, 150, 255, 0.15), transparent 70%)',
          left: '10%',
          top: '50%',
          filter: 'blur(40px)',
        }}
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.4, 0.2],
          x: [0, 30, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className="absolute w-40 h-40 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(150, 100, 255, 0.15), transparent 70%)',
          right: '10%',
          top: '50%',
          filter: 'blur(40px)',
        }}
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.4, 0.2],
          x: [0, -30, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 1,
        }}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center space-x-2 mb-4 md:mb-0 relative"
          >
            <motion.div
              animate={{ 
                rotate: [0, 10, -10, 0],
                filter: ['brightness(1)', 'brightness(1.3)', 'brightness(1)'],
              }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="relative"
            >
              <Scale 
                className="h-6 w-6 text-white relative z-10" 
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
              className="font-heading text-lg font-bold text-white relative"
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
          </motion.div>
          
          <div className="flex flex-wrap justify-center gap-4 mb-4 md:mb-0">
            {footerLinks.map((link, index) => (
              <motion.div
                key={link.path}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link to={link.path}>
                  <motion.span
                    whileHover={{ 
                      scale: 1.1, 
                      y: -2,
                      textShadow: '0 0 10px rgba(100, 150, 255, 0.8), 0 0 20px rgba(150, 100, 255, 0.6)',
                    }}
                    className="text-white/80 hover:text-white transition-colors cursor-pointer block relative"
                    style={{
                      textShadow: '0 1px 3px rgba(0, 0, 0, 0.8)',
                    }}
                  >
                    {link.label}
                    {/* Neon underline on hover */}
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 h-[1px]"
                      style={{
                        background: 'linear-gradient(90deg, rgba(100, 150, 255, 0.8), rgba(150, 100, 255, 0.8))',
                        boxShadow: '0 0 6px rgba(100, 150, 255, 0.6)',
                      }}
                      initial={{ scaleX: 0 }}
                      whileHover={{ scaleX: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  </motion.span>
                </Link>
              </motion.div>
            ))}
          </div>
          
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-white/70 text-sm"
            style={{
              textShadow: '0 1px 3px rgba(0, 0, 0, 0.8)',
            }}
          >
            {t('footer.copyright').replace('{year}', new Date().getFullYear())}
          </motion.p>
        </div>
      </div>
    </motion.footer>
  );
}

export default Footer;
