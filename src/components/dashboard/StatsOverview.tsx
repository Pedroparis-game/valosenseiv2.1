import React, { useState, useEffect } from "react";
import { getOfficialRankIcon } from "../../utils/rankUtils";
import { motion } from "motion/react";
import { PlayerStats } from "../../types";
import { Trophy, Target, TrendingUp } from "lucide-react";

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

  const getRankIcon = (rank: string) => {
    return rankIconUrl;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
      {/* CARD DE RANKING */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="valo-card flex flex-col sm:flex-row items-center gap-8 p-8 h-full group relative overflow-hidden">
          <div className="w-32 h-32 bg-brand-darker border border-brand-red/30 flex items-center justify-center relative shrink-0 overflow-hidden shadow-[0_0_20px_rgba(255,70,85,0.15)] group-hover:shadow-[0_0_30px_rgba(255,70,85,0.4)] group-hover:border-brand-red/80 transition-all duration-300">
             <div className="absolute inset-0 bg-brand-red/10 group-hover:bg-brand-red/20 transition-colors duration-300" />
             <motion.img 
               initial={{ scale: 0.5, rotate: -20 }}
               animate={{ scale: 1, rotate: 0 }}
               transition={{ type: "spring", stiffness: 200, damping: 15 }}
               src={getRankIcon(stats.rank)} 
               alt={stats.rank}
               className="w-24 h-24 object-contain group-hover:scale-110 group-hover:rotate-[5deg] transition-all duration-500 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] group-hover:drop-shadow-[0_0_25px_rgba(255,70,85,0.6)] relative z-10"
               referrerPolicy="no-referrer"
             />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-brand-light/10 to-transparent -translate-x-[100%] group-hover:translate-x-[100%] transition-transform duration-[1.5s] ease-in-out pointer-events-none" />

          
          <div className="flex-grow text-center sm:text-left z-10">
             <div className="flex items-center justify-center sm:justify-start gap-2 mb-2 text-brand-red">
                <Trophy size={14} />
                <span className="text-xs font-sans font-bold uppercase tracking-[0.3em] text-brand-gray">Classificação Oficial</span>
             </div>
             <h3 className="text-4xl md:text-5xl font-heading uppercase leading-none tracking-widest mb-6 text-white">
               {stats.rank}
             </h3>
             <div className="space-y-3">
                <div className="flex justify-between items-end mb-1">
                   <span className="text-[10px] font-sans font-bold uppercase text-brand-gray tracking-widest">Progresso de Ranque</span>
                   <span className="text-sm font-heading tracking-widest text-brand-light">{stats.rr}/100 RR</span>
                </div>
                <div className="h-1.5 w-full bg-brand-darker rounded-none overflow-hidden border border-brand-gray/15">
                   <motion.div 
                     initial={{ width: 0 }}
                     animate={{ width: `${stats.rr}%` }}
                     transition={{ duration: 1.5, delay: 0.5, ease: "circOut" }}
                     className="h-full bg-brand-red" 
                   />
                </div>
             </div>
          </div>
        </div>
      </motion.div>

      {/* CARD DE ESTATÍSTICAS RÁPIDAS */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="valo-card grid grid-cols-3 gap-4 h-full p-8 divide-x divide-brand-gray/15">
          <StatBox 
            label="Win Rate" 
            value={`${stats.overallWinRate}%`} 
            icon={<TrendingUp size={22} />}
            color="text-brand-light"
          />
          <StatBox 
            label="Headshot" 
            value={`${stats.overallHs}%`} 
            icon={<Target size={22} />}
            color="text-brand-red drop-shadow-[0_0_10px_rgba(255,70,85,0.6)]"
          />
          <StatBox 
            label="K/D Total" 
            value={(stats.overallKd ?? 0).toString()} 
            icon={<Activity size={22} />}
            color="text-brand-light"
          />
        </div>
      </motion.div>
    </div>
  );
}

const StatBox = ({ label, value, icon, color }: any) => (
  <div className="flex flex-col items-center justify-center text-center px-2 group">
    <div className="mb-4 p-3 rounded bg-brand-darker border border-brand-gray/20 text-brand-light group-hover:border-brand-red/60 group-hover:text-brand-red transition-all duration-300 group-hover:shadow-[0_0_15px_rgba(255,70,85,0.3)] group-hover:-translate-y-1">
       {icon}
    </div>
    <div className="text-[10px] font-sans font-bold uppercase text-brand-gray mb-1 tracking-[0.2em] group-hover:text-brand-light transition-colors">{label}</div>
    <div className={`text-4xl md:text-5xl font-heading tracking-widest transition-transform duration-300 group-hover:scale-110 ${color}`}>{value}</div>
  </div>
);

const Activity = ({ className, size }: { className?: string; size?: number }) => (
  <svg 
    width={size || 24} 
    height={size || 24} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
  </svg>
);
