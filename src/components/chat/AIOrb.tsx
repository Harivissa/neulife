import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface AIOrbProps {
  state: 'idle' | 'listening' | 'responding';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function AIOrb({ state, size = 'md', className }: AIOrbProps) {
  const sizeClasses = {
    sm: 'h-16 w-16',
    md: 'h-24 w-24',
    lg: 'h-32 w-32',
  };

  return (
    <div className={cn('relative', sizeClasses[size], className)}>
      {/* Outer glow effect */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.3) 0%, transparent 70%)',
        }}
        animate={{
          scale: state === 'idle' ? [1, 1.1, 1] : state === 'listening' ? [1, 1.2, 1] : [1, 1.15, 1],
          opacity: state === 'idle' ? [0.5, 0.7, 0.5] : [0.6, 0.9, 0.6],
        }}
        transition={{
          duration: state === 'listening' ? 1 : 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Main orb */}
      <motion.div
        className="absolute inset-2 rounded-full overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(280, 70%, 50%) 50%, hsl(190, 90%, 50%) 100%)',
          boxShadow: `
            0 0 20px rgba(139, 92, 246, 0.4),
            0 0 40px rgba(139, 92, 246, 0.2),
            inset 0 0 20px rgba(255, 255, 255, 0.1)
          `,
        }}
        animate={{
          scale: state === 'listening' ? [1, 1.02, 1] : 1,
        }}
        transition={{
          duration: 0.5,
          repeat: state === 'listening' ? Infinity : 0,
          ease: 'easeInOut',
        }}
      >
        {/* Inner wave effect */}
        <motion.div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.3) 50%, transparent 100%)',
          }}
          animate={{
            x: ['-100%', '100%'],
            opacity: state === 'responding' ? [0.3, 0.6, 0.3] : 0.3,
          }}
          transition={{
            x: { duration: state === 'responding' ? 1.5 : 3, repeat: Infinity, ease: 'linear' },
            opacity: { duration: 1, repeat: Infinity, ease: 'easeInOut' },
          }}
        />

        {/* Central glow */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/2 h-1/2 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(255, 255, 255, 0.6) 0%, transparent 70%)',
          }}
          animate={{
            scale: state === 'listening' ? [1, 1.3, 1] : state === 'responding' ? [1, 1.2, 1] : [1, 1.1, 1],
            opacity: state === 'listening' ? [0.4, 0.8, 0.4] : [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: state === 'listening' ? 0.8 : 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* Shimmer highlight */}
        <div 
          className="absolute top-2 left-1/4 w-1/4 h-1/4 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(255, 255, 255, 0.4) 0%, transparent 70%)',
          }}
        />
      </motion.div>

      {/* Reflection/shadow */}
      <div 
        className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-2 rounded-full blur-sm opacity-30"
        style={{
          background: 'linear-gradient(90deg, transparent, hsl(var(--primary)), transparent)',
        }}
      />
    </div>
  );
}
