import { motion } from "motion/react";

interface MeinGenieLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  animated?: boolean;
  showText?: boolean;
  className?: string;
}

export default function MeinGenieLogo({ 
  size = 'md', 
  animated = false, 
  showText = true,
  className = ""
}: MeinGenieLogoProps) {
  const sizes = {
    xs: { icon: 'w-6 h-6', text: 'text-sm', container: 'gap-2' },
    sm: { icon: 'w-8 h-8', text: 'text-base', container: 'gap-2' },
    md: { icon: 'w-10 h-10', text: 'text-lg', container: 'gap-3' },
    lg: { icon: 'w-12 h-12', text: 'text-xl', container: 'gap-3' },
    xl: { icon: 'w-16 h-16', text: 'text-2xl', container: 'gap-4' }
  };

  const currentSize = sizes[size];

  return (
    <div className={`flex items-center ${currentSize.container} ${className}`}>
      {/* Premium G Logo Icon */}
      <div className={`${currentSize.icon} relative flex items-center justify-center`}>
        <motion.svg
          className="w-full h-full"
          viewBox="0 0 100 100"
          fill="none"
          initial={animated ? { opacity: 0, scale: 0.8 } : {}}
          animate={animated ? { opacity: 1, scale: 1 } : {}}
          transition={animated ? { duration: 0.6, ease: "easeOut" } : {}}
        >
          <defs>
            {/* Premium gradient */}
            <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="50%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#a855f7" />
            </linearGradient>
            
            {/* Subtle glow filter */}
            <filter id="logoGlow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          {/* Main G Letter */}
          <path
            d="M50 15 C72 15 85 28 85 50 C85 72 72 85 50 85 L35 85 L35 70 L50 70 C63 70 70 63 70 50 C70 37 63 30 50 30 C37 30 30 37 30 50 L30 65 L45 65 L45 55 L55 55 L55 75 L15 75 L15 50 C15 28 28 15 50 15 Z"
            fill="url(#logoGradient)"
            filter="url(#logoGlow)"
            strokeWidth="1"
            stroke="rgba(139, 92, 246, 0.3)"
          />
          
          {/* Intelligence Spark/Tick */}
          <motion.g
            initial={animated ? { opacity: 0, scale: 0 } : {}}
            animate={animated ? { opacity: 1, scale: 1 } : {}}
            transition={animated ? { delay: 0.3, duration: 0.4 } : {}}
          >
            {/* Spark rays */}
            <path
              d="M72 25 L76 21 M72 29 L76 33 M68 25 L64 21 M68 29 L64 33"
              stroke="url(#logoGradient)"
              strokeWidth="2"
              strokeLinecap="round"
            />
            
            {/* Central tick/check */}
            <motion.path
              d="M70 24 L72 26 L76 22"
              stroke="#10b981"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
              initial={animated ? { pathLength: 0 } : {}}
              animate={animated ? { pathLength: 1 } : {}}
              transition={animated ? { delay: 0.6, duration: 0.5 } : {}}
            />
          </motion.g>
          
          {/* Subtle perfection dots */}
          <circle cx="25" cy="40" r="1.5" fill="#10b981" opacity="0.6" />
          <circle cx="75" cy="60" r="1" fill="#8b5cf6" opacity="0.4" />
        </motion.svg>
      </div>

      {/* Logo Text */}
      {showText && (
        <div className="flex flex-col">
          <motion.h1
            className={`${currentSize.text} font-semibold bg-gradient-to-r from-indigo-500 via-purple-600 to-purple-700 bg-clip-text text-transparent leading-tight`}
            initial={animated ? { opacity: 0, x: -10 } : {}}
            animate={animated ? { opacity: 1, x: 0 } : {}}
            transition={animated ? { delay: 0.2, duration: 0.5 } : {}}
          >
            Mein Genie
          </motion.h1>
          {size !== 'xs' && size !== 'sm' && (
            <motion.p
              className="text-xs text-muted-foreground font-medium"
              initial={animated ? { opacity: 0 } : {}}
              animate={animated ? { opacity: 1 } : {}}
              transition={animated ? { delay: 0.4, duration: 0.4 } : {}}
            >
              AI Assistant
            </motion.p>
          )}
        </div>
      )}
    </div>
  );
}