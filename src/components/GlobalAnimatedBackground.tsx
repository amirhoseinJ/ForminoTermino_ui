import { motion } from "motion/react";

interface GlobalAnimatedBackgroundProps {
    variant?: 'primary' | 'secondary' | 'tertiary' | 'landing' | 'auth' | 'profile';
}

export default function GlobalAnimatedBackground({ variant = 'primary' }: GlobalAnimatedBackgroundProps) {
    // Different variants for different pages/sections
    const variants = {
        primary: {
            orbs: [
                { color: 'rgba(139, 92, 246, 0.08)', size: 'w-32 h-32', position: 'top-20 left-10', blur: 'blur-3xl' },
                { color: 'rgba(16, 185, 129, 0.08)', size: 'w-40 h-40', position: 'bottom-20 right-10', blur: 'blur-3xl' },
                { color: 'rgba(59, 130, 246, 0.06)', size: 'w-24 h-24', position: 'top-1/2 left-1/4', blur: 'blur-2xl' },
                { color: 'rgba(139, 92, 246, 0.04)', size: 'w-36 h-36', position: 'bottom-1/3 left-1/3', blur: 'blur-3xl' },
            ],
            gradients: [
                { from: 'rgba(139, 92, 246, 0.03)', to: 'transparent', position: 'top-0 left-0' },
                { from: 'rgba(16, 185, 129, 0.03)', to: 'transparent', position: 'bottom-0 right-0' },
            ]
        },
        secondary: {
            orbs: [
                { color: 'rgba(16, 185, 129, 0.08)', size: 'w-28 h-28', position: 'top-16 right-12', blur: 'blur-3xl' },
                { color: 'rgba(139, 92, 246, 0.06)', size: 'w-32 h-32', position: 'bottom-24 left-8', blur: 'blur-2xl' },
                { color: 'rgba(245, 158, 11, 0.04)', size: 'w-20 h-20', position: 'top-1/3 right-1/4', blur: 'blur-xl' },
            ],
            gradients: [
                { from: 'rgba(16, 185, 129, 0.04)', to: 'transparent', position: 'top-0 right-0' },
                { from: 'rgba(139, 92, 246, 0.02)', to: 'transparent', position: 'bottom-0 left-0' },
            ]
        },
        tertiary: {
            orbs: [
                { color: 'rgba(245, 158, 11, 0.06)', size: 'w-30 h-30', position: 'top-12 left-16', blur: 'blur-2xl' },
                { color: 'rgba(139, 92, 246, 0.05)', size: 'w-24 h-24', position: 'bottom-16 right-12', blur: 'blur-xl' },
                { color: 'rgba(16, 185, 129, 0.04)', size: 'w-28 h-28', position: 'top-2/3 right-1/3', blur: 'blur-2xl' },
            ],
            gradients: [
                { from: 'rgba(245, 158, 11, 0.03)', to: 'transparent', position: 'top-0 left-0' },
                { from: 'rgba(16, 185, 129, 0.02)', to: 'transparent', position: 'bottom-0 right-0' },
            ]
        },
        landing: {
            orbs: [
                { color: 'rgba(139, 92, 246, 0.12)', size: 'w-48 h-48', position: 'top-10 left-20', blur: 'blur-3xl' },
                { color: 'rgba(16, 185, 129, 0.10)', size: 'w-56 h-56', position: 'bottom-10 right-20', blur: 'blur-3xl' },
                { color: 'rgba(59, 130, 246, 0.08)', size: 'w-32 h-32', position: 'top-1/3 right-1/4', blur: 'blur-2xl' },
                { color: 'rgba(245, 158, 11, 0.06)', size: 'w-40 h-40', position: 'bottom-1/4 left-1/4', blur: 'blur-3xl' },
                { color: 'rgba(139, 92, 246, 0.05)', size: 'w-28 h-28', position: 'top-2/3 left-1/2', blur: 'blur-2xl' },
            ],
            gradients: [
                { from: 'rgba(139, 92, 246, 0.05)', to: 'transparent', position: 'top-0 left-0' },
                { from: 'rgba(16, 185, 129, 0.05)', to: 'transparent', position: 'bottom-0 right-0' },
                { from: 'rgba(59, 130, 246, 0.03)', to: 'transparent', position: 'top-0 right-0' },
            ]
        },
        auth: {
            orbs: [
                { color: 'rgba(139, 92, 246, 0.10)', size: 'w-36 h-36', position: 'top-16 right-16', blur: 'blur-3xl' },
                { color: 'rgba(16, 185, 129, 0.08)', size: 'w-44 h-44', position: 'bottom-16 left-16', blur: 'blur-3xl' },
                { color: 'rgba(59, 130, 246, 0.06)', size: 'w-28 h-28', position: 'top-1/2 right-1/3', blur: 'blur-2xl' },
            ],
            gradients: [
                { from: 'rgba(139, 92, 246, 0.04)', to: 'transparent', position: 'top-0 right-0' },
                { from: 'rgba(16, 185, 129, 0.04)', to: 'transparent', position: 'bottom-0 left-0' },
            ]
        },
        profile: {
            orbs: [
                { color: 'rgba(139, 92, 246, 0.07)', size: 'w-32 h-32', position: 'top-20 right-10', blur: 'blur-3xl' },
                { color: 'rgba(16, 185, 129, 0.07)', size: 'w-36 h-36', position: 'bottom-20 left-10', blur: 'blur-3xl' },
                { color: 'rgba(245, 158, 11, 0.05)', size: 'w-24 h-24', position: 'top-1/3 left-1/3', blur: 'blur-2xl' },
            ],
            gradients: [
                { from: 'rgba(139, 92, 246, 0.03)', to: 'transparent', position: 'top-0 left-0' },
                { from: 'rgba(16, 185, 129, 0.03)', to: 'transparent', position: 'bottom-0 right-0' },
            ]
        }
    };

    // Get current variant or fallback to primary
    const currentVariant = variants[variant] || variants.primary;

    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
            {/* Gradient overlays */}
            {currentVariant.gradients.map((gradient, index) => (
                <motion.div
                    key={`gradient-${index}`}
                    className={`absolute inset-0 ${gradient.position}`}
                    style={{
                        background: `radial-gradient(circle at ${gradient.position.includes('top') ? '30%' : '70%'} ${gradient.position.includes('left') ? '30%' : '70%'}, ${gradient.from}, ${gradient.to})`
                    }}
                    animate={{
                        opacity: [0.3, 0.6, 0.3],
                        scale: [1, 1.1, 1],
                    }}
                    transition={{
                        duration: 8 + index * 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: index * 3
                    }}
                />
            ))}

            {/* Floating orbs */}
            {currentVariant.orbs.map((orb, index) => (
                <motion.div
                    key={`orb-${index}`}
                    className={`absolute ${orb.size} ${orb.position} ${orb.blur} rounded-full opacity-50`}
                    style={{ backgroundColor: orb.color }}
                    animate={{
                        y: [0, -30, 0],
                        x: [0, 15, 0],
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.7, 0.3],
                        rotate: [0, 180, 360]
                    }}
                    transition={{
                        duration: 12 + index * 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: index * 2
                    }}
                />
            ))}

            {/* Floating geometric shapes */}
            {Array.from({ length: 15 }, (_, i) => (
                <motion.div
                    key={`shape-${i}`}
                    className="absolute w-1 h-1 rounded-full"
                    style={{
                        backgroundColor: `rgba(${i % 3 === 0 ? '139, 92, 246' : i % 3 === 1 ? '16, 185, 129' : '59, 130, 246'}, 0.4)`,
                        left: `${10 + Math.random() * 80}%`,
                        top: `${10 + Math.random() * 80}%`,
                    }}
                    animate={{
                        y: [0, -100, 0],
                        opacity: [0, 1, 0],
                        scale: [0, 1, 0],
                        rotate: [0, 180, 360]
                    }}
                    transition={{
                        duration: 8 + Math.random() * 4,
                        repeat: Infinity,
                        delay: Math.random() * 8,
                        ease: "easeInOut"
                    }}
                />
            ))}

            {/* Slow-moving abstract lines */}
            <svg className="absolute inset-0 w-full h-full" style={{ mixBlendMode: 'screen' }}>
                <defs>
                    <linearGradient id="line-gradient-1" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="rgba(139, 92, 246, 0.1)" />
                        <stop offset="50%" stopColor="rgba(16, 185, 129, 0.1)" />
                        <stop offset="100%" stopColor="rgba(139, 92, 246, 0.1)" />
                    </linearGradient>
                    <linearGradient id="line-gradient-2" x1="100%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="rgba(16, 185, 129, 0.1)" />
                        <stop offset="50%" stopColor="rgba(59, 130, 246, 0.1)" />
                        <stop offset="100%" stopColor="rgba(16, 185, 129, 0.1)" />
                    </linearGradient>
                </defs>

                <motion.path
                    d="M0,200 Q150,50 300,150 T600,100"
                    stroke="url(#line-gradient-1)"
                    strokeWidth="2"
                    fill="none"
                    opacity={0.3}
                    animate={{
                        d: [
                            "M0,200 Q150,50 300,150 T600,100",
                            "M0,150 Q200,80 350,120 T650,180",
                            "M0,200 Q150,50 300,150 T600,100"
                        ]
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />

                <motion.path
                    d="M600,50 Q450,150 200,100 T0,200"
                    stroke="url(#line-gradient-2)"
                    strokeWidth="2"
                    fill="none"
                    opacity={0.3}
                    animate={{
                        d: [
                            "M600,50 Q450,150 200,100 T0,200",
                            "M650,80 Q400,180 250,130 T50,250",
                            "M600,50 Q450,150 200,100 T0,200"
                        ]
                    }}
                    transition={{
                        duration: 25,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 5
                    }}
                />
            </svg>

            {/* Subtle mesh gradient overlay */}
            <motion.div
                className="absolute inset-0"
                style={{
                    background: `
            radial-gradient(circle at 0% 0%, rgba(139, 92, 246, 0.02), transparent 50%),
            radial-gradient(circle at 100% 0%, rgba(16, 185, 129, 0.02), transparent 50%),
            radial-gradient(circle at 0% 100%, rgba(16, 185, 129, 0.02), transparent 50%),
            radial-gradient(circle at 100% 100%, rgba(139, 92, 246, 0.02), transparent 50%)
          `
                }}
                animate={{
                    opacity: [0.5, 0.8, 0.5],
                }}
                transition={{
                    duration: 15,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            />
        </div>
    );
}