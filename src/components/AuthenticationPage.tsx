import { useState } from "react";
import { motion } from "motion/react";
import { ArrowLeft, Eye, EyeOff, Mail, Lock } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Separator } from "./ui/separator";
import GlobalAnimatedBackground from "./GlobalAnimatedBackground";
import CompactGenieAvatar from "./CompactGenieAvatar";
import RegisterPage from "./RegisterPage";
import ResetPasswordPage from "./ResetPasswordPage";
import { useGoogleLogin } from "@react-oauth/google";

interface AuthenticationPageProps {
    onBack: () => void;
    onAuthenticated: () => void;
}

const API_BASE = import.meta.env.VITE_API_BASE;

export default function AuthenticationPage({
                                               onBack,
                                               onAuthenticated,
                                           }: AuthenticationPageProps) {
    // Keep original logic/state
    const [currentView, setCurrentView] = useState<"login" | "register" | "reset">(
        "login"
    );
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = "Please enter a valid email address";
        }

        if (!password) {
            newErrors.password = "Password is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleEmailSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsLoading(true);
        try {
            const res = await fetch(`${API_BASE}/login/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            if (!res.ok) {
                const err = await res.json();
                setErrors({ form: err.detail || "Login failed" });
            } else {
                const { access, refresh } = await res.json();
                localStorage.setItem("accessToken", access);
                localStorage.setItem("refreshToken", refresh);
                onAuthenticated();
            }
        } catch {
            setErrors({ form: "Network error" });
        } finally {
            setIsLoading(false);
        }
    };

    const googleLogin = useGoogleLogin({
        flow: "auth-code",
        onSuccess: async (codeResponse) => {
            const code = codeResponse.code;
            setIsLoading(true);
            try {
                const res = await fetch(`${API_BASE}/google-auth-code/`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ code }),
                });
                if (!res.ok) {
                    const err = await res.json();
                    setErrors({ form: err.detail || "Google login failed" });
                } else {
                    const { access, refresh } = await res.json();
                    localStorage.setItem("accessToken", access);
                    localStorage.setItem("refreshToken", refresh);
                    onAuthenticated();
                }
            } catch {
                setErrors({ form: "Network error" });
            } finally {
                setIsLoading(false);
            }
        },
        onError: () => setErrors({ form: "Google login was cancelled" }),
    });

    const handleInputChange = (field: string, value: string) => {
        if (field === "email") setEmail(value);
        if (field === "password") setPassword(value);
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: "" }));
        }
    };

    // Keep original routing to separate pages for register/reset
    if (currentView === "register") {
        return (
            <RegisterPage
                onBack={() => setCurrentView("login")}
                onSuccess={onAuthenticated}
            />
        );
    }

    if (currentView === "reset") {
        return (
            <ResetPasswordPage
                onBack={() => setCurrentView("login")}
                onSuccess={() => setCurrentView("login")}
            />
        );
    }

    // ---- UI & Layout adapted to Code 2's style ----
    return (
        <div
            className="h-screen relative overflow-hidden flex flex-col"
            style={{
                background:
                    "linear-gradient(135deg, #0f1419 0%, #1a237e 50%, #0d47a1 100%)",
            }}
        >
            <GlobalAnimatedBackground variant="auth" />

            {/* Compact Header (from code 2) */}
            <div className="glass-card relative z-10 px-4 py-2 border-b border-glass-border flex-shrink-0">
                <div className="flex items-center gap-3">
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onBack}
                            className="hover:bg-glass-bg p-2"
                        >
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </motion.div>
                    <div>
                        <h1 className="text-base text-foreground">Welcome Back</h1>
                        <p className="text-xs text-muted-foreground">Sign in to continue</p>
                    </div>
                </div>
            </div>

            {/* Main Content - compact card, no scrolling (from code 2) */}
            <div className="flex-1 flex items-center justify-center p-4 relative z-10 min-h-0">
                <motion.div
                    className="w-full max-w-sm"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    {/* Compact Avatar + Welcome (styled like code 2, keeps your avatar) */}
                    <motion.div
                        className="text-center mb-4"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    >
                        <div className="mx-auto mb-3 w-fit">
                            <CompactGenieAvatar
                                size="lg"
                                expression="happy"
                                glowColor="purple"
                            />
                        </div>
                        <h2 className="text-lg text-foreground mb-1">Welcome back!</h2>
                        <p className="text-xs text-muted-foreground">
                            Sign in to continue with your AI assistant
                        </p>
                    </motion.div>

                    {/* Auth Card (compact like code 2) */}
                    <motion.div
                        className="glass-card rounded-xl p-4 border border-glass-border"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.6 }}
                    >
                        {/* Email/Password Form (original logic preserved) */}
                        <form onSubmit={handleEmailSignIn} className="space-y-3">
                            {/* Email */}
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    type="email"
                                    value={email}
                                    onChange={(e) => handleInputChange("email", e.target.value)}
                                    placeholder="Email Address"
                                    className={`pl-10 bg-input-background border-glass-border focus:border-neon-purple/50 h-10 ${
                                        errors.email ? "border-red-500" : ""
                                    }`}
                                    required
                                />
                                {errors.email && (
                                    <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                                )}
                            </div>

                            {/* Password */}
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) =>
                                        handleInputChange("password", e.target.value)
                                    }
                                    placeholder="Password"
                                    className={`pl-10 pr-10 bg-input-background border-glass-border focus:border-neon-purple/50 h-10 ${
                                        errors.password ? "border-red-500" : ""
                                    }`}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-4 w-4" />
                                    ) : (
                                        <Eye className="h-4 w-4" />
                                    )}
                                </button>
                                {errors.password && (
                                    <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                                )}
                            </div>

                            {/* Submit */}
                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-gradient-to-r from-neon-purple to-purple-600 hover:from-neon-purple/90 hover:to-purple-600/90 shadow-lg relative overflow-hidden h-10"
                                style={{ boxShadow: "0 0 30px rgba(139, 92, 246, 0.3)" }}
                            >
                                {isLoading && (
                                    <motion.div
                                        className="absolute inset-0 bg-white/20"
                                        initial={{ x: "-100%" }}
                                        animate={{ x: "100%" }}
                                        transition={{ duration: 1, repeat: Infinity }}
                                    />
                                )}
                                <div className="flex items-center justify-center gap-2">
                                    {isLoading ? (
                                        <motion.div
                                            className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                                            animate={{ rotate: 360 }}
                                            transition={{
                                                duration: 1,
                                                repeat: Infinity,
                                                ease: "linear",
                                            }}
                                        />
                                    ) : (
                                        "Sign In"
                                    )}
                                </div>
                            </Button>

                            {errors.form && (
                                <p className="text-red-500 text-center text-sm">{errors.form}</p>
                            )}
                        </form>

                        {/* Separator (like code 2) */}
                        <div className="flex items-center gap-4 my-4">
                            <Separator className="flex-1 bg-glass-border" />
                            <span className="text-xs text-muted-foreground">OR</span>
                            <Separator className="flex-1 bg-glass-border" />
                        </div>

                        {/* Google Sign In (keeps your googleLogin logic) */}
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => googleLogin()}
                            disabled={isLoading}
                            className="w-full border-glass-border hover:bg-glass-bg text-foreground h-10"
                        >
                            <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                                <path
                                    fill="#4285f4"
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                />
                                <path
                                    fill="#34a853"
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                />
                                <path
                                    fill="#fbbc05"
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                />
                                <path
                                    fill="#ea4335"
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                />
                            </svg>
                            Continue with Google
                        </Button>

                        {/* Links row (compact, matches code 2 vibe) */}
                        <div className="mt-4 items-center justify-between">
                            {/*<button*/}
                            {/*    type="button"*/}
                            {/*    onClick={() => setCurrentView("reset")}*/}
                            {/*    className="text-xs text-muted-foreground hover:text-neon-purple transition-colors"*/}
                            {/*>*/}
                            {/*    Forgot password?*/}
                            {/*</button>*/}
                            <button
                                type="button"
                                onClick={() => setCurrentView("register")}
                                className="text-xs text-muted-foreground hover:text-neon-purple transition-colors"
                            >
                                Don&apos;t have an account? Sign up
                            </button>
                        </div>
                    </motion.div>

                    {/* Optional compact features preview (structure from code 2) */}
                    <motion.div
                        className="mt-4 grid grid-cols-2 gap-3"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8, duration: 0.6 }}
                    >
                        <div className="glass-card rounded-lg p-3 text-center border border-glass-border">
                            <div className="w-6 h-6 mx-auto mb-2 rounded-full bg-gradient-to-r from-neon-purple to-purple-600 flex items-center justify-center">
                                <Mail className="h-3 w-3 text-white" />
                            </div>
                            <h3 className="text-xs text-foreground mb-1">Formino</h3>
                            <p className="text-xs text-muted-foreground">AI form assistant</p>
                        </div>

                        <div className="glass-card rounded-lg p-3 text-center border border-glass-border">
                            <div className="w-6 h-6 mx-auto mb-2 rounded-full bg-gradient-to-r from-neon-green to-green-600 flex items-center justify-center">
                                <Lock className="h-3 w-3 text-white" />
                            </div>
                            <h3 className="text-xs text-foreground mb-1">Secure Access</h3>
                            <p className="text-xs text-muted-foreground">JWT-based login</p>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
}
