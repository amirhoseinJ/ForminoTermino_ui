import { motion } from "motion/react";
import { HelpCircle, Sparkles } from "lucide-react";
import { Button } from "./ui/button";

interface AnimatedHelpButtonProps {
  onClick: () => void;
}

export default function AnimatedHelpButton({ onClick }: AnimatedHelpButtonProps) {
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
      {/* Help Button */}
      <motion.div
        className="relative"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Button
          onClick={onClick}
          className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-2xl relative overflow-hidden group"
          style={{
            boxShadow: '0 0 20px rgba(59, 130, 246, 0.4), 0 8px 32px rgba(0, 0, 0, 0.3)'
          }}
        >
          {/* Main icon */}
          <motion.div
            animate={{
              rotate: [0, 360],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            <HelpCircle className="h-7 w-7 text-white relative z-10" />
          </motion.div>
          
          {/* Glossy overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent rounded-full" />
          
          {/* Sparkle effect */}
          <motion.div
            className="absolute top-2 right-2"
            animate={{
              scale: [0, 1, 0],
              rotate: [0, 180, 360],
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: 0.5
            }}
          >
            <Sparkles className="h-3 w-3 text-white/80" />
          </motion.div>
          
          {/* Inner glow pulse */}
          <motion.div
            className="absolute inset-2 rounded-full bg-white/20"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </Button>

        {/* Outer glow rings */}
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-blue-400/30"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.6, 0, 0.6]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-blue-400/20"
          animate={{
            scale: [1, 1.8, 1],
            opacity: [0.4, 0, 0.4]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.3
          }}
        />

        {/* Floating help indicators */}
        {Array.from({ length: 3 }, (_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-blue-400 rounded-full"
            style={{
              left: `${30 + Math.cos(i * 120 * Math.PI / 180) * 25}px`,
              top: `${30 + Math.sin(i * 120 * Math.PI / 180) * 25}px`,
            }}
            animate={{
              scale: [0, 1, 0],
              opacity: [0, 1, 0],
              y: [0, -10, 0]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.3,
              ease: "easeOut"
            }}
          />
        ))}
      </motion.div>

      {/* Tooltip */}
      <motion.div
        className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-background/90 backdrop-blur-sm rounded-lg border border-glass-border text-xs font-medium text-foreground whitespace-nowrap"
        initial={{ opacity: 0, y: 10, scale: 0.8 }}
        whileHover={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.2 }}
      >
        Need help? Tap here!
        <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-background/90" />
      </motion.div>
    </motion.div>
  );
}