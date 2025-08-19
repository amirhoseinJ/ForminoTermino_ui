// TerminoAiBookingPage.tsx
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Send, Check, Mic, MicOff, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { motion, AnimatePresence } from "motion/react";
import { useApp } from "./contexts/AppContext";
import SubtleAnimatedBackground from "./SubtleAnimatedBackground";
import UnifiedGenieAvatar from "./UnifiedGenieAvatar";
import type { Page } from "../types/navigation";
import MarkdownMessage from "./MarkdownMessage.tsx";
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

interface TerminoAiBookingPageProps {
    onNavigate: (page: Page) => void;
}

interface ChatMessage {
    id: string;
    type: "user" | "ai";
    content: string;
    timestamp: Date;
}

const API_BASE = import.meta.env.VITE_API_BASE;

// Full language list (label -> code)
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

    // Voice modal state
    const [showVoiceModal, setShowVoiceModal] = useState(false);
    const [selectedLang, setSelectedLang] = useState<string>("en");
    const [isRecording, setIsRecording] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const mediaStreamRef = useRef<MediaStream | null>(null);
    const recordedChunksRef = useRef<Blob[]>([]);

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

            const data = (await response.json()) as {
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

    // -------- Voice capture logic --------
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

    useEffect(() => {
        return () => {
            // component unmount cleanup
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
                                className="pr-20 bg-input-background border-glass-border focus:border-neon-purple/50 focus:ring-neon-purple/20"
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

                        {/* Microphone button */}
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button
                                onClick={() => setShowVoiceModal(true)}
                                disabled={showSuccessOverlay}
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

            {/* Voice Capture Modal */}
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
                                The appointment has been added to your calendar.
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
