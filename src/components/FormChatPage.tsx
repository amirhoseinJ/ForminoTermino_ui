import { useState, useRef, useEffect } from "react";
import { ArrowLeft, Send, Mic, MicOff, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { motion, AnimatePresence } from "motion/react";
import Robot3DAvatar from "./Robot3DAvatar";
import AnimatedBackground from "./AnimatedBackground";
import SuccessAnimation from "./SuccessAnimation";
import type { Page } from "../types/navigation";
import { toast } from "react-hot-toast";
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

interface StartSessionResp {
    sessionId: string;
    message: string;
    field?: string;
    done: boolean;
    schema?: Record<string, string>;
}

interface MessageResp {
    message: string;
    field?: string;
    done: boolean;
    schema?: Record<string, string>;
}

interface Message {
    id: string;
    content: string;
    sender: "user" | "ai";
    timestamp: Date;
    schema?: Record<string, string>;
}

interface FormChatPageProps {
    onNavigate: (page: Page, data?: { pdfUrl?: string; fileName?: string }) => void;
    formData: { description: string; documentId: string };
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

export default function FormChatPage({ onNavigate, formData }: FormChatPageProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [sessionId, setSessionId] = useState<string | null>(null);
    const [isDone, setIsDone] = useState(false);
    const [yesSubmitting, setYesSubmitting] = useState(false);

    // Voice modal state (ported from TerminoAiBookingPage)
    const [showVoiceModal, setShowVoiceModal] = useState(false);
    const [selectedLang, setSelectedLang] = useState<string>("en");
    const [isRecording, setIsRecording] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const mediaStreamRef = useRef<MediaStream | null>(null);
    const recordedChunksRef = useRef<Blob[]>([]);

    // helper to grab the latest schema we received from the AI
    const getLatestSchema = () => {
        for (let i = messages.length - 1; i >= 0; i--) {
            if (messages[i]?.schema) return messages[i].schema;
        }
        return null;
    };

    const handleConfirmYes = async () => {
        const schema = getLatestSchema();
        if (!schema) {
            toast.error("No form schema to submit yet.");
            return;
        }
        if (!sessionId) {
            toast.error("Missing session. Please restart.");
            return;
        }

        try {
            setYesSubmitting(true);
            const token = localStorage.getItem("accessToken");
            const res = await fetch(`${API_BASE}/form-chat/sessions/${sessionId}/confirm`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: token ? `Bearer ${token}` : "",
                },
                body: JSON.stringify({
                    schema,
                    documentId: formData.documentId,
                }),
            });

            // @ts-ignore
            const payload = await res.json();

            if (!res.ok) {
                const err = await res.text();
                throw new Error(err || "Failed confirming schema.");
            }

            toast.success("Form filled & saved as PDF!");
            onNavigate("form-review", {
                pdfUrl: payload.pdfUrl,
                fileName: payload.name,
            });
        } catch (e: any) {
            console.error(e);
            toast.error("Could not submit schema. Please try again.");
        } finally {
            setYesSubmitting(false);
        }
    };

    useEffect(() => {
        setMessages([
            {
                id: "desc",
                content: formData.description || "An Error Occured. Please try again.",
                sender: "ai",
                timestamp: new Date(),
            },
        ]);
    }, [formData.description]);

    // After initial description is rendered, start backend session
    const [aiThinking, setAiThinking] = useState(false);
    useEffect(() => {
        if (!formData.description) return;

        const start = async () => {
            setAiThinking(true);
            try {
                const token = localStorage.getItem("accessToken");
                const res = await fetch(`${API_BASE}/form-chat/sessions`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: token ? `Bearer ${token}` : "",
                    },
                    body: JSON.stringify({
                        description: formData.description,
                        documentId: formData.documentId,
                    }),
                });
                const data: StartSessionResp = await res.json();

                if (!res.ok) throw new Error(data as any);

                setSessionId(data.sessionId);

                setMessages((prev) => [
                    ...prev,
                    {
                        id: crypto.randomUUID(),
                        content: data.message,
                        schema: data.done ? data.schema : undefined,
                        sender: "ai",
                        timestamp: new Date(),
                    },
                ]);

                if (data.done) {
                    setIsDone(true);
                    setTimeout(() => setShowSuccess(true), 800);
                }
            } catch (e: any) {
                setMessages((prev) => [
                    ...prev,
                    {
                        id: crypto.randomUUID(),
                        content: "Sorry—couldn’t start the form session.",
                        sender: "ai",
                        timestamp: new Date(),
                    },
                ]);
            } finally {
                setAiThinking(false);
            }
        };

        start();
    }, [formData.description, formData.documentId]);

    const [inputValue, setInputValue] = useState("");
    const [showSuccess, setShowSuccess] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async () => {
        if (!inputValue.trim()) return;
        if (!sessionId) {
            toast.error("Error!");
            return;
        }
        const text = inputValue.trim();
        const userMessage: Message = {
            id: Date.now().toString(),
            content: text,
            sender: "user",
            timestamp: new Date(),
        };
        setMessages((prev) => [...prev, userMessage]);
        setInputValue("");
        setAiThinking(true);

        try {
            const token = localStorage.getItem("accessToken");
            const res = await fetch(`${API_BASE}/form-chat/sessions/${sessionId}/message`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: token ? `Bearer ${token}` : "",
                },
                body: JSON.stringify({ text }),
            });
            const data: MessageResp = await res.json();
            if (!res.ok) throw new Error(data as any);

            setMessages((prev) => [
                ...prev,
                {
                    id: (Date.now() + 1).toString(),
                    content: data.message,
                    schema: data.done ? data.schema : undefined,
                    sender: "ai",
                    timestamp: new Date(),
                },
            ]);

            if (data.done) {
                setIsDone(true);
                setTimeout(() => setShowSuccess(true), 800);
            }
        } catch (e: any) {
            setMessages((prev) => [
                ...prev,
                {
                    id: (Date.now() + 1).toString(),
                    content: "Oops—something went wrong saving that. Please try again.",
                    sender: "ai",
                    timestamp: new Date(),
                },
            ]);
        } finally {
            setAiThinking(false);
        }
    };

    const handleSuccessComplete = () => {
        setShowSuccess(false);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            handleSendMessage();
        }
    };

    // -------- Voice capture logic (ported) --------
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
                setIsProcessing(true);
                mediaRecorderRef.current.stop();
            }
        } catch (e) {
            console.error(e);
            setIsProcessing(false);
        } finally {
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

            const token = localStorage.getItem("accessToken");
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

    // Cleanup on unmount
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
                background: "linear-gradient(135deg, #0f1419 0%, #1a237e 50%, #0d47a1 100%)",
            }}
        >
            {/* Animated Background */}
            <AnimatedBackground />

            {/* Header */}
            <div className="glass-card glass-glow-purple relative z-10 px-4 py-6 flex-shrink-0 border-b border-glass-border">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onNavigate("form-submission")}
                            className="hover:bg-glass-bg hover:text-neon-purple"
                        >
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                        <div className="flex items-center gap-3">
                            <Robot3DAvatar size="sm" isThinking={aiThinking} expression={aiThinking ? "processing" : "happy"} />
                            <div>
                                <h1 className="text-lg text-foreground">Form Assistant</h1>
                                <p className="text-xs text-muted-foreground">{aiThinking ? "Processing..." : "Online & Ready"}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 relative z-10">
                <AnimatePresence>
                    {messages.map((message) => (
                        <motion.div
                            key={message.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                            className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                        >
                            <div className={`flex gap-3 max-w-[80%] ${message.sender === "user" ? "flex-row-reverse" : "flex-row"}`}>
                                {message.sender === "ai" && <Robot3DAvatar size="sm" isThinking={false} expression="happy" />}
                                <motion.div
                                    className={`p-4 rounded-2xl relative overflow-hidden ${
                                        message.sender === "user"
                                            ? "bg-gradient-to-r from-neon-purple to-neon-purple/80 text-white"
                                            : "glass-card border border-glass-border"
                                    }`}
                                    style={{
                                        backdropFilter: "blur(20px)",
                                        boxShadow:
                                            message.sender === "user"
                                                ? "0 0 20px rgba(139, 92, 246, 0.3)"
                                                : "0 8px 32px rgba(0, 0, 0, 0.3)",
                                    }}
                                    initial={{ scale: 0.8 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                                >
                                    <div className="text-sm leading-relaxed">
                                        <MarkdownMessage content={message.content} isUser={message.sender === "user"} />
                                        {message.schema && (
                                            <ul className="mt-2 space-y-1">
                                                {Object.entries(message.schema).map(([key, value]) => (
                                                    <li key={key}>
                                                        <strong>{key}:</strong> {value}
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                    <p className={`text-xs mt-2 ${message.sender === "user" ? "text-white/70" : "text-muted-foreground"}`}>
                                        {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                    </p>

                                    {/* Message glow effect */}
                                    <div
                                        className="absolute inset-0 rounded-2xl pointer-events-none"
                                        style={{
                                            background:
                                                message.sender === "user"
                                                    ? "radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.1), transparent)"
                                                    : "radial-gradient(circle at 50% 50%, rgba(16, 185, 129, 0.05), transparent)",
                                            filter: "blur(10px)",
                                        }}
                                    />
                                </motion.div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {/* AI Thinking Indicator */}
                {aiThinking && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex justify-start">
                        <div className="flex gap-3">
                            <Robot3DAvatar size="sm" isThinking={true} expression="processing" />
                            <div className="glass-card border border-glass-border p-4 rounded-2xl backdrop-blur-20">
                                <div className="flex gap-2">
                                    {[0, 1, 2].map((i) => (
                                        <motion.div
                                            key={i}
                                            className="w-2 h-2 bg-neon-green rounded-full"
                                            animate={{ opacity: [0.3, 1, 0.3] }}
                                            transition={{
                                                duration: 1,
                                                repeat: Infinity,
                                                delay: i * 0.2,
                                            }}
                                            style={{ boxShadow: "0 0 8px rgba(16, 185, 129, 0.5)" }}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="glass-card border-t border-glass-border p-4 flex-shrink-0 relative z-10">
                {isDone ? (
                    <div className="flex gap-3 justify-center">
                        <Button onClick={handleConfirmYes} disabled={yesSubmitting} className="bg-neon-green text-white hover:bg-neon-green/90">
                            {yesSubmitting ? "Submitting..." : "Yes"}
                        </Button>

                        <Button onClick={() => onNavigate("upload-file")} variant="destructive">
                            No
                        </Button>
                    </div>
                ) : (
                    <div className="flex gap-3 items-end">
                        <div className="flex-1 relative">
                            <Input
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder={sessionId ? "Type your answer..." : "Setting things up…"}
                                className="pr-24 bg-input-background border-glass-border focus:border-neon-green/50 focus:ring-neon-green/20"
                                disabled={aiThinking || !sessionId}
                                style={{ backdropFilter: "blur(10px)" }}
                            />
                        </div>

                        {/* Microphone button (opens modal) */}
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button
                                onClick={() => setShowVoiceModal(true)}
                                disabled={aiThinking || !sessionId}
                                className="bg-gradient-to-r from-neon-green to-emerald-600 hover:from-neon-green/90 hover:to-emerald-600/90 h-10 w-10 p-0"
                                style={{ boxShadow: "0 0 20px rgba(16, 185, 129, 0.35)" }}
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
                                disabled={!inputValue.trim() || aiThinking || !sessionId}
                                className="h-10 w-10 p-0 bg-gradient-to-r from-neon-green to-neon-green/80 hover:from-neon-green/90 hover:to-neon-green/70"
                                style={{ boxShadow: "0 0 20px rgba(16, 185, 129, 0.3)" }}
                            >
                                <Send className="h-4 w-4" />
                            </Button>
                        </motion.div>
                    </div>
                )}
            </div>

            {/* Voice Capture Modal */}
            <Dialog open={showVoiceModal} onOpenChange={setShowVoiceModal}>
                <DialogContent className="glass-card border-glass-border">
                    <DialogHeader>
                        <DialogTitle className="text-foreground">Speak your answer</DialogTitle>
                        <DialogDescription className="text-muted-foreground">
                            Choose your language, then tap the microphone. Tap again to finish and send.
                        </DialogDescription>
                    </DialogHeader>

                    {/* Language picker */}
                    <div className="space-y-2">
                        <label className="text-sm text-muted-foreground">Language</label>
                        <Select value={selectedLang} onValueChange={(v) => setSelectedLang(v)}>
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
                ${isRecording ? "bg-red-600" : "bg-neon-green"}
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
                        Your recording will be sent with language code <span className="font-mono">{selectedLang}</span> for
                        transcription.
                    </p>

                    {/* Optional close button */}
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

            {/* Success Animation */}
            <SuccessAnimation
                isVisible={showSuccess}
                onComplete={handleSuccessComplete}
                title="Form Processing Complete!"
                message="Your form has been successfully processed and is ready for review."
            />
        </div>
    );
}
