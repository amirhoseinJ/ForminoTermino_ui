import { MessageSquare, Calendar, Bell, User, Settings, Sparkles } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { motion } from "motion/react";
import Robot3DAvatar from "./Robot3DAvatar";
import AnimatedBackground from "./AnimatedBackground";
import { useState, useEffect } from "react";

interface DashboardProps {
  onNavigate: (page: string) => void;
}

export default function Dashboard({ onNavigate }: DashboardProps) {
  const [_showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    // Hide welcome message after 5 seconds
    const timer = setTimeout(() => {
      setShowWelcome(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated Background */}
      <AnimatedBackground />

      {/* Header */}
      <div className="glass-card glass-glow-purple relative z-10 px-4 py-3 border-b border-glass-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="relative"
            >
              <Robot3DAvatar size="sm" expression="happy" />
            </motion.div>
            <div>
              <h1 className="text-xl text-foreground">Dashboard</h1>
              <p className="text-xs text-muted-foreground">Welcome back to Mein Genie!</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate('profile')}
              className="hover:bg-glass-bg hover:text-neon-purple"
            >
              <User className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate('settings')}
              className="hover:bg-glass-bg hover:text-neon-green"
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 p-4 space-y-8">
        {/* Welcome Message */}
        <motion.div
          className="text-center py-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <motion.h2
            className="text-3xl mb-4 bg-gradient-to-r from-neon-purple to-neon-green bg-clip-text text-transparent"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            Hello, how can I assist you?
          </motion.h2>
          <motion.p
            className="text-muted-foreground text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            Choose a service to get started with AI-powered assistance
          </motion.p>
        </motion.div>

        {/* Service Cards */}
        <div className="space-y-6 max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 }}
          >
            <Card className="glass-card border-2 border-glass-border hover:border-neon-purple/50 transition-all duration-300 hover:scale-105 overflow-hidden group cursor-pointer glass-glow-purple">
              <CardContent className="p-6" onClick={() => onNavigate('form-submission')}>
                <div className="flex items-start gap-6">
                  <motion.div
                    className="p-4 rounded-2xl relative overflow-hidden"
                    style={{
                      background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(139, 92, 246, 0.1))',
                      border: '2px solid rgba(139, 92, 246, 0.3)',
                      boxShadow: '0 0 20px rgba(139, 92, 246, 0.2)'
                    }}
                    whileHover={{ 
                      scale: 1.1,
                      boxShadow: '0 0 30px rgba(139, 92, 246, 0.4)'
                    }}
                  >
                    <MessageSquare className="h-8 w-8 text-neon-purple" />
                  </motion.div>
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-3">
                      <h3 className="text-xl text-foreground">Formino - Form Assistant</h3>
                      <Badge 
                        variant="secondary" 
                        className="bg-neon-purple/10 text-neon-purple border-neon-purple/20"
                      >
                        <Sparkles className="h-3 w-3 mr-1" />
                        AI Powered
                      </Badge>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                      Get intelligent help with filling out forms, documents, and applications. Our AI guides you step-by-step for accuracy and completeness.
                    </p>
                    <Button 
                      className="mt-4 w-full bg-gradient-to-r from-neon-purple to-neon-purple/80 hover:from-neon-purple/90 hover:to-neon-purple/70"
                      style={{ boxShadow: '0 0 20px rgba(139, 92, 246, 0.3)' }}
                      onClick={(e) => {
                        e.stopPropagation();
                        onNavigate('form-submission');
                      }}
                    >
                      Get Started
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.0 }}
          >
            <Card className="glass-card border-2 border-glass-border hover:border-neon-green/50 transition-all duration-300 hover:scale-105 overflow-hidden group cursor-pointer glass-glow-green">
              <CardContent className="p-6" onClick={() => onNavigate('appointment-booking')}>
                <div className="flex items-start gap-6">
                  <motion.div
                    className="p-4 rounded-2xl relative overflow-hidden"
                    style={{
                      background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(16, 185, 129, 0.1))',
                      border: '2px solid rgba(16, 185, 129, 0.3)',
                      boxShadow: '0 0 20px rgba(16, 185, 129, 0.2)'
                    }}
                    whileHover={{ 
                      scale: 1.1,
                      boxShadow: '0 0 30px rgba(16, 185, 129, 0.4)'
                    }}
                  >
                    <Calendar className="h-8 w-8 text-neon-green" />
                  </motion.div>
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-3">
                      <h3 className="text-xl text-foreground">Termino - Appointment Booker</h3>
                      <Badge 
                        variant="secondary" 
                        className="bg-neon-green/10 text-neon-green border-neon-green/20"
                      >
                        <Sparkles className="h-3 w-3 mr-1" />
                        Voice Enabled
                      </Badge>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                      Schedule and manage appointments with automated booking, voice commands, and smart reminders. Never miss an important appointment again.
                    </p>
                    <Button 
                      variant="outline" 
                      className="mt-4 w-full border-neon-green/30 text-neon-green hover:bg-neon-green/10 hover:border-neon-green/50"
                      onClick={(e) => {
                        e.stopPropagation();
                        onNavigate('appointment-booking');
                      }}
                    >
                      Book Appointment
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          className="pt-8 border-t border-glass-border max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
        >
          <h3 className="mb-6 text-foreground">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: User, label: 'Profile', page: 'profile', color: 'neon-purple' },
              { icon: Calendar, label: 'Calendar', page: 'appointment-calendar', color: 'neon-green' },
              { icon: Bell, label: 'Upgrade', page: 'pricing', color: 'warning' },
              { icon: Settings, label: 'Settings', page: 'settings', color: 'info' }
            ].map((action, index) => (
              <motion.div
                key={action.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.4 + index * 0.1 }}
              >
                <Button
                  variant="outline"
                  onClick={() => onNavigate(action.page as any)}
                  className="glass-card h-20 w-full flex-col gap-2 border-glass-border hover:border-neon-purple/30 hover:bg-glass-bg group"
                >
                  <action.icon className="h-6 w-6 group-hover:text-neon-purple transition-colors" />
                  <span className="text-sm group-hover:text-neon-purple transition-colors">{action.label}</span>
                </Button>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          className="space-y-4 max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6 }}
        >
          <h3 className="text-foreground">Recent Activity</h3>
          <Card className="glass-card border border-glass-border">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div 
                  className="p-3 rounded-lg"
                  style={{
                    background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(16, 185, 129, 0.05))',
                    border: '1px solid rgba(16, 185, 129, 0.2)'
                  }}
                >
                  <Calendar className="h-4 w-4 text-neon-green" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">Upcoming appointment</p>
                  <p className="text-xs text-muted-foreground">
                    Dr. Smith - Monday, Aug 5 at 9:00 AM
                  </p>
                </div>
                <Button 
                  size="sm" 
                  variant="ghost"
                  onClick={() => onNavigate('appointment-calendar')}
                  className="hover:bg-glass-bg hover:text-neon-green"
                >
                  View
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Genie Tips */}
        <motion.div
          className="max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8 }}
        >
          <div className="glass-card p-6 border border-glass-border">
            <div className="flex items-start gap-4">
              <Robot3DAvatar size="sm" expression="happy" />
              <div className="flex-1">
                <h4 className="font-medium mb-2 text-foreground flex items-center gap-2">
                  💡 Genie Tip
                  <Badge variant="outline" className="border-neon-green/30 text-neon-green text-xs">
                    Pro Tip
                  </Badge>
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Try using voice commands in both Formino and Termino for faster, hands-free assistance! Just tap the microphone and speak naturally.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}