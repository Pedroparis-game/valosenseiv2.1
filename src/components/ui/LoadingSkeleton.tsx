import React from "react";
import { motion } from "motion/react";

export default function LoadingSkeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`tactical-card relative overflow-hidden bg-hud-surface border border-hud-border ${className}`}>
      <motion.div
        className="absolute inset-0 z-10"
        style={{
          background: "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.05), transparent)",
        }}
        animate={{
          x: ["-100%", "200%"],
        }}
        transition={{
          repeat: Infinity,
          duration: 1.5,
          ease: "linear",
        }}
      />
      <div className="w-full h-full opacity-30 bg-hud-grid-bg" />
    </div>
  );
}
