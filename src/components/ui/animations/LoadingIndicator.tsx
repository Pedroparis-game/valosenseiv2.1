import React from 'react';
import { motion } from 'motion/react';
import { Target } from 'lucide-react';

interface LoadingIndicatorProps {
  text?: string;
  className?: string;
}

export const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ 
  text = "Sincronizando Telemetria...",
  className = "" 
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`flex flex-col items-center justify-center p-8 relative ${className}`}
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-accent-secondary/5 blur-[40px] rounded-full pointer-events-none" />
      
      <div className="relative mb-6">
        {/* Rotating outer ring */}
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          className="absolute inset-[-10px] border-t-2 border-r-2 border-accent-secondary/40 rounded-full"
        />
        <motion.div 
          animate={{ rotate: -360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="absolute inset-[-20px] border-b-2 border-l-2 border-accent-primary/30 rounded-full"
        />
        
        {/* Core icon */}
        <Target size={48} className="text-accent-secondary animate-pulse" />
      </div>
      
      <div className="text-center relative z-10">
        <div className="font-display uppercase text-2xl tracking-widest mb-2 text-text-main">
          {text}
        </div>
        
        {/* Thematic progress bar */}
        <div className="w-48 h-1 bg-hud-surface border border-hud-border mx-auto overflow-hidden relative">
          <motion.div 
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-accent-secondary to-accent-primary"
            animate={{ 
              x: ["-100%", "100%"] 
            }}
            transition={{ 
              duration: 1.5, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            style={{ width: '50%' }}
          />
        </div>
        
        <p className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-text-muted mt-3">
          Estabelecendo conexão
        </p>
      </div>
    </motion.div>
  );
};
