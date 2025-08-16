import { useState } from "react";
import { motion } from "motion/react";
import { MessageSquare, Calendar, User } from "lucide-react";
import { Button } from "./ui/button";
import { useApp } from "./contexts/AppContext";
import MeinGenieLogo from "./MeinGenieLogo";
import HelpTutorial from "./HelpTutorial";
import GlobalAnimatedBackground from "./GlobalAnimatedBackground";
import AnimatedHelpRobot from "./AnimatedHelpRobot";
import ServiceCard from "./ServiceCard";
import type { Page } from "../types/navigation";
import type { LucideIcon } from 'lucide-react';   // icons are components

interface MainHubProps {
  onNavigate: (page: Page) => void;
  onLogout: () => void;
}

export default function MainHub({ onNavigate, onLogout }: MainHubProps) {
  const { t } = useApp();
  const [showHelp, setShowHelp] = useState(false);

    interface Service {
        title: string;
        subtitle: string;
        description: string;
        icon: LucideIcon;
        color: 'purple' | 'green';   // or just string
        glowColor: string;
        page: Page;                  // ← important
        delay: number;
    }

    const services: Service[] = [
        {
            title: t('formino.title'),
            subtitle: t('formino.subtitle'),
            description: 'Intelligent help with forms, documents, and applications',
            icon: MessageSquare,
            color: 'purple',
            glowColor: 'rgba(139, 92, 246, 0.6)',
            page: 'formino',           // literal matches Page union
            delay: 0.4,
        },
        {
            title: t('termino.title'),
            subtitle: t('termino.subtitle'),
            description: 'Voice-enabled scheduling and smart appointment management',
            icon: Calendar,
            color: 'green',
            glowColor: 'rgba(16, 185, 129, 0.6)',
            page: 'termino',
            delay: 0.6,
        },
    ];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Global Animated Background */}
      <GlobalAnimatedBackground variant="primary" />

      {/* Header with prominent logo */}
      <div className="glass-card glass-glow-purple relative z-10 px-4 py-6 border-b border-glass-border">
        <div className="flex items-center justify-between">

            <Button onClick={() => onLogout()}
                    className=" rounded-full text-black bg-red-300 hover:bg-red-50/10 hover:text-neon-purple transition-all duration-300"
            >
                Logout
            </Button>

            <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex-1 flex justify-center mr-18"
          >
            <MeinGenieLogo size="lg" animated={true} showText={true} />
          </motion.div>
          
          <motion.div
            className="flex gap-2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onNavigate('profile')}
                className="w-10 h-10 p-0 rounded-full hover:bg-neon-purple/10 hover:text-neon-purple transition-all duration-300"
                style={{
                  boxShadow: '0 0 0 0 rgba(139, 92, 246, 0.4)',
                  transition: 'box-shadow 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 0 20px rgba(139, 92, 246, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 0 0 0 rgba(139, 92, 246, 0.4)';
                }}
              >
                <User className="h-5 w-5" />
              </Button>
            </motion.div>


            {/*<motion.div*/}
            {/*  whileHover={{ scale: 1.05 }}*/}
            {/*  whileTap={{ scale: 0.95 }}*/}
            {/*>*/}
            {/*  <Button*/}
            {/*    variant="ghost"*/}
            {/*    size="sm"*/}
            {/*    onClick={() => onNavigate('settings')}*/}
            {/*    className="w-10 h-10 p-0 rounded-full hover:bg-neon-green/10 hover:text-neon-green transition-all duration-300"*/}
            {/*    style={{*/}
            {/*      boxShadow: '0 0 0 0 rgba(16, 185, 129, 0.4)',*/}
            {/*      transition: 'box-shadow 0.3s ease'*/}
            {/*    }}*/}
            {/*    onMouseEnter={(e) => {*/}
            {/*      e.currentTarget.style.boxShadow = '0 0 20px rgba(16, 185, 129, 0.4)';*/}
            {/*    }}*/}
            {/*    onMouseLeave={(e) => {*/}
            {/*      e.currentTarget.style.boxShadow = '0 0 0 0 rgba(16, 185, 129, 0.4)';*/}
            {/*    }}*/}
            {/*  >*/}
            {/*    <Settings className="h-5 w-5" />*/}
            {/*  </Button>*/}
            {/*</motion.div>*/}



          </motion.div>
        </div>
      </div>

      {/* Main Service Icons */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-8 py-8">
        <div className="w-full max-w-md space-y-8">
          {services.map((service) => (
            <ServiceCard
              key={service.page}
              title={service.title}
              subtitle={service.subtitle}
              description={service.description}
              icon={service.icon}
              color={service.color}
              glowColor={service.glowColor}
              delay={service.delay}
              onClick={() => onNavigate(service.page)}
            />
          ))}
        </div>
      </div>

      {/* Enhanced bottom status */}
      <motion.div
        className="relative z-10 p-6 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.6 }}
      >
        <motion.p 
          className="text-xs text-muted-foreground"
          animate={{
            opacity: [0.7, 1, 0.7]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          {t('hub.status')}
        </motion.p>
      </motion.div>

      {/* Animated Help Robot (Bottom Right) */}
      <AnimatedHelpRobot onClick={() => setShowHelp(true)} />

      {/* Help Tutorial */}
      <HelpTutorial isOpen={showHelp} onClose={() => setShowHelp(false)} />
    </div>
  );
}