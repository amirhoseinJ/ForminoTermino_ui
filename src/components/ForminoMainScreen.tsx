import { useState, useMemo } from "react";
import { ArrowLeft, Camera, Upload, Link, Send } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { motion, AnimatePresence } from "motion/react";
import { useApp } from "./contexts/AppContext";
import SubtleAnimatedBackground from "./SubtleAnimatedBackground";
import UnifiedGenieAvatar from "./UnifiedGenieAvatar";
import type { Page } from "../types/navigation";
import type { LucideIcon } from "lucide-react";
import MarkdownMessage from "./MarkdownMessage";



const API_BASE = import.meta.env.VITE_API_BASE

interface ForminoMainScreenProps {
    onNavigate: (page: Page) => void;
}

interface ActionButton {
    id: string;
    icon: LucideIcon;
    title: string;
    description: string;
    color: string;
    hoverColor: string;
    glowColor: string;
    page: Page;
}

const actionButtons: ActionButton[] = [
    {
        id: "scan",
        icon: Camera,
        title: "Scan Document",
        description: "Take a photo of your document",
        color: "from-blue-500 to-blue-600",
        hoverColor: "hover:from-blue-600 hover:to-blue-700",
        glowColor: "rgba(59,130,246,.4)",
        page: "scan-document", // literal satisfies Page
    },
    {
        id: "upload",
        icon: Upload,
        title: "Upload File",
        description: "Select a file from your device",
        color: "from-purple-500 to-purple-600",
        hoverColor: "hover:from-purple-600 hover:to-purple-700",
        glowColor: "rgba(139,92,246,.4)",
        page: "upload-file",
    },
    {
        id: "link",
        icon: Link,
        title: "Submit Link",
        description: "Share a web link or URL",
        color: "from-green-500 to-green-600",
        hoverColor: "hover:from-green-600 hover:to-green-700",
        glowColor: "rgba(16,185,129,.4)",
        page: "submit-link",
    },
];

interface ChatMessage {
    id: string;
    type: "user" | "ai";
    content: string;
    timestamp: Date;
}

export default function ForminoMainScreen({ onNavigate }: ForminoMainScreenProps) {
    const { t } = useApp();
    const [messages, setMessages] = useState<ChatMessage[]>([
        {
            id: "1",
            type: "ai",
            content:
                "Hi! I'm your form assistant. I can help you with documents, forms, and applications. How can I help you today?",
            timestamp: new Date(),
        },
    ]);
    const [inputValue, setInputValue] = useState("");
    const [isTyping, setIsTyping] = useState(false);

    //@ts-ignore
    // Build the conversation string in the requested format
    const conversationString = useMemo(() => {
        return messages
            .map((m) => (m.type === "ai" ? `AI:\n${m.content}` : `User:\n${m.content}`))
            .join("\n");
    }, [messages]);

    const handleSendMessage = async () => {
        if (!inputValue.trim()) return;

        const userMessage: ChatMessage = {
            id: Date.now().toString(),
            type: "user",
            content: inputValue,
            timestamp: new Date(),
        };

        // Optimistically add the user message to local state
        setMessages((prev) => [...prev, userMessage]);
        setInputValue("");
        setIsTyping(true);

        try {
            const token = localStorage.getItem("accessToken");

            // Build the full conversation string including the just-added user message.
            // Because setState is async, we create it from the "prev + userMessage" shape.
            const fullConversation = [...messages, userMessage]
                .map((m) => (m.type === "ai" ? `AI:\n${m.content}` : `User:\n${m.content}`))
                .join("\n");

            const response = await fetch(`${API_BASE}/chat/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                // Send the entire conversation every time
                body: JSON.stringify({ message: fullConversation }),
            });

            if (!response.ok) {
                throw new Error(`Server error: ${response.status}`);
            }

            const { reply } = await response.json();
            const aiMessage: ChatMessage = {
                id: (Date.now() + 1).toString(),
                type: "ai",
                content: reply,
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, aiMessage]);
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
                                onClick={() => onNavigate("hub")}
                                className="hover:bg-glass-bg hover:text-neon-purple"
                            >
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                        </motion.div>
                        <div>
                            <h1 className="text-lg text-foreground">{t("formino.title")}</h1>
                            <p className="text-xs text-muted-foreground">{t("formino.subtitle")}</p>
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
                                    delay: index * 0.1,
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
                                        <MarkdownMessage content={message.content} isUser={message.type === "user"} />                                        <p className="text-xs opacity-60 mt-1">
                                            {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                        </p>
                                    </motion.div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {/* Typing Indicator */}
                    {isTyping && (
                        <motion.div className="flex justify-start" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
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
                                placeholder="Ask me about forms, documents, or applications..."
                                className="pr-10 bg-input-background border-glass-border focus:border-neon-purple/50 focus:ring-neon-purple/20"
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSendMessage();
                                    }
                                }}
                                style={{ backdropFilter: "blur(10px)" }}
                            />
                        </div>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button
                                onClick={handleSendMessage}
                                disabled={!inputValue.trim()}
                                className="bg-gradient-to-r from-neon-purple to-purple-600 hover:from-neon-purple/90 hover:to-purple-600/90 h-10 w-10 p-0"
                                style={{ boxShadow: "0 0 20px rgba(139, 92, 246, 0.3)" }}
                                aria-label="Send message"
                                title="Send message"
                            >
                                <Send className="h-4 w-4" />
                            </Button>
                        </motion.div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="p-4 border-t border-glass-border/50">
                    <div className="grid grid-cols-3 gap-3">
                        {actionButtons.map((action, index) => (
                            <motion.button
                                key={action.id}
                                className={`relative p-4 rounded-2xl bg-gradient-to-br ${action.color} ${action.hoverColor} text-white overflow-hidden group`}
                                onClick={() => onNavigate(action.page)}
                                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                transition={{
                                    delay: 0.6 + index * 0.1,
                                    type: "spring",
                                    stiffness: 200,
                                    damping: 20,
                                }}
                                whileHover={{
                                    scale: 1.05,
                                    y: -2,
                                }}
                                whileTap={{ scale: 0.95 }}
                                style={{
                                    boxShadow: `0 0 20px ${action.glowColor}, 0 4px 20px rgba(0, 0, 0, 0.2)`,
                                }}
                            >
                                {/* Icon */}
                                <motion.div
                                    className="flex justify-center mb-2"
                                    animate={{
                                        y: [0, -2, 0],
                                        rotate: [0, 5, -5, 0],
                                    }}
                                    transition={{
                                        duration: 3 + index,
                                        repeat: Infinity,
                                        ease: "easeInOut",
                                        delay: index * 0.5,
                                    }}
                                >
                                    <action.icon className="h-6 w-6" />
                                </motion.div>

                                {/* Text */}
                                <div className="text-center">
                                    <h3 className="text-xs font-semibold mb-1">{action.title}</h3>
                                    <p className="text-xs opacity-80 leading-tight">{action.description}</p>
                                </div>

                                {/* Glossy overlay */}
                                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl" />

                                {/* Hover effect */}
                                <motion.div
                                    className="absolute inset-0 bg-white/10 rounded-2xl"
                                    initial={{ scale: 0, opacity: 0 }}
                                    whileHover={{ scale: 1, opacity: 1 }}
                                    transition={{ duration: 0.3 }}
                                />

                                {/* Animated particles */}
                                <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
                                    {Array.from({ length: 3 }, (_, i) => (
                                        <motion.div
                                            key={i}
                                            className="absolute w-1 h-1 bg-white/60 rounded-full"
                                            style={{
                                                left: `${30 + Math.random() * 40}%`,
                                                top: `${30 + Math.random() * 40}%`,
                                            }}
                                            animate={{
                                                y: [0, -15, 0],
                                                opacity: [0, 1, 0],
                                                scale: [0, 1, 0],
                                            }}
                                            transition={{
                                                duration: 2,
                                                repeat: Infinity,
                                                delay: Math.random() * 2,
                                                ease: "easeOut",
                                            }}
                                        />
                                    ))}
                                </div>
                            </motion.button>
                        ))}
                    </div>

                    {/* Help text */}
                    <motion.p
                        className="text-xs text-muted-foreground text-center mt-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1, duration: 0.6 }}
                    >
                        Choose an option above or continue chatting for personalized help
                    </motion.p>
                </div>
            </div>
        </div>
    );
}