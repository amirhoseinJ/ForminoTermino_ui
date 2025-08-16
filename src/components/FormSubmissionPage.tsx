import { ArrowLeft, Scan, Upload, Link } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { motion } from "motion/react";
import Robot3DAvatar from "./Robot3DAvatar";
import AnimatedBackground from "./AnimatedBackground";
import { useState } from "react";

interface FormSubmissionPageProps {
  onNavigate: (page: string) => void;
}

export default function FormSubmissionPage({ onNavigate }: FormSubmissionPageProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
    
    // Trigger bounce animation and navigate after delay
    setTimeout(() => {
      console.log(`Selected option: ${option}`);
      onNavigate('form-chat');
    }, 600);
  };

  const iconOptions = [
    {
      id: 'scan',
      icon: Scan,
      title: 'Scan Document',
      description: 'Use your camera to scan physical forms and documents',
      color: 'neon-green'
    },
    {
      id: 'upload',
      icon: Upload,
      title: 'Upload PDF',
      description: 'Upload an existing PDF form from your device',
      color: 'neon-green'
    },
    {
      id: 'link',
      icon: Link,
      title: 'Paste Web Link',
      description: 'Provide a URL to an online form or document',
      color: 'neon-green'
    }
  ];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated Background */}
      <AnimatedBackground />

      {/* Header */}
      <div className="glass-card glass-glow-purple relative z-10 px-4 py-3 border-b border-glass-border">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNavigate('dashboard')}
            className="hover:bg-glass-bg hover:text-neon-purple"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-xl text-foreground">Formino - Form Assistant</h1>
        </div>
      </div>

      <div className="relative z-10 p-4 space-y-8">
        {/* AI Avatar and Welcome */}
        <motion.div
          className="text-center py-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <div className="flex justify-center mb-6">
            <Robot3DAvatar size="xl" />
          </div>
          <motion.h2
            className="text-3xl mb-4 bg-gradient-to-r from-neon-purple to-neon-green bg-clip-text text-transparent"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            How would you like to submit your form?
          </motion.h2>
          <motion.p
            className="text-muted-foreground text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.6 }}
          >
            Choose the method that works best for you
          </motion.p>
        </motion.div>

        {/* Options */}
        <div className="space-y-6 max-w-md mx-auto">
          {iconOptions.map((option, index) => {
            const IconComponent = option.icon;
            const isSelected = selectedOption === option.id;
            
            return (
              <motion.div
                key={option.id}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 + index * 0.2, duration: 0.6 }}
              >
                <Card 
                  className={`glass-card border-2 cursor-pointer transition-all duration-300 overflow-hidden group hover:scale-105 ${
                    isSelected 
                      ? 'glass-glow-green border-neon-green/50' 
                      : 'border-glass-border hover:border-neon-green/30 hover:glass-glow-green'
                  }`}
                  onClick={() => handleOptionSelect(option.id)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center gap-6">
                      {/* Icon Container */}
                      <motion.div
                        className={`p-6 rounded-2xl relative overflow-hidden ${
                          isSelected ? 'bounce-scale' : ''
                        }`}
                        style={{
                          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(16, 185, 129, 0.05))',
                          border: '2px solid rgba(16, 185, 129, 0.3)',
                          boxShadow: '0 0 20px rgba(16, 185, 129, 0.2)'
                        }}
                        whileHover={{ 
                          scale: 1.1,
                          boxShadow: '0 0 30px rgba(16, 185, 129, 0.4)'
                        }}
                        whileTap={{ scale: 0.95 }}
                        animate={isSelected ? { 
                          scale: [1, 1.2, 1],
                          rotate: [0, 10, -10, 0]
                        } : {}}
                        transition={{ duration: 0.6 }}
                      >
                        <IconComponent 
                          className="h-12 w-12 text-neon-green group-hover:drop-shadow-lg"
                          style={{ filter: 'drop-shadow(0 0 10px rgba(16, 185, 129, 0.5))' }}
                        />
                        
                        {/* Glow effect on hover */}
                        <motion.div
                          className="absolute inset-0 rounded-2xl pointer-events-none"
                          style={{
                            background: 'radial-gradient(circle, rgba(16, 185, 129, 0.2), transparent)',
                            filter: 'blur(10px)'
                          }}
                          initial={{ opacity: 0 }}
                          whileHover={{ opacity: 1 }}
                          transition={{ duration: 0.3 }}
                        />
                      </motion.div>
                      
                      {/* Text Content */}
                      <div className="flex-1">
                        <motion.h3
                          className="text-xl mb-2 text-foreground"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 1 + index * 0.2, duration: 0.4 }}
                        >
                          {option.title}
                        </motion.h3>
                        <motion.p
                          className="text-muted-foreground text-sm leading-relaxed"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 1.2 + index * 0.2, duration: 0.4 }}
                        >
                          {option.description}
                        </motion.p>
                      </div>
                    </div>

                    {/* Selection Indicator */}
                    {isSelected && (
                      <motion.div
                        className="absolute top-2 right-2 w-4 h-4 rounded-full bg-neon-green"
                        style={{ boxShadow: '0 0 10px rgba(16, 185, 129, 0.8)' }}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.3, type: "spring", stiffness: 300 }}
                      />
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Help Text */}
        <motion.div
          className="mt-12 max-w-md mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8, duration: 0.6 }}
        >
          <div className="glass-card p-6 text-center border border-glass-border">
            <p className="text-sm text-muted-foreground leading-relaxed">
              Our AI will help you fill out the form step by step, ensuring accuracy and completeness with intelligent assistance.
            </p>
          </div>
        </motion.div>

        {/* Floating particles for added ambiance */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {Array.from({ length: 8 }, (_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-neon-green/30 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -100, 0],
                opacity: [0, 1, 0],
                scale: [0, 1, 0]
              }}
              transition={{
                duration: 4 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 4,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}