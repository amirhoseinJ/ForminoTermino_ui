// TerminoAiBookingPage.tsx
import { useState } from "react";
import { ArrowLeft, Send, Check } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { motion, AnimatePresence } from "motion/react";
import { useApp } from "./contexts/AppContext";
import SubtleAnimatedBackground from "./SubtleAnimatedBackground";
import UnifiedGenieAvatar from "./UnifiedGenieAvatar";
import type { Page } from "../types/navigation";
import MarkdownMessage from "./MarkdownMessage.tsx";

interface TerminoAiBookingPageProps {
    onNavigate: (page: Page) => void;
}

interface ChatMessage {
    id: string;
    type: "user" | "ai";
    content: string;
    timestamp: Date;
}


const API_BASE = import.meta.env.VITE_API_BASE

export default function TerminoAiBookingPage({ onNavigate }: TerminoAiBookingPageProps) {
    const { t } = useApp();
    const [messages, setMessages] = useState<ChatMessage[]>([
        {
            id: "1",
            type: "ai",
            content: "Hi! I'm your Appointments assistant. How can I help you today?",
            timestamp: new Date(),
        },
    ]);
    const [inputValue, setInputValue] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [showSuccessOverlay, setShowSuccessOverlay] = useState(false);

    // API config (mirrors other pages)
    const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

    // For Google sync (optional but nice)
    const googleSync = async () => {
        if (!token) return;
        try {
            await fetch(`${API_BASE}/google/sync/`, {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
            });
        } catch {
            // swallow
        }
    };

    // Helper: format the full conversation exactly as requested
    const formatConversation = (allMessages: ChatMessage[]) => {
        return allMessages
            .map((m) => `${m.type === "ai" ? "AI" : "User"}:\n${m.content}`)
            .join("\n");
    };

    const handleSendMessage = async () => {
        if (!inputValue.trim()) return;

        const userMessage: ChatMessage = {
            id: Date.now().toString(),
            type: "user",
            content: inputValue,
            timestamp: new Date(),
        };

        // Optimistically render the user's message
        setMessages((prev) => [...prev, userMessage]);
        setInputValue("");
        setIsTyping(true);

        // Build the full conversation string INCLUDING the new user message
        const conversationString = formatConversation([...messages, userMessage]);

        try {
            const response = await fetch(`${API_BASE}/ai-booking/chat/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                body: JSON.stringify({ message: conversationString }),
            });

            if (!response.ok) {
                throw new Error(`Server error: ${response.status}`);
            }

            const data = await response.json() as {
                reply: string;
                event_created?: boolean;
                event?: {
                    id?: number | string;
                    title: string;
                    start_iso: string;
                    end_iso: string;
                    location?: string;
                    description?: string;
                } | null;
            };

            // Append AI chat reply
            const aiMessage: ChatMessage = {
                id: (Date.now() + 1).toString(),
                type: "ai",
                content: data.reply || "…",
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, aiMessage]);

            // If backend says event created, sync & show success overlay
            if (data.event_created) {
                // optional: sync to Google in the background (non-blocking)
                googleSync();
                // Show success overlay and stay there
                setShowSuccessOverlay(true);
            }
        } catch (err) {
            console.error(err);
            setMessages((prev) => [
                ...prev,
                {
                    id: (Date.now() + 1).toString(),
                    type: "ai",
                    content: "Sorry, something went wrong. Please try again.",
                    timestamp: new Date(),
                },
            ]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div className="min-h-screen bg-background relative overflow-hidden flex flex-col">
            {/* Subtle Animated Background */}
            <SubtleAnimatedBackground variant="primary" />

            {/* Header */}
            <div className="glass-card glass-glow-purple relative z-10 px-4 py-3 border-b border-glass-border">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onNavigate("termino")}
                                className="hover:bg-glass-bg hover:text-neon-purple"
                            >
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                        </motion.div>
                        <div>
                            <h1 className="text-lg text-foreground">{t("termino.title")}</h1>
                            <p className="text-xs text-muted-foreground">{t("termino.subtitle")}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <UnifiedGenieAvatar size="sm" expression="happy" glowColor="purple" />
                    </div>
                </div>
            </div>

            {/* Chat Interface */}
            <div className="flex-1 flex flex-col relative z-10">
                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    <AnimatePresence>
                        {messages.map((message, index) => (
                            <motion.div
                                key={message.id}
                                className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
                                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                transition={{
                                    delay: index * 0.05,
                                    type: "spring",
                                    stiffness: 200,
                                    damping: 20,
                                }}
                            >
                                <div className="flex items-start gap-3 max-w-[80%]">
                                    {message.type === "ai" && (
                                        <div className="flex-shrink-0">
                                            <UnifiedGenieAvatar size="xs" expression="happy" glowColor="purple" />
                                        </div>
                                    )}

                                    <motion.div
                                        className={`px-4 py-3 rounded-2xl ${
                                            message.type === "user"
                                                ? "bg-neon-purple text-white ml-auto"
                                                : "glass-card border border-glass-border"
                                        }`}
                                        whileHover={{ scale: 1.02 }}
                                        style={{
                                            boxShadow:
                                                message.type === "user"
                                                    ? "0 0 20px rgba(139, 92, 246, 0.3)"
                                                    : "0 4px 20px rgba(0, 0, 0, 0.1)",
                                        }}
                                    >
                                        <MarkdownMessage content={message.content} isUser={message.type === "user"} />
                                        <p className="text-xs opacity-60 mt-1">
                                            {message.timestamp.toLocaleTimeString([], {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </p>
                                    </motion.div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {/* Typing Indicator */}
                    {isTyping && (
                        <motion.div
                            className="flex justify-start"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <div className="flex items-start gap-3">
                                <UnifiedGenieAvatar size="xs" expression="thinking" glowColor="purple" />
                                <div className="glass-card border border-glass-border px-4 py-3 rounded-2xl">
                                    <div className="flex gap-1">
                                        {[0, 1, 2].map((i) => (
                                            <motion.div
                                                key={i}
                                                className="w-1 h-1 bg-muted-foreground rounded-full"
                                                animate={{
                                                    scale: [1, 1.5, 1],
                                                    opacity: [0.5, 1, 0.5],
                                                }}
                                                transition={{
                                                    duration: 1,
                                                    repeat: Infinity,
                                                    delay: i * 0.2,
                                                }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </div>

                {/* Input Area */}
                <div className="p-4 border-t border-glass-border glass-card">
                    <div className="flex gap-2">
                        <div className="flex-1 relative">
                            <Input
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                placeholder="Tell me about your appointment..."
                                className="pr-10 bg-input-background border-glass-border focus:border-neon-purple/50 focus:ring-neon-purple/20"
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSendMessage();
                                    }
                                }}
                                style={{ backdropFilter: "blur(10px)" }}
                                disabled={showSuccessOverlay}
                            />
                        </div>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button
                                onClick={handleSendMessage}
                                disabled={!inputValue.trim() || showSuccessOverlay}
                                className="bg-gradient-to-r from-neon-purple to-purple-600 hover:from-neon-purple/90 hover:to-purple-600/90 h-10 w-10 p-0"
                                style={{ boxShadow: "0 0 20px rgba(139, 92, 246, 0.3)" }}
                            >
                                <Send className="h-4 w-4" />
                            </Button>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Success Overlay */}
            <AnimatePresence>
                {showSuccessOverlay && (
                    <motion.div
                        className="fixed inset-0 z-50 flex items-center justify-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <div className="absolute inset-0 bg-black/60" />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: "spring", stiffness: 220, damping: 18 }}
                            className="relative glass-card border-glass-border rounded-2xl p-8 text-center"
                            role="status"
                            aria-live="polite"
                        >
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 260, damping: 16, delay: 0.05 }}
                                className="mx-auto mb-4 rounded-full bg-green-500/20 p-4"
                            >
                                <Check className="h-10 w-10 text-neon-green" />
                            </motion.div>
                            <h3 className="text-lg font-semibold text-foreground mb-2">Appointment added!</h3>
                            <p className="text-sm text-muted-foreground mb-6">
                                The appointment has been added to your calendar and synced to Google (if connected).
                            </p>
                            <Button
                                onClick={() => onNavigate("termino")}
                                className="bg-gradient-to-r from-neon-green to-green-600 hover:from-neon-green/90 hover:to-green-600/90"
                                style={{ boxShadow: "0 0 20px rgba(34, 197, 94, 0.35)" }}
                            >
                                Back To Termino
                            </Button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
