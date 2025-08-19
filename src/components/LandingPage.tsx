import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Button } from "./ui/button";
import {
    Sparkles,
    Wand2,
    ArrowRight,
    Shield,
    Zap,
    Users,
    Globe,
    Clock,
    CheckCircle,
    Star,
    MessageSquare,
    Calendar,
} from "lucide-react";
import GlobalAnimatedBackground from "./GlobalAnimatedBackground";
import { useApp } from "./contexts/AppContext";

interface LandingPageProps {
    onSignIn: () => void;
}

export default function LandingPage({ onSignIn }: LandingPageProps) {
    const { t } = useApp();

    // ---- UI reveal orchestration (styling/structure only) ----
    const [showMagicSmoke, setShowMagicSmoke] = useState(false);
    const [showSuperAppBox, setShowSuperAppBox] = useState(false);
    const [showServices, setShowServices] = useState(false);

    useEffect(() => {
        const timer1 = setTimeout(() => setShowMagicSmoke(true), 1000);
        const timer2 = setTimeout(() => setShowSuperAppBox(true), 2000);
        const timer3 = setTimeout(() => setShowServices(true), 2800);
        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
            clearTimeout(timer3);
        };
    }, []);

    const benefits = [
        {
            icon: Shield,
            title: "Secure & Trustworthy",
            description: "Highest security standards for your personal data",
        },
        {
            icon: Zap,
            title: "Lightning Fast & Efficient",
            description: "AI-powered automation saves you valuable time",
        },
        {
            icon: Users,
            title: "User-Friendly",
            description: "Intuitive interface designed for all ages",
        },
        {
            icon: Globe,
            title: "Available Everywhere",
            description: "Seamless synchronization across all your devices",
        },
    ];

    return (
        <div
            className="min-h-screen flex flex-col"
            style={{
                background:
                    "linear-gradient(135deg, #0f1419 0%, #1a237e 50%, #0d47a1 100%)",
            }}
        >
            {/* Global animated BG from code 2 */}
            <GlobalAnimatedBackground variant="landing" />

            {/* ------------------------- Hero Section ------------------------- */}
            <div className="flex-1 flex flex-col items-center justify-center px-6 py-16 relative overflow-hidden z-10">
                {/* Floating decorative sparkles */}
                <div className="absolute inset-0 pointer-events-none">
                    <motion.div
                        className="absolute top-20 left-10"
                        animate={{ y: [0, -10, 0], opacity: [0.3, 0.8, 0.3] }}
                        transition={{ duration: 3, repeat: Infinity }}
                    >
                        <Sparkles className="w-4 h-4 text-neon-purple" />
                    </motion.div>
                    <motion.div
                        className="absolute top-32 right-16"
                        animate={{ y: [0, -15, 0], opacity: [0.4, 0.9, 0.4] }}
                        transition={{ duration: 4, repeat: Infinity, delay: 1 }}
                    >
                        <Sparkles className="w-3 h-3 text-neon-green" />
                    </motion.div>
                    <motion.div
                        className="absolute bottom-40 left-20"
                        animate={{ y: [0, -8, 0], opacity: [0.2, 0.7, 0.2] }}
                        transition={{ duration: 3.5, repeat: Infinity, delay: 2 }}
                    >
                        <Sparkles className="w-5 h-5 text-neon-purple/70" />
                    </motion.div>
                </div>

                {/* Centerpiece / "Genie" emblem */}
                <motion.div
                    className="text-center mb-8"
                    initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                >
                    <div className="relative inline-block">
                        <motion.div
                            className="relative"
                            animate={{ y: [0, -8, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        >
                            <div className="bg-gradient-to-br from-neon-purple to-purple-800 rounded-full p-8 shadow-2xl relative overflow-hidden glass-card">
                                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-full" />
                                <Wand2 className="w-16 h-16 text-white relative z-10" />
                                <motion.div
                                    className="absolute -top-2 -right-2"
                                    animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
                                    transition={{ duration: 3, repeat: Infinity }}
                                >
                                    <Sparkles className="w-8 h-8 text-yellow-300" />
                                </motion.div>
                            </div>
                        </motion.div>

                        {/* Magic Smoke Animation */}
                        {showMagicSmoke && (
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4">
                                {[...Array(8)].map((_, i) => (
                                    <motion.div
                                        key={i}
                                        className="absolute w-2 h-2 bg-gradient-to-t from-neon-purple to-transparent rounded-full"
                                        style={{ left: `${Math.random() * 40 - 20}px` }}
                                        animate={{
                                            y: [-10, -60],
                                            opacity: [0, 0.8, 0],
                                            scale: [0.5, 1.2, 0.8],
                                        }}
                                        transition={{
                                            duration: 3,
                                            repeat: Infinity,
                                            delay: i * 0.3,
                                            ease: "easeOut",
                                        }}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Title/Subtitle use original i18n keys (main logic preserved) */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                        className="mt-6"
                    >
                        <h1 className="text-4xl md:text-6xl font-bold text-white mb-2 drop-shadow-lg">
                            {t("landing.title")}
                        </h1>
                        <p className="text-xl md:text-2xl text-foreground">
                            {t("landing.subtitle")}
                        </p>
                    </motion.div>
                </motion.div>

                {/* --------------------- Super App Box (services) --------------------- */}
                {showSuperAppBox && (
                    <motion.div
                        className="glass-card rounded-3xl p-8 max-w-md w-full mx-auto border border-glass-border"
                        initial={{ opacity: 0, scale: 0.5, y: 50, filter: "blur(10px)" }}
                        animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                    >
                        <div className="text-center mb-6">
                            <h2 className="text-2xl font-bold text-white mb-2">
                                {t("landing.title")}
                            </h2>
                            <p className="text-muted-foreground">
                                {/* short neutral tagline; style-only addition */}
                                All your assistants in one place
                            </p>
                        </div>

                        {/* Service Icons (use your original services & copy) */}
                        {showServices && (
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                {/* Formino */}
                                <motion.div
                                    className="glass-card rounded-2xl p-4 hover:glass-glow-purple transition-all duration-300 cursor-pointer border border-glass-border"
                                    initial={{ opacity: 0, scale: 0.3, y: 20 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    transition={{ duration: 0.8, delay: 0.2 }}
                                    whileHover={{ y: -4 }}
                                >
                                    <div className="text-center">
                                        <div className="bg-neon-purple rounded-full p-3 w-12 h-12 mx-auto mb-3">
                                            <MessageSquare className="w-6 h-6 text-white" />
                                        </div>
                                        <h3 className="text-white font-semibold text-sm">
                                            {t("landing.formino")}
                                        </h3>
                                        <p className="text-muted-foreground text-xs mt-1">
                                            {t("landing.formino.subtitle")}
                                        </p>
                                    </div>
                                </motion.div>

                                {/* Termino */}
                                <motion.div
                                    className="glass-card rounded-2xl p-4 hover:glass-glow-green transition-all duration-300 cursor-pointer border border-glass-border"
                                    initial={{ opacity: 0, scale: 0.3, y: 20 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    transition={{ duration: 0.8, delay: 0.4 }}
                                    whileHover={{ y: -4 }}
                                >
                                    <div className="text-center">
                                        <div className="bg-neon-green rounded-full p-3 w-12 h-12 mx-auto mb-3">
                                            <Calendar className="w-6 h-6 text-white" />
                                        </div>
                                        <h3 className="text-white font-semibold text-sm">
                                            {t("landing.termino")}
                                        </h3>
                                        <p className="text-muted-foreground text-xs mt-1">
                                            {t("landing.termino.subtitle")}
                                        </p>
                                    </div>
                                </motion.div>
                            </div>
                        )}

                        {/* Coming Soon / placeholders to match structure */}
                        {showServices && (
                            <div className="grid grid-cols-3 gap-3">
                                {[
                                    { icon: MessageSquare, name: "Chatino" },
                                    { icon: Globe, name: "Webino" },
                                    { icon: Star, name: "More..." },
                                ].map((service, index) => (
                                    <motion.div
                                        key={service.name}
                                        className="glass-card rounded-xl p-3 opacity-60 border border-glass-border"
                                        initial={{ opacity: 0, scale: 0.3 }}
                                        animate={{ opacity: 0.6, scale: 1 }}
                                        transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                                    >
                                        <div className="text-center">
                                            <div className="bg-muted-foreground rounded-full p-2 w-8 h-8 mx-auto mb-2">
                                                <service.icon className="w-4 h-4 text-background" />
                                            </div>
                                            <h4 className="text-white text-xs font-medium">
                                                {service.name}
                                            </h4>
                                            <p className="text-muted-foreground text-xs">Coming Soon</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </motion.div>
                )}

                {/* CTA Button (preserves onSignIn + i18n) */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 3.5, duration: 0.8 }}
                    className="mt-8"
                >
                    <Button
                        onClick={onSignIn}
                        size="lg"
                        className="bg-gradient-to-r from-neon-purple to-neon-green hover:from-neon-purple/90 hover:to-neon-green/90 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                        style={{ boxShadow: "0 0 30px rgba(139, 92, 246, 0.3)" }}
                    >
                        <Sparkles className="w-5 h-5 mr-2" />
                        {t("landing.signin")}
                        <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                </motion.div>
            </div>

            {/* ------------------------- Info Section ------------------------- */}
            <div className="glass-card border-t border-glass-border relative z-10">
                <div className="max-w-6xl mx-auto px-6 py-16">
                    {/* Section Header */}
                    <motion.div
                        className="text-center mb-12"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                            Why Choose {t("landing.title")}?
                        </h2>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Discover the future of digital assistance with our revolutionary
                            super app
                        </p>
                    </motion.div>

                    {/* Benefits Grid */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
                        {benefits.map((benefit, index) => (
                            <motion.div
                                key={benefit.title}
                                className="glass-card rounded-2xl p-6 text-center hover:glass-glow-purple transition-all duration-300 border border-glass-border"
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                viewport={{ once: true }}
                                whileHover={{ y: -8 }}
                            >
                                <div className="bg-gradient-to-br from-neon-purple to-purple-800 rounded-full p-4 w-16 h-16 mx-auto mb-4">
                                    <benefit.icon className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-white font-semibold text-lg mb-2">
                                    {benefit.title}
                                </h3>
                                <p className="text-muted-foreground text-sm leading-relaxed">
                                    {benefit.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>

                    {/* Feature Highlights (kept from code 2, neutral copy) */}
                    <motion.div
                        className="glass-card rounded-3xl p-8 border border-glass-border"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <div className="grid md:grid-cols-2 gap-8 items-center">
                            <div>
                                <h3 className="text-2xl font-bold text-white mb-6">
                                    Your AI Assistants in Detail
                                </h3>
                                <div className="space-y-4">
                                    <div className="flex items-start gap-3">
                                        <CheckCircle className="w-6 h-6 text-neon-green mt-1 flex-shrink-0" />
                                        <div>
                                            <h4 className="text-white font-semibold">
                                                {t("landing.formino")} — Smart Forms
                                            </h4>
                                            <p className="text-muted-foreground text-sm">
                                                Automatic form filling and processing for all documents
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <CheckCircle className="w-6 h-6 text-neon-green mt-1 flex-shrink-0" />
                                        <div>
                                            <h4 className="text-white font-semibold">
                                                {t("landing.termino")} — Smart Scheduling
                                            </h4>
                                            <p className="text-muted-foreground text-sm">
                                                AI-powered appointment booking and calendar management
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <Clock className="w-6 h-6 text-neon-purple mt-1 flex-shrink-0" />
                                        <div>
                                            <h4 className="text-white font-semibold">24/7 Availability</h4>
                                            <p className="text-muted-foreground text-sm">
                                                Your AI assistants work around the clock for you
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="relative inline-block">
                                    <motion.div
                                        className="glass-card rounded-2xl p-8 border border-glass-border"
                                        animate={{ y: [0, -10, 0] }}
                                        transition={{
                                            duration: 3,
                                            repeat: Infinity,
                                            ease: "easeInOut",
                                        }}
                                    >
                                        <div className="flex items-center justify-center gap-4 mb-4">
                                            <div className="bg-neon-purple rounded-full p-3">
                                                <MessageSquare className="w-6 h-6 text-white" />
                                            </div>
                                            <div className="bg-neon-green rounded-full p-3">
                                                <Calendar className="w-6 h-6 text-white" />
                                            </div>
                                        </div>
                                        <p className="text-white font-semibold">Perfect Collaboration</p>
                                        <p className="text-muted-foreground text-sm">
                                            Two AI assistants, infinite possibilities
                                        </p>
                                    </motion.div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Footer */}
                    <motion.div
                        className="text-center mt-16 pt-8 border-t border-glass-border"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <p className="text-muted-foreground">
                            © 2025 Mein Genie. Your magical journey into the future of digital
                            assistance.
                        </p>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
