import { useState } from "react";
import { motion } from "motion/react";
import { ArrowLeft, Eye, EyeOff, Mail, Lock } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import GlobalAnimatedBackground from "./GlobalAnimatedBackground";
import MeinGenieLogo from "./MeinGenieLogo";
import CompactGenieAvatar from "./CompactGenieAvatar";
import RegisterPage from "./RegisterPage";
import ResetPasswordPage from "./ResetPasswordPage";
import { useGoogleLogin } from '@react-oauth/google';

interface AuthenticationPageProps {
  onBack: () => void;
  onAuthenticated: () => void;
}

const API_BASE = import.meta.env.VITE_API_BASE;


export default function AuthenticationPage({ onBack, onAuthenticated }: AuthenticationPageProps) {

  const [currentView, setCurrentView] = useState<'login' | 'register' | 'reset'>('login')
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!password) {
      newErrors.password = 'Password is required';
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
                // store tokens however you like:
                localStorage.setItem("accessToken", access);
                localStorage.setItem("refreshToken", refresh);
                // then notify app you’re authenticated:
                onAuthenticated();
            }
        } catch (err) {
            setErrors({ form: "Network error" });
        } finally {
            setIsLoading(false);
        }
    };

    const googleLogin = useGoogleLogin({
        flow: 'auth-code',  // ← triggers codeResponse.code :contentReference[oaicite:3]{index=3}
        onSuccess: async (codeResponse) => {
            const code = codeResponse.code;            // the one-time code :contentReference[oaicite:4]{index=4}
            setIsLoading(true);
            try {
                // 2️⃣ Send code to backend for exchange
                const res = await fetch(`${API_BASE}/google-auth-code/`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ code }),
                });
                if (!res.ok) {
                    const err = await res.json();
                    setErrors({ form: err.detail || 'Google login failed' });
                } else {
                    const { access, refresh } = await res.json();
                    localStorage.setItem('accessToken', access);
                    localStorage.setItem('refreshToken', refresh);
                    onAuthenticated();
                }
            } catch {
                setErrors({ form: 'Network error' });
            } finally {
                setIsLoading(false);
            }
        },
        onError: () => setErrors({ form: 'Google login was cancelled' }),
    });

  const handleInputChange = (field: string, value: string) => {
    if (field === 'email') setEmail(value);
    if (field === 'password') setPassword(value);
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (currentView === 'register') {
    return (
      <RegisterPage 
        onBack={() => setCurrentView('login')}
        onSuccess={onAuthenticated}
      />
    );
  }

    if (currentView === 'reset') {
        return (
            <ResetPasswordPage
                onBack={() => setCurrentView('login')}
                onSuccess={() => {
                    setCurrentView('login');
                }}
            />
        )
    }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Global Animated Background */}
      <GlobalAnimatedBackground variant="primary" />

      {/* Header */}
      <div className="glass-card glass-glow-purple relative z-10 px-4 py-4 border-b border-glass-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={onBack}
                className="hover:bg-glass-bg hover:text-neon-purple"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </motion.div>
            <h1 className="text-lg font-semibold text-foreground">Sign In</h1>
          </div>
          <MeinGenieLogo size="sm" animated={true} showText={false} />
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex-1 flex items-center justify-center p-6">
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, type: "spring" }}
        >
          {/* Welcome Section */}
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <div className="flex justify-center mb-4">
              <CompactGenieAvatar size="lg" expression="happy" glowColor="purple" />
            </div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-neon-purple to-purple-400 bg-clip-text text-transparent mb-2">
              Welcome Back!
            </h2>
            <p className="text-muted-foreground">
              Sign in to continue your AI-powered journey
            </p>
          </motion.div>

          {/* Sign In Form */}
          <motion.div
            className="glass-card rounded-3xl p-8 border-2 border-neon-purple/20 relative overflow-hidden"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            {/* Google Sign In Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.4 }}
              className="mb-6"
            >
              <Button
                onClick={() => googleLogin()}
                disabled={isLoading}
                className="w-full bg-white hover:bg-gray-50 text-gray-900 border border-gray-300 relative overflow-hidden group"
                style={{ boxShadow: '0 0 20px rgba(255, 255, 255, 0.1)' }}
              >
                <div className="flex items-center justify-center gap-3 relative z-10">
                  <svg className="h-5 w-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span className="font-medium">Continue with Google</span>
                </div>
                
                {/* Hover effect */}
                <motion.div
                  className="absolute inset-0 bg-gray-100"
                  initial={{ scale: 0, opacity: 0 }}
                  whileHover={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </Button>
            </motion.div>

            {/* Divider */}
            <motion.div
              className="flex items-center my-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.4 }}
            >


                {/* left segment */}
                <div className="flex-1 h-px bg-glass-border" />

                {/* label */}
                <span className="mx-2 px-2 text-xs uppercase text-muted-foreground">
                  OR
                </span>

                {/* right segment */}
                <div className="flex-1 h-px bg-glass-border" />

            </motion.div>

            <form onSubmit={handleEmailSignIn} className="space-y-6">
              {/* Email */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8, duration: 0.4 }}
              >
                <label className="block text-sm font-medium text-foreground mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="Enter your email"
                    className={`pl-10 bg-input-background border-glass-border focus:border-neon-purple/50 focus:ring-neon-purple/20 ${
                      errors.email ? 'border-red-500' : ''
                    }`}
                    style={{ backdropFilter: 'blur(10px)' }}
                  />
                </div>
                {errors.email && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-500 text-xs mt-1"
                  >
                    {errors.email}
                  </motion.p>
                )}
              </motion.div>

              {/* Password */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9, duration: 0.4 }}
              >
                <label className="block text-sm font-medium text-foreground mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    placeholder="Enter your password"
                    className={`pl-10 pr-10 bg-input-background border-glass-border focus:border-neon-purple/50 focus:ring-neon-purple/20 ${
                      errors.password ? 'border-red-500' : ''
                    }`}
                    style={{ backdropFilter: 'blur(10px)' }}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                {errors.password && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-500 text-xs mt-1"
                  >
                    {errors.password}
                  </motion.p>
                )}
              </motion.div>

              {/* Forgot Password */}
              {/*<motion.div*/}
              {/*  className="text-right"*/}
              {/*  initial={{ opacity: 0 }}*/}
              {/*  animate={{ opacity: 1 }}*/}
              {/*  transition={{ delay: 1, duration: 0.4 }}*/}
              {/*>*/}
              {/*  <button*/}
              {/*    type="button"*/}
              {/*    onClick={() => setCurrentView('reset')}*/}
              {/*    className="hover:cursor-pointer text-sm text-neon-purple hover:text-neon-purple/80 underline"*/}
              {/*  >*/}
              {/*    Forgot password?*/}
              {/*  </button>*/}
              {/*</motion.div>*/}

              {/* Sign In Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1, duration: 0.4 }}
              >
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-neon-purple to-purple-600 hover:from-neon-purple/90 hover:to-purple-600/90 text-white relative overflow-hidden group"
                  disabled={isLoading}
                  style={{ boxShadow: '0 0 20px rgba(139, 92, 246, 0.3)' }}
                >
                  <div className="flex items-center justify-center gap-2 relative z-10">
                    {isLoading ? (
                      <>
                        <motion.div
                          className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                        Signing In...
                      </>
                    ) : (
                      'Sign In'
                    )}
                  </div>
                  
                  {/* Hover effect */}
                  <motion.div
                    className="absolute inset-0 bg-white/20"
                    initial={{ scale: 0, opacity: 0 }}
                    whileHover={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                </Button>
              </motion.div>
                {errors.form && (
                    <p className="text-red-500 text-center mt-2">{errors.form}</p>
                )}
            </form>

            {/* Animated border */}
            <motion.div
              className="absolute inset-0 rounded-3xl border-2 border-neon-purple/20"
              animate={{
                borderColor: [
                  'rgba(139, 92, 246, 0.2)',
                  'rgba(139, 92, 246, 0.4)',
                  'rgba(139, 92, 246, 0.2)'
                ]
              }}
              style={{ pointerEvents: 'none' }}
              transition={{ duration: 3, repeat: Infinity }}
            />
          </motion.div>

          {/* Register Link */}
          <motion.div
            className="text-center mt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.4 }}
          >
            <p className="text-sm text-muted-foreground">
              Don't have an account?{' '}
              <button
                onClick={() => setCurrentView('register')}
                className="hover:cursor-pointer text-neon-purple hover:text-neon-purple/80 underline font-medium"
              >
                Register with Email
              </button>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}