import { motion, AnimatePresence } from "motion/react";

interface SpeechBubbleProps {
  text: string;
  isVisible: boolean;
  position?: 'left' | 'right' | 'center';
  className?: string;
}

export default function SpeechBubble({ 
  text, 
  isVisible, 
  position = 'right',
  className = '' 
}: SpeechBubbleProps) {
  const positionClasses = {
    left: 'left-0',
    right: 'right-0',
    center: 'left-1/2 transform -translate-x-1/2'
  };

  const tailClasses = {
    left: 'left-4 border-r-card border-r-8 border-t-transparent border-b-transparent border-l-0',
    right: 'right-4 border-l-card border-l-8 border-t-transparent border-b-transparent border-r-0',
    center: 'left-1/2 transform -translate-x-1/2 border-l-card border-l-8 border-t-transparent border-b-transparent border-r-0'
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className={`absolute -top-16 ${positionClasses[position]} z-20 ${className}`}
          initial={{ opacity: 0, scale: 0.8, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 10 }}
          transition={{ 
            type: "spring", 
            stiffness: 200, 
            damping: 20,
            duration: 0.4 
          }}
        >
          {/* Speech Bubble */}
          <div className="bg-card border border-border rounded-lg p-3 shadow-lg max-w-xs">
            <p className="text-sm text-card-foreground">{text}</p>
          </div>
          
          {/* Tail */}
          <div 
            className={`absolute top-full ${tailClasses[position]} w-0 h-0 border-t-4 border-b-4`}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}