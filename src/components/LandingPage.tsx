import { motion } from "motion/react";
import { MessageSquare, Calendar } from "lucide-react";
import { Button } from "./ui/button";
import { useApp } from "./contexts/AppContext";

interface LandingPageProps {
  onSignIn: () => void;
}

export default function LandingPage({ onSignIn }: LandingPageProps) {
  const { t } = useApp();

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-background via-background to-purple-900/5 flex flex-col items-center justify-center relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 20 }, (_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-neon-purple/20 rounded-full"
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

      {/* Main Content */}
      <div className="relative z-10 text-center flex-1 flex flex-col justify-center px-8">
        {/* App Title */}
        <motion.div
          className="mb-16"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8, type: "spring" }}
        >
          <h1 className="text-6xl font-bold bg-gradient-to-r from-neon-purple via-neon-green to-neon-purple bg-clip-text text-transparent mb-4">
            {t('landing.title')}
          </h1>
          <p className="text-xl text-muted-foreground">
            {t('landing.subtitle')}
          </p>
        </motion.div>

        {/* Animated Service Logos */}
        <div className="flex items-center justify-center gap-16 mb-20">
          {/* Formino Logo */}
          <motion.div
            className="flex flex-col items-center group"
            initial={{ x: -100, opacity: 0, rotate: -10 }}
            animate={{ x: 0, opacity: 1, rotate: 0 }}
            transition={{ delay: 1, duration: 1, type: "spring", stiffness: 100 }}
          >
            <motion.div
              className="relative mb-4"
              animate={{ 
                y: [0, -10, 0],
                rotate: [0, 5, 0]
              }}
              transition={{ 
                duration: 4, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
            >
              <motion.div
                className="w-24 h-24 rounded-3xl bg-gradient-to-br from-neon-purple to-purple-600 flex items-center justify-center relative overflow-hidden"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {/* Glossy overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-3xl" />
                
                {/* Icon */}
                <MessageSquare className="h-12 w-12 text-white relative z-10" />
                
                {/* Glow effect */}
                <motion.div
                  className="absolute inset-0 rounded-3xl"
                  style={{
                    background: 'radial-gradient(circle, rgba(139, 92, 246, 0.4), transparent)',
                    filter: 'blur(20px)'
                  }}
                  animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 0.8, 0.5]
                  }}
                  transition={{ 
                    duration: 3, 
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              </motion.div>
            </motion.div>
            
            <motion.h3
              className="text-2xl font-semibold text-neon-purple"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5, duration: 0.6 }}
            >
              {t('landing.formino')}
            </motion.h3>
            <motion.p
              className="text-sm text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.7, duration: 0.6 }}
            >
              {t('landing.formino.subtitle')}
            </motion.p>
          </motion.div>

          {/* Connecting Line Animation */}
          <motion.div
            className="flex-1 h-px bg-gradient-to-r from-neon-purple via-transparent via-transparent to-neon-green relative"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 2, duration: 1.5, ease: "easeInOut" }}
          >
            {/* Flowing particles */}
            <motion.div
              className="absolute top-0 left-0 w-2 h-2 bg-neon-purple rounded-full -translate-y-1/2"
              animate={{ x: [0, 200] }}
              transition={{ 
                duration: 3, 
                repeat: Infinity, 
                ease: "linear",
                delay: 2.5
              }}
            />
          </motion.div>

          {/* Termino Logo */}
          <motion.div
            className="flex flex-col items-center group"
            initial={{ x: 100, opacity: 0, rotate: 10 }}
            animate={{ x: 0, opacity: 1, rotate: 0 }}
            transition={{ delay: 1.2, duration: 1, type: "spring", stiffness: 100 }}
          >
            <motion.div
              className="relative mb-4"
              animate={{ 
                y: [0, -8, 0],
                rotate: [0, -3, 0]
              }}
              transition={{ 
                duration: 3.5, 
                repeat: Infinity, 
                ease: "easeInOut",
                delay: 1
              }}
            >
              <motion.div
                className="w-24 h-24 rounded-3xl bg-gradient-to-br from-neon-green to-green-600 flex items-center justify-center relative overflow-hidden"
                whileHover={{ scale: 1.1, rotate: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {/* Glossy overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-3xl" />
                
                {/* Icon */}
                <Calendar className="h-12 w-12 text-white relative z-10" />
                
                {/* Glow effect */}
                <motion.div
                  className="absolute inset-0 rounded-3xl"
                  style={{
                    background: 'radial-gradient(circle, rgba(16, 185, 129, 0.4), transparent)',
                    filter: 'blur(20px)'
                  }}
                  animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 0.8, 0.5]
                  }}
                  transition={{ 
                    duration: 2.5, 
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.5
                  }}
                />
              </motion.div>
            </motion.div>
            
            <motion.h3
              className="text-2xl font-semibold text-neon-green"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.7, duration: 0.6 }}
            >
              {t('landing.termino')}
            </motion.h3>
            <motion.p
              className="text-sm text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.9, duration: 0.6 }}
            >
              {t('landing.termino.subtitle')}
            </motion.p>
          </motion.div>
        </div>
      </div>

      {/* Sign In Button */}
        <motion.div
            className="relative z-10 pb-12 px-8 w-full max-w-sm"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 3, duration: 0.8 }}
        >


              {/* Centered glows */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="absolute w-64 h-64 bg-neon-purple/5 rounded-full blur-3xl" />
                  <div className="absolute w-64 h-64 bg-neon-green/5 rounded-full blur-3xl mix-blend-screen" />
              </div>

          {/* Your pulsing wrapper & button */}
          <motion.div
              className="w-full h-14 rounded-2xl overflow-hidden"
              animate={{
                  scale: [1, 1.02, 1],
                  boxShadow: [
                      '0 0 20px rgba(139, 92, 246, 0.3)',
                      '0 0 30px rgba(139, 92, 246, 0.5)',
                      '0 0 20px rgba(139, 92, 246, 0.3)'
                  ]
              }}
              transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
              }}
          >

              <Button
                  onClick={onSignIn}
                  className="w-full h-full text-lg
               bg-gradient-to-r from-neon-purple to-purple-600
               hover:from-neon-purple/90 hover:to-purple-600/90
               relative overflow-hidden group"
              >
                <span className="relative z-10 flex items-center justify-center gap-3">
                  {t('landing.signin')}
                </span>

                  {/* Glossy overlay */}
                  <div
                      className="absolute inset-0
                 bg-gradient-to-r from-white/20 to-transparent
                 opacity-0 group-hover:opacity-100
                 transition-opacity duration-300
                 rounded-2xl"
                  />

                  {/* Ripple effect */}
                  <motion.div
                      className="absolute inset-0 bg-white/10 rounded-2xl"
                      initial={{ scale: 0, opacity: 0 }}
                      whileHover={{ scale: 1, opacity: [0, 0.5, 0] }}
                      transition={{ duration: 0.6 }}
                  />
              </Button>
                    </motion.div>

        {/* Subtle instruction */}
        <motion.p
          className="text-center text-xs text-muted-foreground mt-4 opacity-70"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{ delay: 3.5, duration: 0.6 }}
        >
          Secure • Private • Intelligent
        </motion.p>
      </motion.div>

      {/* Ambient glow effects */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-neon-purple/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-neon-green/5 rounded-full blur-3xl" />
    </motion.div>
  );
}