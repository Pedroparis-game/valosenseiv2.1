import React from 'react';
import { motion } from 'motion/react';
import { MapPin, AlertCircle, Eye, Flame, Shield } from 'lucide-react';

export type MarkerType = 'flash' | 'smoke' | 'molly' | 'info' | 'enemy';

interface TacticalMapMarkerProps {
  x: number;
  y: number;
  type: MarkerType;
  onClick?: () => void;
  label?: string;
  delay?: number;
}

export const TacticalMapMarker: React.FC<TacticalMapMarkerProps> = ({ 
  x, 
  y, 
  type, 
  onClick,
  label,
  delay = 0
}) => {
  const getMarkerColor = () => {
    switch(type) {
      case 'smoke': return 'bg-text-muted text-hud-base border-text-main shadow-[0_0_15px_rgba(139,151,163,0.5)]';
      case 'flash': return 'bg-accent-secondary text-hud-base border-white shadow-[0_0_15px_rgba(0,229,255,0.6)]';
      case 'molly': return 'bg-accent-primary text-hud-base border-white shadow-[0_0_15px_rgba(255,70,85,0.6)]';
      case 'info': return 'bg-accent-success text-hud-base border-white shadow-[0_0_15px_rgba(57,255,136,0.6)]';
      case 'enemy': return 'bg-accent-primary text-white border-accent-primary shadow-[0_0_20px_rgba(255,70,85,0.8)]';
      default: return 'bg-accent-secondary text-hud-base';
    }
  };

  const getIcon = () => {
    switch(type) {
      case 'smoke': return <div className="w-2 h-2 rounded-full bg-hud-base" />;
      case 'flash': return <Eye size={12} />;
      case 'molly': return <Flame size={12} />;
      case 'info': return <Shield size={12} />;
      case 'enemy': return <AlertCircle size={14} />;
      default: return <MapPin size={12} />;
    }
  };

  const colorClass = getMarkerColor();

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 15, delay }}
      className="absolute transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer z-20"
      style={{ left: `${x}%`, top: `${y}%` }}
      onClick={onClick}
      whileHover={{ scale: 1.2, zIndex: 30 }}
      whileTap={{ scale: 0.9 }}
    >
      {/* Continuous breathing pulse */}
      <motion.div 
        className={`absolute inset-0 rounded-full opacity-40 ${colorClass.split(' ')[0]}`}
        animate={{ scale: [1, 1.8, 1], opacity: [0.4, 0, 0.4] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />
      
      {/* Core marker */}
      <div className={`relative flex items-center justify-center w-6 h-6 rounded-full border-2 ${colorClass}`}>
        {getIcon()}
      </div>
      
      {/* Label (shows on hover) */}
      {label && (
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
          <div className="bg-hud-surface border border-hud-border px-2 py-1 text-[10px] font-mono font-bold uppercase whitespace-nowrap text-text-main rounded-sm shadow-xl">
            {label}
          </div>
        </div>
      )}
    </motion.div>
  );
};
