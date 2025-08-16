import { motion } from "motion/react";
import  type { LucideIcon } from "lucide-react";

interface ServiceCardProps {
  title: string;
  subtitle: string;
  description: string;
  icon: LucideIcon;
  color: string;
  glowColor: string;
  delay: number;
  onClick: () => void;
}

export default function ServiceCard({
  title,
  subtitle,
  description,
  icon: Icon,
  color,
  glowColor,
  delay,
  onClick
}: ServiceCardProps) {
  return (
    <motion.div
      className="relative group cursor-pointer"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      onClick={onClick}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
    >
      <div 
        className={`glass-card rounded-3xl p-6 relative overflow-hidden transition-all duration-300 ${
          color === 'purple' ? 'hover:glass-glow-purple' : 'hover:glass-glow-green'
        }`}
        style={{
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
          transition: 'box-shadow 0.3s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = `0 0 30px ${glowColor}, 0 8px 32px rgba(0, 0, 0, 0.3)`;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.3)';
        }}
      >
        {/* Subtle background gradient */}
        <div 
          className={`absolute inset-0 rounded-3xl ${
            color === 'purple' 
              ? 'bg-gradient-to-br from-neon-purple/5 to-transparent' 
              : 'bg-gradient-to-br from-neon-green/5 to-transparent'
          }`}
        />
        
        {/* Content */}
        <div className="relative z-10 flex items-center gap-6">
          {/* Static icon with subtle hover effect */}
          <div
            className={`w-20 h-20 rounded-2xl flex items-center justify-center relative overflow-hidden shadow-lg transition-all duration-300 ${
              color === 'purple' 
                ? 'bg-gradient-to-br from-neon-purple to-purple-600' 
                : 'bg-gradient-to-br from-neon-green to-green-600'
            }`}
            style={{
              boxShadow: `0 0 20px ${glowColor.replace('0.6', '0.3')}`
            }}
          >
            {/* Glossy overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl" />
            
            <Icon className="h-10 w-10 text-white relative z-10" />
          </div>
          
          {/* Text content */}
          <div className="flex-1">
            <motion.h2 
              className="text-2xl font-semibold text-foreground mb-1"
              whileHover={{ x: 2 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {title}
            </motion.h2>
            <p className="text-muted-foreground text-sm mb-3">{subtitle}</p>
            <p className="text-xs text-muted-foreground/80 leading-relaxed">
              {description}
            </p>
          </div>
        </div>

        {/* Simple hover overlay */}
        <motion.div
          className="absolute inset-0 bg-white/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        />
      </div>
    </motion.div>
  );
}