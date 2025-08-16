import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, ChevronLeft, ChevronRight, Camera, Upload, Link, Mic, Calendar, MessageSquare, CheckCircle, Play } from "lucide-react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "./ui/dialog";
import UnifiedGenieAvatar from "./UnifiedGenieAvatar";

interface HelpTutorialProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function HelpTutorial({ isOpen, onClose }: HelpTutorialProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const tutorialSteps = [
    {
      id: 'welcome',
      title: 'Welcome to Mein Genie!',
      subtitle: 'Your AI-powered personal assistant',
      description: "I'm your friendly AI companion ready to help with documents, forms, and appointments. Let me show you everything I can do!",
      illustration: 'welcome',
      category: 'intro'
    },
    {
      id: 'overview',
      title: 'Two Powerful Features',
      subtitle: 'Formino & Termino at your service',
      description: "I offer two main services: Formino for handling documents and forms, and Termino for managing appointments. Both are designed to make your life easier!",
      illustration: 'overview',
      category: 'intro'
    },
    {
      id: 'formino-intro',
      title: 'Meet Formino',
      subtitle: 'Your intelligent document assistant',
      description: "Formino is your go-to helper for any document, form, or application. I can scan, read, and help you complete paperwork with AI-powered assistance.",
      illustration: 'formino',
      category: 'formino'
    },
    {
      id: 'formino-scan',
      title: 'Scan Any Document',
      subtitle: 'Just point and capture',
      description: "Take a photo of any form, application, or document. I'll analyze it instantly and identify all the fields that need to be filled out.",
      illustration: 'scan',
      category: 'formino'
    },
    {
      id: 'formino-upload',
      title: 'Upload Digital Files',
      subtitle: 'PDFs, images, and more',
      description: "Already have digital documents? Upload PDFs, images, or any file type. I'll extract the text and help you complete them step by step.",
      illustration: 'upload',
      category: 'formino'
    },
    {
      id: 'formino-link',
      title: 'Handle Web Forms',
      subtitle: 'Share any online form link',
      description: "Found an online application or web form? Just paste the link and I'll guide you through completing it with all the right information.",
      illustration: 'link',
      category: 'formino'
    },
    {
      id: 'formino-chat',
      title: 'Smart Conversations',
      subtitle: 'I ask, you answer, we complete',
      description: "I'll ask you questions one by one for each field in your form. If it's new information, I can save it to your profile for future use - making everything faster next time!",
      illustration: 'chat',
      category: 'formino'
    },
    {
      id: 'termino-intro',
      title: 'Meet Termino',
      subtitle: 'Your appointment booking specialist',
      description: "Termino handles all your appointment scheduling needs - from doctors and dentists to government offices and business meetings. Just tell me what you need!",
      illustration: 'termino',
      category: 'termino'
    },
    {
      id: 'termino-options',
      title: 'Three Ways to Book',
      subtitle: 'Choose your preferred method',
      description: "I offer three convenient ways: let me book for you using AI, help you book it yourself with guidance, or manage appointments you've already scheduled.",
      illustration: 'options',
      category: 'termino'
    },
    {
      id: 'termino-voice',
      title: 'Voice-Powered Booking',
      subtitle: 'Just speak your needs',
      description: 'Press the microphone and say something like "I need a dentist appointment next Tuesday" or "Book me a meeting with Dr. Smith." I\'ll handle the rest!',
      illustration: 'voice',
      category: 'termino'
    },
    {
      id: 'termino-calendar',
      title: 'Smart Calendar Management',
      subtitle: 'All your appointments in one place',
      description: "View, edit, and share your appointments. I sync with Google Calendar and can send details via WhatsApp or Telegram. Never miss an appointment again!",
      illustration: 'calendar',
      category: 'termino'
    },
    {
      id: 'complete',
      title: 'Ready to Get Started?',
      subtitle: 'Your AI assistant is here to help!',
      description: "You're now ready to use both Formino and Termino! Remember, I'm always learning and improving to serve you better. Let's make your daily tasks effortless!",
      illustration: 'complete',
      category: 'outro'
    }
  ];

  const currentTutorial = tutorialSteps[currentStep];

  const nextStep = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'formino': return 'from-neon-purple to-purple-600';
      case 'termino': return 'from-neon-green to-green-600';
      default: return 'from-blue-500 to-blue-600';
    }
  };

  const renderIllustration = (type: string) => {
    switch (type) {
      case 'welcome':
        return (
          <motion.div
            className="flex flex-col items-center mb-6"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
          >
            <div className="relative mb-4">
              <UnifiedGenieAvatar size="xl" expression="excited" glowColor="purple" />
              
              {/* Welcome sparkles */}
              {Array.from({ length: 6 }, (_, i) => (
                <motion.div
                  key={i}
                  className="absolute text-lg"
                  style={{
                    left: `${50 + Math.cos(i * 60 * Math.PI / 180) * 50}%`,
                    top: `${50 + Math.sin(i * 60 * Math.PI / 180) * 50}%`,
                  }}
                  animate={{
                    scale: [0, 1, 0],
                    opacity: [0, 1, 0],
                    rotate: [0, 360]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.3
                  }}
                >
                  {i % 3 === 0 ? '✨' : i % 3 === 1 ? '⭐' : '💫'}
                </motion.div>
              ))}
            </div>
            <motion.div
              className="text-center bg-gradient-to-r from-neon-purple to-neon-green bg-clip-text text-transparent"
              animate={{ 
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <p className="text-sm font-semibold">Welcome to the future!</p>
            </motion.div>
          </motion.div>
        );

      case 'overview':
        return (
          <motion.div
            className="flex items-center justify-center gap-4 mb-6"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            {/* Formino */}
            <motion.div
              className="flex flex-col items-center"
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-12 h-12 bg-gradient-to-r from-neon-purple to-purple-600 rounded-xl flex items-center justify-center mb-2 shadow-lg">
                <MessageSquare className="h-6 w-6 text-white" />
              </div>
              <p className="text-xs font-semibold text-neon-purple">Formino</p>
            </motion.div>

            {/* Connection */}
            <motion.div
              className="flex items-center"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div className="w-8 h-0.5 bg-gradient-to-r from-neon-purple to-neon-green rounded-full" />
              <UnifiedGenieAvatar size="sm" expression="happy" glowColor="blue" className="mx-2" />
              <div className="w-8 h-0.5 bg-gradient-to-r from-neon-green to-green-600 rounded-full" />
            </motion.div>

            {/* Termino */}
            <motion.div
              className="flex flex-col items-center"
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-12 h-12 bg-gradient-to-r from-neon-green to-green-600 rounded-xl flex items-center justify-center mb-2 shadow-lg">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <p className="text-xs font-semibold text-neon-green">Termino</p>
            </motion.div>
          </motion.div>
        );

      case 'formino':
        return (
          <motion.div
            className="flex flex-col items-center mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="relative mb-4">
              <UnifiedGenieAvatar size="lg" expression="focused" glowColor="purple" />
              <motion.div
                className="absolute -top-2 -right-2 w-10 h-10 bg-gradient-to-r from-neon-purple to-purple-600 rounded-full flex items-center justify-center shadow-lg"
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              >
                <MessageSquare className="h-5 w-5 text-white" />
              </motion.div>
            </div>
            
            {/* Sample document */}
            <motion.div
              className="w-16 h-20 bg-white rounded-lg shadow-lg border-2 border-gray-200 flex flex-col items-center justify-center mb-2 relative overflow-hidden"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4 }}
            >
              <div className="w-12 h-1 bg-gray-300 rounded mb-1" />
              <div className="w-10 h-1 bg-gray-300 rounded mb-1" />
              <div className="w-8 h-1 bg-gray-300 rounded mb-1" />
              <div className="w-12 h-1 bg-neon-purple/30 rounded" />
              
              {/* Scan line effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-b from-transparent via-neon-purple/30 to-transparent h-1"
                animate={{ y: [0, 80, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.div>
            <p className="text-xs text-center text-muted-foreground">
              Form & Document Processing
            </p>
          </motion.div>
        );

      case 'scan':
        return (
          <motion.div
            className="flex flex-col items-center mb-6"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <motion.div
              className="relative w-20 h-20 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-4 shadow-2xl overflow-hidden"
              whileHover={{ scale: 1.05 }}
              style={{ boxShadow: '0 0 20px rgba(59, 130, 246, 0.4)' }}
            >
              <Camera className="h-10 w-10 text-white relative z-10" />
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl" />
              
              {/* Camera flash effect */}
              <motion.div
                className="absolute inset-0 bg-white rounded-2xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.8, 0] }}
                transition={{ duration: 0.3, repeat: Infinity, repeatDelay: 2 }}
              />
              
              {/* Viewfinder corners */}
              <div className="absolute top-2 left-2 w-2 h-2 border-t-2 border-l-2 border-white/60" />
              <div className="absolute top-2 right-2 w-2 h-2 border-t-2 border-r-2 border-white/60" />
              <div className="absolute bottom-2 left-2 w-2 h-2 border-b-2 border-l-2 border-white/60" />
              <div className="absolute bottom-2 right-2 w-2 h-2 border-b-2 border-r-2 border-white/60" />
            </motion.div>
            
            <motion.div
              className="flex items-center gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <Camera className="h-4 w-4 text-blue-500" />
              <span className="text-xs text-muted-foreground">Point & Capture</span>
            </motion.div>
          </motion.div>
        );

      case 'upload':
        return (
          <motion.div
            className="flex flex-col items-center mb-6"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <motion.div
              className="relative w-20 h-20 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4 shadow-2xl"
              whileHover={{ scale: 1.05 }}
              style={{ boxShadow: '0 0 20px rgba(139, 92, 246, 0.4)' }}
            >
              <Upload className="h-10 w-10 text-white" />
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl" />
              
              {/* Upload progress indicators */}
              {Array.from({ length: 4 }, (_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-white rounded-full"
                  style={{
                    left: `${25 + i * 12}%`,
                    bottom: '20%'
                  }}
                  animate={{
                    y: [0, -25, 0],
                    opacity: [0, 1, 0],
                    scale: [0.5, 1, 0.5]
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.2
                  }}
                />
              ))}
            </motion.div>
            
            <div className="flex flex-wrap justify-center gap-1 mb-2">
              {['PDF', 'IMG', 'DOC'].map((type, i) => (
                <motion.span
                  key={type}
                  className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded-full"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                >
                  {type}
                </motion.span>
              ))}
            </div>
          </motion.div>
        );

      case 'link':
        return (
          <motion.div
            className="flex flex-col items-center mb-6"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <motion.div
              className="relative w-20 h-20 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-4 shadow-2xl"
              whileHover={{ scale: 1.05 }}
              style={{ boxShadow: '0 0 20px rgba(16, 185, 129, 0.4)' }}
            >
              <Link className="h-10 w-10 text-white" />
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl" />
              
              {/* Link chain animation */}
              <motion.div
                className="absolute inset-3 border-2 border-white/40 rounded-lg"
                animate={{
                  borderColor: ['rgba(255,255,255,0.4)', 'rgba(255,255,255,0.8)', 'rgba(255,255,255,0.4)']
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.div>
            
            <motion.div
              className="flex items-center gap-1 px-2 py-1 bg-white/10 rounded-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <div className="w-1 h-1 bg-green-400 rounded-full" />
              <span className="text-xs text-muted-foreground">https://example.com</span>
            </motion.div>
          </motion.div>
        );

      case 'chat':
        return (
          <motion.div
            className="flex flex-col items-center mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {/* Chat conversation */}
            <div className="w-full max-w-xs space-y-2 mb-4">
              <div className="flex items-start gap-2">
                <UnifiedGenieAvatar size="xs" expression="happy" glowColor="purple" />
                <motion.div
                  className="glass-card border border-glass-border px-3 py-2 rounded-2xl flex-1"
                  initial={{ scale: 0, originX: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.4, type: "spring" }}
                >
                  <p className="text-xs">What's your full name?</p>
                </motion.div>
              </div>
              
              <motion.div
                className="flex justify-end"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 }}
              >
                <motion.div
                  className="bg-neon-purple text-white px-3 py-2 rounded-2xl max-w-[70%]"
                  initial={{ scale: 0, originX: 1 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1, type: "spring" }}
                >
                  <p className="text-xs">John Smith</p>
                </motion.div>
              </motion.div>

              <div className="flex items-start gap-2">
                <UnifiedGenieAvatar size="xs" expression="thinking" glowColor="blue" />
                <motion.div
                  className="glass-card border border-glass-border px-3 py-2 rounded-2xl flex-1"
                  initial={{ scale: 0, originX: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1.4, type: "spring" }}
                >
                  <p className="text-xs">Save to profile? ✓</p>
                </motion.div>
              </div>
            </div>
          </motion.div>
        );

      case 'termino':
        return (
          <motion.div
            className="flex flex-col items-center mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="relative mb-4">
              <UnifiedGenieAvatar size="lg" expression="focused" glowColor="green" />
              <motion.div
                className="absolute -top-2 -right-2 w-10 h-10 bg-gradient-to-r from-neon-green to-green-600 rounded-full flex items-center justify-center shadow-lg"
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              >
                <Calendar className="h-5 w-5 text-white" />
              </motion.div>
            </div>
            
            {/* Appointment types */}
            <div className="flex gap-2 mb-2">
              {[
                { icon: '🏥', label: 'Doctor' },
                { icon: '🏛️', label: 'Office' },
                { icon: '💼', label: 'Business' }
              ].map((type, i) => (
                <motion.div
                  key={type.label}
                  className="flex flex-col items-center p-2 glass-card rounded-lg"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                >
                  <span className="text-lg mb-1">{type.icon}</span>
                  <span className="text-xs text-muted-foreground">{type.label}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        );

      case 'options':
        return (
          <motion.div
            className="flex flex-col items-center mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="space-y-3 w-full max-w-xs">
              {[
                { icon: '🤖', text: 'AI Books for Me', color: 'from-blue-500 to-blue-600' },
                { icon: '👤', text: 'I Book Myself', color: 'from-green-500 to-green-600' },
                { icon: '📝', text: 'Already Booked', color: 'from-purple-500 to-purple-600' }
              ].map((option, i) => (
                <motion.div
                  key={i}
                  className={`flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r ${option.color} text-white shadow-lg`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.2 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <span className="text-lg">{option.icon}</span>
                  <span className="text-sm font-medium">{option.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        );

      case 'voice':
        return (
          <motion.div
            className="flex flex-col items-center mb-6"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <motion.div
              className="relative w-20 h-20 bg-gradient-to-r from-neon-green to-green-600 rounded-full flex items-center justify-center mb-4 shadow-2xl"
              whileHover={{ scale: 1.05 }}
              style={{ boxShadow: '0 0 20px rgba(16, 185, 129, 0.4)' }}
            >
              <Mic className="h-10 w-10 text-white" />
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-full" />
              
              {/* Sound waves */}
              {Array.from({ length: 3 }, (_, i) => (
                <motion.div
                  key={i}
                  className="absolute border-2 border-white/40 rounded-full"
                  style={{
                    width: `${80 + i * 20}%`,
                    height: `${80 + i * 20}%`,
                    left: `${10 - i * 10}%`,
                    top: `${10 - i * 10}%`
                  }}
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.6, 0, 0.6]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.3
                  }}
                />
              ))}
            </motion.div>
            
            <motion.div
              className="flex items-center gap-2 px-3 py-2 glass-card rounded-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <Play className="h-3 w-3 text-green-500" />
              <span className="text-xs text-muted-foreground">"I need a dentist appointment"</span>
            </motion.div>
          </motion.div>
        );

      case 'calendar':
        return (
          <motion.div
            className="flex flex-col items-center mb-6"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <motion.div
              className="relative w-20 h-20 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-4 shadow-2xl"
              whileHover={{ scale: 1.05 }}
              style={{ boxShadow: '0 0 20px rgba(59, 130, 246, 0.4)' }}
            >
              <Calendar className="h-10 w-10 text-white" />
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl" />
              
              {/* Calendar grid simulation */}
              <div className="absolute inset-3 grid grid-cols-3 gap-0.5">
                {Array.from({ length: 9 }, (_, i) => (
                  <motion.div
                    key={i}
                    className={`rounded-sm ${i === 4 ? 'bg-green-400' : 'bg-white/20'}`}
                    animate={{
                      opacity: i === 4 ? [0.8, 1, 0.8] : [0.2, 0.6, 0.2]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.1
                    }}
                  />
                ))}
              </div>
            </motion.div>
            
            {/* Social sharing buttons */}
            <div className="flex gap-2">
              {[
                { name: 'WhatsApp', color: 'bg-green-500' },
                { name: 'Telegram', color: 'bg-blue-500' },
                { name: 'Google', color: 'bg-red-500' }
              ].map((app, i) => (
                <motion.div
                  key={app.name}
                  className={`w-6 h-6 ${app.color} rounded-full flex items-center justify-center`}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 + i * 0.1 }}
                >
                  <span className="text-white text-xs">{app.name[0]}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        );

      case 'complete':
        return (
          <motion.div
            className="flex flex-col items-center mb-6"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <motion.div
              className="relative w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mb-4 shadow-2xl"
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 360]
              }}
              transition={{
                scale: { duration: 2, repeat: Infinity },
                rotate: { duration: 8, repeat: Infinity, ease: "linear" }
              }}
              style={{ boxShadow: '0 0 30px rgba(16, 185, 129, 0.5)' }}
            >
              <CheckCircle className="h-10 w-10 text-white" />
              <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent rounded-full" />
              
              {/* Success celebration particles */}
              {Array.from({ length: 8 }, (_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-yellow-300 rounded-full"
                  style={{
                    left: `${50 + Math.cos(i * 45 * Math.PI / 180) * 35}%`,
                    top: `${50 + Math.sin(i * 45 * Math.PI / 180) * 35}%`,
                  }}
                  animate={{
                    scale: [0, 1.5, 0],
                    opacity: [0, 1, 0],
                    rotate: [0, 360]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.15
                  }}
                />
              ))}
            </motion.div>
            
            <div className="flex items-center gap-4 mb-2">
              <UnifiedGenieAvatar size="sm" expression="success" glowColor="green" />
              <motion.div
                className="flex items-center gap-1"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <span className="text-xs text-green-500 font-semibold">Ready to serve!</span>
                <CheckCircle className="h-3 w-3 text-green-500" />
              </motion.div>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-card border-glass-border max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        <DialogTitle className="sr-only">
          {currentTutorial.title} - Tutorial Step {currentStep + 1} of {tutorialSteps.length}
        </DialogTitle>
        <DialogDescription className="sr-only">
          {currentTutorial.description}
        </DialogDescription>
        
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="relative"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6 sticky top-0 glass-card z-10 p-2 -m-2 rounded-lg">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm text-foreground font-medium">Tutorial</span>
              <span className={`px-2 py-0.5 text-xs rounded-full bg-gradient-to-r ${getCategoryColor(currentTutorial.category)} text-white`}>
                {currentTutorial.category}
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="w-8 h-8 p-0 hover:bg-red-500/10 hover:text-red-500"
              aria-label="Close tutorial"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Progress Indicator */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground">
                Step {currentStep + 1} of {tutorialSteps.length}
              </span>
              <span className="text-xs text-muted-foreground font-medium">
                {Math.round(((currentStep + 1) / tutorialSteps.length) * 100)}%
              </span>
            </div>
            <div className="w-full bg-glass-bg rounded-full h-1.5 overflow-hidden">
              <motion.div
                className={`h-full bg-gradient-to-r ${getCategoryColor(currentTutorial.category)} rounded-full`}
                initial={{ width: 0 }}
                animate={{ width: `${((currentStep + 1) / tutorialSteps.length) * 100}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>
          </div>

          {/* Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="text-center"
            >
              {/* Illustration */}
              <div className="min-h-[120px] flex items-center justify-center">
                {renderIllustration(currentTutorial.illustration)}
              </div>

              {/* Title & Subtitle */}
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-foreground mb-1">
                  {currentTutorial.title}
                </h2>
                <p className={`text-sm mb-3 bg-gradient-to-r ${getCategoryColor(currentTutorial.category)} bg-clip-text text-transparent font-medium`}>
                  {currentTutorial.subtitle}
                </p>
              </div>

              {/* Description */}
              <p className="text-sm text-muted-foreground leading-relaxed mb-6 px-2">
                {currentTutorial.description}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-between sticky bottom-0 glass-card p-2 -m-2 rounded-lg">
            <Button
              variant="outline"
              size="sm"
              onClick={prevStep}
              disabled={currentStep === 0}
              className="border-glass-border hover:bg-glass-bg"
              aria-label="Previous step"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>

            {/* Dot indicators */}
            <div className="flex gap-1" role="tablist" aria-label="Tutorial steps">
              {tutorialSteps.map((_, index) => (
                <motion.button
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentStep ? 'bg-neon-purple' : 'bg-glass-bg hover:bg-glass-border'
                  }`}
                  onClick={() => setCurrentStep(index)}
                  animate={index === currentStep ? { scale: [1, 1.3, 1] } : {}}
                  transition={{ duration: 0.3 }}
                  role="tab"
                  aria-selected={index === currentStep}
                  aria-label={`Go to step ${index + 1}: ${tutorialSteps[index].title}`}
                />
              ))}
            </div>

            {currentStep === tutorialSteps.length - 1 ? (
              <Button
                size="sm"
                onClick={onClose}
                className="bg-gradient-to-r from-neon-green to-green-600 hover:from-neon-green/90 hover:to-green-600/90 shadow-lg"
                aria-label="Get started with Mein Genie"
              >
                Get Started
                <CheckCircle className="h-4 w-4 ml-1" />
              </Button>
            ) : (
              <Button
                size="sm"
                onClick={nextStep}
                className={`bg-gradient-to-r ${getCategoryColor(currentTutorial.category)} hover:opacity-90 shadow-lg`}
                aria-label="Next step"
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            )}
          </div>

          {/* Decorative elements */}
          <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${getCategoryColor(currentTutorial.category)} opacity-60 rounded-t-lg`} />
          
          {/* Floating particles */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-lg">
            {Array.from({ length: 3 }, (_, i) => (
              <motion.div
                key={i}
                className={`absolute w-1 h-1 rounded-full ${
                  currentTutorial.category === 'formino' ? 'bg-neon-purple/40' : 
                  currentTutorial.category === 'termino' ? 'bg-neon-green/40' : 'bg-blue-500/40'
                }`}
                style={{
                  left: `${20 + Math.random() * 60}%`,
                  top: `${20 + Math.random() * 60}%`,
                }}
                animate={{
                  y: [0, -15, 0],
                  opacity: [0, 0.8, 0],
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
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}