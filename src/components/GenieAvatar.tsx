import { motion } from "motion/react";

interface GenieAvatarProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  expression?: 'neutral' | 'happy' | 'thumbsUp' | 'pointing' | 'nodding';
  isAnimating?: boolean;
  className?: string;
}

export default function GenieAvatar({ 
  size = 'lg', 
  expression = 'neutral', 
  isAnimating = false,
  className = '' 
}: GenieAvatarProps) {
  const sizeClasses = {
    sm: 'w-12 h-16',
    md: 'w-16 h-20',
    lg: 'w-20 h-24',
    xl: 'w-32 h-40'
  };

  const bodySize = {
    sm: 'w-8 h-10',
    md: 'w-12 h-14',
    lg: 'w-16 h-18',
    xl: 'w-24 h-28'
  };

  const headSize = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
    xl: 'w-16 h-16'
  };

  const eyeSize = {
    sm: 'w-1 h-1',
    md: 'w-1.5 h-1.5',
    lg: 'w-2 h-2',
    xl: 'w-3 h-3'
  };

  const armSize = {
    sm: 'w-1 h-4',
    md: 'w-1.5 h-6',
    lg: 'w-2 h-8',
    xl: 'w-3 h-12'
  };

  // Animation variants based on expression
  const getArmAnimation = () => {
    switch (expression) {
      case 'happy':
        return {
          rotate: [0, 15, -15, 0],
          transition: { duration: 1, repeat: isAnimating ? Infinity : 0 }
        };
      case 'thumbsUp':
        return {
          rotate: [0, -45],
          y: [0, -4],
          transition: { duration: 0.5 }
        };
      case 'pointing':
        return {
          rotate: [0, -30],
          x: [0, 8],
          transition: { duration: 0.5 }
        };
      default:
        return {};
    }
  };

  const getHeadAnimation = () => {
    switch (expression) {
      case 'nodding':
        return {
          y: [0, 2, 0],
          transition: { duration: 0.6, repeat: 2 }
        };
      default:
        return {};
    }
  };

  const getEyeAnimation = () => {
    if (expression === 'happy') {
      return {
        scaleY: [1, 0.3, 1],
        transition: { duration: 0.3 }
      };
    }
    return {};
  };

  return (
    <div className={`${sizeClasses[size]} relative ${className}`}>
      {/* Robot Body */}
      <div className={`${bodySize[size]} mx-auto bg-gradient-to-b from-primary to-primary/80 rounded-lg relative shadow-lg`}>
        {/* Body Details */}
        <div className="absolute inset-2 bg-gradient-to-b from-white/20 to-transparent rounded-md" />
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-2 h-1 bg-primary/60 rounded-full" />
        
        {/* Robot Head */}
        <motion.div
          className={`${headSize[size]} mx-auto -mt-2 bg-gradient-to-b from-primary to-primary/80 rounded-lg relative shadow-md`}
          animate={getHeadAnimation()}
        >
          {/* Head Details */}
          <div className="absolute inset-1 bg-gradient-to-b from-white/20 to-transparent rounded-md" />
          
          {/* Eyes */}
          <div className="absolute top-2 left-1/2 transform -translate-x-1/2 flex gap-1">
            <motion.div
              className={`${eyeSize[size]} bg-white rounded-full`}
              animate={getEyeAnimation()}
            />
            <motion.div
              className={`${eyeSize[size]} bg-white rounded-full`}
              animate={getEyeAnimation()}
            />
          </div>
          
          {/* Mouth */}
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2">
            {expression === 'happy' || expression === 'thumbsUp' ? (
              <div className="w-3 h-1 bg-white rounded-full" />
            ) : (
              <div className="w-2 h-0.5 bg-white rounded-full" />
            )}
          </div>

          {/* Antenna */}
          <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-0.5 h-2 bg-primary/60">
            <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-soft-green rounded-full" />
          </div>
        </motion.div>

        {/* Arms */}
        <motion.div
          className={`absolute left-0 top-2 ${armSize[size]} bg-primary rounded-full origin-bottom`}
          animate={getArmAnimation()}
        />
        <motion.div
          className={`absolute right-0 top-2 ${armSize[size]} bg-primary rounded-full origin-bottom`}
          animate={expression === 'pointing' ? {} : getArmAnimation()}
        />

        {/* Special thumb for thumbs up */}
        {expression === 'thumbsUp' && (
          <motion.div
            className="absolute right-0 top-0 w-1 h-2 bg-primary rounded-full"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.3 }}
          />
        )}

        {/* Legs */}
        <div className="absolute -bottom-2 left-2 w-1 h-3 bg-primary/80 rounded-full" />
        <div className="absolute -bottom-2 right-2 w-1 h-3 bg-primary/80 rounded-full" />
      </div>

      {/* Glow effect when animating */}
      {isAnimating && (
        <motion.div
          className="absolute inset-0 rounded-lg border-2 border-primary/30"
          animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.2, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}
    </div>
  );
}