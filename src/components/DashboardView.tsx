import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { RefreshCcw, Target, ArrowLeft, BookOpen, BarChart3, Map } from "lucide-react";
import { PlayerStats, AnalysisResult, MatchRecord } from "../types";
import StatsOverview from "./dashboard/StatsOverview";
import Insights from "./dashboard/Insights";
import TacticalLibrary from "./dashboard/TacticalLibrary";
import MatchHistory from "./dashboard/MatchHistory";
import WeaponStats from "./dashboard/WeaponStats";
import { MapPerformanceGrid } from "./dashboard/MapPerformanceGrid";
import { MapDetailModal } from "./dashboard/MapDetailModal";
import { mockMapPerformanceData } from "../data/mockMapPerformance";
import InsightsChartsSection from "./charts/InsightsChartsSection";

import { Button } from "./ui/Button";
import { TabBar } from "./ui/TabBar";
import { LoadingIndicator } from "./ui/animations/LoadingIndicator";

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
              <span className="text-xs font-mono font-bold uppercase tracking-[0.2em] bg-accent-primary/10 text-accent-primary border border-accent-primary/20 px-3 py-1 clip-chamfer-sm">Telemetria de Agente</span>
            </div>
            <h2 className="text-5xl md:text-7xl font-display uppercase leading-none flex flex-wrap items-baseline justify-center md:justify-start gap-2 tracking-wider">
               <span className="text-text-main">{stats.name}</span>
               <span className="text-text-muted text-3xl md:text-5xl">#{stats.tag}</span>
            </h2>
         </div>
         <div className="flex gap-4 w-full md:w-auto">
            <Button 
              onClick={handleRefresh}
              loading={loading}
              variant="primary"
              className="w-1/2 md:w-auto"
              icon={<RefreshCcw size={18} />}
            >
              Atualizar
            </Button>
            <Button 
              onClick={handleNewSearch}
              variant="secondary"
              className="w-1/2 md:w-auto"
              icon={<ArrowLeft size={18} />}
            >
              Voltar
            </Button>
         </div>
      </motion.div>

      {/* VIEW TABS SELECTOR */}
      <motion.div variants={item}>
        <TabBar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          tabs={[
            { id: 'training', label: 'Geral', icon: <BarChart3 size={18} /> },
            { id: 'charts', label: 'Evolução', icon: <Target size={18} /> },
            { id: 'maps', label: 'Mapas', icon: <Map size={18} /> },
            { id: 'library', label: 'Biblioteca', icon: <BookOpen size={18} /> },
          ]}
        />
      </motion.div>

      {/* CORE VIEWPORT */}
      <div className="space-y-12 relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: -20, filter: "blur(4px)" }}
            animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, x: 20, filter: "blur(4px)" }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="w-full"
          >
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
              <div className="tactical-card py-32">
                <LoadingIndicator />
              </div>
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
          </motion.div>
        </AnimatePresence>
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
