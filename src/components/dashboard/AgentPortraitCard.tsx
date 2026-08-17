import React from 'react';
import { motion } from 'motion/react';
import CountUp from '../ui/CountUp';

interface Props {
  agentName: string;
  role: 'Duelista' | 'Iniciador' | 'Controlador' | 'Sentinela';
  winrate: number;
  kda: number;
  matchesPlayed: number;
}

export default function AgentPortraitCard({ agentName, role, winrate, kda, matchesPlayed }: Props) {
  // Generate a stylized fallback silhouette based on agent name if we don't have official assets
  const seed = agentName.length;

  return (
    <div className="tactical-card group overflow-hidden h-full flex flex-col relative">
      {/* Background Stylized Graphic */}
      <div className="absolute inset-0 bg-hud-surface opacity-50 z-0" />
      <div className="absolute -right-12 -top-12 w-48 h-48 bg-hud-border/10 rounded-full blur-2xl group-hover:bg-accent-primary/10 transition-colors duration-500 z-0" />
      
      {/* Fake Silhouette representation to avoid copyright */}
      <div className="absolute bottom-0 right-0 w-3/4 h-3/4 opacity-10 group-hover:opacity-20 transition-opacity duration-300 pointer-events-none z-0 overflow-hidden flex items-end justify-end">
         <div className="font-display font-bold text-[180px] leading-none text-text-muted mix-blend-overlay -mb-8 -mr-8">
           {agentName.charAt(0)}
         </div>
      </div>

      <div className="p-6 relative z-10 flex-grow flex flex-col justify-between">
        <div className="mb-8">
          <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-accent-primary border border-accent-primary/30 bg-accent-primary/10 px-2 py-0.5 clip-chamfer-sm">
            {role}
          </span>
          <h3 className="text-3xl font-display uppercase tracking-widest text-text-main mt-3">
            {agentName}
          </h3>
          <p className="text-xs font-mono text-text-muted mt-1 uppercase tracking-widest">
            {matchesPlayed} Partidas
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-[10px] font-mono font-bold uppercase text-text-muted tracking-widest mb-1">Winrate</div>
            <div className="text-2xl font-display tracking-widest text-text-main">
              <CountUp value={winrate} decimals={1} suffix="%" />
            </div>
          </div>
          <div>
            <div className="text-[10px] font-mono font-bold uppercase text-text-muted tracking-widest mb-1">KDA</div>
            <div className="text-2xl font-display tracking-widest text-text-main">
              <CountUp value={kda} decimals={2} />
            </div>
          </div>
        </div>
      </div>

      {/* Decorative accent bar */}
      <div className="h-1 w-full bg-hud-border group-hover:bg-accent-primary transition-colors duration-300" />
    </div>
  );
}
