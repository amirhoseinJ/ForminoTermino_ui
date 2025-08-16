import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";

interface SuccessAnimationProps {
  isVisible: boolean;
  onComplete?: () => void;
  title?: string;
  message?: string;
}

export default function SuccessAnimation({ 
  isVisible, 
  onComplete,
  title = "Success!",
  message = "Your task has been completed successfully."
}: SuccessAnimationProps) {
  const [showCheckmark, setShowCheckmark] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showText, setShowText] = useState(false);

  useEffect(() => {
    if (isVisible) {
      // Sequence the animations
      setTimeout(() => setShowCheckmark(true), 200);
      setTimeout(() => setShowConfetti(true), 800);
      setTimeout(() => setShowText(true), 1200);
      setTimeout(() => {
        if (onComplete) onComplete();
      }, 3000);
    } else {
      setShowCheckmark(false);
      setShowConfetti(false);
      setShowText(false);
    }
  }, [isVisible, onComplete]);

  // Generate confetti particles
  const confettiParticles = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    color: ['#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#06b6d4'][Math.floor(Math.random() * 5)],
    delay: Math.random() * 0.5,
    x: Math.random() * 100,
    y: Math.random() * 50 + 25,
    size: Math.random() * 8 + 4,
    rotation: Math.random() * 360
  }));

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{ background: 'rgba(0, 0, 0, 0.8)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="relative">
            {/* Checkmark Circle */}
            <motion.div
              className="w-32 h-32 rounded-full flex items-center justify-center relative"
              style={{
                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(16, 185, 129, 0.1))',
                border: '3px solid rgba(16, 185, 129, 0.3)',
                backdropFilter: 'blur(10px)'
              }}
              initial={{ scale: 0, rotate: -180 }}
              animate={showCheckmark ? { scale: 1, rotate: 0 } : {}}
              transition={{ type: "spring", stiffness: 200, damping: 20, duration: 0.8 }}
            >
              {/* Animated Checkmark */}
              <AnimatePresence>
                {showCheckmark && (
                  <motion.svg
                    className="w-16 h-16"
                    viewBox="0 0 24 24"
                    fill="none"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <motion.path
                      d="M5 13l4 4L19 7"
                      stroke="#10b981"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeDasharray="100"
                      strokeDashoffset="100"
                      animate={{ strokeDashoffset: 0 }}
                      transition={{ delay: 0.4, duration: 0.8, ease: "easeInOut" }}
                    />
                  </motion.svg>
                )}
              </AnimatePresence>

              {/* Glow Effect */}
              <motion.div
                className="absolute inset-0 rounded-full pointer-events-none"
                style={{
                  background: 'radial-gradient(circle, rgba(16, 185, 129, 0.3), transparent)',
                  filter: 'blur(20px)'
                }}
                animate={showCheckmark ? { scale: [0, 1.5, 1], opacity: [0, 0.8, 0.4] } : {}}
                transition={{ delay: 0.3, duration: 1 }}
              />
            </motion.div>

            {/* Confetti */}
            <AnimatePresence>
              {showConfetti && confettiParticles.map((particle) => (
                <motion.div
                  key={particle.id}
                  className="absolute pointer-events-none"
                  style={{
                    left: `${particle.x}%`,
                    top: `${particle.y}%`,
                    width: `${particle.size}px`,
                    height: `${particle.size}px`,
                    backgroundColor: particle.color,
                    borderRadius: Math.random() > 0.5 ? '50%' : '2px'
                  }}
                  initial={{ 
                    scale: 0, 
                    rotate: particle.rotation,
                    y: 0,
                    opacity: 1
                  }}
                  animate={{
                    scale: [0, 1, 0],
                    rotate: [particle.rotation, particle.rotation + 360],
                    y: [-100, 100],
                    x: [0, (Math.random() - 0.5) * 200],
                    opacity: [1, 1, 0]
                  }}
                  transition={{
                    delay: particle.delay,
                    duration: 2,
                    ease: "easeOut"
                  }}
                />
              ))}
            </AnimatePresence>

            {/* Success Text */}
            <AnimatePresence>
              {showText && (
                <motion.div
                  className="absolute top-40 left-1/2 transform -translate-x-1/2 text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                >
                  <motion.h2
                    className="text-3xl font-bold text-neon-green mb-2"
                    style={{ filter: 'drop-shadow(0 0 10px rgba(16, 185, 129, 0.5))' }}
                    animate={{ scale: [0.9, 1.05, 1] }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                  >
                    {title}
                  </motion.h2>
                  <motion.p
                    className="text-gray-300 max-w-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.4 }}
                  >
                    {message}
                  </motion.p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Ripple Effect */}
            {showCheckmark && (
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-neon-green pointer-events-none"
                initial={{ scale: 0, opacity: 0.8 }}
                animate={{ scale: 3, opacity: 0 }}
                transition={{ delay: 0.5, duration: 1.5, ease: "easeOut" }}
              />
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}