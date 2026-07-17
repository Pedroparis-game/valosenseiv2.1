import React, { useState } from "react";
import { motion } from "motion/react";
import { RefreshCcw, Brain, Target, ArrowLeft, BookOpen, BarChart3 } from "lucide-react";
import { PlayerStats, AnalysisResult } from "../types";
import StatsOverview from "./dashboard/StatsOverview";
import Insights from "./dashboard/Insights";
import TacticalLibrary from "./dashboard/TacticalLibrary";

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
  const [activeTab, setActiveTab] = useState<'training' | 'library'>('training');

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 100, damping: 20 } }
  };

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="max-w-6xl mx-auto px-2 md:px-0 animate-fadeIn"
    >
      {/* HEADER SECTION */}
      <motion.div variants={item} className="flex flex-col md:flex-row justify-between items-center md:items-end mb-8 gap-6 border-b border-brand-gray/20 pb-8">
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
      </motion.div>

      {/* VIEW TABS SELECTOR */}
      <motion.div variants={item} className="flex gap-2 border-b border-brand-gray/10 pb-6 mb-8">
        <button
          onClick={() => setActiveTab('training')}
          className={`flex-1 md:flex-initial flex items-center justify-center gap-3 px-6 py-3 font-heading text-xl md:text-2xl uppercase tracking-widest border transition-all ${
            activeTab === 'training'
              ? 'bg-brand-red text-white border-brand-red shadow-[0_0_15px_rgba(255,70,85,0.25)]'
              : 'bg-[#0f141c] text-brand-gray border-brand-gray/15 hover:text-brand-light hover:border-brand-gray/30'
          }`}
          style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%)' }}
        >
          <BarChart3 size={18} />
          Painel de Treino
        </button>
        <button
          onClick={() => setActiveTab('library')}
          className={`flex-1 md:flex-initial flex items-center justify-center gap-3 px-6 py-3 font-heading text-xl md:text-2xl uppercase tracking-widest border transition-all ${
            activeTab === 'library'
              ? 'bg-brand-red text-white border-brand-red shadow-[0_0_15px_rgba(255,70,85,0.25)]'
              : 'bg-[#0f141c] text-brand-gray border-brand-gray/15 hover:text-brand-light hover:border-brand-gray/30'
          }`}
          style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%)' }}
        >
          <BookOpen size={18} />
          Biblioteca Tática
        </button>
      </motion.div>

      {/* CORE VIEWPORT */}
      <div className="space-y-12">
        {activeTab === 'training' ? (
          <>
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
                  <div className="font-heading uppercase text-4xl tracking-widest mb-2 animate-pulse text-brand-light">Sincronizando Dados...</div>
                  <p className="text-sm font-sans uppercase tracking-[0.2em] text-brand-gray">Estabelecendo conexão com o servidor tático</p>
                </div>
              </motion.div>
            )}
          </>
        ) : (
          <TacticalLibrary />
        )}
      </div>
    </motion.div>
  );
};
