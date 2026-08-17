import React, { useState } from 'react';
import { motion } from 'motion/react';
import HeroSummary from '../components/dashboard/HeroSummary';
import StatCard from '../components/dashboard/StatCard';
import AgentPortraitCard from '../components/dashboard/AgentPortraitCard';
import InsightsGrid from '../components/dashboard/InsightsGrid';
import { MatchRecord } from '../types';
import { Crosshair, Trophy, TrendingUp, Skull } from 'lucide-react';

// Mock Data to illustrate the assembly
const mockMatches: MatchRecord[] = [
  { matchId: '1', playedAt: '2026-08-10T10:00:00Z', map: 'Ascent', agent: 'Jett', result: 'win', kills: 24, deaths: 12, assists: 4, rankBefore: 50, rankAfter: 68, side: 'attack' },
  { matchId: '2', playedAt: '2026-08-11T14:00:00Z', map: 'Bind', agent: 'Omen', result: 'loss', kills: 14, deaths: 18, assists: 12, rankBefore: 68, rankAfter: 52, side: 'defense' },
  { matchId: '3', playedAt: '2026-08-12T19:00:00Z', map: 'Lotus', agent: 'Jett', result: 'win', kills: 30, deaths: 15, assists: 2, rankBefore: 52, rankAfter: 75, side: 'attack' },
];

const mockRadar = [
  { attribute: 'MIRA', value: 85 },
  { attribute: 'UTILIDADE', value: 60 },
  { attribute: 'CLUTCH', value: 75 },
  { attribute: 'ENTRY', value: 90 },
  { attribute: 'SUPORTE', value: 40 },
];

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'insights'>('overview');

  return (
    <div className="w-full flex flex-col gap-8 pb-12">
      {/* Top Hero Section */}
      <HeroSummary 
        playerName="SENSEI" 
        playerTag="BR1" 
        rankName="Imortal 2" 
        rr={145} 
        highlightStatLabel="Headshot %" 
        highlightStatValue={34.2} 
        highlightStatSuffix="%" 
      />

      {/* Custom Tabs */}
      <div className="flex gap-1 border-b border-hud-border w-full">
        <button 
          onClick={() => setActiveTab('overview')}
          className={`px-6 py-3 font-mono font-bold text-xs uppercase tracking-widest transition-colors relative ${activeTab === 'overview' ? 'text-accent-primary' : 'text-text-muted hover:text-text-main'}`}
        >
          Visão Geral
          {activeTab === 'overview' && (
            <motion.div layoutId="tab-indicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent-primary" />
          )}
        </button>
        <button 
          onClick={() => setActiveTab('insights')}
          className={`px-6 py-3 font-mono font-bold text-xs uppercase tracking-widest transition-colors relative ${activeTab === 'insights' ? 'text-accent-primary' : 'text-text-muted hover:text-text-main'}`}
        >
          Telemetria Tática
          {activeTab === 'insights' && (
            <motion.div layoutId="tab-indicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent-primary" />
          )}
        </button>
      </div>

      {/* Tab Content with Crossfade */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full"
      >
        {activeTab === 'overview' ? (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 w-full">
            {/* Quick Stats */}
            <div className="col-span-1 md:col-span-8 grid grid-cols-2 md:grid-cols-2 gap-6">
              <StatCard label="Winrate" value={58.4} decimals={1} suffix="%" trend={2.4} icon={<Trophy size={20} />} />
              <StatCard label="K/D Ratio" value={1.32} decimals={2} trend={-0.05} icon={<Skull size={20} />} />
              <StatCard label="Dano Médio / Round" value={164} trend={12} icon={<Crosshair size={20} />} />
              <StatCard label="Progresso de RR" value={145} prefix="+" trend={45} icon={<TrendingUp size={20} />} />
            </div>

            {/* Top Agent Portrait */}
            <div className="col-span-1 md:col-span-4 h-full min-h-[300px]">
              <AgentPortraitCard 
                agentName="JETT" 
                role="Duelista" 
                winrate={62.5} 
                kda={1.45} 
                matchesPlayed={42} 
              />
            </div>
          </div>
        ) : (
          <InsightsGrid matches={mockMatches} radarData={mockRadar} primaryAgent="Jett" />
        )}
      </motion.div>
    </div>
  );
}
