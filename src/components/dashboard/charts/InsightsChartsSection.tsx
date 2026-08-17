import React, { useMemo } from "react";
import { MatchRecord, AgentRadarData } from "../../../types";
import { PerformanceTrendChart } from "./PerformanceTrendChart";
import { AgentRadarChart } from "./AgentRadarChart";
import { RankProgressionChart } from "./RankProgressionChart";
import { MapWinrateBar } from "./MapWinrateBar";

interface InsightsChartsSectionProps {
  matches: MatchRecord[];
  loading?: boolean;
}

export const InsightsChartsSection: React.FC<InsightsChartsSectionProps> = ({
  matches,
  loading = false,
}) => {
  // Memoized data calculations
  const {
    trendData,
    rankData,
    mapWinrateData,
    agentRadarData,
    topAgentName,
  } = useMemo(() => {
    if (!matches || matches.length === 0) {
      return {
        trendData: [],
        rankData: [],
        mapWinrateData: [],
        agentRadarData: [],
        topAgentName: "Desconhecido",
      };
    }

    // Sort matches chronologically (oldest first)
    const sortedMatches = [...matches].sort(
      (a, b) => new Date(a.playedAt).getTime() - new Date(b.playedAt).getTime()
    );

    // 1. Calculate Trend Data (KDA & Rolling Winrate)
    const windowSize = 10;
    const trendData = sortedMatches.map((match, index) => {
      const kda = (match.kills + match.assists) / Math.max(1, match.deaths);
      
      // Calculate rolling winrate for the last 'windowSize' matches up to this point
      const startIdx = Math.max(0, index - windowSize + 1);
      const windowMatches = sortedMatches.slice(startIdx, index + 1);
      const wins = windowMatches.filter(m => m.result === "win").length;
      const winrate = (wins / windowMatches.length) * 100;

      return {
        playedAt: match.playedAt,
        kda,
        winrate,
        map: match.map,
        agent: match.agent,
        result: match.result,
      };
    });

    // 2. Calculate Rank Progression Data
    const rankData = sortedMatches.map(match => ({
      playedAt: match.playedAt,
      rankAfter: match.rankAfter,
      result: match.result,
    }));

    // 3. Calculate Map Winrate Data
    const mapStats: Record<string, { wins: number; total: number }> = {};
    sortedMatches.forEach(match => {
      if (!mapStats[match.map]) {
        mapStats[match.map] = { wins: 0, total: 0 };
      }
      mapStats[match.map].total++;
      if (match.result === "win") {
        mapStats[match.map].wins++;
      }
    });

    const mapWinrateData = Object.entries(mapStats)
      .map(([map, stats]) => ({
        map,
        winrate: (stats.wins / stats.total) * 100,
        totalMatches: stats.total,
      }))
      .sort((a, b) => b.winrate - a.winrate);

    // 4. Calculate Top Agent for Radar Mocking
    // (Assuming backend hasn't provided the exact attributes yet, we mock a realistic profile based on the most played agent)
    const agentStats: Record<string, number> = {};
    sortedMatches.forEach(match => {
      agentStats[match.agent] = (agentStats[match.agent] || 0) + 1;
    });
    
    let topAgentName = sortedMatches[0].agent;
    let maxPlays = 0;
    Object.entries(agentStats).forEach(([agent, plays]) => {
      if (plays > maxPlays) {
        maxPlays = plays;
        topAgentName = agent;
      }
    });

    // Mocking attributes since they aren't directly calculable from raw basic match stats
    // In a full implementation, these would come from the Gemini AI analysis.
    const agentRadarData: AgentRadarData[] = [
      { attribute: "Mira", valueAgent1: Math.floor(Math.random() * 40) + 60 },
      { attribute: "Utilidade", valueAgent1: Math.floor(Math.random() * 50) + 50 },
      { attribute: "Clutch", valueAgent1: Math.floor(Math.random() * 60) + 40 },
      { attribute: "Entry", valueAgent1: Math.floor(Math.random() * 70) + 30 },
      { attribute: "Suporte", valueAgent1: Math.floor(Math.random() * 50) + 50 },
    ];

    return {
      trendData,
      rankData,
      mapWinrateData,
      agentRadarData,
      topAgentName,
    };
  }, [matches]);

  if (loading) {
    return (
      <div className="w-full py-12 flex flex-col items-center justify-center text-brand-red font-heading uppercase tracking-widest animate-pulse">
        Sincronizando Dados Táticos...
      </div>
    );
  }

  if (!matches || matches.length === 0) {
    return (
      <div className="w-full py-12 flex flex-col items-center justify-center bg-zinc-900/30 border border-zinc-800 rounded-xl">
        <p className="text-zinc-500 font-sans">Nenhum histórico de partida encontrado para gerar os gráficos.</p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center gap-3 mb-8">
        <h2 className="text-2xl font-heading uppercase text-white tracking-widest">
          Gráficos de Insights
        </h2>
        <div className="h-px flex-grow bg-gradient-to-r from-brand-red/30 to-transparent" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PerformanceTrendChart data={trendData} />
        <RankProgressionChart data={rankData} />
        <MapWinrateBar data={mapWinrateData} />
        <AgentRadarChart data={agentRadarData} agent1Name={topAgentName} />
      </div>
    </div>
  );
};
