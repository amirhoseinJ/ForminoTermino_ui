import { useState } from "react";
import { motion } from "motion/react";
import { User, LogOut } from "lucide-react";
import { Button } from "./ui/button";
import MeinGenieLogo from "./MeinGenieLogo";
import HelpTutorial from "./HelpTutorial";
import GlobalAnimatedBackground from "./GlobalAnimatedBackground";
import AnimatedHelpRobot from "./AnimatedHelpRobot";
import type { Page } from "../types/navigation";
import { EnhancedServiceIcon } from "./EnhancedServiceIcons";

interface MainHubProps {
    onNavigate: (page: Page) => void;
    onLogout: () => void;
}

export default function MainHub({ onNavigate, onLogout }: MainHubProps) {
    const [showHelp, setShowHelp] = useState(false);

    // Hover/touch states for the Code-2 style affordances
    const [hoveredService, setHoveredService] = useState<string | null>(null);
    const [touchedService, setTouchedService] = useState<string | null>(null);

    const handleServiceInteractionStart = (serviceId: string) => {
        setHoveredService(serviceId);
        setTouchedService(serviceId);
    };

    const handleServiceInteractionEnd = () => {
        setHoveredService(null);
        setTimeout(() => setTouchedService(null), 300);
    };

    const isServiceActive = (serviceId: string) =>
        hoveredService === serviceId || touchedService === serviceId;

    const services = [
        {
            id: "formino",
            title: "Formino",
            description: "AI Form Assistant for instant document completion",
            color: "purple" as const,
            page: "formino" as Page,
            features: ["Multi-language support", "Smart completion", "Document scanning"],
            delay: 0.4,
        },
        {
            id: "termino",
            title: "Termino",
            description: "AI Appointment Booker for effortless scheduling",
            color: "green" as const,
            page: "termino" as Page,
            features: ["Smart booking", "Calendar sync", "Reminder system"],
            delay: 0.6,
        },
    ];

    return (
        <div
            className="h-screen relative overflow-hidden flex flex-col"
            style={{
                background: "linear-gradient(135deg, #0f1419 0%, #1a237e 50%, #0d47a1 100%)",
            }}
        >
            <GlobalAnimatedBackground variant="primary" />

            {/* Compact Header (Code 2 style) */}
            <div className="relative z-10 p-3 flex-shrink-0">
                <div className="flex justify-between items-center">
                    <motion.div
                        className="flex items-center"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <MeinGenieLogo size="sm" animated={true} showText={true} />
                    </motion.div>

                    <motion.div
                        className="flex gap-2 profile-buttons"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.7 }}
                    >
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onNavigate("profile")}
                                className="hover:glass-glow-purple transition-all duration-300 p-2"
                                style={{
                                    background:
                                        "linear-gradient(135deg, #0f1419 0%, #1a237e 50%, #0d47a1 100%)",
                                    backdropFilter: "blur(20px)",
                                    border: "1px solid rgba(139, 92, 246, 0.2)",
                                }}
                            >
                                <motion.div
                                    whileHover={{ rotate: [0, -10, 10, 0] }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <User className="w-4 h-4" />
                                </motion.div>
                            </Button>
                        </motion.div>
                    </motion.div>
                </div>
            </div>

            {/* Main Content — Code 2 structure, literals for all labels */}
            <div className="relative z-10 flex flex-col items-center justify-center flex-1 p-4 min-h-0">
                <motion.div
                    className="text-center mb-6"
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 }}
                >
                    <h2 className="text-xl md:text-2xl mb-2">Welcome Back!</h2>
                    <p className="text-sm text-muted-foreground">
                        Choose your AI assistant to get started
                    </p>
                </motion.div>

                {/* Service Cards — Code 2 visuals with EnhancedServiceIcon */}
                <div className="flex gap-4 mb-6 w-full max-w-md">
                    {services.map((service, index) => {
                        const isActive = isServiceActive(service.id);

                        return (
                            <motion.div
                                key={service.id}
                                className={`glass-card p-4 rounded-xl cursor-pointer transition-all duration-300 relative overflow-hidden flex-1 ${
                                    service.id === "formino"
                                        ? "hover:glass-glow-purple"
                                        : "hover:glass-glow-green"
                                }`}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 1 + index * 0.1 }}
                                whileHover={{ scale: 1.02, y: -2 }}
                                whileTap={{ scale: 0.98 }}
                                onHoverStart={() => handleServiceInteractionStart(service.id)}
                                onHoverEnd={handleServiceInteractionEnd}
                                onTouchStart={() => handleServiceInteractionStart(service.id)}
                                onTouchEnd={handleServiceInteractionEnd}
                                onClick={() => onNavigate(service.page)}
                            >
                                {/* Active Glow */}
                                {isActive && (
                                    <motion.div
                                        className="absolute inset-0 rounded-xl pointer-events-none"
                                        style={{
                                            background:
                                                service.color === "purple"
                                                    ? "radial-gradient(circle at center, rgba(139, 92, 246, 0.1), transparent 70%)"
                                                    : "radial-gradient(circle at center, rgba(16, 185, 129, 0.1), transparent 70%)",
                                            filter: "blur(20px)",
                                        }}
                                        animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
                                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                    />
                                )}

                                <div className="flex flex-col items-center text-center relative z-10">
                                    <motion.div
                                        className="flex justify-center mb-3 relative"
                                        animate={isActive ? { scale: [1, 1.05, 1] } : {}}
                                        transition={{ duration: 0.6 }}
                                    >
                                        <EnhancedServiceIcon
                                            type={service.id as "formino" | "termino"}
                                            size="small"
                                            animated={true}
                                            isHovered={isActive}
                                        />
                                    </motion.div>

                                    <h3 className="text-sm mb-2">{service.title}</h3>
                                    <p className="text-xs text-muted-foreground leading-tight line-clamp-2">
                                        {service.description}
                                    </p>

                                    <motion.div
                                        className="flex flex-wrap justify-center gap-1 mt-2 opacity-0"
                                        animate={{ opacity: isActive ? 1 : 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        {service.features.slice(0, 2).map((feature, i) => (
                                            <motion.span
                                                key={i}
                                                className={`text-xs px-2 py-0.5 rounded-full ${
                                                    service.color === "purple"
                                                        ? "bg-neon-purple/20 text-neon-purple"
                                                        : "bg-neon-green/20 text-neon-green"
                                                }`}
                                                initial={{ scale: 0 }}
                                                animate={isActive ? { scale: 1 } : { scale: 0 }}
                                                transition={{ delay: i * 0.1 }}
                                            >
                                                {feature}
                                            </motion.span>
                                        ))}
                                    </motion.div>

                                    <motion.div
                                        className="mt-2 opacity-0"
                                        animate={{ opacity: isActive ? 1 : 0 }}
                                        transition={{ duration: 0.2, delay: 0.1 }}
                                    >
                                        <div
                                            className={`px-3 py-1 rounded-full text-xs border ${
                                                service.color === "purple"
                                                    ? "bg-neon-purple/20 text-neon-purple border-neon-purple/30"
                                                    : "bg-neon-green/20 text-neon-green border-neon-green/30"
                                            }`}
                                        >
                                            Tap to start →
                                        </div>
                                    </motion.div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Quick Actions — literals only */}
                <motion.div
                    className="flex flex-wrap justify-center gap-2"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.3 }}
                >
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={onLogout}
                            className="glass-card hover:glass-glow-green text-xs transition-all duration-300 px-3 py-2"
                        >
                            <motion.div
                                whileHover={{ x: [0, -5, 5, 0] }}
                                transition={{ duration: 0.4 }}
                            >
                                <LogOut className="w-3 h-3 mr-1" />
                            </motion.div>
                            Sign Out
                        </Button>
                    </motion.div>

                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowHelp(true)}
                            className="glass-card hover:glass-glow-purple text-xs transition-all duration-300 px-3 py-2"
                        >
                            Help
                        </Button>
                    </motion.div>
                </motion.div>

                {/* Subtle status line — literal text */}
                {/*<motion.p*/}
                {/*    className="mt-4 text-xs text-muted-foreground text-center"*/}
                {/*    initial={{ opacity: 0, y: 10 }}*/}
                {/*    animate={{ opacity: [0.7, 1, 0.7], y: 0 }}*/}
                {/*    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}*/}
                {/*>*/}
                {/*    Status: Ready*/}
                {/*</motion.p>*/}
            </div>

            {/* Bottom-right helper (keep Code-1 component, Code-2 placement/animation) */}
            <motion.div
                className="fixed bottom-4 right-4 z-20"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.5, type: "spring", stiffness: 200 }}
            >
                <motion.div
                    className="relative cursor-pointer"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowHelp(true)}
                >
                    <AnimatedHelpRobot onClick={() => setShowHelp(true)} />
                    <motion.div
                        className="absolute -inset-2 border-2 border-neon-green/30 rounded-full"
                        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.7, 0.3] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    />
                </motion.div>
            </motion.div>

            <HelpTutorial isOpen={showHelp} onClose={() => setShowHelp(false)} />
        </div>
    );
}
