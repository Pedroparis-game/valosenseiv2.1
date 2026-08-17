import React from 'react';
import { motion } from 'motion/react';

interface Props {
  rank: string; // e.g. "Diamond 3", "Radiant"
  imageUrl?: string;
  className?: string;
}

export default function RankBadge({ rank, imageUrl, className = "" }: Props) {
  // Se não houver imagem fornecida, usamos a silhueta padrão/texto
  return (
    <div className={`relative group ${className}`}>
      <div className="w-16 h-16 md:w-20 md:h-20 bg-hud-base border border-hud-border flex items-center justify-center clip-chamfer transition-colors duration-300 group-hover:border-accent-primary/50 overflow-hidden relative">
        <div className="absolute inset-0 bg-accent-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {imageUrl ? (
          <motion.img
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            src={imageUrl}
            alt={rank}
            className="w-12 h-12 md:w-14 md:h-14 object-contain drop-shadow-[0_0_8px_rgba(255,70,85,0.15)] relative z-10 group-hover:scale-110 transition-transform duration-500"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="font-display font-bold text-2xl text-accent-primary">
            {rank.charAt(0)}
          </div>
        )}
      </div>
      
      {/* Decorative corners */}
      <div className="absolute -top-1 -left-1 w-2 h-2 border-t border-l border-text-muted opacity-50 group-hover:border-accent-primary transition-colors" />
      <div className="absolute -bottom-1 -right-1 w-2 h-2 border-b border-r border-text-muted opacity-50 group-hover:border-accent-primary transition-colors" />
    </div>
  );
}
