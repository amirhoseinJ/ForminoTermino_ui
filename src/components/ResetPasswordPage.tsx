// ResetPasswordPage.tsx
import { useState } from "react";
import { motion } from "motion/react";
import { ArrowLeft, Mail } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import GlobalAnimatedBackground from "./GlobalAnimatedBackground";
import MeinGenieLogo from "./MeinGenieLogo";
import toast from "react-hot-toast";


interface ResetPasswordPageProps {
    onBack: () => void;
    onSuccess: () => void;
}

export default function ResetPasswordPage({
                                              onBack,
                                              onSuccess
                                          }: ResetPasswordPageProps) {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const validate = () => {
        if (!email.trim()) {
            setError("Email is required");
            return false;
        }
        if (!/\S+@\S+\.\S+/.test(email)) {
            setError("Please enter a valid email");
            return false;
        }
        setError("");
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        setIsLoading(true);
        // replace this with your real password-reset API call
        await new Promise((r) => setTimeout(r, 1500));
        setIsLoading(false);
        toast.success("Reset link sent successfully.");  // ← show toast
        // optionally show a “check your email” message before navigating back
        onSuccess();
    };

    return (
        <div className="min-h-screen bg-background relative overflow-hidden">
            <GlobalAnimatedBackground variant="primary" />

            <div className="glass-card glass-glow-purple relative z-10 px-4 py-4 border-b border-glass-border">
                <div className="flex items-center gap-3">
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onBack}
                            className="hover:bg-glass-bg hover:text-neon-purple"
                        >
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </motion.div>
                    <h1 className="text-lg font-semibold text-foreground">
                        Reset Password
                    </h1>
                </div>
                <MeinGenieLogo size="sm" animated showText={false} />
            </div>

            <div className="relative z-10 flex-1 flex items-center justify-center p-6">
                <motion.div
                    className="w-full max-w-md glass-card rounded-3xl p-8 border-2 border-neon-purple/20"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className="text-xl font-medium mb-4 text-center text-foreground">
                        Enter your email to receive a reset link
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Your email address"
                                className={`pl-10 bg-input-background border-glass-border focus:border-neon-purple/50 focus:ring-neon-purple/20 ${
                                    error ? "border-red-500" : ""
                                }`}
                            />
                        </div>
                        {error && (
                            <p className="text-red-500 text-xs mt-1">{error}</p>
                        )}

                        <Button
                            type="submit"
                            className="w-full bg-gradient-to-r from-neon-purple to-purple-600 text-white"
                            disabled={isLoading}
                        >
                            {isLoading ? "Sending…" : "Send Reset Link"}
                        </Button>
                    </form>
                </motion.div>
            </div>
        </div>
    );
}
