import React from "react";
import { motion } from "motion/react";
import { RefreshCcw, Brain, Target, ArrowLeft } from "lucide-react";
import { PlayerStats, AnalysisResult } from "../types";
import StatsOverview from "./dashboard/StatsOverview";
import Insights from "./dashboard/Insights";

interface DashboardViewProps {
  stats: PlayerStats;
  analysis: AnalysisResult | null;
  loading: boolean;
  handleRefresh: () => void;
  handleNewSearch: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  stats,
  analysis,
  loading,
  handleRefresh,
  handleNewSearch
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className="max-w-6xl mx-auto px-2 md:px-0"
    >
      <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-12 gap-6 border-b border-brand-gray/20 pb-10">
         <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
              <span className="text-xs font-sans font-bold uppercase opacity-80 tracking-[0.2em] bg-brand-red text-white px-3 py-1">Telemetria de Agente</span>
            </div>
            <h2 className="text-5xl md:text-7xl font-heading uppercase leading-none flex flex-wrap items-baseline justify-center md:justify-start gap-2 tracking-wider drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)]">
              <span className="text-brand-light">{stats.name}</span>
              <span className="text-brand-red/80 text-3xl md:text-5xl">#{stats.tag}</span>
            </h2>
         </div>
          <div className="flex gap-4 w-full md:w-auto font-heading text-xl uppercase tracking-widest">
             <button 
               onClick={handleRefresh}
               disabled={loading}
               className="valo-btn !py-2 !px-6 flex items-center justify-center gap-2 w-1/2 md:w-auto !bg-brand-gray/10 !text-brand-light hover:!text-white border-brand-gray/30 disabled:opacity-50"
             >
               <RefreshCcw size={18} className={loading ? "animate-spin" : ""} />
               Atualizar
             </button>
             <button 
               onClick={handleNewSearch}
               className="valo-btn !py-2 !px-6 flex items-center justify-center gap-2 w-1/2 md:w-auto"
             >
               <ArrowLeft size={18} />
               Voltar
             </button>
          </div>
      </div>

      <div className="space-y-12">
        <StatsOverview stats={stats} />
        
        {analysis ? (
          <Insights analysis={analysis} stats={stats} />
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-32 gap-6 bg-brand-dark/50 backdrop-blur-md border border-brand-red/30 relative"
            style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%)' }}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-red/10 blur-[50px] rounded-full" />
            <div className="relative">
              <Brain size={64} className="text-brand-red animate-pulse" />
              <Target size={24} className="absolute -top-2 -right-2 text-white animate-bounce" />
            </div>
            <div className="text-center relative z-10">
              <div className="font-heading uppercase text-4xl tracking-widest mb-2 animate-pulse text-brand-light">Análise em Progresso...</div>
              <p className="text-sm font-sans uppercase tracking-[0.2em] text-brand-gray">Processando vetores balísticos e log de combate</p>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};
