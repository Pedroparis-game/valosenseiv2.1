import React from 'react';
import { motion } from 'motion/react';
import { MatchRecord } from '../../types';
import PerformanceTrendChart from '../charts/PerformanceTrendChart';
import AgentRadarChart from '../charts/AgentRadarChart';
import RankProgressionChart from '../charts/RankProgressionChart';
import MapWinrateBar from '../charts/MapWinrateBar';

interface Props {
  matches: MatchRecord[];
  radarData: any[];
  primaryAgent: string;
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 }
  }
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 20 } as any }
};

export default function InsightsGrid({ matches, radarData, primaryAgent }: Props) {
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
          data={radarData} 
          primaryAgentName={primaryAgent} 
        />
      </motion.div>
      
      <motion.div variants={item} className="w-full">
        <MapWinrateBar matches={matches} />
      </motion.div>
    </motion.div>
  );
}
