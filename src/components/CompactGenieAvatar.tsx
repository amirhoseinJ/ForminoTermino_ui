import { motion } from "motion/react";
import { useState, useEffect } from "react";

interface CompactGenieAvatarProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  expression?: 'happy' | 'thinking' | 'processing' | 'excited' | 'focused' | 'success' | 'sleeping';
  isAnimated?: boolean;
  glowColor?: 'purple' | 'green' | 'blue' | 'orange';
  className?: string;
}

export default function CompactGenieAvatar({ 
  size = 'md', 
  expression = 'happy',
  isAnimated = true,
  glowColor = 'purple',
  className = ""
}: CompactGenieAvatarProps) {
  const [isBlinking, setIsBlinking] = useState(false);

  // Random blinking effect
  useEffect(() => {
    if (!isAnimated) return;
    
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 150);
    }, 3000 + Math.random() * 2000);

    return () => clearInterval(blinkInterval);
  }, [isAnimated]);

  const sizes = {
    xs: { container: 'w-8 h-10', body: 'w-6 h-8', eye: 'w-0.5 h-0.5' },
    sm: { container: 'w-12 h-14', body: 'w-8 h-10', eye: 'w-1 h-1' },
    md: { container: 'w-16 h-20', body: 'w-12 h-16', eye: 'w-1.5 h-1.5' },
    lg: { container: 'w-20 h-24', body: 'w-16 h-20', eye: 'w-2 h-2' },
    xl: { container: 'w-24 h-28', body: 'w-20 h-24', eye: 'w-2.5 h-2.5' }
  };

  const glowColors = {
    purple: { primary: '#8b5cf6', secondary: '#a78bfa' },
    green: { primary: '#10b981', secondary: '#34d399' },
    blue: { primary: '#3b82f6', secondary: '#60a5fa' },
    orange: { primary: '#f59e0b', secondary: '#fbbf24' }
  };

  const currentSize = sizes[size];
  const currentGlow = glowColors[glowColor];

  // Expression configurations
  const expressions = {
    happy: {
      eyeShape: 'rounded-full',
      eyeColor: currentGlow.primary,
      eyeScale: 1,
      mouthShape: 'w-4 h-2 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full',
      cheekGlow: 'bg-pink-400/30',
      antennaColor: currentGlow.secondary
    },
    thinking: {
      eyeShape: 'rounded-full',
      eyeColor: '#60a5fa',
      eyeScale: 0.8,
      mouthShape: 'w-2 h-2 bg-blue-400 rounded-full',
      cheekGlow: 'bg-blue-400/20',
      antennaColor: '#60a5fa'
    },
    processing: {
      eyeShape: 'rounded-full',
      eyeColor: '#f59e0b',
      eyeScale: 1.2,
      mouthShape: 'w-3 h-1 bg-orange-400 rounded',
      cheekGlow: 'bg-orange-400/30',
      antennaColor: '#fbbf24'
    },
    excited: {
      eyeShape: 'rounded-full',
      eyeColor: '#fbbf24',
      eyeScale: 1.3,
      mouthShape: 'w-5 h-3 bg-gradient-to-r from-yellow-300 to-red-400 rounded-full',
      cheekGlow: 'bg-yellow-400/40',
      antennaColor: '#fcd34d'
    },
    focused: {
      eyeShape: 'rounded',
      eyeColor: currentGlow.primary,
      eyeScale: 0.6,
      mouthShape: 'w-1 h-1 bg-purple-400 rounded-full',
      cheekGlow: 'bg-purple-400/20',
      antennaColor: currentGlow.secondary
    },
    success: {
      eyeShape: 'rounded-full',
      eyeColor: '#10b981',
      eyeScale: 1.1,
      mouthShape: 'w-4 h-2 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full',
      cheekGlow: 'bg-green-400/30',
      antennaColor: '#34d399'
    },
    sleeping: {
      eyeShape: 'rounded',
      eyeColor: '#6b7280',
      eyeScale: 0.3,
      mouthShape: 'w-2 h-1 bg-gray-400 rounded-full',
      cheekGlow: 'bg-gray-400/20',
      antennaColor: '#9ca3af'
    }
  };

  const expr = expressions[expression];

  return (
    <motion.div
      className={`${currentSize.container} relative flex items-end justify-center ${className}`}
      initial={isAnimated ? { scale: 0, rotate: -180, opacity: 0 } : {}}
      animate={isAnimated ? { scale: 1, rotate: 0, opacity: 1 } : {}}
      transition={isAnimated ? { 
        type: "spring", 
        stiffness: 200, 
        damping: 15,
        duration: 1.2
      } : {}}
    >
      {/* Main Robot Body (Integrated Design) */}
      <motion.div
        className={`${currentSize.body} relative rounded-2xl overflow-hidden shadow-2xl`}
        style={{
          background: `linear-gradient(135deg, 
            rgba(30, 41, 59, 0.95) 0%, 
            rgba(51, 65, 85, 0.9) 50%, 
            rgba(30, 41, 59, 0.95) 100%)`,
          border: `2px solid ${currentGlow.primary}40`,
          boxShadow: `0 0 20px ${currentGlow.primary}40, 0 8px 32px rgba(0, 0, 0, 0.4)`
        }}
        animate={isAnimated ? {
          y: [0, -3, 0],
          scale: [1, 1.02, 1]
        } : {}}
        transition={isAnimated ? {
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        } : {}}
      >
        {/* Glossy Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-white/10 to-transparent rounded-2xl" />
        
        {/* Inner Glow */}
        <motion.div
          className="absolute inset-1 rounded-xl"
          style={{ 
            background: `linear-gradient(135deg, ${currentGlow.primary}20, transparent)` 
          }}
          animate={isAnimated ? {
            opacity: [0.3, 0.7, 0.3]
          } : {}}
          transition={isAnimated ? {
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut"
          } : {}}
        />

        {/* Head Section (Integrated Top) */}
        <div className="relative mt-2 mx-auto" style={{ width: '75%', height: '45%' }}>
          {/* Antenna */}
          <motion.div
            className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-0.5 h-3 rounded-full"
            style={{ backgroundColor: expr.antennaColor }}
            animate={isAnimated ? {
              rotate: [0, 8, -8, 0],
              height: [12, 16, 12]
            } : {}}
            transition={isAnimated ? {
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut"
            } : {}}
          >
            {/* Antenna Tip with Pulse */}
            <motion.div
              className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: expr.antennaColor }}
              animate={isAnimated ? {
                scale: [1, 1.5, 1],
                opacity: [0.7, 1, 0.7]
              } : {}}
              transition={isAnimated ? {
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              } : {}}
            />
          </motion.div>

          {/* Expressive Eyes */}
          <div className="flex items-center justify-center gap-1 mt-4">
            {/* Left Eye */}
            <motion.div
              className={`${currentSize.eye} ${expr.eyeShape} bg-white relative overflow-hidden shadow-inner`}
              animate={isAnimated ? {
                scale: isBlinking ? [1, 0.1, 1] : [expr.eyeScale, expr.eyeScale * 1.1, expr.eyeScale],
                scaleY: isBlinking ? 0.1 : 1
              } : {}}
              transition={isAnimated ? {
                duration: isBlinking ? 0.15 : 2,
                repeat: isBlinking ? 0 : Infinity,
                ease: "easeInOut"
              } : {}}
            >
              {/* Eye Pupil */}
              <motion.div
                className="absolute inset-0.5 rounded-full shadow-lg"
                style={{ backgroundColor: expr.eyeColor }}
                animate={isAnimated && expression === 'thinking' ? {
                  x: [0, 1, -1, 0]
                } : {}}
                transition={isAnimated ? {
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                } : {}}
              >
                {/* Eye Highlight */}
                <div className="absolute top-0.5 left-0.5 w-0.5 h-0.5 bg-white rounded-full opacity-80" />
              </motion.div>
            </motion.div>

            {/* Right Eye */}
            <motion.div
              className={`${currentSize.eye} ${expr.eyeShape} bg-white relative overflow-hidden shadow-inner`}
              animate={isAnimated ? {
                scale: isBlinking ? [1, 0.1, 1] : [expr.eyeScale, expr.eyeScale * 1.1, expr.eyeScale],
                scaleY: isBlinking ? 0.1 : 1
              } : {}}
              transition={isAnimated ? {
                duration: isBlinking ? 0.15 : 2,
                repeat: isBlinking ? 0 : Infinity,
                ease: "easeInOut",
                delay: isBlinking ? 0 : 0.1
              } : {}}
            >
              {/* Eye Pupil */}
              <motion.div
                className="absolute inset-0.5 rounded-full shadow-lg"
                style={{ backgroundColor: expr.eyeColor }}
                animate={isAnimated && expression === 'thinking' ? {
                  x: [0, 1, -1, 0]
                } : {}}
                transition={isAnimated ? {
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                } : {}}
              >
                {/* Eye Highlight */}
                <div className="absolute top-0.5 left-0.5 w-0.5 h-0.5 bg-white rounded-full opacity-80" />
              </motion.div>
            </motion.div>
          </div>

          {/* Cheek Glow */}
          <div className="flex justify-between mt-1 px-1">
            <motion.div
              className={`w-1 h-1 ${expr.cheekGlow} rounded-full`}
              animate={isAnimated ? {
                opacity: [0.5, 1, 0.5],
                scale: [1, 1.2, 1]
              } : {}}
              transition={isAnimated ? {
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              } : {}}
            />
            <motion.div
              className={`w-1 h-1 ${expr.cheekGlow} rounded-full`}
              animate={isAnimated ? {
                opacity: [0.5, 1, 0.5],
                scale: [1, 1.2, 1]
              } : {}}
              transition={isAnimated ? {
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.2
              } : {}}
            />
          </div>

          {/* Expressive Mouth */}
          <motion.div
            className={`${expr.mouthShape} mx-auto mt-1 shadow-lg`}
            animate={isAnimated ? {
              scale: expression === 'excited' ? [1, 1.3, 1] : [1, 1.1, 1]
            } : {}}
            transition={isAnimated ? {
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            } : {}}
          />
        </div>

        {/* Body Details */}
        <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-1">
          {/* Status Indicators */}
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-1 h-1 rounded-full"
              style={{ backgroundColor: i === 0 ? '#ef4444' : i === 1 ? '#fbbf24' : '#10b981' }}
              animate={isAnimated ? {
                opacity: [0.4, 1, 0.4],
                scale: [1, 1.3, 1]
              } : {}}
              transition={isAnimated ? {
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.2
              } : {}}
            />
          ))}
        </div>

        {/* Side Panels */}
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-0.5 h-6 bg-gray-500 rounded-full opacity-60" />
        <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-0.5 h-6 bg-gray-500 rounded-full opacity-60" />

        {/* Screen Effect */}
        <motion.div
          className="absolute inset-3 rounded-lg border border-cyan-400/30"
          style={{
            background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.1), rgba(59, 130, 246, 0.1))'
          }}
          animate={isAnimated ? {
            opacity: [0.3, 0.6, 0.3],
            borderColor: ['rgba(6, 182, 212, 0.3)', 'rgba(59, 130, 246, 0.5)', 'rgba(6, 182, 212, 0.3)']
          } : {}}
          transition={isAnimated ? {
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          } : {}}
        />
      </motion.div>

      {/* Outer Glow */}
      {isAnimated && (
        <motion.div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{
            background: `radial-gradient(circle, ${currentGlow.primary}30, transparent)`,
            filter: 'blur(15px)',
            transform: 'scale(1.4)'
          }}
          animate={{
            scale: [1.4, 1.6, 1.4],
            opacity: [0.4, 0.7, 0.4]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      )}

      {/* Floating Expression Particles */}
      {isAnimated && expression === 'excited' && Array.from({ length: 4 }, (_, i) => (
        <motion.div
          key={i}
          className="absolute text-xs"
          style={{
            left: `${50 + Math.cos(i * 90 * Math.PI / 180) * 25}%`,
            top: `${30 + Math.sin(i * 90 * Math.PI / 180) * 20}%`,
          }}
          animate={{
            y: [0, -15, 0],
            opacity: [0, 1, 0],
            scale: [0, 1.2, 0],
            rotate: [0, 360, 720]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.3,
            ease: "easeOut"
          }}
        >
          {i % 2 === 0 ? '✨' : '⭐'}
        </motion.div>
      ))}

      {/* Thinking Bubbles */}
      {isAnimated && expression === 'thinking' && Array.from({ length: 3 }, (_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-blue-400 rounded-full"
          style={{
            left: `${60 + i * 8}%`,
            top: `${20 - i * 5}%`,
          }}
          animate={{
            y: [0, -10, 0],
            opacity: [0, 1, 0],
            scale: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: i * 0.2,
            ease: "easeInOut"
          }}
        />
      ))}
    </motion.div>
  );
}