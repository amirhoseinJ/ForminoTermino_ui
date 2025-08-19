import { motion } from 'motion/react';
import { FileText, Calendar } from 'lucide-react';

interface EnhancedServiceIconProps {
  type: 'formino' | 'termino';
  size?: 'small' | 'medium' | 'large';
  animated?: boolean;
  isHovered?: boolean;
}

export function EnhancedServiceIcon({ type, size = 'medium', animated = true, isHovered = false }: EnhancedServiceIconProps) {
  const sizes = {
    small: 'w-6 h-6',
    medium: 'w-8 h-8',
    large: 'w-12 h-12'
  };

  const containerSizes = {
    small: 'w-12 h-12',
    medium: 'w-16 h-16',
    large: 'w-20 h-20'
  };

  if (type === 'formino') {
    return (
      <motion.div
        className={`${containerSizes[size]} relative flex items-center justify-center`}
        animate={animated ? {
          scale: isHovered ? [1, 1.05, 1] : 1
        } : {}}
        transition={{ duration: 0.8 }}
      >
        {/* Outer Ring */}
        <motion.div
          className="absolute inset-0 rounded-2xl border-2 border-neon-purple/30"
          animate={animated ? {
            rotate: isHovered ? [0, 360] : 0,
            borderColor: isHovered 
              ? ['rgba(139, 92, 246, 0.3)', 'rgba(16, 185, 129, 0.5)', 'rgba(139, 92, 246, 0.3)']
              : 'rgba(139, 92, 246, 0.3)'
          } : {}}
          transition={{
            rotate: { duration: 2, ease: "linear" },
            borderColor: { duration: 1.5, repeat: Infinity }
          }}
        />
        
        {/* Inner Glow */}
        <motion.div
          className="absolute inset-1 rounded-xl bg-gradient-to-br from-neon-purple/20 to-neon-purple/5"
          animate={animated && isHovered ? {
            background: [
              'linear-gradient(to bottom right, rgba(139, 92, 246, 0.2), rgba(139, 92, 246, 0.05))',
              'linear-gradient(to bottom right, rgba(16, 185, 129, 0.2), rgba(16, 185, 129, 0.05))',
              'linear-gradient(to bottom right, rgba(139, 92, 246, 0.2), rgba(139, 92, 246, 0.05))'
            ]
          } : {}}
          transition={{ duration: 2, repeat: Infinity }}
        />
        
        {/* Document Icon */}
        <motion.div
          className="relative z-10"
          animate={animated ? {
            rotate: isHovered ? [0, 5, -5, 0] : 0
          } : {}}
          transition={{ duration: 0.8 }}
        >
          <FileText className={`${sizes[size]} text-neon-purple`} />
          
          {/* Scanning lines effect */}
          {animated && isHovered && (
            <motion.div
              className="absolute inset-0 overflow-hidden rounded"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="absolute w-full h-0.5 bg-gradient-to-r from-transparent via-neon-green to-transparent"
                  style={{ top: `${25 + i * 25}%` }}
                  animate={{
                    x: ['-100%', '100%'],
                    opacity: [0, 1, 0]
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
          )}
        </motion.div>
        
        {/* Floating Particles */}
        {animated && isHovered && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-neon-purple rounded-full"
                style={{
                  left: '50%',
                  top: '50%',
                  transform: `rotate(${i * 45}deg) translateY(-${size === 'large' ? 35 : 25}px)`
                }}
                animate={{
                  scale: [0, 1, 0],
                  opacity: [0, 0.8, 0]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.25,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>
        )}
      </motion.div>
    );
  }

  // Termino Icon
  return (
    <motion.div
      className={`${containerSizes[size]} relative flex items-center justify-center`}
      animate={animated ? {
        scale: isHovered ? [1, 1.05, 1] : 1
      } : {}}
      transition={{ duration: 0.8 }}
    >
      {/* Outer Ring */}
      <motion.div
        className="absolute inset-0 rounded-2xl border-2 border-neon-green/30"
        animate={animated ? {
          rotate: isHovered ? [360, 0] : 0,
          borderColor: isHovered 
            ? ['rgba(16, 185, 129, 0.3)', 'rgba(139, 92, 246, 0.5)', 'rgba(16, 185, 129, 0.3)']
            : 'rgba(16, 185, 129, 0.3)'
        } : {}}
        transition={{
          rotate: { duration: 2, ease: "linear" },
          borderColor: { duration: 1.5, repeat: Infinity }
        }}
      />
      
      {/* Clock Ticks */}
      {animated && isHovered && (
        <div className="absolute inset-0">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-0.5 h-2 bg-neon-green/50 rounded-full"
              style={{
                left: '50%',
                top: '10%',
                transformOrigin: '50% 150%',
                transform: `rotate(${i * 30}deg) translateX(-50%)`
              }}
              animate={{
                opacity: [0.3, 1, 0.3],
                scale: [1, 1.5, 1]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.1
              }}
            />
          ))}
        </div>
      )}
      
      {/* Inner Glow */}
      <motion.div
        className="absolute inset-1 rounded-xl bg-gradient-to-br from-neon-green/20 to-neon-green/5"
        animate={animated && isHovered ? {
          background: [
            'linear-gradient(to bottom right, rgba(16, 185, 129, 0.2), rgba(16, 185, 129, 0.05))',
            'linear-gradient(to bottom right, rgba(139, 92, 246, 0.2), rgba(139, 92, 246, 0.05))',
            'linear-gradient(to bottom right, rgba(16, 185, 129, 0.2), rgba(16, 185, 129, 0.05))'
          ]
        } : {}}
        transition={{ duration: 2, repeat: Infinity }}
      />
      
      {/* Calendar Icon */}
      <motion.div
        className="relative z-10"
        animate={animated ? {
          rotate: isHovered ? [0, -5, 5, 0] : 0
        } : {}}
        transition={{ duration: 0.8 }}
      >
        <Calendar className={`${sizes[size]} text-neon-green`} />
        
        {/* Calendar Grid Effect */}
        {animated && isHovered && (
          <motion.div
            className="absolute inset-0 overflow-hidden rounded"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {/* Grid lines */}
            <div className="absolute inset-1 grid grid-cols-3 grid-rows-3 gap-0.5">
              {[...Array(9)].map((_, i) => (
                <motion.div
                  key={i}
                  className="bg-neon-green/30 rounded-sm"
                  animate={{
                    opacity: [0, 0.6, 0],
                    scale: [0.8, 1, 0.8]
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.15,
                    ease: "easeInOut"
                  }}
                />
              ))}
            </div>
          </motion.div>
        )}
      </motion.div>
      
      {/* Orbit Dots */}
      {animated && isHovered && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1.5 h-1.5 bg-neon-green rounded-full"
              style={{
                left: '50%',
                top: '50%',
              }}
              animate={{
                x: [0, Math.cos(i * 60 * Math.PI / 180) * (size === 'large' ? 30 : 20)],
                y: [0, Math.sin(i * 60 * Math.PI / 180) * (size === 'large' ? 30 : 20)],
                scale: [0, 1, 0],
                opacity: [0, 0.8, 0]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.3,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
}