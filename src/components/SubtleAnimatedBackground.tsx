import { motion } from "motion/react";

interface SubtleAnimatedBackgroundProps {
  variant?: 'primary' | 'secondary' | 'minimal';
  className?: string;
}

export default function SubtleAnimatedBackground({ 
  variant = 'primary',
  className = ""
}: SubtleAnimatedBackgroundProps) {

  const variants = {
    primary: {
      baseGradient: 'from-blue-900/20 via-purple-900/15 to-blue-900/20',
      shapes: [
        { color: 'rgba(59, 130, 246, 0.1)', size: 'w-32 h-32', position: 'top-20 left-10' },
        { color: 'rgba(139, 92, 246, 0.08)', size: 'w-40 h-40', position: 'bottom-20 right-10' },
        { color: 'rgba(16, 185, 129, 0.06)', size: 'w-24 h-24', position: 'top-1/2 left-1/4' },
        { color: 'rgba(59, 130, 246, 0.05)', size: 'w-36 h-36', position: 'bottom-1/3 left-1/3' },
        { color: 'rgba(139, 92, 246, 0.04)', size: 'w-28 h-28', position: 'top-1/4 right-1/4' },
      ],
      particles: 20
    },
    secondary: {
      baseGradient: 'from-purple-800/15 via-blue-800/10 to-purple-800/15',
      shapes: [
        { color: 'rgba(139, 92, 246, 0.08)', size: 'w-28 h-28', position: 'top-16 right-12' },
        { color: 'rgba(59, 130, 246, 0.06)', size: 'w-32 h-32', position: 'bottom-24 left-8' },
        { color: 'rgba(16, 185, 129, 0.04)', size: 'w-20 h-20', position: 'top-1/3 right-1/4' },
      ],
      particles: 15
    },
    minimal: {
      baseGradient: 'from-blue-900/10 via-purple-900/5 to-blue-900/10',
      shapes: [
        { color: 'rgba(59, 130, 246, 0.05)', size: 'w-24 h-24', position: 'top-1/4 left-1/4' },
        { color: 'rgba(139, 92, 246, 0.04)', size: 'w-20 h-20', position: 'bottom-1/4 right-1/4' },
      ],
      particles: 10
    }
  };

  const currentVariant = variants[variant];

  return (
    <div className={`fixed inset-0 pointer-events-none overflow-hidden ${className}`}>
      {/* Base Gradient Background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${currentVariant.baseGradient}`} />

      {/* Animated Gradient Overlays */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(circle at 20% 20%, rgba(59, 130, 246, 0.08), transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(139, 92, 246, 0.08), transparent 50%),
            radial-gradient(circle at 40% 80%, rgba(16, 185, 129, 0.06), transparent 50%)
          `
        }}
        animate={{
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Floating Geometric Shapes */}
      {currentVariant.shapes.map((shape, index) => (
        <motion.div
          key={`shape-${index}`}
          className={`absolute ${shape.size} ${shape.position} rounded-full blur-xl`}
          style={{ backgroundColor: shape.color }}
          animate={{
            y: [0, -30, 0],
            x: [0, 15, 0],
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.7, 0.3],
            rotate: [0, 180, 360]
          }}
          transition={{
            duration: 15 + index * 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: index * 2
          }}
        />
      ))}

      {/* Geometric Lines */}
      <svg className="absolute inset-0 w-full h-full opacity-30" style={{ mixBlendMode: 'screen' }}>
        <defs>
          <linearGradient id="line-gradient-1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(59, 130, 246, 0.2)" />
            <stop offset="50%" stopColor="rgba(139, 92, 246, 0.3)" />
            <stop offset="100%" stopColor="rgba(16, 185, 129, 0.2)" />
          </linearGradient>
          <linearGradient id="line-gradient-2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(139, 92, 246, 0.2)" />
            <stop offset="50%" stopColor="rgba(59, 130, 246, 0.3)" />
            <stop offset="100%" stopColor="rgba(16, 185, 129, 0.2)" />
          </linearGradient>
        </defs>
        
        <motion.path
          d="M0,400 Q300,200 600,350 T1200,300"
          stroke="url(#line-gradient-1)"
          strokeWidth="2"
          fill="none"
          opacity={0.4}
          animate={{
            d: [
              "M0,400 Q300,200 600,350 T1200,300",
              "M0,350 Q350,250 650,320 T1250,280",
              "M0,400 Q300,200 600,350 T1200,300"
            ]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        <motion.path
          d="M1200,100 Q900,300 600,200 T0,250"
          stroke="url(#line-gradient-2)"
          strokeWidth="2"
          fill="none"
          opacity={0.4}
          animate={{
            d: [
              "M1200,100 Q900,300 600,200 T0,250",
              "M1250,150 Q850,350 550,230 T50,280",
              "M1200,100 Q900,300 600,200 T0,250"
            ]
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 5
          }}
        />
      </svg>

      {/* Floating Particles */}
      {Array.from({ length: currentVariant.particles }, (_, i) => (
        <motion.div
          key={`particle-${i}`}
          className="absolute w-1 h-1 rounded-full"
          style={{
            backgroundColor: i % 3 === 0 ? 'rgba(59, 130, 246, 0.6)' : 
                           i % 3 === 1 ? 'rgba(139, 92, 246, 0.6)' : 'rgba(16, 185, 129, 0.6)',
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -100, 0],
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
            rotate: [0, 180, 360]
          }}
          transition={{
            duration: 8 + Math.random() * 6,
            repeat: Infinity,
            delay: Math.random() * 8,
            ease: "easeInOut"
          }}
        />
      ))}

      {/* Subtle Moving Hexagons */}
      {Array.from({ length: 6 }, (_, i) => (
        <motion.div
          key={`hexagon-${i}`}
          className="absolute"
          style={{
            left: `${20 + i * 15}%`,
            top: `${30 + (i % 2) * 40}%`,
          }}
          animate={{
            rotate: [0, 360],
            scale: [0.8, 1.2, 0.8],
            opacity: [0.1, 0.3, 0.1]
          }}
          transition={{
            duration: 20 + i * 2,
            repeat: Infinity,
            ease: "linear",
            delay: i * 3
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 2L21.5 7V17L12 22L2.5 17V7L12 2Z"
              stroke={i % 2 === 0 ? 'rgba(59, 130, 246, 0.3)' : 'rgba(139, 92, 246, 0.3)'}
              strokeWidth="1"
              fill="none"
            />
          </svg>
        </motion.div>
      ))}

      {/* Subtle Triangular Patterns */}
      {Array.from({ length: 8 }, (_, i) => (
        <motion.div
          key={`triangle-${i}`}
          className="absolute"
          style={{
            left: `${10 + i * 12}%`,
            top: `${20 + (i % 3) * 25}%`,
          }}
          animate={{
            rotate: [0, 120, 240, 360],
            scale: [0.5, 1, 0.5],
            opacity: [0.05, 0.2, 0.05]
          }}
          transition={{
            duration: 15 + i,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 2
          }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M8 2L14 12H2L8 2Z"
              stroke={i % 3 === 0 ? 'rgba(59, 130, 246, 0.4)' : 
                     i % 3 === 1 ? 'rgba(139, 92, 246, 0.4)' : 'rgba(16, 185, 129, 0.4)'}
              strokeWidth="1"
              fill="none"
            />
          </svg>
        </motion.div>
      ))}

      {/* Mesh Gradient Overlay */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(circle at 0% 0%, rgba(59, 130, 246, 0.02), transparent 50%),
            radial-gradient(circle at 100% 0%, rgba(139, 92, 246, 0.02), transparent 50%),
            radial-gradient(circle at 0% 100%, rgba(16, 185, 129, 0.02), transparent 50%),
            radial-gradient(circle at 100% 100%, rgba(59, 130, 246, 0.02), transparent 50%)
          `
        }}
        animate={{
          opacity: [0.3, 0.7, 0.3],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </div>
  );
}