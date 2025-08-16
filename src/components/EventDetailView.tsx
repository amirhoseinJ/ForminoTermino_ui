import { motion } from "motion/react";
import { X, MapPin, User, Calendar, Share2, MessageCircle, Send, Copy, Check } from "lucide-react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Badge } from "./ui/badge";
import { useState } from "react";
import { useApp } from "./contexts/AppContext";

interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  location?: string;
  description?: string;
  type: 'ai-booked' | 'manual' | 'google-sync';
  provider?: string;
  category?: string;
}

interface EventDetailViewProps {
  event: CalendarEvent | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function EventDetailView({ event, isOpen, onClose }: EventDetailViewProps) {
    // @ts-ignore
  const { t } = useApp();
  const [copiedToClipboard, setCopiedToClipboard] = useState(false);

  if (!event) return null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit', 
      hour12: true 
    });
  };

  const getEventTypeConfig = (type: string) => {
    switch (type) {
      case 'ai-booked':
        return {
          label: 'AI Booked',
          color: 'bg-neon-green/10 text-neon-green border-neon-green/20',
          icon: '🤖'
        };
      case 'google-sync':
        return {
          label: 'Google Calendar',
          color: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
          icon: '📅'
        };
      default:
        return {
          label: 'Manual',
          color: 'bg-neon-purple/10 text-neon-purple border-neon-purple/20',
          icon: '✏️'
        };
    }
  };

  const generateShareText = () => {
    const dateText = formatDate(event.date);
    const timeText = formatTime(event.time);
    
    return `📅 ${event.title}\n\n🗓️ ${dateText}\n⏰ ${timeText}${
      event.location ? `\n📍 ${event.location}` : ''
    }${
      event.description ? `\n\n📝 ${event.description}` : ''
    }\n\n✨ Scheduled with Mein Genie`;
  };

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(generateShareText());
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const handleTelegramShare = () => {
    const text = encodeURIComponent(generateShareText());
    window.open(`https://t.me/share/url?text=${text}`, '_blank');
  };

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generateShareText());
      setCopiedToClipboard(true);
      setTimeout(() => setCopiedToClipboard(false), 2000);
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  };

  const typeConfig = getEventTypeConfig(event.type);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-card border-glass-border max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl font-semibold text-foreground">{event.title}</span>
                <Badge variant="outline" className={`${typeConfig.color} text-xs`}>
                  {typeConfig.icon} {typeConfig.label}
                </Badge>
              </div>
              {event.provider && (
                <p className="text-sm text-muted-foreground">{event.provider}</p>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="w-8 h-8 p-0 hover:bg-red-500/10 hover:text-red-500"
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
          <DialogDescription>
            View and share details for this {event.type === 'ai-booked' ? 'AI-scheduled' : 'calendar'} event
          </DialogDescription>
        </DialogHeader>

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
        >
          {/* Event Details */}
          <div className="space-y-4 mb-6">
            {/* Date & Time */}
            <motion.div
              className="flex items-center gap-3 p-3 glass-card rounded-lg border border-glass-border"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="p-2 bg-neon-purple/10 rounded-lg">
                <Calendar className="h-5 w-5 text-neon-purple" />
              </div>
              <div>
                <p className="font-medium text-foreground">{formatDate(event.date)}</p>
                <p className="text-sm text-muted-foreground">{formatTime(event.time)}</p>
              </div>
            </motion.div>

            {/* Location */}
            {event.location && (
              <motion.div
                className="flex items-center gap-3 p-3 glass-card rounded-lg border border-glass-border"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="p-2 bg-neon-green/10 rounded-lg">
                  <MapPin className="h-5 w-5 text-neon-green" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Location</p>
                  <p className="text-sm text-muted-foreground">{event.location}</p>
                </div>
              </motion.div>
            )}

            {/* Description */}
            {event.description && (
              <motion.div
                className="p-3 glass-card rounded-lg border border-glass-border"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-500/10 rounded-lg">
                    <User className="h-5 w-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground mb-1">Description</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">{event.description}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Sharing Options */}
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center gap-2 mb-3">
              <Share2 className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">Share this event</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* WhatsApp Share */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  onClick={handleWhatsAppShare}
                  className="w-full bg-[#25D366] hover:bg-[#20BA5A] text-white relative overflow-hidden group"
                >
                  <div className="flex items-center gap-2 relative z-10">
                    <MessageCircle className="h-4 w-4" />
                    <span className="font-medium">WhatsApp</span>
                  </div>
                  
                  {/* Hover effect */}
                  <motion.div
                    className="absolute inset-0 bg-white/20"
                    initial={{ scale: 0, opacity: 0 }}
                    whileHover={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                </Button>
              </motion.div>

              {/* Telegram Share */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  onClick={handleTelegramShare}
                  className="w-full bg-[#0088cc] hover:bg-[#006ba6] text-white relative overflow-hidden group"
                >
                  <div className="flex items-center gap-2 relative z-10">
                    <Send className="h-4 w-4" />
                    <span className="font-medium">Telegram</span>
                  </div>
                  
                  {/* Hover effect */}
                  <motion.div
                    className="absolute inset-0 bg-white/20"
                    initial={{ scale: 0, opacity: 0 }}
                    whileHover={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                </Button>
              </motion.div>
            </div>

            {/* Copy to Clipboard */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                onClick={handleCopyToClipboard}
                variant="outline"
                className="w-full border-glass-border hover:bg-glass-bg relative overflow-hidden group"
                disabled={copiedToClipboard}
              >
                <div className="flex items-center gap-2 relative z-10">
                  {copiedToClipboard ? (
                    <>
                      <Check className="h-4 w-4 text-neon-green" />
                      <span className="text-neon-green font-medium">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      <span>Copy Details</span>
                    </>
                  )}
                </div>
                
                {/* Success animation */}
                {copiedToClipboard && (
                  <motion.div
                    className="absolute inset-0 bg-neon-green/10"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </Button>
            </motion.div>
          </motion.div>

          {/* AI Booked Badge */}
          {event.type === 'ai-booked' && (
            <motion.div
              className="mt-6 p-3 glass-card rounded-lg border-2 border-neon-green/30 relative overflow-hidden"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-neon-green/20 rounded-lg">
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  >
                    🤖
                  </motion.div>
                </div>
                <div>
                  <p className="text-sm font-medium text-neon-green">AI Scheduled</p>
                  <p className="text-xs text-muted-foreground">
                    This appointment was automatically booked by your Termino AI assistant
                  </p>
                </div>
              </div>
              
              {/* Animated border */}
              <motion.div
                className="absolute inset-0 rounded-lg border-2 border-neon-green/20"
                animate={{
                  borderColor: [
                    'rgba(16, 185, 129, 0.2)',
                    'rgba(16, 185, 129, 0.4)',
                    'rgba(16, 185, 129, 0.2)'
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.div>
          )}

          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-neon-purple via-neon-green to-neon-purple opacity-60" />
          
          {/* Floating particles */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-lg">
            {Array.from({ length: 6 }, (_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-neon-purple/30 rounded-full"
                style={{
                  left: `${20 + Math.random() * 60}%`,
                  top: `${20 + Math.random() * 60}%`,
                }}
                animate={{
                  y: [0, -20, 0],
                  opacity: [0, 0.6, 0],
                  scale: [0, 1, 0]
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 3,
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