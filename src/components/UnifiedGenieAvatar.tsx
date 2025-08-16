import { motion } from "motion/react";
import { useState, useEffect } from "react";

interface UnifiedGenieAvatarProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  expression?: 'neutral' | 'happy' | 'thinking' | 'processing' | 'excited' | 'focused' | 'success' | 'listening' | 'speaking' | 'sleeping';
  isAnimated?: boolean;
  glowColor?: 'purple' | 'green' | 'blue' | 'orange' | 'white';
  className?: string;
  isBlinking?: boolean;
  isSpeaking?: boolean;
}

export default function UnifiedGenieAvatar({ 
  size = 'md', 
  expression = 'neutral',
  isAnimated = true,
  glowColor = 'purple',
  className = "",
  isBlinking = false,
  isSpeaking = false
}: UnifiedGenieAvatarProps) {
  const [autoBlinking, setAutoBlinking] = useState(false);

  // Auto-blink every 3-4 seconds
  useEffect(() => {
    if (!isAnimated) return;
    
    const blinkInterval = setInterval(() => {
      setAutoBlinking(true);
      setTimeout(() => setAutoBlinking(false), 150);
    }, 3000 + Math.random() * 1000);

    return () => clearInterval(blinkInterval);
  }, [isAnimated]);

  const sizes = {
    xs: { container: 'w-8 h-10', body: 'w-6 h-8', eyeContainer: 'w-4 h-3', eye: 'w-1 h-1', mouth: 'w-2 h-1' },
    sm: { container: 'w-12 h-14', body: 'w-8 h-10', eyeContainer: 'w-6 h-4', eye: 'w-1.5 h-1.5', mouth: 'w-3 h-1.5' },
    md: { container: 'w-16 h-20', body: 'w-12 h-16', eyeContainer: 'w-8 h-5', eye: 'w-2 h-2', mouth: 'w-4 h-2' },
    lg: { container: 'w-20 h-24', body: 'w-16 h-20', eyeContainer: 'w-10 h-6', eye: 'w-2.5 h-2.5', mouth: 'w-5 h-2.5' },
    xl: { container: 'w-24 h-28', body: 'w-20 h-24', eyeContainer: 'w-12 h-7', eye: 'w-3 h-3', mouth: 'w-6 h-3' }
  };

  const glowColors = {
    purple: { primary: '#8b5cf6', secondary: '#a78bfa', light: '#c4b5fd' },
    green: { primary: '#10b981', secondary: '#34d399', light: '#6ee7b7' },
    blue: { primary: '#3b82f6', secondary: '#60a5fa', light: '#93c5fd' },
    orange: { primary: '#f59e0b', secondary: '#fbbf24', light: '#fcd34d' },
    white: { primary: '#ffffff', secondary: '#f3f4f6', light: '#e5e7eb' }
  };

  const currentSize = sizes[size];
  const currentGlow = glowColors[glowColor];

  // Expression configurations
  const expressions = {
    neutral: {
      eyeColor: currentGlow.primary,
      eyeScale: 1,
      eyeShape: 'rounded-full',
      mouthColor: currentGlow.secondary,
      mouthShape: 'rounded-full',
      mouthScale: 0.8,
      cheekGlow: false,
      antennaColor: currentGlow.light,
      bodyGlow: `${currentGlow.primary}20`
    },
    happy: {
      eyeColor: currentGlow.primary,
      eyeScale: 1.1,
      eyeShape: 'rounded-full',
      mouthColor: '#fbbf24',
      mouthShape: 'rounded-full',
      mouthScale: 1.2,
      cheekGlow: true,
      antennaColor: '#fcd34d',
      bodyGlow: `${currentGlow.primary}30`
    },
    thinking: {
      eyeColor: '#60a5fa',
      eyeScale: 0.9,
      eyeShape: 'rounded',
      mouthColor: '#94a3b8',
      mouthShape: 'rounded-full',
      mouthScale: 0.6,
      cheekGlow: false,
      antennaColor: '#93c5fd',
      bodyGlow: '#3b82f620'
    },
    processing: {
      eyeColor: '#f59e0b',
      eyeScale: 1.1,
      eyeShape: 'rounded-full',
      mouthColor: '#fbbf24',
      mouthShape: 'rounded',
      mouthScale: 0.7,
      cheekGlow: false,
      antennaColor: '#fcd34d',
      bodyGlow: '#f59e0b25'
    },
    excited: {
      eyeColor: '#fbbf24',
      eyeScale: 1.3,
      eyeShape: 'rounded-full',
      mouthColor: '#f59e0b',
      mouthShape: 'rounded-full',
      mouthScale: 1.4,
      cheekGlow: true,
      antennaColor: '#fcd34d',
      bodyGlow: '#fbbf2430'
    },
    focused: {
      eyeColor: currentGlow.primary,
      eyeScale: 0.7,
      eyeShape: 'rounded',
      mouthColor: currentGlow.secondary,
      mouthShape: 'rounded-full',
      mouthScale: 0.5,
      cheekGlow: false,
      antennaColor: currentGlow.light,
      bodyGlow: `${currentGlow.primary}25`
    },
    success: {
      eyeColor: '#10b981',
      eyeScale: 1.1,
      eyeShape: 'rounded-full',
      mouthColor: '#34d399',
      mouthShape: 'rounded-full',
      mouthScale: 1.3,
      cheekGlow: true,
      antennaColor: '#6ee7b7',
      bodyGlow: '#10b98130'
    },
    listening: {
      eyeColor: '#3b82f6',
      eyeScale: 1.2,
      eyeShape: 'rounded-full',
      mouthColor: '#60a5fa',
      mouthShape: 'rounded-full',
      mouthScale: 0.8,
      cheekGlow: false,
      antennaColor: '#93c5fd',
      bodyGlow: '#3b82f625'
    },
    speaking: {
      eyeColor: currentGlow.primary,
      eyeScale: 1.1,
      eyeShape: 'rounded-full',
      mouthColor: '#f59e0b',
      mouthShape: 'rounded-full',
      mouthScale: isSpeaking ? 1.1 : 0.9,
      cheekGlow: false,
      antennaColor: '#fbbf24',
      bodyGlow: `${currentGlow.primary}25`
    },
    sleeping: {
      eyeColor: '#6b7280',
      eyeScale: 0.3,
      eyeShape: 'rounded',
      mouthColor: '#9ca3af',
      mouthShape: 'rounded-full',
      mouthScale: 0.6,
      cheekGlow: false,
      antennaColor: '#d1d5db',
      bodyGlow: '#6b728015'
    }
  };

  const expr = expressions[expression];
  const shouldBlink = isBlinking || autoBlinking;

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
            rgba(51, 65, 85, 0.9) 30%,
            rgba(71, 85, 105, 0.85) 70%,
            rgba(30, 41, 59, 0.95) 100%)`,
          border: `2px solid ${currentGlow.primary}40`,
          boxShadow: `0 0 20px ${currentGlow.primary}40, 0 8px 32px rgba(0, 0, 0, 0.4)`
        }}
        animate={isAnimated ? {
          y: [0, -3, 0],
          scale: [1, 1.01, 1]
        } : {}}
        transition={isAnimated ? {
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        } : {}}
      >
        {/* Shiny Glossy Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-white/10 to-transparent rounded-2xl" />
        
        {/* Secondary Shine */}
        <motion.div
          className="absolute top-1 left-1 right-1 h-1/3 rounded-t-xl bg-gradient-to-b from-white/20 to-transparent"
          animate={isAnimated ? {
            opacity: [0.2, 0.4, 0.2]
          } : {}}
          transition={isAnimated ? {
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          } : {}}
        />
        
        {/* Inner Body Glow */}
        <motion.div
          className="absolute inset-1 rounded-xl"
          style={{ 
            background: `linear-gradient(135deg, ${expr.bodyGlow}, transparent)` 
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
        <div className="relative mt-2 mx-auto" style={{ width: '75%', height: '50%' }}>
          {/* Antenna */}
          <motion.div
            className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-0.5 h-3 rounded-full"
            style={{ backgroundColor: expr.antennaColor }}
            animate={isAnimated ? {
              rotate: [0, 5, -5, 0],
              height: [12, 14, 12]
            } : {}}
            transition={isAnimated ? {
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            } : {}}
          >
            {/* Antenna Tip with Enhanced Glow */}
            <motion.div
              className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 rounded-full shadow-lg"
              style={{ 
                backgroundColor: expr.antennaColor,
                boxShadow: `0 0 8px ${expr.antennaColor}80`
              }}
              animate={isAnimated ? {
                scale: [1, 1.3, 1],
                opacity: [0.8, 1, 0.8]
              } : {}}
              transition={isAnimated ? {
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              } : {}}
            />
          </motion.div>

          {/* Eye Container */}
          <div className={`${currentSize.eyeContainer} mx-auto mt-3 flex items-center justify-center gap-1`}>
            {/* Left Eye */}
            <motion.div
              className={`${currentSize.eye} ${expr.eyeShape} bg-white relative overflow-hidden shadow-inner`}
              animate={isAnimated ? {
                scale: shouldBlink ? [1, 0.1, 1] : [expr.eyeScale, expr.eyeScale * 1.05, expr.eyeScale],
                scaleY: shouldBlink ? 0.1 : 1
              } : {}}
              transition={isAnimated ? {
                duration: shouldBlink ? 0.15 : 2.5,
                repeat: shouldBlink ? 0 : Infinity,
                ease: "easeInOut"
              } : {}}
            >
              {/* Eye Pupil with Enhanced Shine */}
              <motion.div
                className="absolute inset-0.5 rounded-full shadow-lg relative"
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
                {/* Primary Eye Highlight */}
                <div className="absolute top-0.5 left-0.5 w-1 h-1 bg-white rounded-full opacity-90 shadow-sm" />
                {/* Secondary Highlight */}
                <div className="absolute bottom-0.5 right-0.5 w-0.5 h-0.5 bg-white/60 rounded-full" />
              </motion.div>
            </motion.div>

            {/* Right Eye */}
            <motion.div
              className={`${currentSize.eye} ${expr.eyeShape} bg-white relative overflow-hidden shadow-inner`}
              animate={isAnimated ? {
                scale: shouldBlink ? [1, 0.1, 1] : [expr.eyeScale, expr.eyeScale * 1.05, expr.eyeScale],
                scaleY: shouldBlink ? 0.1 : 1
              } : {}}
              transition={isAnimated ? {
                duration: shouldBlink ? 0.15 : 2.5,
                repeat: shouldBlink ? 0 : Infinity,
                ease: "easeInOut",
                delay: shouldBlink ? 0 : 0.1
              } : {}}
            >
              {/* Eye Pupil with Enhanced Shine */}
              <motion.div
                className="absolute inset-0.5 rounded-full shadow-lg relative"
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
                {/* Primary Eye Highlight */}
                <div className="absolute top-0.5 left-0.5 w-1 h-1 bg-white rounded-full opacity-90 shadow-sm" />
                {/* Secondary Highlight */}
                <div className="absolute bottom-0.5 right-0.5 w-0.5 h-0.5 bg-white/60 rounded-full" />
              </motion.div>
            </motion.div>
          </div>

          {/* Cheek Glow (when happy/excited) */}
          {expr.cheekGlow && (
            <>
              <motion.div
                className="absolute left-0 top-1/2 w-1.5 h-1.5 bg-pink-400/30 rounded-full blur-sm"
                animate={isAnimated ? {
                  opacity: [0.3, 0.8, 0.3],
                  scale: [1, 1.2, 1]
                } : {}}
                transition={isAnimated ? {
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                } : {}}
              />
              <motion.div
                className="absolute right-0 top-1/2 w-1.5 h-1.5 bg-pink-400/30 rounded-full blur-sm"
                animate={isAnimated ? {
                  opacity: [0.3, 0.8, 0.3],
                  scale: [1, 1.2, 1]
                } : {}}
                transition={isAnimated ? {
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.1
                } : {}}
              />
            </>
          )}

          {/* Expressive Mouth */}
          <motion.div
            className={`${currentSize.mouth} ${expr.mouthShape} mx-auto mt-1 shadow-lg relative overflow-hidden`}
            style={{ backgroundColor: expr.mouthColor }}
            animate={isAnimated ? {
              scale: isSpeaking ? [expr.mouthScale, expr.mouthScale * 1.2, expr.mouthScale] : 
                     expression === 'excited' ? [expr.mouthScale, expr.mouthScale * 1.3, expr.mouthScale] : 
                     [expr.mouthScale, expr.mouthScale * 1.1, expr.mouthScale]
            } : {}}
            transition={isAnimated ? {
              duration: isSpeaking ? 0.3 : 1.5,
              repeat: isSpeaking ? Infinity : Infinity,
              ease: "easeInOut"
            } : {}}
          >
            {/* Mouth Highlight */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1/2 h-1/2 bg-white/20 rounded-full" />
          </motion.div>
        </div>

        {/* Body Status Indicators */}
        <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-1 h-1 rounded-full shadow-sm"
              style={{ 
                backgroundColor: i === 0 ? '#ef4444' : i === 1 ? '#fbbf24' : '#10b981'
              }}
              animate={isAnimated ? {
                opacity: [0.4, 1, 0.4],
                scale: [1, 1.2, 1]
              } : {}}
              transition={isAnimated ? {
                duration: 1.8,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.2
              } : {}}
            />
          ))}
        </div>

        {/* Side Control Panels */}
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-0.5 h-6 bg-slate-500/80 rounded-full shadow-inner" />
        <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-0.5 h-6 bg-slate-500/80 rounded-full shadow-inner" />

        {/* Internal Screen Glow */}
        <motion.div
          className="absolute inset-3 rounded-lg border shadow-inner"
          style={{
            background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.1), rgba(59, 130, 246, 0.1))',
            borderColor: `${currentGlow.primary}30`
          }}
          animate={isAnimated ? {
            opacity: [0.3, 0.6, 0.3],
            borderColor: [`${currentGlow.primary}30`, `${currentGlow.primary}50`, `${currentGlow.primary}30`]
          } : {}}
          transition={isAnimated ? {
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          } : {}}
        />
      </motion.div>

      {/* Enhanced Outer Glow */}
      {isAnimated && (
        <motion.div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{
            background: `radial-gradient(circle, ${currentGlow.primary}40, transparent)`,
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

      {/* Expression-Based Floating Elements */}
      {isAnimated && expression === 'excited' && Array.from({ length: 4 }, (_, i) => (
        <motion.div
          key={i}
          className="absolute text-xs pointer-events-none"
          style={{
            left: `${50 + Math.cos(i * 90 * Math.PI / 180) * 30}%`,
            top: `${30 + Math.sin(i * 90 * Math.PI / 180) * 25}%`,
          }}
          animate={{
            y: [0, -15, 0],
            opacity: [0, 1, 0],
            scale: [0, 1.2, 0],
            rotate: [0, 180, 360]
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
          className="absolute w-1 h-1 rounded-full pointer-events-none"
          style={{
            backgroundColor: '#60a5fa',
            left: `${65 + i * 8}%`,
            top: `${15 - i * 5}%`,
          }}
          animate={{
            y: [0, -10, 0],
            opacity: [0, 1, 0],
            scale: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 1.8,
            repeat: Infinity,
            delay: i * 0.3,
            ease: "easeInOut"
          }}
        />
      ))}

      {/* Processing Indicators */}
      {isAnimated && expression === 'processing' && Array.from({ length: 3 }, (_, i) => (
        <motion.div
          key={i}
          className="absolute w-0.5 h-4 rounded-full pointer-events-none"
          style={{
            backgroundColor: '#fbbf24',
            left: `${45 + i * 5}%`,
            top: '10%'
          }}
          animate={{
            scaleY: [0.5, 1.5, 0.5],
            opacity: [0.6, 1, 0.6]
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            delay: i * 0.2,
            ease: "easeInOut"
          }}
        />
      ))}
    </motion.div>
  );
}