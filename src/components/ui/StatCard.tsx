import React from 'react';
import { motion } from 'motion/react';
import { AnimatedCounter } from './animations/AnimatedCounter';
import { Hash } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: number;
  suffix?: string;
  decimals?: number;
  icon: React.ReactNode;
  trend: 'up' | 'down' | 'neutral';
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ 
  label, 
  value, 
  suffix = '',
  decimals = 0,
  icon, 
  trend, 
  className = "" 
}) => {
  const trendColor = 
    trend === 'up' ? 'text-accent-success' : 
    trend === 'down' ? 'text-accent-primary' : 
    'text-text-muted';
    
  const glowColor = 
    trend === 'up' ? 'rgba(57, 255, 136, 0.2)' : 
    trend === 'down' ? 'rgba(255, 70, 85, 0.2)' : 
    'rgba(0, 229, 255, 0.2)';

  return (
    <motion.div 
      whileHover={{ scale: 1.05, rotateX: 5, rotateY: -5, boxShadow: `0 0 30px ${glowColor}` }}
      className={`tactical-card p-4 flex flex-col justify-between group h-full transition-transform duration-300 transform-gpu perspective-1000 ${className}`}
    >
      <div className="flex justify-between items-start mb-4 relative z-10">
        <motion.div 
          whileHover={{ rotate: [0, -10, 10, -10, 0], transition: { duration: 0.5 } }}
          className="text-text-muted group-hover:text-accent-secondary transition-colors"
        >
          {icon}
        </motion.div>
        <Hash size={12} className="text-hud-border group-hover:text-accent-secondary/50 transition-colors" />
      </div>
      
      <div className="relative z-10">
        <div className="text-[10px] font-mono font-bold uppercase text-text-muted mb-1 tracking-[0.1em] group-hover:text-text-main transition-colors">{label}</div>
        <div className="flex items-baseline gap-2">
          <div className="text-3xl font-display tracking-widest text-text-main">
            <AnimatedCounter value={value} decimals={decimals} suffix={suffix} />
          </div>
          <div className={`text-xs font-mono font-bold ${trendColor}`}>
            {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '—'}
          </div>
        </div>
      </div>
      
      {/* Interactive hover glow layer */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background: `radial-gradient(circle at center, ${glowColor} 0%, transparent 70%)`
        }}
      />
    </motion.div>
  );
};
