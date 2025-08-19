import { motion } from "motion/react";
import { ArrowLeft, Bot, User, CheckCircle, Clock, Sparkles, Calendar, CalendarPlus, Send, Check } from "lucide-react";
import { Button } from "./ui/button";
import { useApp } from "./contexts/AppContext";
import SubtleAnimatedBackground from "./SubtleAnimatedBackground";
import UnifiedGenieAvatar from "./UnifiedGenieAvatar";
import type { Page } from "../types/navigation.ts";
import { useState, useEffect, useCallback } from "react";

interface TerminoMainPageProps {
    onNavigate: (page: Page) => void;
}

const API_BASE = import.meta.env.VITE_API_BASE

export default function TerminoSelectionPage({ onNavigate }: TerminoMainPageProps) {
    const { t } = useApp();

    // Telegram state
    const [telegramConnected, setTelegramConnected] = useState(false);
    const [tgLoading, setTgLoading] = useState(false);

    // Google Calendar state
    const [gcalConnected, setGcalConnected] = useState(false);
    const [gcalLoading, setGcalLoading] = useState(false);

    const options = [
        {
            id: "ai-book" as const,
            title: "I want Termino to book an appointment for me",
            description:
                "Let our AI handle everything - just tell me what you need and I'll find and book the best appointment for you.",
            icon: Bot,
            color: "from-blue-500 to-blue-600",
            hoverColor: "hover:from-blue-600 hover:to-blue-700",
            glowColor: "rgba(59, 130, 246, 0.4)",
            features: ["AI-powered booking", "Smart scheduling", "Best time suggestions"],
            avatar: "focused",
        },
        {
            id: "self-book" as const,
            title: "I will make the reservation myself",
            description:
                "Get guidance and support while you book your own appointment. I'll help you through the process step by step.",
            icon: User,
            color: "from-green-500 to-green-600",
            hoverColor: "hover:from-green-600 hover:to-green-700",
            glowColor: "rgba(16, 185, 129, 0.4)",
            features: ["Step-by-step guidance", "Form assistance", "Booking tips"],
            avatar: "happy",
        },
        {
            id: "already-booked" as const,
            title: "I have already booked this appointment",
            description:
                "Add your existing appointment to my calendar system for tracking, reminders, and easy sharing.",
            icon: CheckCircle,
            color: "from-purple-500 to-purple-600",
            hoverColor: "hover:from-purple-600 hover:to-purple-700",
            glowColor: "rgba(139, 92, 246, 0.4)",
            features: ["Calendar integration", "Smart reminders", "Easy sharing"],
            avatar: "success",
        },
    ];

    // --------------------------
    // Helpers: API calls
    // --------------------------

    async function fetchTelegramStatus(): Promise<boolean> {
        const token = localStorage.getItem("accessToken");
        if (!token) return false;
        const res = await fetch(`${API_BASE}/telegram/status/`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) return false;
        const data = await res.json();
        return Boolean(data.connected);
    }

    async function fetchGoogleStatus(): Promise<boolean> {
        const token = localStorage.getItem("accessToken");
        if (!token) return false;
        const res = await fetch(`${API_BASE}/google/status/`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) return false;
        const data = await res.json();
        return Boolean(data.connected);
    }

    async function waitForConnection({
                                         totalMs = 60000,
                                         startDelayMs = 1500,
                                         maxDelayMs = 4000,
                                     }: { totalMs?: number; startDelayMs?: number; maxDelayMs?: number } = {}) {
        let elapsed = 0;
        let delay = startDelayMs;
        while (elapsed < totalMs) {
            const connected = await fetchTelegramStatus();
            if (connected) return true;
            await new Promise((r) => setTimeout(r, delay));
            elapsed += delay;
            delay = Math.min(maxDelayMs, Math.floor(delay * 1.6));
        }
        return false;
    }

    // --------------------------
    // Telegram actions
    // --------------------------

    async function onConnectTelegram() {
        const token = localStorage.getItem("accessToken");
        if (!token) {
            alert("You must be logged in to connect Telegram.");
            return;
        }
        setTgLoading(true);
        try {
            const res = await fetch(`${API_BASE}/telegram/create-link/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!res.ok) {
                const err = await res.text();
                throw new Error(err);
            }
            const data = await res.json();
            window.open(data.deep_link, "_blank", "noopener,noreferrer");
            // flip automatically after user connects
            const connected = await waitForConnection();
            if (connected) setTelegramConnected(true);
        } catch (e: any) {
            alert(`Error: ${e?.message || e}`);
        } finally {
            setTgLoading(false);
        }
    }

    const onDisconnectTelegram = async () => {
        const token = localStorage.getItem("accessToken");
        if (!token) return alert("Please log in first.");
        const ok = window.confirm("Disconnect Telegram? You won't receive updates there anymore.");
        if (!ok) return;

        setTgLoading(true);
        try {
            const r = await fetch(`${API_BASE}/telegram/disconnect/`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!r.ok) throw new Error(await r.text());
            setTelegramConnected(false);
        } catch (e: any) {
            alert(`Failed to disconnect: ${e?.message || e}`);
        } finally {
            setTgLoading(false);
        }
    };

    const handleClickTg = () => {
        if (tgLoading) return;
        telegramConnected ? onDisconnectTelegram() : onConnectTelegram();
    };

    // --------------------------
    // Google actions
    // --------------------------

    const refreshGoogle = useCallback(() => {
        fetchGoogleStatus().then(setGcalConnected).catch(() => {});
    }, []);

    useEffect(() => {
        // initial statuses
        fetchTelegramStatus().then(setTelegramConnected).catch(() => {});
        refreshGoogle();
    }, [refreshGoogle]);

    // Re-check on focus/visibility
    useEffect(() => {
        const onFocus = () => {
            fetchTelegramStatus().then(setTelegramConnected).catch(() => {});
            refreshGoogle();
        };
        window.addEventListener("focus", onFocus);
        document.addEventListener("visibilitychange", onFocus);
        return () => {
            window.removeEventListener("focus", onFocus);
            document.removeEventListener("visibilitychange", onFocus);
        };
    }, [refreshGoogle]);

    // Listen to postMessage from Google callback page
    useEffect(() => {
        const handler = (event: MessageEvent) => {
            if (event?.data?.type === "google_calendar_connected") {
                refreshGoogle();
            }
        };
        window.addEventListener("message", handler);
        return () => window.removeEventListener("message", handler);
    }, [refreshGoogle]);

    const onGcalConnect = async () => {
        const token = localStorage.getItem("accessToken");
        if (!token) return alert("Please log in first.");
        setGcalLoading(true);
        try {
            const r = await fetch(`${API_BASE}/google/start/`, {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!r.ok) throw new Error(await r.text());
            const { auth_url } = await r.json();
            window.open(auth_url, "_blank");

            // optimistic poll for up to 60s
            const start = Date.now();
            const poll = async () => {
                const ok = await fetchGoogleStatus();
                if (ok) {
                    setGcalConnected(true);
                    return;
                }
                if (Date.now() - start < 60000) {
                    setTimeout(poll, 2000);
                }
            };
            poll();
        } catch (e: any) {
            alert(`Failed to start Google OAuth: ${e?.message || e}`);
        } finally {
            setGcalLoading(false);
        }
    };

    const onGcalDisconnect = async () => {
        const token = localStorage.getItem("accessToken");
        if (!token) return alert("Please log in first.");
        if (!window.confirm("Disconnect Google Calendar?")) return;

        setGcalLoading(true);
        try {
            const r = await fetch(`${API_BASE}/google/disconnect/`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!r.ok) throw new Error(await r.text());
            setGcalConnected(false);
        } catch (e: any) {
            alert(`Failed to disconnect: ${e?.message || e}`);
        } finally {
            setGcalLoading(false);
        }
    };

    const handleGcalClick = () => (gcalConnected ? onGcalDisconnect() : onGcalConnect());

    // --------------------------
    // Card click
    // --------------------------
    const handleOptionClick = (id: string) => {
        if (id === "ai-book") onNavigate("termino-ai-booking");
        else if (id === "self-book") onNavigate("termino-self-booking");
        else if (id === "already-booked") onNavigate("termino-manage-bookings");
    };

    return (
        <div
            className="min-h-dvh md:min-h-screen relative overflow-x-hidden overflow-y-auto flex flex-col"
            style={{
                background:
                    "linear-gradient(135deg, #0f1419 0%, #1a237e 50%, #0d47a1 100%)",
            }}
        >
            {/* Subtle Animated Background */}
            <SubtleAnimatedBackground variant="secondary" />

            {/* Header */}
            <div className="glass-card glass-glow-green relative z-10 px-4 py-4 border-b border-glass-border">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                    onNavigate("hub");
                                }}
                                className="hover:bg-glass-bg hover:text-neon-green"
                            >
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                        </motion.div>

                        <div>
                            <h1 className="text-lg text-foreground">{t("termino.title")}</h1>
                            <p className="text-xs text-muted-foreground">Choose your booking method</p>
                        </div>
                    </div>

                    {/* Right action buttons */}
                    <div className="absolute right-4 inset-y-0 flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                                onNavigate("termino-calendar");
                            }}
                            className="border-neon-green/30 text-neon-green hover:bg-neon-green/10"
                        >
                            <Calendar className="h-4 w-4 mr-1" />
                            Calendar
                        </Button>

                        {/* Telegram */}
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleClickTg}
                            disabled={tgLoading}
                            className={
                                telegramConnected
                                    ? "border-green-500/30 text-green-500 hover:bg-green-500/10"
                                    : "border-sky-500/30 text-sky-500 hover:bg-sky-500/10"
                            }
                        >
                            {telegramConnected ? (
                                <>
                                    <Check className="h-4 w-4 mr-1" />
                                    Telegram Connected
                                </>
                            ) : (
                                <>
                                    <Send className="h-4 w-4 mr-1" />
                                    Connect Telegram
                                </>
                            )}
                        </Button>

                        {/* Google Calendar */}
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleGcalClick}
                            disabled={gcalLoading}
                            className={
                                gcalConnected
                                    ? "border-green-500/30 text-green-500 hover:bg-green-500/10"
                                    : "border-blue-500/30 text-blue-500 hover:bg-blue-500/10"
                            }
                        >
                            {gcalConnected ? (
                                <>
                                    <Check className="h-4 w-4 mr-1" />
                                    Google Calendar Connected
                                </>
                            ) : (
                                <>
                                    <CalendarPlus className="h-4 w-4 mr-1" />
                                    Connect Google Calendar
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="relative z-10 px-6 py-8">
                {/* Welcome Section */}
                <motion.div
                    className="text-center mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="flex justify-center mb-4">
                        <UnifiedGenieAvatar size="lg" expression="happy" glowColor="green" />
                    </div>

                    <motion.h2
                        className="text-xl font-semibold text-foreground mb-2"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                    >
                        How do you want to book your appointment?
                    </motion.h2>

                    <motion.p
                        className="text-sm text-muted-foreground max-w-sm mx-auto"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.6 }}
                    >
                        Choose the method that works best for you. I'm here to help either way!
                    </motion.p>
                </motion.div>

                {/* Option Cards — HORIZONTAL LAYOUT */}
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {options.map((option, index) => (
                            <motion.div
                                key={option.id}
                                className="relative group cursor-pointer"
                                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                transition={{
                                    delay: 0.5 + index * 0.1,
                                    type: "spring",
                                    stiffness: 200,
                                    damping: 20,
                                }}
                                whileHover={{ scale: 1.02, y: -2 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => handleOptionClick(option.id)}
                            >
                                {/* Main Card */}
                                <div
                                    className={`glass-card rounded-3xl p-6 relative overflow-hidden border-2 border-glass-border group-hover:border-opacity-60 transition-all duration-300 h-full`}
                                    style={{
                                        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
                                        transition: "box-shadow 0.3s ease",
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.boxShadow = `0 0 30px ${option.glowColor}, 0 8px 32px rgba(0, 0, 0, 0.3)`;
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.boxShadow = "0 8px 32px rgba(0, 0, 0, 0.3)";
                                    }}
                                >
                                    {/* Animated Background Gradient */}
                                    <motion.div
                                        className={`absolute inset-0 bg-gradient-to-br ${option.color} opacity-10 rounded-3xl`}
                                        animate={{
                                            opacity: [0.1, 0.15, 0.1],
                                        }}
                                        transition={{
                                            duration: 4,
                                            repeat: Infinity,
                                            ease: "easeInOut",
                                            delay: index * 0.5,
                                        }}
                                    />

                                    {/* Content */}
                                    <div className="relative z-10">
                                        {/* Header with Icon and Avatar */}
                                        <div className="flex items-start gap-4 mb-4">
                                            {/* Icon */}
                                            <motion.div
                                                className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${option.color} flex items-center justify-center relative overflow-hidden shadow-lg`}
                                                animate={{
                                                    boxShadow: [
                                                        `0 0 20px ${option.glowColor}`,
                                                        `0 0 30px ${option.glowColor}`,
                                                        `0 0 20px ${option.glowColor}`,
                                                    ],
                                                }}
                                                transition={{ duration: 3, repeat: Infinity }}
                                                whileHover={{ rotate: [0, -2, 2, 0] }}
                                            >
                                                {/* Glossy overlay */}
                                                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl" />

                                                <motion.div
                                                    animate={{
                                                        scale: [1, 1.05, 1],
                                                    }}
                                                    transition={{
                                                        duration: 2,
                                                        repeat: Infinity,
                                                        ease: "easeInOut",
                                                    }}
                                                >
                                                    <option.icon className="h-8 w-8 text-white relative z-10" />
                                                </motion.div>

                                                {/* Pulse effect */}
                                                <motion.div
                                                    className="absolute inset-0 rounded-2xl bg-white/10"
                                                    animate={{ opacity: [0, 0.3, 0] }}
                                                    transition={{ duration: 2, repeat: Infinity }}
                                                />
                                            </motion.div>

                                            {/* Avatar */}
                                            <div className="flex-shrink-0">
                                                <UnifiedGenieAvatar
                                                    size="sm"
                                                    expression={option.avatar as any}
                                                    glowColor={option.id === "ai-book" ? "blue" : option.id === "self-book" ? "green" : "purple"}
                                                />
                                            </div>
                                        </div>

                                        {/* Title */}
                                        <motion.h3
                                            className="text-base font-semibold text-foreground mb-2 leading-tight"
                                            whileHover={{ x: 2 }}
                                            transition={{ type: "spring", stiffness: 300 }}
                                        >
                                            {option.title}
                                        </motion.h3>

                                        {/* Description */}
                                        <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{option.description}</p>

                                        {/* Features */}
                                        <div className="space-y-1">
                                            {option.features.map((feature, i) => (
                                                <motion.div
                                                    key={i}
                                                    className="flex items-center gap-2"
                                                    initial={{ opacity: 0, x: -10 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: 0.8 + index * 0.1 + i * 0.05 }}
                                                >
                                                    <div className={`w-1 h-1 rounded-full bg-gradient-to-r ${option.color}`} />
                                                    <span className="text-xs text-muted-foreground">{feature}</span>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Interactive particles on hover */}
                                    <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
                                        {Array.from({ length: 4 }, (_, i) => (
                                            <motion.div
                                                key={i}
                                                className="absolute w-1 h-1 rounded-full"
                                                style={{
                                                    backgroundColor: option.glowColor.replace("0.4", "0.8"),
                                                    left: `${30 + Math.random() * 40}%`,
                                                    top: `${30 + Math.random() * 40}%`,
                                                }}
                                                initial={{ scale: 0, opacity: 0 }}
                                                whileHover={{
                                                    scale: [0, 1, 0],
                                                    opacity: [0, 1, 0],
                                                    y: [0, -15, 0],
                                                }}
                                                transition={{
                                                    duration: 1.2,
                                                    delay: i * 0.1,
                                                    ease: "easeOut",
                                                }}
                                            />
                                        ))}
                                    </div>

                                    {/* Selection indicator */}
                                    <motion.div
                                        className={`absolute top-4 right-4 w-6 h-6 rounded-full bg-gradient-to-r ${option.color} flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                                        whileHover={{ scale: 1.1 }}
                                    >
                                        <motion.div initial={{ scale: 0 }} whileHover={{ scale: 1 }} transition={{ delay: 0.1 }}>
                                            <Sparkles className="h-3 w-3 text-white" />
                                        </motion.div>
                                    </motion.div>

                                    {/* Animated border */}
                                    <motion.div
                                        className={`absolute inset-0 rounded-3xl border-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                                        style={{
                                            borderImage: `linear-gradient(45deg, ${option.glowColor}, transparent, ${option.glowColor}) 1`,
                                        }}
                                        animate={{
                                            background: [
                                                `linear-gradient(0deg, ${option.glowColor}10, transparent)`,
                                                `linear-gradient(180deg, ${option.glowColor}15, transparent)`,
                                                `linear-gradient(360deg, ${option.glowColor}10, transparent)`,
                                            ],
                                        }}
                                        transition={{ duration: 3, repeat: Infinity }}
                                    />
                                </div>

                                {/* Enhanced glow pulse */}
                                <motion.div
                                    className="absolute inset-0 rounded-3xl pointer-events-none"
                                    style={{
                                        background: `radial-gradient(circle, ${option.glowColor}, transparent)`,
                                        filter: "blur(20px)",
                                    }}
                                    animate={{
                                        scale: [1, 1.05, 1],
                                        opacity: [0.3, 0.5, 0.3],
                                    }}
                                    transition={{
                                        duration: 2.5 + index * 0.3,
                                        repeat: Infinity,
                                        ease: "easeInOut",
                                    }}
                                />
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Bottom Helper Text */}
                <motion.div
                    className="text-center mt-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1, duration: 0.6 }}
                >
                    <p className="text-xs text-muted-foreground max-w-xs mx-auto">
                        Don't worry - you can always change your mind later or try different methods!
                    </p>

                    <motion.div className="flex justify-center mt-4" animate={{ y: [0, -2, 0] }} transition={{ duration: 2, repeat: Infinity }}>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span>Available 24/7</span>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
}
