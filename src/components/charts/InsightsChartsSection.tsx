import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import PerformanceTrendChart from './PerformanceTrendChart';
import AgentRadarChart from './AgentRadarChart';
import RankProgressionChart from './RankProgressionChart';
import MapWinrateBar from './MapWinrateBar';
import { MatchRecord } from '../../types';

interface Props {
  matches: MatchRecord[];
}

// Container for staggering animations
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 20 } }
};

export default function InsightsChartsSection({ matches }: Props) {
  // We compute the mock radar data for the primary agent based on most played agent
  const radarData = useMemo(() => {
    if (!matches || matches.length === 0) return { data: [], primaryAgent: '' };

    // Find most played agent
    const agentCounts: Record<string, number> = {};
    matches.forEach(m => {
      agentCounts[m.agent] = (agentCounts[m.agent] || 0) + 1;
    });
    const primaryAgent = Object.keys(agentCounts).reduce((a, b) => agentCounts[a] > agentCounts[b] ? a : b);

    // Mocking attributes (since the prompt said "não precisa calcular os atributos, isso vem de outro lugar")
    // If we had real data, we'd pass it here. For now, generate some plausible data.
    const data = [
      { attribute: 'MIRA', value: 75, secondaryValue: 60 },
      { attribute: 'UTILIDADE', value: 85, secondaryValue: 70 },
      { attribute: 'CLUTCH', value: 65, secondaryValue: 55 },
      { attribute: 'ENTRY', value: 40, secondaryValue: 80 },
      { attribute: 'SUPORTE', value: 90, secondaryValue: 50 },
    ];

    return { data, primaryAgent, secondaryAgent: 'Jett' };
  }, [matches]);

  if (!matches || matches.length === 0) {
    return (
      <div className="w-full py-16 flex flex-col items-center justify-center tactical-card">
        <h3 className="text-xl font-display uppercase tracking-widest text-text-main mb-2">
          Telemetria Insuficiente
        </h3>
        <p className="text-sm font-mono text-text-muted">
          Não há dados de partidas suficientes para gerar gráficos.
        </p>
      </div>
    );
  }

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 xl:grid-cols-2 gap-6 w-full"
    >
      <motion.div variants={item} className="w-full">
        <PerformanceTrendChart matches={matches} />
      </motion.div>
      
      <motion.div variants={item} className="w-full">
        <RankProgressionChart matches={matches} />
      </motion.div>
      
      <motion.div variants={item} className="w-full">
        <AgentRadarChart 
          data={radarData.data} 
          primaryAgentName={radarData.primaryAgent} 
          secondaryAgentName={radarData.secondaryAgent} 
        />
      </motion.div>
      
      <motion.div variants={item} className="w-full">
        <MapWinrateBar matches={matches} />
      </motion.div>
    </motion.div>
  );
}
