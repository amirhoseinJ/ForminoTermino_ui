import { motion } from "motion/react";
import { useState } from "react";
import UnifiedGenieAvatar from "./UnifiedGenieAvatar";

interface CuteRobotHelpButtonProps {
  onClick: () => void;
}

export default function CuteRobotHelpButton({ onClick }: CuteRobotHelpButtonProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="fixed bottom-6 right-6 z-50"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ 
        type: "spring", 
        stiffness: 200, 
        damping: 20,
        delay: 1 
      }}
    >
      {/* Main Robot Button */}
      <motion.div
        className="relative cursor-pointer"
        onClick={onClick}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <div className="relative">
          <UnifiedGenieAvatar 
            size="md" 
            expression={isHovered ? "excited" : "happy"} 
            glowColor="blue" 
          />

          {/* Floating help symbols */}
          {Array.from({ length: 3 }, (_, i) => (
            <motion.div
              key={i}
              className="absolute text-xs"
              style={{
                left: `${50 + Math.cos(i * 120 * Math.PI / 180) * 30}%`,
                top: `${30 + Math.sin(i * 120 * Math.PI / 180) * 20}%`,
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
        </div>

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
      </motion.div>
    </motion.div>
  );
}