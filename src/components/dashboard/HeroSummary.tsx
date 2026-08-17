import React from 'react';
import { motion } from 'motion/react';
import RankBadge from './RankBadge';
import CountUp from '../ui/CountUp';

interface Props {
  playerName: string;
  playerTag: string;
  rankName: string;
  rankImageUrl?: string;
  rr: number;
  highlightStatLabel: string;
  highlightStatValue: number;
  highlightStatSuffix?: string;
}

export default function HeroSummary({ 
  playerName, 
  playerTag, 
  rankName, 
  rankImageUrl, 
  rr,
  highlightStatLabel,
  highlightStatValue,
  highlightStatSuffix
}: Props) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="flex flex-col md:flex-row items-center md:items-end justify-between gap-8 pb-8 border-b border-hud-border relative"
    >
      <div className="flex flex-col md:flex-row items-center md:items-center gap-6 z-10 text-center md:text-left w-full md:w-auto">
        <RankBadge rank={rankName} imageUrl={rankImageUrl} />
        
        <div>
          <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
            <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-accent-primary bg-accent-primary/10 border border-accent-primary/20 px-2 py-0.5 clip-chamfer-sm">
              Operador Ativo
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-display uppercase leading-none tracking-widest text-text-main drop-shadow-md flex flex-wrap items-baseline justify-center md:justify-start gap-2">
            <span>{playerName}</span>
            <span className="text-text-muted text-2xl md:text-4xl">#{playerTag}</span>
          </h1>
          <div className="text-sm font-mono font-bold uppercase tracking-widest text-text-muted mt-2">
            <span className="text-text-main">{rankName}</span> <span className="opacity-50">//</span> <span className="text-accent-primary">{rr} RR</span>
          </div>
        </div>
      </div>

      <div className="tactical-card p-4 px-6 md:px-8 border-accent-primary/20 bg-accent-primary/5 flex flex-col items-center md:items-end text-center md:text-right min-w-[200px]">
        <span className="text-[10px] font-mono font-bold uppercase text-text-muted tracking-[0.15em] mb-1">
          {highlightStatLabel}
        </span>
        <div className="text-4xl md:text-5xl font-display tracking-widest text-accent-primary">
          <CountUp value={highlightStatValue} decimals={1} suffix={highlightStatSuffix} />
        </div>
      </div>
    </motion.div>
  );
}
