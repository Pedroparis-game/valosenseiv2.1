import React from "react";
import { motion } from "motion/react";
import { Activity } from "lucide-react";

interface Props {
  title?: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export default function EmptyState({ 
  title = "Sem dados disponíveis", 
  message = "Jogue mais partidas para que eu possa avaliar sua performance com precisão.",
  actionLabel,
  onAction,
  icon = <Activity size={32} />
}: Props) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="tactical-card p-12 w-full flex flex-col items-center justify-center text-center min-h-[300px]"
    >
      <div className="w-16 h-16 bg-hud-base border border-hud-border flex items-center justify-center clip-chamfer-sm text-text-muted mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-display uppercase tracking-widest text-text-main mb-2">
        {title}
      </h3>
      <p className="text-sm font-body text-text-muted max-w-sm mb-6 leading-relaxed">
        {message}
      </p>
      
      {actionLabel && onAction && (
        <button onClick={onAction} className="tactical-btn !py-2 !text-sm">
          {actionLabel}
        </button>
      )}
    </motion.div>
  );
}
