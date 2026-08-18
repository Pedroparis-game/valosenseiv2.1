import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LabelList } from 'recharts';
import { MatchRecord } from '../../types';

interface Props {
  matches: MatchRecord[];
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-hud-surface border border-hud-border p-3 clip-chamfer-sm shadow-xl">
        <p className="text-xs font-mono font-bold text-text-main mb-2 border-b border-hud-border pb-1">
          {data.map}
        </p>
        <p className="text-xs font-mono font-bold text-text-muted mb-1">
          Vitórias: <span className="text-accent-primary">{data.wins}</span>
        </p>
        <p className="text-xs font-mono font-bold text-text-muted mb-1">
          Derrotas: <span className="text-accent-crimson">{data.losses}</span>
        </p>
        <p className="text-xs font-mono font-bold text-text-main pt-1 border-t border-hud-border/50">
          Winrate: {(data.winrate).toFixed(1)}%
        </p>
      </div>
    );
  }
  return null;
};

export default function MapWinrateBar({ matches }: Props) {
  const chartData = useMemo(() => {
    if (!matches || matches.length === 0) return [];
    
    const mapStats: Record<string, { wins: number; total: number; map: string }> = {};
    
    matches.forEach(m => {
      if (!mapStats[m.map]) {
        mapStats[m.map] = { wins: 0, total: 0, map: m.map };
      }
      mapStats[m.map].total += 1;
      if (m.result === 'win') {
        mapStats[m.map].wins += 1;
      }
    });

    const data = Object.values(mapStats).map(stat => ({
      ...stat,
      losses: stat.total - stat.wins,
      winrate: (stat.wins / stat.total) * 100
    }));

    return data.sort((a, b) => b.winrate - a.winrate);
  }, [matches]);

  if (!chartData.length) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center text-text-muted tactical-card p-6 min-h-[300px]">
        <span className="font-mono text-xs uppercase tracking-widest">Sem telemetria de mapa</span>
      </div>
    );
  }

  const getColor = (winrate: number) => {
    if (winrate > 55) return '#FF4655'; // Tactical Cyan
    if (winrate >= 45) return '#8B97A3';
    return '#2A3441';
  };

  return (
    <div className="tactical-card p-4 md:p-6 w-full h-[400px] flex flex-col">
      <div className="mb-4">
        <h3 className="font-display text-xl uppercase tracking-widest text-text-main">Aproveitamento Tático</h3>
        <p className="font-mono text-[10px] text-text-muted uppercase tracking-[0.1em]">Winrate % por Mapa</p>
      </div>
      
      <div className="flex-grow w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} layout="vertical" margin={{ top: 0, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2A323C" horizontal={true} vertical={false} />
            <XAxis 
              type="number" 
              domain={[0, 100]} 
              stroke="#8B97A3"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              fontFamily="JetBrains Mono"
            />
            <YAxis 
              type="category" 
              dataKey="map" 
              stroke="#E2E8F0"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              fontFamily="JetBrains Mono"
              width={80}
            />
            <Tooltip cursor={{ fill: '#1B1E22' }} content={<CustomTooltip />} />
            
            <Bar 
              dataKey="winrate" 
              isAnimationActive={true}
              animationDuration={1000}
              animationEasing="ease-out"
              radius={[0, 4, 4, 0]}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getColor(entry.winrate)} />
              ))}
              <LabelList 
                dataKey="total" 
                position="right" 
                formatter={(val: number) => `(${val} partidas)`}
                fill="#8B97A3"
                fontSize={10}
                fontFamily="JetBrains Mono"
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
