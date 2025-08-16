import { motion } from "motion/react";

interface AIAvatarProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isThinking?: boolean;
  className?: string;
}

export default function AIAvatar({ size = 'md', isThinking = false, className = '' }: AIAvatarProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  };

  const eyeSize = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
    lg: 'w-3 h-3',
    xl: 'w-4 h-4'
  };

  return (
    <motion.div
      className={`${sizeClasses[size]} relative ${className}`}
      animate={isThinking ? { scale: [1, 1.05, 1] } : {}}
      transition={{ duration: 2, repeat: isThinking ? Infinity : 0 }}
    >
      {/* Main avatar circle */}
      <div
        className={`w-full h-full rounded-full bg-gradient-to-br from-blue-400 to-blue-500 flex items-center justify-center shadow-lg relative overflow-hidden ${
          isThinking ? 'pulse-glow' : ''
        }`}
      >
        {/* Inner glow effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-full" />
        
        {/* Face container */}
        <div className="relative z-10 flex flex-col items-center justify-center">
          {/* Eyes */}
          <div className="flex gap-1 mb-1">
            <motion.div
              className={`${eyeSize[size]} bg-white rounded-full`}
              animate={isThinking ? { scaleY: [1, 0.1, 1] } : {}}
              transition={{ duration: 1.5, repeat: isThinking ? Infinity : 0, delay: 0 }}
            />
            <motion.div
              className={`${eyeSize[size]} bg-white rounded-full`}
              animate={isThinking ? { scaleY: [1, 0.1, 1] } : {}}
              transition={{ duration: 1.5, repeat: isThinking ? Infinity : 0, delay: 0.2 }}
            />
          </div>
          
          {/* Mouth - subtle smile */}
          <div className={`${size === 'sm' ? 'w-2 h-1' : size === 'md' ? 'w-3 h-1.5' : size === 'lg' ? 'w-4 h-2' : 'w-6 h-3'} relative`}>
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-full h-0.5 bg-white rounded-full opacity-80" />
          </div>
        </div>

        {/* Animated thinking dots */}
        {isThinking && (
          <motion.div
            className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex gap-0.5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-0.5 h-0.5 bg-white rounded-full"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.2
                }}
              />
            ))}
          </motion.div>
        )}
      </div>

      {/* Outer glow ring when thinking */}
      {isThinking && (
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-blue-300/50"
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.2, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}
    </motion.div>
  );
}