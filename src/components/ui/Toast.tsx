import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Info, X, CheckCircle, AlertTriangle } from "lucide-react";

interface ToastProps {
  id: string;
  message: string;
  type?: 'info' | 'success' | 'warning' | 'error';
  onClose: (id: string) => void;
  duration?: number;
}

const icons = {
  info: <Info size={16} className="text-accent-primary" />,
  success: <CheckCircle size={16} className="text-emerald-400" />,
  warning: <AlertTriangle size={16} className="text-amber-400" />,
  error: <AlertTriangle size={16} className="text-accent-primary" />,
};

export default function Toast({ id, message, type = 'info', onClose, duration = 4000 }: ToastProps) {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => onClose(id), duration);
      return () => clearTimeout(timer);
    }
  }, [id, duration, onClose]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 50, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 20, scale: 0.95 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className="bg-hud-surface border border-hud-border clip-chamfer-sm p-4 flex items-start gap-3 shadow-2xl relative overflow-hidden pointer-events-auto min-w-[300px] max-w-sm"
    >
      <div className="absolute top-0 left-0 w-1 h-full bg-accent-primary opacity-80" />
      
      <div className="mt-0.5">{icons[type]}</div>
      
      <div className="flex-grow">
        <p className="text-xs font-mono font-bold text-text-main uppercase tracking-wider">{message}</p>
      </div>
      
      <button 
        onClick={() => onClose(id)}
        className="text-text-muted hover:text-text-main transition-colors p-1"
      >
        <X size={14} />
      </button>
    </motion.div>
  );
}

// Minimal Toast Provider for demonstration
// In a real app, use a proper context or zustand store.
export function ToastContainer({ toasts, onClose }: { toasts: any[], onClose: (id: string) => void }) {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map(toast => (
          <Toast key={toast.id} {...toast} onClose={onClose} />
        ))}
      </AnimatePresence>
    </div>
  );
}
