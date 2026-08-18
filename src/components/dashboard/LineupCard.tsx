import React from 'react';
import { ShieldAlert, Map as MapIcon, Target, BookOpen, CheckCircle } from 'lucide-react';

interface Props {
  id: string;
  title: string;
  agent: string;
  map: string;
  type: string;
  difficulty: string;
  verified: boolean;
  thumbnailUrl?: string;
  onClick: () => void;
}

export default function LineupCard({ title, agent, map, type, difficulty, verified, thumbnailUrl, onClick }: Props) {
  return (
    <div 
      onClick={onClick}
      className="tactical-card group cursor-pointer flex flex-col h-full"
    >
      {/* Thumbnail */}
      <div className="w-full h-40 bg-hud-base border-b border-hud-border relative overflow-hidden">
        {thumbnailUrl ? (
          <img 
            src={thumbnailUrl} 
            alt={title} 
            className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity duration-300 group-hover:scale-105" 
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-hud-border">
             <MapIcon size={48} strokeWidth={1} />
          </div>
        )}
        
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-hud-surface via-transparent to-transparent opacity-80" />
        
        {/* Badges overlay */}
        <div className="absolute top-3 left-3 flex gap-2">
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-text-main bg-hud-base/80 backdrop-blur-sm border border-hud-border px-2 py-0.5 clip-chamfer-sm">
            {map}
          </span>
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-accent-primary bg-accent-primary/10 backdrop-blur-sm border border-accent-primary/30 px-2 py-0.5 clip-chamfer-sm">
            {type}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-grow flex flex-col justify-between relative">
        {/* Red accent line that appears on hover */}
        <div className="absolute top-0 left-0 w-full h-[2px] bg-accent-primary transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
        
        <div>
          <div className="flex items-center justify-between mb-2">
             <span className="text-xs font-mono font-bold text-text-muted tracking-widest uppercase">{agent}</span>
             {verified && (
               <div className="flex items-center gap-1 text-emerald-400 text-[10px] font-mono uppercase tracking-widest">
                 <CheckCircle size={12} />
                 <span>Verified</span>
               </div>
             )}
          </div>
          <h4 className="font-display text-xl uppercase tracking-widest text-text-main group-hover:text-accent-primary transition-colors">
            {title}
          </h4>
        </div>
        
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-1">
            {[1, 2, 3].map(star => (
              <Target 
                key={star} 
                size={14} 
                className={
                  (difficulty === 'easy' && star === 1) || 
                  (difficulty === 'medium' && star <= 2) || 
                  (difficulty === 'hard') 
                    ? "text-text-main" 
                    : "text-hud-border"
                } 
              />
            ))}
          </div>
          <span className="text-[10px] font-mono text-text-muted uppercase tracking-widest flex items-center gap-1 group-hover:text-text-main transition-colors">
            Ver Setup <BookOpen size={12} />
          </span>
        </div>
      </div>
    </div>
  );
}
