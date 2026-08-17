/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface MatchData {
  id: string;
  map: string;
  agent: string;
  score: string; // e.g. "13-11"
  outcome: 'Victory' | 'Defeat';
  kda: string; // e.g. "18/12/5"
  kdRatio: number;
  hsPercentage: number;
  adr: number;
  firstBloods: number;
  economicRating: number;
  timestamp: string;
}

export interface PlayerStats {
  name: string;
  tag: string;
  rank: string;
  overallHs: number;
  overallWinRate: number;
  overallKd: number;
  rr: number;
  rankImageUrl: string;
  recentMatches: MatchData[];
}

export interface TrainingInsight {
  category: 'mira' | 'posicionamento' | 'economia' | 'utilitarias' | 'gameSense';
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  actionableStep: string;
}

export interface MapPerformance {
  mapName: string;
  winRate: number;
  bestAgent: string;
  tendency: string; // e.g. "Struggles on Defense"
  recommendedAgents: string[];
  metaContext: string;
}

export interface MapAgentStats {
  name: string;
  iconUrl: string;
}

export interface MapDashboardStats {
  winRate: number;
  acs: number;
  kdRatio: number;
}

export interface MatchRecord {
  matchId: string;
  playedAt: string; // ISO date
  map: string;
  agent: string;
  result: "win" | "loss" | "draw";
  kills: number;
  deaths: number;
  assists: number;
  rankBefore: number;
  rankAfter: number;
  side: "attack" | "defense";
}

export interface AgentRadarData {
  attribute: string;
  valueAgent1: number;
  valueAgent2?: number;
}

export interface MapDashboardData {
  mapId: string;
  mapName: string;
  images: {
    splash: string;
    radar: string;
  };
  stats: MapDashboardStats;
  topAgents: MapAgentStats[];
}

export interface TacticalMetric {
  label: string;
  value: number;
  average: number; // For comparison
  description: string;
}

export interface WeaponStat {
  name: string;
  kills: number;
  hsPercentage: number;
  accuracy: number; // e.g. 25 for 25%
}

export interface DailyGoal {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  xpReward: number;
}

export interface AnalysisResult {
  id: string;
  userId: string;
  riotId: string;
  overallScore: number;
  tacticalBreakdown: {
    mira: TacticalMetric;
    gameSense: TacticalMetric;
    economia: TacticalMetric;
    posicionamento: TacticalMetric;
    utilitarias: TacticalMetric;
  };
  mapMastery: MapPerformance[];
  insights: TrainingInsight[];
  weaponStats?: WeaponStat[];
  dailyGoals?: DailyGoal[];
  coachVerdict: {
    summary: string;
    strengths: string[];
    weaknesses: string[];
    recommendations: string[];
    stats: {
      headshotRate: string;
      kda: string;
      winRate: string;
      impactScore: string;
      bestAgent: string;
      bestMap: string;
    };
    conclusion: string;
  };
  createdAt: string;
}
