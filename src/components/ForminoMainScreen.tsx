// ForminoMainScreen.tsx
import { useState, useMemo, useEffect, useRef } from "react";
import { ArrowLeft, Camera, Upload, Link, Send, Mic, MicOff, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { motion, AnimatePresence } from "motion/react";
import { useApp } from "./contexts/AppContext";
import SubtleAnimatedBackground from "./SubtleAnimatedBackground";
import UnifiedGenieAvatar from "./UnifiedGenieAvatar";
import type { Page } from "../types/navigation";
import type { LucideIcon } from "lucide-react";
import MarkdownMessage from "./MarkdownMessage";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "./ui/dialog";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "./ui/select";

const API_BASE = import.meta.env.VITE_API_BASE;

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
        page: "scan-document",
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

// Full language list (label -> code) copied from TerminoAiBookingPage
const LANGUAGES: { label: string; code: string }[] = [
    { label: "Global English", code: "en" },
    { label: "Australian English", code: "en_au" },
    { label: "British English", code: "en_uk" },
    { label: "US English", code: "en_us" },
    { label: "Spanish", code: "es" },
    { label: "French", code: "fr" },
    { label: "German", code: "de" },
    { label: "Italian", code: "it" },
    { label: "Portuguese", code: "pt" },
    { label: "Dutch", code: "nl" },
    { label: "Hindi", code: "hi" },
    { label: "Japanese", code: "ja" },
    { label: "Chinese", code: "zh" },
    { label: "Finnish", code: "fi" },
    { label: "Korean", code: "ko" },
    { label: "Polish", code: "pl" },
    { label: "Russian", code: "ru" },
    { label: "Turkish", code: "tr" },
    { label: "Ukrainian", code: "uk" },
    { label: "Vietnamese", code: "vi" },
    { label: "Afrikaans", code: "af" },
    { label: "Albanian", code: "sq" },
    { label: "Amharic", code: "am" },
    { label: "Arabic", code: "ar" },
    { label: "Armenian", code: "hy" },
    { label: "Assamese", code: "as" },
    { label: "Azerbaijani", code: "az" },
    { label: "Bashkir", code: "ba" },
    { label: "Basque", code: "eu" },
    { label: "Belarusian", code: "be" },
    { label: "Bengali", code: "bn" },
    { label: "Bosnian", code: "bs" },
    { label: "Breton", code: "br" },
    { label: "Bulgarian", code: "bg" },
    { label: "Burmese", code: "my" },
    { label: "Catalan", code: "ca" },
    { label: "Croatian", code: "hr" },
    { label: "Czech", code: "cs" },
    { label: "Danish", code: "da" },
    { label: "Estonian", code: "et" },
    { label: "Faroese", code: "fo" },
    { label: "Galician", code: "gl" },
    { label: "Georgian", code: "ka" },
    { label: "Greek", code: "el" },
    { label: "Gujarati", code: "gu" },
    { label: "Haitian", code: "ht" },
    { label: "Hausa", code: "ha" },
    { label: "Hawaiian", code: "haw" },
    { label: "Hebrew", code: "he" },
    { label: "Hungarian", code: "hu" },
    { label: "Icelandic", code: "is" },
    { label: "Indonesian", code: "id" },
    { label: "Javanese", code: "jw" },
    { label: "Kannada", code: "kn" },
    { label: "Kazakh", code: "kk" },
    { label: "Khmer", code: "km" },
    { label: "Lao", code: "lo" },
    { label: "Latin", code: "la" },
    { label: "Latvian", code: "lv" },
    { label: "Lingala", code: "ln" },
    { label: "Lithuanian", code: "lt" },
    { label: "Luxembourgish", code: "lb" },
    { label: "Macedonian", code: "mk" },
    { label: "Malagasy", code: "mg" },
    { label: "Malay", code: "ms" },
    { label: "Malayalam", code: "ml" },
    { label: "Maltese", code: "mt" },
    { label: "Maori", code: "mi" },
    { label: "Marathi", code: "mr" },
    { label: "Mongolian", code: "mn" },
    { label: "Nepali", code: "ne" },
    { label: "Norwegian", code: "no" },
    { label: "Norwegian Nynorsk", code: "nn" },
    { label: "Occitan", code: "oc" },
    { label: "Panjabi", code: "pa" },
    { label: "Pashto", code: "ps" },
    { label: "Persian", code: "fa" },
    { label: "Romanian", code: "ro" },
    { label: "Sanskrit", code: "sa" },
    { label: "Serbian", code: "sr" },
    { label: "Shona", code: "sn" },
    { label: "Sindhi", code: "sd" },
    { label: "Sinhala", code: "si" },
    { label: "Slovak", code: "sk" },
    { label: "Slovenian", code: "sl" },
    { label: "Somali", code: "so" },
    { label: "Sundanese", code: "su" },
    { label: "Swahili", code: "sw" },
    { label: "Swedish", code: "sv" },
    { label: "Tagalog", code: "tl" },
    { label: "Tajik", code: "tg" },
    { label: "Tamil", code: "ta" },
    { label: "Tatar", code: "tt" },
    { label: "Telugu", code: "te" },
    { label: "Thai", code: "th" },
    { label: "Tibetan", code: "bo" },
    { label: "Turkmen", code: "tk" },
    { label: "Urdu", code: "ur" },
    { label: "Uzbek", code: "uz" },
    { label: "Welsh", code: "cy" },
    { label: "Yiddish", code: "yi" },
    { label: "Yoruba", code: "yo" },
];

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

    // Voice modal state (copied pattern from TerminoAiBookingPage)
    const [showVoiceModal, setShowVoiceModal] = useState(false);
    const [selectedLang, setSelectedLang] = useState<string>("en");
    const [isRecording, setIsRecording] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const mediaStreamRef = useRef<MediaStream | null>(null);
    const recordedChunksRef = useRef<Blob[]>([]);

    // token for API calls that need auth (voice & chat)
    const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

    // Build the conversation string in the requested format
    // @ts-ignore
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
            // Build the full conversation string including the just-added user message.
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

    // -------- Voice capture logic (ported from TerminoAiBookingPage) --------
    const startRecording = async () => {
        try {
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                alert("Microphone access is not supported in this browser.");
                return;
            }
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaStreamRef.current = stream;

            const mr = new MediaRecorder(stream);
            mediaRecorderRef.current = mr;
            recordedChunksRef.current = [];

            mr.ondataavailable = (e) => {
                if (e.data && e.data.size > 0) {
                    recordedChunksRef.current.push(e.data);
                }
            };

            mr.onstop = async () => {
                // After stopping we immediately send the audio
                await sendAudioToBackend();
            };

            mr.start();
            setIsRecording(true);
        } catch (e) {
            console.error(e);
            alert("Could not start recording. Please allow microphone access.");
        }
    };

    const stopRecording = () => {
        try {
            if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
                setIsRecording(false);
                setIsProcessing(true); // show "Processing..." immediately after stopping
                mediaRecorderRef.current.stop();
            }
        } catch (e) {
            console.error(e);
            setIsProcessing(false);
        } finally {
            // stop tracks
            if (mediaStreamRef.current) {
                mediaStreamRef.current.getTracks().forEach((t) => t.stop());
                mediaStreamRef.current = null;
            }
        }
    };

    const sendAudioToBackend = async () => {
        try {
            const blob = new Blob(recordedChunksRef.current, { type: "audio/webm" });
            if (!blob.size) {
                setIsProcessing(false);
                return;
            }

            const formData = new FormData();
            formData.append("audio", blob, "voice.webm");
            formData.append("language", selectedLang);

            const response = await fetch(`${API_BASE}/voice/`, {
                method: "POST",
                headers: {
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                body: formData,
            });

            if (!response.ok) throw new Error(`Voice server error: ${response.status}`);

            const data = (await response.json()) as { text?: string };
            const transcript = data?.text ?? "";

            // Put transcribed text into the input field
            setInputValue(transcript);

            // Close modal
            setShowVoiceModal(false);
        } catch (e) {
            console.error(e);
            alert("Failed to process voice. Please try again.");
        } finally {
            setIsProcessing(false);
            recordedChunksRef.current = [];
        }
    };

    // Cleanup if modal closes while recording
    useEffect(() => {
        if (!showVoiceModal && isRecording) {
            stopRecording();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [showVoiceModal]);

    // Component unmount cleanup
    useEffect(() => {
        return () => {
            if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
                mediaRecorderRef.current.stop();
            }
            if (mediaStreamRef.current) {
                mediaStreamRef.current.getTracks().forEach((t) => t.stop());
            }
        };
    }, []);
    // -------- end voice capture logic --------

    return (
        <div
            className="min-h-dvh md:min-h-screen relative overflow-x-hidden overflow-y-auto flex flex-col"
            style={{
                background:
                    "linear-gradient(135deg, #0f1419 0%, #1a237e 50%, #0d47a1 100%)",
            }}
        >
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
                                        <MarkdownMessage content={message.content} isUser={message.type === "user"} />
                                        <p className="text-xs opacity-60 mt-1">
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
                                className="pr-20 bg-input-background border-glass-border focus:border-neon-purple/50 focus:ring-neon-purple/20"
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSendMessage();
                                    }
                                }}
                                style={{ backdropFilter: "blur(10px)" }}
                            />
                        </div>

                        {/* Microphone button (same look & behavior as TerminoAiBookingPage) */}
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button
                                onClick={() => setShowVoiceModal(true)}
                                className="bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-700/90 hover:to-indigo-700/90 h-10 w-10 p-0"
                                style={{ boxShadow: "0 0 20px rgba(99, 102, 241, 0.35)" }}
                                aria-label="Record voice"
                                title="Record voice"
                            >
                                <Mic className="h-4 w-4" />
                            </Button>
                        </motion.div>

                        {/* Send button */}
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

            {/* Voice Capture Modal (same UX as TerminoAiBookingPage) */}
            <Dialog open={showVoiceModal} onOpenChange={setShowVoiceModal}>
                <DialogContent className="glass-card border-glass-border">
                    <DialogHeader>
                        <DialogTitle className="text-foreground">Speak your request</DialogTitle>
                        <DialogDescription className="text-muted-foreground">
                            Choose your language, then tap the microphone. Tap again to finish and send.
                        </DialogDescription>
                    </DialogHeader>

                    {/* Language picker */}
                    <div className="space-y-2">
                        <label className="text-sm text-muted-foreground">Language</label>
                        <Select
                            value={selectedLang}
                            onValueChange={(v) => setSelectedLang(v)}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select a language" />
                            </SelectTrigger>
                            <SelectContent className="max-h-64 overflow-y-auto">
                                {LANGUAGES.map((l) => (
                                    <SelectItem key={l.code} value={l.code}>
                                        {l.label} — {l.code}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Big microphone button */}
                    <div className="flex flex-col items-center justify-center py-4">
                        <motion.button
                            onClick={() => (isRecording ? stopRecording() : startRecording())}
                            className={`rounded-full w-24 h-24 flex items-center justify-center text-white shadow-xl
                                ${isRecording ? "bg-red-600" : "bg-neon-purple"}
                            `}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            aria-label={isRecording ? "Stop recording" : "Start recording"}
                            title={isRecording ? "Stop recording" : "Start recording"}
                            disabled={isProcessing}
                        >
                            {isRecording ? <MicOff className="w-10 h-10" /> : <Mic className="w-10 h-10" />}
                        </motion.button>

                        {/* Status text */}
                        {!isProcessing && (
                            <p className="mt-3 text-sm text-muted-foreground">
                                {isRecording ? "Listening… tap to stop" : "Tap to start recording"}
                            </p>
                        )}

                        {/* Processing state */}
                        {isProcessing && (
                            <div className="mt-4 flex items-center gap-2 text-foreground">
                                <Loader2 className="h-5 w-5 animate-spin" />
                                <span className="font-medium">Processing...</span>
                            </div>
                        )}
                    </div>

                    {/* Helper note */}
                    <p className="text-xs text-muted-foreground">
                        Your recording will be sent with language code <span className="font-mono">{selectedLang}</span> for transcription.
                    </p>

                    {/* Optional close button if not recording/processing */}
                    <div className="flex justify-end gap-2">
                        <Button
                            variant="outline"
                            onClick={() => {
                                if (!isRecording && !isProcessing) setShowVoiceModal(false);
                            }}
                            disabled={isRecording || isProcessing}
                        >
                            Close
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
