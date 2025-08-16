import { motion } from "motion/react";
import { useState } from "react";

interface AnimatedHelpRobotProps {
  onClick: () => void;
}

export default function AnimatedHelpRobot({ onClick }: AnimatedHelpRobotProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="fixed bottom-6 right-6 z-50 cursor-pointer"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ 
        type: "spring", 
        stiffness: 200, 
        damping: 20,
        delay: 1 
      }}
      onClick={onClick}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      <div className="relative">
        {/* Main Robot Body */}
        <motion.div
          className="w-14 h-16 relative"
          animate={{
            y: [0, -4, 0],
            rotate: [0, 2, -2, 0]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          {/* Robot Body */}
          <div
            className="w-10 h-12 mx-auto bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl relative overflow-hidden shadow-2xl"
            style={{
              boxShadow: '0 0 20px rgba(59, 130, 246, 0.4), 0 4px 20px rgba(0, 0, 0, 0.3)'
            }}
          >
            {/* Glossy overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent rounded-xl" />
            
            {/* Head section (top of body) */}
            <div className="w-6 h-6 mx-auto mt-1 relative">
              {/* Question mark antenna */}
              <motion.div
                className="absolute -top-1 left-1/2 transform -translate-x-1/2 text-yellow-300 text-xs font-bold"
                animate={{
                  rotate: isHovered ? [0, 15, -15, 0] : [0, 5, -5, 0],
                  scale: [1, 1.2, 1]
                }}
                transition={{
                  duration: isHovered ? 1 : 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                ?
              </motion.div>

              {/* Eyes */}
              <div className="flex items-center justify-center gap-1 mt-2">
                <motion.div
                  className="w-1 h-1 bg-white rounded-full"
                  animate={isHovered ? {
                    scale: [1, 0.2, 1]
                  } : {
                    scale: [1, 1.3, 1]
                  }}
                  transition={{
                    duration: isHovered ? 0.3 : 2,
                    repeat: isHovered ? 3 : Infinity,
                    ease: "easeInOut"
                  }}
                />
                <motion.div
                  className="w-1 h-1 bg-white rounded-full"
                  animate={isHovered ? {
                    scale: [1, 0.2, 1]
                  } : {
                    scale: [1, 1.3, 1]
                  }}
                  transition={{
                    duration: isHovered ? 0.3 : 2,
                    repeat: isHovered ? 3 : Infinity,
                    ease: "easeInOut",
                    delay: isHovered ? 0.1 : 0
                  }}
                />
              </div>

              {/* Smile */}
              <motion.div
                className="w-2 h-1 bg-yellow-400 rounded-full mx-auto mt-0.5"
                animate={isHovered ? {
                  scale: [1, 1.5, 1],
                  width: ['8px', '12px', '8px']
                } : {
                  opacity: [0.8, 1, 0.8]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </div>

            {/* Body indicators */}
            <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex gap-0.5">
              <motion.div
                className="w-0.5 h-0.5 bg-green-400 rounded-full"
                animate={{
                  opacity: [0.5, 1, 0.5],
                  scale: [1, 1.5, 1]
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              <motion.div
                className="w-0.5 h-0.5 bg-yellow-400 rounded-full"
                animate={{
                  opacity: [0.5, 1, 0.5],
                  scale: [1, 1.5, 1]
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.3
                }}
              />
              <motion.div
                className="w-0.5 h-0.5 bg-red-400 rounded-full"
                animate={{
                  opacity: [0.5, 1, 0.5],
                  scale: [1, 1.5, 1]
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.6
                }}
              />
            </div>

            {/* Side arms */}
            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-0.5 h-3 bg-blue-400 rounded-full" />
            <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-0.5 h-3 bg-blue-400 rounded-full" />

            {/* Inner screen glow */}
            <motion.div
              className="absolute inset-1 rounded-lg bg-cyan-400/20 border border-cyan-400/30"
              animate={{
                opacity: [0.3, 0.6, 0.3],
                borderColor: ['rgba(34, 211, 238, 0.3)', 'rgba(34, 211, 238, 0.6)', 'rgba(34, 211, 238, 0.3)']
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </div>

          {/* Floating help symbols */}
          {Array.from({ length: 3 }, (_, i) => (
            <motion.div
              key={i}
              className="absolute text-xs"
              style={{
                left: `${50 + Math.cos(i * 120 * Math.PI / 180) * 20}%`,
                top: `${40 + Math.sin(i * 120 * Math.PI / 180) * 15}%`,
              }}
              animate={{
                y: [0, -8, 0],
                opacity: [0, 1, 0],
                scale: [0, 1, 0]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.4,
                ease: "easeOut"
              }}
            >
              {i === 0 ? '💡' : i === 1 ? '❓' : '✨'}
            </motion.div>
          ))}
        </motion.div>

        {/* Pulsing Attention Ring */}
        <motion.div
          className="absolute inset-0 rounded-xl border-2 border-blue-400/50 pointer-events-none"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.8, 0, 0.8]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        {/* Secondary pulse ring */}
        <motion.div
          className="absolute inset-0 rounded-xl border-2 border-blue-300/30 pointer-events-none"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.6, 0, 0.6]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5
          }}
        />

        {/* Help tooltip */}
        <motion.div
          className="absolute bottom-full right-0 mb-2 px-2 py-1 bg-white text-gray-800 rounded-lg shadow-lg text-xs font-medium whitespace-nowrap"
          initial={{ opacity: 0, y: 10, scale: 0.8 }}
          animate={{ 
            opacity: isHovered ? 1 : 0, 
            y: isHovered ? 0 : 10, 
            scale: isHovered ? 1 : 0.8 
          }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center gap-1">
            <span>Need help?</span>
            <motion.span
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 0.5, repeat: 2 }}
            >
              👋
            </motion.span>
          </div>
          
          {/* Tooltip arrow */}
          <div className="absolute top-full right-3 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white" />
        </motion.div>

        {/* Background glow */}
        <motion.div
          className="absolute inset-0 rounded-xl"
          style={{
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.3), transparent)',
            filter: 'blur(15px)',
            transform: 'scale(1.5)'
          }}
          animate={{
            scale: [1.5, 1.8, 1.5],
            opacity: [0.4, 0.7, 0.4]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>
    </motion.div>
  );
}