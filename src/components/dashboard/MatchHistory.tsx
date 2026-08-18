import React from 'react';
import { MatchData } from '../../types';
import AgentImage from './AgentImage';
import { Target, Skull, Activity, Flame } from 'lucide-react';
import { motion } from 'motion/react';

interface Props {
  matches: MatchData[];
}

export default function MatchHistory({ matches }: Props) {
  if (!matches || matches.length === 0) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="valo-card col-span-1 md:col-span-2 flex flex-col h-full"
    >
      <div className="flex items-center gap-3 mb-6">
         <div className="p-2 bg-accent-primary/10 border border-accent-primary/40 shadow-[0_0_15px_rgba(255,70,85,0.4)]">
           <Flame size={20} className="text-accent-primary drop-shadow-[0_0_5px_rgba(255,70,85,0.8)]" />
         </div>
         <h3 className="text-2xl font-display uppercase tracking-widest text-text-main drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">Últimas Partidas</h3>
      </div>

      <div className="flex flex-col gap-3 overflow-y-auto pr-2 custom-scrollbar flex-grow">
        {matches.map((match, idx) => {
          const isWin = match.outcome === 'Victory';
          return (
            <div 
              key={match.id || idx} 
              className={`flex flex-col sm:flex-row sm:items-center gap-4 p-4 border-l-4 bg-[#0a0f16]/80 transition-all hover:bg-[#131923] border ${isWin ? 'border-l-[#16c68a] border-t-hud-border/10 border-r-hud-border/10 border-b-hud-border/10 hover:border-[#16c68a]/50 hover:shadow-[0_0_15px_rgba(22,198,138,0.15)]' : 'border-l-accent-primary border-t-hud-border/10 border-r-hud-border/10 border-b-hud-border/10 hover:border-accent-primary/50 hover:shadow-[0_0_15px_rgba(255,70,85,0.15)]'}`}
            >
              <div className="flex items-center gap-4 min-w-[200px]">
                <AgentImage agentName={match.agent} />
                <div>
                  <div className={`font-display uppercase text-xl tracking-wider ${isWin ? 'text-[#16c68a]' : 'text-accent-primary'}`}>
                    {match.outcome === 'Victory' ? 'Vitória' : 'Derrota'}
                  </div>
                  <div className="text-xs font-sans text-text-muted uppercase tracking-widest">
                    {match.map} • {match.score}
                  </div>
                </div>
              </div>
              
              <div className="flex-grow grid grid-cols-3 gap-4 text-center">
                <div className="flex flex-col">
                  <span className="text-xs text-text-muted font-bold uppercase tracking-wider mb-1 flex items-center justify-center gap-1"><Skull size={12}/> KDA</span>
                  <span className="font-display text-lg text-text-main">{match.kda}</span>
                </div>
                <div className="flex flex-col border-l border-hud-border/20">
                  <span className="text-xs text-text-muted font-bold uppercase tracking-wider mb-1 flex items-center justify-center gap-1"><Target size={12}/> HS%</span>
                  <span className="font-display text-lg text-text-main">{match.hsPercentage}%</span>
                </div>
                <div className="flex flex-col border-l border-hud-border/20">
                  <span className="text-xs text-text-muted font-bold uppercase tracking-wider mb-1 flex items-center justify-center gap-1"><Activity size={12}/> KD Ratio</span>
                  <span className="font-display text-lg text-text-main">{match.kdRatio.toFixed(2)}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
