import React, { useState, useEffect } from "react";
import { getOfficialRankIcon } from "../../utils/rankUtils";
import { motion } from "motion/react";
import { PlayerStats } from "../../types";
import { Trophy, Target, TrendingUp, Crosshair, Activity, Hash } from "lucide-react";

interface Props {
  stats: PlayerStats;
}

export default function StatsOverview({ stats }: Props) {
  const [rankIconUrl, setRankIconUrl] = useState<string>(
    stats.rankImageUrl || "https://media.valorant-api.com/competitivetiers/03621f13-4c37-ad53-9043-695333d57551/0/largeicon.png"
  );

  useEffect(() => {
    if (stats.rankImageUrl) {
      setRankIconUrl(stats.rankImageUrl);
      return;
    }
    const loadIcon = async () => {
      const url = await getOfficialRankIcon(stats.rank);
      setRankIconUrl(url);
    };
    loadIcon();
  }, [stats.rank, stats.rankImageUrl]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-12 relative hud-grid-bg p-2 md:p-6 rounded-xl border border-hud-border/30">
      
      {/* Decorative corner brackets */}
      <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-accent-cyan/30"></div>
      <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-accent-cyan/30"></div>
      <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-accent-cyan/30"></div>
      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-accent-cyan/30"></div>

      {/* RANKING CARD (Col Span 5) */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="lg:col-span-5"
      >
        <div className="tactical-card flex flex-col sm:flex-row items-center gap-6 p-6 h-full group">
          <div className="w-28 h-28 bg-hud-base border border-hud-border flex items-center justify-center shrink-0 clip-chamfer relative overflow-hidden transition-all duration-300 group-hover:border-accent-cyan/50">
             <div className="absolute inset-0 bg-accent-cyan/5 group-hover:bg-accent-cyan/10 transition-colors" />
             <motion.img
               initial={{ scale: 0.5, rotate: -20 }}
               animate={{ scale: 1, rotate: 0 }}
               transition={{ type: "spring", stiffness: 200, damping: 15 }}
               src={rankIconUrl}
               alt={stats.rank}
               className="w-20 h-20 object-contain drop-shadow-[0_0_10px_rgba(0,223,216,0.2)] relative z-10 group-hover:scale-110 transition-transform duration-500"
               referrerPolicy="no-referrer"
             />
          </div>
          
          <div className="flex-grow text-center sm:text-left z-10 w-full">
             <div className="flex items-center justify-center sm:justify-start gap-2 mb-1 text-accent-cyan">
                <Trophy size={12} className="opacity-80" />
                <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em]">Rating Atual</span>
             </div>
             
             <h3 className="text-3xl md:text-4xl font-display uppercase leading-none tracking-widest text-text-main mb-4">
               {stats.rank}
             </h3>
             
             <div className="space-y-2 w-full">
                <div className="flex justify-between items-end mb-1">
                   <span className="text-[10px] font-mono font-bold text-text-muted tracking-widest">PROGRESSO // RR</span>
                   <span className="text-xs font-mono text-accent-cyan font-bold">{stats.rr} / 100</span>
                </div>
                {/* Tactical Progress Bar */}
                <div className="h-1.5 w-full bg-hud-base border border-hud-border overflow-hidden">
                   <motion.div
                     initial={{ width: 0 }}
                     animate={{ width: `${stats.rr}%` }}
                     transition={{ duration: 1, delay: 0.2, ease: "circOut" }}
                     className="h-full bg-accent-cyan shadow-[0_0_8px_rgba(0,223,216,0.6)]"
                    />
                </div>
             </div>
          </div>
        </div>
      </motion.div>

      {/* QUICK STATS (Col Span 7) */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
        className="lg:col-span-7"
      >
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 h-full">
          <StatBox 
            label="Win Rate" 
            value={`${stats.overallWinRate}%`} 
            icon={<TrendingUp size={16} />}
            trend={stats.overallWinRate >= 50 ? 'up' : 'down'}
          />
          <StatBox 
            label="Headshot" 
            value={`${stats.overallHs}%`} 
            icon={<Crosshair size={16} />}
            trend={stats.overallHs >= 25 ? 'up' : 'neutral'}
          />
          <StatBox 
            label="K/D Ratio" 
            value={(stats.overallKd ?? 0).toFixed(2)} 
            icon={<Activity size={16} />}
            trend={(stats.overallKd ?? 0) >= 1.1 ? 'up' : 'down'}
            className="col-span-2 md:col-span-1"
          />
        </div>
      </motion.div>
    </div>
  );
}

const StatBox = ({ label, value, icon, trend, className = "" }: { label: string; value: string; icon: React.ReactNode; trend: 'up' | 'down' | 'neutral'; className?: string }) => {
  const trendColor = 
    trend === 'up' ? 'text-accent-cyan' : 
    trend === 'down' ? 'text-accent-crimson' : 
    'text-text-muted';

  return (
    <div className={`tactical-card p-4 flex flex-col justify-between group h-full ${className}`}>
      <div className="flex justify-between items-start mb-4">
        <div className="text-text-muted group-hover:text-text-main transition-colors">
          {icon}
        </div>
        <Hash size={12} className="text-hud-border" />
      </div>
      
      <div>
        <div className="text-[10px] font-mono font-bold uppercase text-text-muted mb-1 tracking-[0.1em]">{label}</div>
        <div className="flex items-baseline gap-2">
          <div className="text-3xl font-display tracking-widest text-text-main">{value}</div>
          <div className={`text-xs font-mono font-bold ${trendColor}`}>
            {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '—'}
          </div>
        </div>
      </div>
    </div>
  );
};
