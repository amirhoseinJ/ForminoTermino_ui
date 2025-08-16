import { motion } from 'framer-motion';

/* ------------------------------------------------------------------ */
/*  Domain types                                                      */
/* ------------------------------------------------------------------ */

const colors = ['neon-purple', 'neon-green', 'info', 'warning'] as const;
type Color     = typeof colors[number];            // 'neon-purple' | 'neon-green' | 'info' | 'warning'
type ShapeKind = 'circle' | 'square' | 'triangle' | 'hexagon';

interface Shape {
    id:        number;
    type:      ShapeKind;
    size:      number;
    x:         number;
    y:         number;
    delay:     number;
    duration:  number;
    color:     Color;
}

interface AnimatedBackgroundProps {
    className?: string;
}

/* ------------------------------------------------------------------ */
/*  Styling                                                           */
/* ------------------------------------------------------------------ */

const colorClasses: Record<Color, string> = {
    'neon-purple': 'border-purple-500  bg-purple-500/10',
    'neon-green' : 'border-green-400   bg-green-400/10',
    info         : 'border-blue-400    bg-blue-400/10',
    warning      : 'border-yellow-400  bg-yellow-400/10'
};

/* ------------------------------------------------------------------ */
/*  Component                                                         */
/* ------------------------------------------------------------------ */

export default function AnimatedBackground({ className = '' }: AnimatedBackgroundProps) {
    /* -------- random shape generation (now type-safe) --------------- */
    const shapes: Shape[] = Array.from({ length: 12 }, (_, i): Shape => ({
        id:        i,
        type:      ['circle', 'square', 'triangle', 'hexagon'][Math.floor(Math.random() * 4)] as ShapeKind,
        size:      Math.random() * 40 + 20,
        x:         Math.random() * 100,
        y:         Math.random() * 100,
        delay:     Math.random() * 4,
        duration:  Math.random() * 3 + 4,
        color:     colors[Math.floor(Math.random() * colors.length)]
    }));

    /* -------- helper to render one shape ---------------------------- */
    const renderShape = (shape: Shape) => {
        const base = 'absolute opacity-20';
        const style: React.CSSProperties = {
            width : `${shape.size}px`,
            height: `${shape.size}px`,
            left  : `${shape.x}%`,
            top   : `${shape.y}%`
        };

        /* choose gradient based on colour */
        const pickGradient = () =>
            colorClasses[shape.color].includes('purple') ? 'rgba(139,92,246,0.1)' :
                colorClasses[shape.color].includes('green')  ? 'rgba(16,185,129,0.1)'  :
                    colorClasses[shape.color].includes('blue')   ? 'rgba(59,130,246,0.1)'  :
                        'rgba(245,158,11,0.1)';

        switch (shape.type) {
            case 'circle':
                return (
                    <motion.div
                        key={shape.id}
                        className={`${base} ${colorClasses[shape.color]} rounded-full border`}
                        style={style}
                        animate={{ y:[0,-50,0], rotate:[0,360], scale:[0.8,1.2,0.8], opacity:[0.1,0.3,0.1] }}
                        transition={{ duration:shape.duration, repeat:Infinity, delay:shape.delay, ease:'easeInOut' }}
                    />
                );

            case 'square':
                return (
                    <motion.div
                        key={shape.id}
                        className={`${base} ${colorClasses[shape.color]} border`}
                        style={style}
                        animate={{ y:[0,-40,0], rotate:[0,180,360], scale:[0.7,1.1,0.7], opacity:[0.1,0.4,0.1] }}
                        transition={{ duration:shape.duration, repeat:Infinity, delay:shape.delay, ease:'linear' }}
                    />
                );

            case 'triangle':
                return (
                    <motion.div
                        key={shape.id}
                        className={base}
                        style={{
                            ...style,
                            background: `linear-gradient(45deg, ${pickGradient()})`,
                            clipPath  : 'polygon(50% 0%, 0% 100%, 100% 100%)'
                        }}
                        animate={{ y:[0,-60,0], rotate:[0,120,240,360], scale:[0.6,1.3,0.6], opacity:[0.1,0.5,0.1] }}
                        transition={{ duration:shape.duration, repeat:Infinity, delay:shape.delay, ease:'easeInOut' }}
                    />
                );

            case 'hexagon':
                return (
                    <motion.div
                        key={shape.id}
                        className={base}
                        style={{
                            ...style,
                            background: `linear-gradient(60deg, ${pickGradient()})`,
                            clipPath  : 'polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%)'
                        }}
                        animate={{ y:[0,-30,0], rotate:[0,60,120,180,240,300,360], scale:[0.9,1,0.9], opacity:[0.1,0.3,0.1] }}
                        transition={{ duration:shape.duration, repeat:Infinity, delay:shape.delay, ease:'linear' }}
                    />
                );

            default:
                return null;
        }
    };

    /* ------------------------------------------------------------------ */
    /*  JSX                                                              */
    /* ------------------------------------------------------------------ */

    return (
        <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
            {/* Animated vertical “data streams” */}
            <div className="absolute inset-0">
                {Array.from({ length: 6 }, (_, i) => (
                    <motion.div
                        key={`stream-${i}`}
                        className="absolute w-0.5 h-full opacity-20"
                        style={{
                            left       : `${20 + i * 15}%`,
                            background : `linear-gradient(180deg, transparent, ${i % 2 ? '#10b981' : '#8b5cf6'}, transparent)`
                        }}
                        animate={{ opacity:[0.1,0.4,0.1], scaleY:[0.5,1,0.5] }}
                        transition={{ duration:3 + i*0.5, repeat:Infinity, delay:i*0.5, ease:'easeInOut' }}
                    />
                ))}
            </div>

            {/* Floating shapes */}
            {shapes.map(renderShape)}

            {/* Glowing orbs */}
            <motion.div
                className="absolute top-1/4 right-1/4 w-32 h-32 rounded-full opacity-10"
                style={{ background:'radial-gradient(circle, rgba(139,92,246,0.3), transparent)', filter:'blur(40px)' }}
                animate={{ scale:[0.8,1.2,0.8], x:[0,50,0], y:[0,-30,0] }}
                transition={{ duration:8, repeat:Infinity, ease:'easeInOut' }}
            />
            <motion.div
                className="absolute bottom-1/3 left-1/3 w-24 h-24 rounded-full opacity-10"
                style={{ background:'radial-gradient(circle, rgba(16,185,129,0.3), transparent)', filter:'blur(30px)' }}
                animate={{ scale:[1.2,0.8,1.2], x:[0,-40,0], y:[0,20,0] }}
                transition={{ duration:6, repeat:Infinity, ease:'easeInOut', delay:2 }}
            />

            {/* Subtle particle grid */}
            <div className="absolute inset-0 opacity-5">
                <div
                    className="w-full h-full"
                    style={{
                        backgroundImage  : 'radial-gradient(circle, #8b5cf6 1px, transparent 1px)',
                        backgroundSize   : '40px 40px',
                        backgroundPosition: '0 0'
                    }}
                />
            </div>
        </div>
    );
}
