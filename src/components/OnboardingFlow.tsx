import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import GenieAvatar from "./GenieAvatar";
import SpeechBubble from "./SpeechBubble";

interface OnboardingFlowProps {
  onComplete: (userName: string) => void;
}

type Step = 'welcome' | 'continue' | 'input' | 'completion';

export default function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState<Step>('welcome');
  const [userName, setUserName] = useState('');
  const [showSpeechBubble, setShowSpeechBubble] = useState(false);
  const [avatarExpression, setAvatarExpression] = useState<'neutral' | 'happy' | 'thumbsUp' | 'pointing' | 'nodding'>('neutral');

  // Step 1: Welcome animation
  useEffect(() => {
    if (currentStep === 'welcome') {
      const timer = setTimeout(() => {
        setShowSpeechBubble(true);
        setAvatarExpression('happy');
      }, 800); // After pop animation
      return () => clearTimeout(timer);
    }
  }, [currentStep]);

  // Step 2: Continue button handler
  const handleContinue = () => {
    setAvatarExpression('thumbsUp');
    setShowSpeechBubble(false);
    
    setTimeout(() => {
      setCurrentStep('continue');
      setTimeout(() => {
        setCurrentStep('input');
        setAvatarExpression('pointing');
        setShowSpeechBubble(true);
      }, 1000); // After avatar moves to corner
    }, 500); // After thumbs up animation
  };

  // Step 3: Input handling
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserName(e.target.value);
    if (e.target.value.length > 0 && currentStep === 'input') {
      setCurrentStep('completion');
      setAvatarExpression('nodding');
      setShowSpeechBubble(false);
    }
  };

  // Step 4: Completion
  const handleFinish = () => {
    onComplete(userName);
  };

  const getCurrentSpeechText = () => {
    switch (currentStep) {
      case 'welcome':
        return "Welcome to Mein Genie! I'm Genie, your smart assistant.";
      case 'input':
        return "To get started, what should I call you?";
      default:
        return "";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-calm-blue to-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary/5 rounded-full blur-xl" />
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-soft-green/5 rounded-full blur-xl" />
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-warning/5 rounded-full blur-xl" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-sm mx-auto">
        {/* Avatar Container */}
        <div className="relative mb-8">
          {/* Center Avatar (Steps 1-2) */}
          <AnimatePresence>
            {(currentStep === 'welcome' || currentStep === 'continue') && (
              <motion.div
                className="flex justify-center relative"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{
                    scale: 0.3,
                    x: 280,
                    y: -200,
                    opacity: 0.8,
                    transition: { duration: 1, ease: 'easeInOut' }   // 👈 exit-specific timing
                }}

                transition={{
                    type: 'spring',
                    stiffness: 300,
                    damping: 20,
                    duration: 0.6
                }}
              >
                <div className="relative">
                  <GenieAvatar 
                    size="xl" 
                    expression={avatarExpression}
                    isAnimating={currentStep === 'welcome'}
                  />
                  <SpeechBubble
                    text={getCurrentSpeechText()}
                    isVisible={showSpeechBubble}
                    position="center"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Corner Avatar (Steps 3-4) */}
          <AnimatePresence>
            {(currentStep === 'input' || currentStep === 'completion') && (
              <motion.div
                className="absolute top-0 right-0 z-20"
                initial={{ scale: 0.3, x: 280, y: -200, opacity: 0.8 }}
                animate={{ scale: 1, x: 0, y: 0, opacity: 1 }}
                transition={{ 
                  type: "spring", 
                  stiffness: 200, 
                  damping: 20,
                  duration: 0.8 
                }}
              >
                <div className="relative">
                  <GenieAvatar 
                    size="md" 
                    expression={avatarExpression}
                    isAnimating={avatarExpression === 'nodding'}
                  />
                  <SpeechBubble
                    text={getCurrentSpeechText()}
                    isVisible={showSpeechBubble}
                    position="left"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Content Area */}
        <div className="space-y-6">
          {/* App Title */}
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <h1 className="text-3xl font-bold text-primary mb-2">Mein Genie</h1>
            <p className="text-muted-foreground">Your intelligent assistant</p>
          </motion.div>

          {/* Continue Button (Step 2) */}
          <AnimatePresence>
            {currentStep === 'welcome' && showSpeechBubble && (
              <motion.div
                className="flex justify-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: 1, duration: 0.4 }}
              >
                <Button
                  onClick={handleContinue}
                  className="bg-soft-green hover:bg-soft-green/90 text-lg px-8 py-3"
                >
                  Continue
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Name Input (Step 3) */}
          <AnimatePresence>
            {currentStep === 'input' && (
              <motion.div
                className="space-y-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                <div className="relative">
                  <motion.div
                    className="absolute inset-0 rounded-lg border-2 border-primary/30"
                    animate={{ 
                      boxShadow: [
                        '0 0 0 0 rgba(66, 153, 225, 0.4)',
                        '0 0 0 8px rgba(66, 153, 225, 0.1)',
                        '0 0 0 0 rgba(66, 153, 225, 0.4)'
                      ]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <Input
                    value={userName}
                    onChange={handleNameChange}
                    placeholder="Enter your name..."
                    className="text-center text-lg py-3 bg-card border-2 border-primary/20 focus:border-primary/50"
                    autoFocus
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Finish Button (Step 4) */}
          <AnimatePresence>
            {currentStep === 'completion' && userName.length > 0 && (
              <motion.div
                className="flex justify-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8, duration: 0.4 }}
              >
                <motion.div
                  animate={{ 
                    scale: [1, 1.05, 1],
                    boxShadow: [
                      '0 4px 20px rgba(72, 187, 120, 0.2)',
                      '0 8px 30px rgba(72, 187, 120, 0.4)',
                      '0 4px 20px rgba(72, 187, 120, 0.2)'
                    ]
                  }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <Button
                    onClick={handleFinish}
                    className="bg-soft-green hover:bg-soft-green/90 text-lg px-12 py-3"
                  >
                    Finish
                  </Button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Welcome back message */}
          <AnimatePresence>
            {currentStep === 'completion' && (
              <motion.div
                className="text-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 0.4 }}
              >
                <p className="text-muted-foreground">
                  Nice to meet you, <span className="text-primary font-medium">{userName}</span>!
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Progress indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.4 }}
      >
        {['welcome', 'continue', 'input', 'completion'].map((step, index) => (
          <motion.div
            key={step}
            className={`w-2 h-2 rounded-full transition-colors duration-300 ${
              ['welcome', 'continue', 'input', 'completion'].indexOf(currentStep) >= index
                ? 'bg-primary'
                : 'bg-primary/30'
            }`}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1 + index * 0.1, duration: 0.3 }}
          />
        ))}
      </motion.div>
    </div>
  );
}