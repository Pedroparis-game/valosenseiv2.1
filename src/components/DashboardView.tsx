import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { RefreshCcw, Brain, Target, ArrowLeft, BookOpen, BarChart3, Map } from "lucide-react";
import { PlayerStats, AnalysisResult, MatchRecord, MapDashboardData } from "../types";
import StatsOverview from "./dashboard/StatsOverview";
import Insights from "./dashboard/Insights";
import TacticalLibrary from "./dashboard/TacticalLibrary";
import MatchHistory from "./dashboard/MatchHistory";
import WeaponStats from "./dashboard/WeaponStats";
import { MapPerformanceGrid } from "./dashboard/MapPerformanceGrid";
import { MapDetailModal } from "./dashboard/MapDetailModal";
import { mockMapPerformanceData } from "../data/mockMapPerformance";
import { InsightsChartsSection } from "./dashboard/charts/InsightsChartsSection";

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
  const [activeTab, setActiveTab] = useState<'training' | 'library' | 'maps' | 'charts'>('training');
  const [selectedMapId, setSelectedMapId] = useState<string | null>(null);

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

  const selectedMapData = selectedMapId 
    ? mockMapPerformanceData.find(m => m.mapId === selectedMapId) 
    : null;

  // Map API MatchData to our new MatchRecord for charts
  const matchRecords: MatchRecord[] = stats.recentMatches.map(m => {
    const [k, d, a] = m.kda.split("/").map(Number);
    return {
      matchId: m.id,
      playedAt: m.timestamp,
      map: m.map,
      agent: m.agent,
      result: m.outcome === "Victory" ? "win" : "loss",
      kills: k || 0,
      deaths: d || 0,
      assists: a || 0,
      rankBefore: stats.rr || 50,
      rankAfter: (stats.rr || 50) + (m.outcome === "Victory" ? 15 : -15), // Mocking variation
      side: "attack"
    };
  });

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="max-w-6xl mx-auto px-2 md:px-0 animate-fadeIn"
    >
      {/* HEADER SECTION */}
      <motion.div variants={item} className="flex flex-col md:flex-row justify-between items-center md:items-end mb-8 gap-6 border-b border-hud-border pb-8">
         <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
              <span className="text-xs font-mono font-bold uppercase tracking-[0.2em] bg-accent-cyan/10 text-accent-cyan border border-accent-cyan/20 px-3 py-1 clip-chamfer-sm">Telemetria de Agente</span>
            </div>
            <h2 className="text-5xl md:text-7xl font-display uppercase leading-none flex flex-wrap items-baseline justify-center md:justify-start gap-2 tracking-wider">
               <span className="text-text-main">{stats.name}</span>
               <span className="text-text-muted text-3xl md:text-5xl">#{stats.tag}</span>
            </h2>
         </div>
         <div className="flex gap-4 w-full md:w-auto">
            <button 
              onClick={handleRefresh}
              disabled={loading}
              className="tactical-btn w-1/2 md:w-auto disabled:opacity-50"
            >
              <RefreshCcw size={18} className={loading ? "animate-spin" : ""} />
              Atualizar
            </button>
            <button 
              onClick={handleNewSearch}
              className="tactical-btn w-1/2 md:w-auto"
            >
              <ArrowLeft size={18} />
              Voltar
            </button>
         </div>
      </motion.div>

      {/* VIEW TABS SELECTOR */}
      <motion.div variants={item} className="flex flex-wrap gap-2 border-b border-hud-border pb-6 mb-8">
        <button
          onClick={() => setActiveTab('training')}
          className={`flex-1 md:flex-initial flex items-center justify-center gap-3 px-4 md:px-6 py-3 font-display text-sm md:text-lg uppercase tracking-widest border transition-all clip-chamfer-sm ${
            activeTab === 'training'
              ? 'bg-accent-cyan/10 text-accent-cyan border-accent-cyan shadow-[0_0_15px_rgba(0,223,216,0.15)]'
              : 'bg-hud-surface text-text-muted border-hud-border hover:text-text-main hover:border-text-muted'
          }`}
        >
          <BarChart3 size={18} />
          Geral
        </button>
        
        <button
          onClick={() => setActiveTab('charts')}
          className={`flex-1 md:flex-initial flex items-center justify-center gap-3 px-4 md:px-6 py-3 font-display text-sm md:text-lg uppercase tracking-widest border transition-all clip-chamfer-sm ${
            activeTab === 'charts'
              ? 'bg-accent-cyan/10 text-accent-cyan border-accent-cyan shadow-[0_0_15px_rgba(0,223,216,0.15)]'
              : 'bg-hud-surface text-text-muted border-hud-border hover:text-text-main hover:border-text-muted'
          }`}
        >
          <Target size={18} />
          Evolução
        </button>

        <button
          onClick={() => setActiveTab('maps')}
          className={`flex-1 md:flex-initial flex items-center justify-center gap-3 px-4 md:px-6 py-3 font-display text-sm md:text-lg uppercase tracking-widest border transition-all clip-chamfer-sm ${
            activeTab === 'maps'
              ? 'bg-accent-cyan/10 text-accent-cyan border-accent-cyan shadow-[0_0_15px_rgba(0,223,216,0.15)]'
              : 'bg-hud-surface text-text-muted border-hud-border hover:text-text-main hover:border-text-muted'
          }`}
        >
          <Map size={18} />
          Mapas
        </button>

        <button
          onClick={() => setActiveTab('library')}
          className={`flex-1 md:flex-initial flex items-center justify-center gap-3 px-4 md:px-6 py-3 font-display text-sm md:text-lg uppercase tracking-widest border transition-all clip-chamfer-sm ${
            activeTab === 'library'
              ? 'bg-accent-cyan/10 text-accent-cyan border-accent-cyan shadow-[0_0_15px_rgba(0,223,216,0.15)]'
              : 'bg-hud-surface text-text-muted border-hud-border hover:text-text-main hover:border-text-muted'
          }`}
        >
          <BookOpen size={18} />
          Biblioteca
        </button>
      </motion.div>

      {/* CORE VIEWPORT */}
      <div className="space-y-12">
        {activeTab === 'training' && (
          <>
            <StatsOverview stats={stats} />
            
            {analysis ? (
              <>
                <Insights analysis={analysis} stats={stats} />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-auto">
                   <MatchHistory matches={stats.recentMatches} />
                   <div className="flex flex-col gap-8 h-full">
                     <WeaponStats weapons={analysis.weaponStats || []} />
                   </div>
                </div>
              </>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="tactical-card flex flex-col items-center justify-center py-32 gap-6 relative"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-accent-cyan/5 blur-[50px] rounded-full" />
                <div className="relative">
                  <Brain size={64} className="text-accent-cyan opacity-50 animate-pulse" />
                  <Target size={24} className="absolute -top-2 -right-2 text-text-main animate-bounce" />
                </div>
                <div className="text-center relative z-10">
                  <div className="font-display uppercase text-3xl tracking-widest mb-2 text-text-main">Sincronizando Telemetria...</div>
                  <p className="text-sm font-mono font-bold uppercase tracking-[0.2em] text-text-muted">Estabelecendo conexão com o servidor tático</p>
                </div>
              </motion.div>
            )}
          </>
        )}

        {activeTab === 'charts' && (
           <InsightsChartsSection matches={matchRecords} />
        )}

        {activeTab === 'maps' && (
           <MapPerformanceGrid 
             maps={mockMapPerformanceData} 
             onClick={(id) => setSelectedMapId(id)} 
           />
        )}

        {activeTab === 'library' && (
          <TacticalLibrary />
        )}
      </div>

      {/* MODAL LAYER */}
      <AnimatePresence>
        {selectedMapId && selectedMapData && (
          <MapDetailModal 
            mapData={selectedMapData} 
            onClose={() => setSelectedMapId(null)} 
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};
