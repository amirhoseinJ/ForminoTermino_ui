import { motion } from "motion/react";

interface Robot3DAvatarProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isThinking?: boolean;
  expression?: 'neutral' | 'happy' | 'processing';
  className?: string;
}

export default function Robot3DAvatar({ 
  size = 'lg', 
  isThinking = false, 
  expression = 'neutral',
  className = '' 
}: Robot3DAvatarProps) {
  const sizeClasses = {
    sm: 'w-12 h-16',
    md: 'w-16 h-20',
    lg: 'w-20 h-24',
    xl: 'w-32 h-40'
  };

  const headSize = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  };

  const bodySize = {
    sm: 'w-6 h-8',
    md: 'w-10 h-12',
    lg: 'w-12 h-14',
    xl: 'w-20 h-24'
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
      animate={{ y: [-5, 5, -5] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
    >
      {/* Robot Head */}
      <motion.div
        className={`${headSize[size]} mx-auto relative overflow-hidden`}
        style={{
          background: 'linear-gradient(135deg, #e2e8f0 0%, #cbd5e0 50%, #a0aec0 100%)',
          borderRadius: '50%',
          boxShadow: `
            inset 0 -20px 20px rgba(0,0,0,0.1),
            inset 0 20px 20px rgba(255,255,255,0.3),
            0 10px 20px rgba(0,0,0,0.2),
            0 0 20px rgba(139, 92, 246, 0.3)
          `
        }}
        animate={isThinking ? { scale: [1, 1.05, 1] } : {}}
        transition={{ duration: 1.5, repeat: isThinking ? Infinity : 0 }}
      >
        {/* Head Highlight */}
        <div 
          className="absolute top-2 left-2 w-1/3 h-1/3 rounded-full opacity-60"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.8), transparent)'
          }}
        />
        
        {/* Eyes */}
        <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 flex gap-2">
          <motion.div
            className={`${eyeSize[size]} rounded-full relative overflow-hidden`}
            style={{
              background: 'radial-gradient(circle, #3b82f6, #1e40af)',
              boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3), 0 0 10px #3b82f6'
            }}
            animate={expression === 'processing' ? { opacity: [1, 0.3, 1] } : {}}
            transition={{ duration: 0.8, repeat: expression === 'processing' ? Infinity : 0 }}
          >
            {/* Eye shine */}
            <div className="absolute top-1 left-1 w-1 h-1 bg-white rounded-full opacity-80" />
          </motion.div>
          <motion.div
            className={`${eyeSize[size]} rounded-full relative overflow-hidden`}
            style={{
              background: 'radial-gradient(circle, #3b82f6, #1e40af)',
              boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3), 0 0 10px #3b82f6'
            }}
            animate={expression === 'processing' ? { opacity: [1, 0.3, 1] } : {}}
            transition={{ duration: 0.8, repeat: expression === 'processing' ? Infinity : 0, delay: 0.2 }}
          >
            {/* Eye shine */}
            <div className="absolute top-1 left-1 w-1 h-1 bg-white rounded-full opacity-80" />
          </motion.div>
        </div>

        {/* Mouth */}
        <div className="absolute bottom-1/4 left-1/2 transform -translate-x-1/2">
          {expression === 'happy' ? (
            <div 
              className="w-4 h-2 border-2 border-gray-600 rounded-b-full"
              style={{ borderTop: 'none' }}
            />
          ) : (
            <div className="w-3 h-1 bg-gray-600 rounded-full" />
          )}
        </div>

        {/* Antenna */}
        <div 
          className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-1 h-4 rounded-full"
          style={{
            background: 'linear-gradient(180deg, #a0aec0, #e2e8f0)',
            boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)'
          }}
        >
          <motion.div 
            className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 rounded-full"
            style={{
              background: 'radial-gradient(circle, var(--neon-green), #059669)',
              boxShadow: '0 0 8px var(--neon-green)'
            }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
      </motion.div>

      {/* Robot Body */}
      <motion.div
        className={`${bodySize[size]} mx-auto mt-2 relative`}
        style={{
          background: 'linear-gradient(135deg, #e2e8f0 0%, #cbd5e0 50%, #a0aec0 100%)',
          borderRadius: '20px',
          boxShadow: `
            inset 0 -10px 20px rgba(0,0,0,0.1),
            inset 0 10px 20px rgba(255,255,255,0.3),
            0 5px 15px rgba(0,0,0,0.2)
          `
        }}
      >
        {/* Body Highlight */}
        <div 
          className="absolute top-1 left-1 w-1/3 h-1/2 rounded-lg opacity-60"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.8), transparent)'
          }}
        />
        
        {/* Chest Panel */}
        <div 
          className="absolute top-1/4 left-1/2 transform -translate-x-1/2 w-2/3 h-1/2 rounded-lg"
          style={{
            background: 'linear-gradient(135deg, #1a202c, #2d3748)',
            border: '1px solid #4a5568',
            boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3)'
          }}
        >
          {/* Status Light */}
          <motion.div 
            className="absolute top-1 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full"
            style={{
              background: isThinking ? 'var(--neon-purple)' : 'var(--neon-green)',
              boxShadow: isThinking ? '0 0 4px var(--neon-purple)' : '0 0 4px var(--neon-green)'
            }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
        </div>

        {/* Arms */}
        <div 
          className="absolute left-0 top-1/4 w-1 h-3/4 rounded-full transform -translate-x-1/2"
          style={{
            background: 'linear-gradient(180deg, #e2e8f0, #a0aec0)',
            boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.1)'
          }}
        />
        <div 
          className="absolute right-0 top-1/4 w-1 h-3/4 rounded-full transform translate-x-1/2"
          style={{
            background: 'linear-gradient(180deg, #e2e8f0, #a0aec0)',
            boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.1)'
          }}
        />
      </motion.div>

      {/* Glow Effect */}
      {isThinking && (
        <motion.div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(139, 92, 246, 0.2), transparent)',
            filter: 'blur(10px)'
          }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}
    </motion.div>
  );
}