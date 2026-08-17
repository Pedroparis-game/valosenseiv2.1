import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { MatchRecord } from '../../types';

interface Props {
  matches: MatchRecord[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const resultColor = data.result === 'win' ? 'text-accent-primary' : data.result === 'loss' ? 'text-accent-crimson' : 'text-text-muted';
    
    return (
      <div className="bg-hud-surface border border-hud-border p-3 clip-chamfer-sm shadow-xl">
        <p className="text-[10px] font-mono font-bold text-text-muted uppercase tracking-widest mb-2 border-b border-hud-border pb-1">
          {new Date(label).toLocaleDateString('pt-BR')}
        </p>
        <div className="space-y-1">
          <p className="text-xs font-mono font-bold">
            <span className="text-text-muted">MAPA:</span> <span className="text-text-main">{data.map}</span>
          </p>
          <p className="text-xs font-mono font-bold">
            <span className="text-text-muted">AGENTE:</span> <span className="text-text-main">{data.agent}</span>
          </p>
          <p className="text-xs font-mono font-bold">
            <span className="text-text-muted">RESULTADO:</span> <span className={`${resultColor} uppercase`}>{data.result}</span>
          </p>
          <div className="pt-2 mt-2 border-t border-hud-border/50">
            {payload.map((entry: any, index: number) => (
              <p key={`item-${index}`} className="text-xs font-mono font-bold" style={{ color: entry.color }}>
                {entry.name}: {entry.value.toFixed(2)}
              </p>
            ))}
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export default function PerformanceTrendChart({ matches }: Props) {
  const chartData = useMemo(() => {
    if (!matches || matches.length === 0) return [];

    const sortedMatches = [...matches].sort((a, b) => new Date(a.playedAt).getTime() - new Date(b.playedAt).getTime());

    return sortedMatches.map((match, index) => {
      // KDA Ratio
      const kda = (match.kills + match.assists) / Math.max(match.deaths, 1);

      // Rolling Winrate (last 10 matches)
      const startIdx = Math.max(0, index - 9);
      const windowMatches = sortedMatches.slice(startIdx, index + 1);
      const wins = windowMatches.filter(m => m.result === 'win').length;
      const winrate = (wins / windowMatches.length) * 100;

      return {
        ...match,
        kda,
        winrate
      };
    });
  }, [matches]);

  if (!chartData.length) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center text-text-muted tactical-card p-6 min-h-[300px]">
        <span className="font-mono text-xs uppercase tracking-widest">Sem dados suficientes</span>
        <span className="font-body text-sm mt-2 opacity-70">Jogue mais partidas para calibrar a tendência.</span>
      </div>
    );
  }

  return (
    <div className="tactical-card p-4 md:p-6 w-full h-[400px] flex flex-col">
      <div className="mb-4">
        <h3 className="font-display text-xl uppercase tracking-widest text-text-main">Tendência de Performance</h3>
        <p className="font-mono text-[10px] text-text-muted uppercase tracking-[0.1em]">KDA vs Média de Vitórias (10 partidas)</p>
      </div>
      
      <div className="flex-grow w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2A323C" vertical={false} />
            <XAxis 
              dataKey="playedAt" 
              tickFormatter={(val) => new Date(val).toLocaleDateString('pt-BR', { month: 'short', day: 'numeric' })}
              stroke="#8B97A3"
              fontSize={10}
              tickLine={false}
              fontFamily="JetBrains Mono"
            />
            <YAxis 
              yAxisId="left" 
              stroke="#FF4655" 
              fontSize={10} 
              tickLine={false} 
              axisLine={false}
              fontFamily="JetBrains Mono"
            />
            <YAxis 
              yAxisId="right" 
              orientation="right" 
              stroke="#8B97A3" 
              fontSize={10} 
              tickLine={false} 
              axisLine={false}
              domain={[0, 100]}
              fontFamily="JetBrains Mono"
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: '10px', fontFamily: 'JetBrains Mono', textTransform: 'uppercase' }} />
            
            <Line 
              yAxisId="left"
              type="monotone" 
              dataKey="kda" 
              name="KDA Ratio" 
              stroke="#FF4655" 
              strokeWidth={2}
              dot={{ fill: '#FF4655', strokeWidth: 0, r: 3 }}
              activeDot={{ r: 6, stroke: '#FF4655', strokeWidth: 2, fill: '#0B1015' }}
              isAnimationActive={true}
              animationDuration={800}
            />
            <Line 
              yAxisId="right"
              type="monotone" 
              dataKey="winrate" 
              name="Winrate %" 
              stroke="#8B97A3" 
              strokeWidth={2}
              strokeDasharray="4 4"
              dot={false}
              isAnimationActive={true}
              animationDuration={800}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
