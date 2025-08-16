import { useState } from "react";
import { ArrowLeft, Mic, MicOff } from "lucide-react";
import { Button } from "./ui/button";
import { motion } from "motion/react";
import AIAvatar from "./AIAvatar";

interface AppointmentBookingPageProps {
  onNavigate: (page: string) => void;
}

export default function AppointmentBookingPage({ onNavigate }: AppointmentBookingPageProps) {
  const [isListening, setIsListening] = useState(false);
  const [hasSpoken, setHasSpoken] = useState(false);
  const [recognizedText, setRecognizedText] = useState('');

  const handleMicToggle = () => {
    setIsListening(!isListening);
    
    if (!isListening) {
      // Simulate voice recognition
      setTimeout(() => {
        setRecognizedText("I need to book a doctor's appointment for next week");
        setHasSpoken(true);
        setIsListening(false);
        
        // Auto-navigate to time slots after recognition
        setTimeout(() => {
          onNavigate('appointment-slots');
        }, 2000);
      }, 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-calm-blue to-background">
      {/* Header */}
      <div className="bg-card/80 backdrop-blur-sm border-b px-4 py-3">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNavigate('dashboard')}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-xl">Termino - Appointment Booker</h1>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] p-4 space-y-8">
        {/* AI Avatar */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
        >
          <AIAvatar size="xl" isThinking={isListening} />
        </motion.div>

        {/* Main Question */}
        <motion.div
          className="text-center space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-2xl px-4">
            What appointment can I help you book today?
          </h2>
          <p className="text-muted-foreground">
            Tap the microphone and tell me what you need
          </p>
        </motion.div>

        {/* Voice Recognition Text */}
        {(recognizedText || isListening) && (
          <motion.div
            className="bg-card border rounded-lg p-4 max-w-sm mx-auto"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
          >
            <p className="text-center text-sm">
              {isListening ? (
                <span className="text-muted-foreground">Listening...</span>
              ) : (
                <span>"{recognizedText}"</span>
              )}
            </p>
          </motion.div>
        )}

        {/* Microphone Button */}
        <motion.div
          className="relative"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, type: "spring", stiffness: 200, damping: 20 }}
        >
          <Button
            onClick={handleMicToggle}
            className={`w-24 h-24 rounded-full p-0 transition-all duration-300 ${
              isListening 
                ? 'bg-destructive hover:bg-destructive/90 pulse-glow' 
                : 'bg-soft-green hover:bg-soft-green/90 shadow-lg hover:shadow-xl'
            }`}
          >
            {isListening ? (
              <MicOff className="h-8 w-8 text-white" />
            ) : (
              <Mic className="h-8 w-8 text-white" />
            )}
          </Button>

          {/* Pulse rings when listening */}
          {isListening && (
            <>
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-destructive/30"
                animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-destructive/30"
                animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
              />
            </>
          )}
        </motion.div>

        {/* Status Text */}
        <motion.p
          className="text-sm text-muted-foreground text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          {isListening ? (
            "Tap again to stop listening"
          ) : hasSpoken ? (
            "Perfect! Let me find available appointments..."
          ) : (
            "Tap to start voice command"
          )}
        </motion.p>

        {/* Quick Options */}
        {!isListening && !hasSpoken && (
          <motion.div
            className="space-y-3 w-full max-w-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
          >
            <p className="text-center text-sm text-muted-foreground mb-4">
              Or choose a quick option:
            </p>
            <div className="grid grid-cols-1 gap-2">
              <Button 
                variant="outline" 
                className="h-auto py-3"
                onClick={() => {
                  setRecognizedText("Doctor's appointment");
                  setHasSpoken(true);
                  setTimeout(() => onNavigate('appointment-slots'), 1000);
                }}
              >
                Doctor's Appointment
              </Button>
              <Button 
                variant="outline" 
                className="h-auto py-3"
                onClick={() => {
                  setRecognizedText("Dentist appointment");
                  setHasSpoken(true);
                  setTimeout(() => onNavigate('appointment-slots'), 1000);
                }}
              >
                Dentist Appointment
              </Button>
              <Button 
                variant="outline" 
                className="h-auto py-3"
                onClick={() => {
                  setRecognizedText("Hair salon appointment");
                  setHasSpoken(true);
                  setTimeout(() => onNavigate('appointment-slots'), 1000);
                }}
              >
                Hair Salon
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}