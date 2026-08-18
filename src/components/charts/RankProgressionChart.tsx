import React, { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer } from 'recharts';
import { MatchRecord } from '../../types';

interface Props {
  matches: MatchRecord[];
}

const CustomDot = (props: any) => {
  const { cx, cy, payload } = props;
  
  if (payload.result === 'win') {
    return (
      <svg x={cx - 5} y={cy - 5} width={10} height={10} fill="#39FF88" viewBox="0 0 10 10" style={{ filter: 'drop-shadow(0 0 5px rgba(57,255,136,0.6))' }}>
        <polygon points="5,0 10,10 0,10" />
      </svg>
    );
  }
  
  if (payload.result === 'loss') {
    return (
      <svg x={cx - 5} y={cy - 5} width={10} height={10} fill="#FF4655" viewBox="0 0 10 10">
        <polygon points="0,0 10,0 5,10" />
      </svg>
    );
  }

  return <circle cx={cx} cy={cy} r={3} fill="#00E5FF" />;
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const diff = data.rankAfter - data.rankBefore;
    const diffText = diff > 0 ? `+${diff}` : `${diff}`;
    const diffColor = diff > 0 ? 'text-accent-primary' : diff < 0 ? 'text-accent-crimson' : 'text-text-muted';

    return (
      <div className="bg-hud-surface border border-hud-border p-3 clip-chamfer-sm shadow-xl">
         <p className="text-[10px] font-mono font-bold text-text-muted uppercase tracking-widest mb-1">
          {new Date(label).toLocaleDateString('pt-BR')}
        </p>
        <p className="text-xs font-mono font-bold text-text-main mb-2 border-b border-hud-border pb-1">
          {data.map} ({data.agent})
        </p>
        <p className="text-xl font-display text-text-main">
          {data.rankAfter} <span className={`text-sm ${diffColor}`}>({diffText})</span>
        </p>
      </div>
    );
  }
  return null;
};

export default function RankProgressionChart({ matches }: Props) {
  const { chartData, averageRank } = useMemo(() => {
    if (!matches || matches.length === 0) return { chartData: [], averageRank: 0 };
    
    const sorted = [...matches].sort((a, b) => new Date(a.playedAt).getTime() - new Date(b.playedAt).getTime());
    const sum = sorted.reduce((acc, match) => acc + match.rankAfter, 0);
    
    return {
      chartData: sorted,
      averageRank: sum / sorted.length
    };
  }, [matches]);

  if (!chartData.length) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center text-text-muted tactical-card p-6 min-h-[300px]">
        <span className="font-mono text-xs uppercase tracking-widest">Aguardando telemetria</span>
        <span className="font-body text-sm mt-2 opacity-70">Jogue partidas ranqueadas para habilitar.</span>
      </div>
    );
  }

  // Calculate min/max for domain to make the chart look more dynamic
  const minRank = Math.min(...chartData.map(d => d.rankAfter)) - 20;
  const maxRank = Math.max(...chartData.map(d => d.rankAfter)) + 20;

  return (
    <div className="tactical-card p-4 md:p-6 w-full h-[400px] flex flex-col">
      <div className="mb-4">
        <h3 className="font-display text-xl uppercase tracking-widest text-text-main">Progressão de Rating</h3>
        <p className="font-mono text-[10px] text-text-muted uppercase tracking-[0.1em]">Evolução de RR no Período</p>
      </div>
      
      <div className="flex-grow w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorRank" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00E5FF" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#00E5FF" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#2A323C" vertical={false} />
            <XAxis 
              dataKey="playedAt" 
              tickFormatter={(val) => {
                const d = new Date(val);
                return `${d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })} ${d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute:'2-digit' })}`;
              }}
              stroke="#8B97A3"
              fontSize={10}
              tickLine={false}
              fontFamily="JetBrains Mono"
            />
            <YAxis 
              domain={[Math.max(0, minRank), maxRank]}
              stroke="#8B97A3"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              fontFamily="JetBrains Mono"
            />
            <Tooltip content={<CustomTooltip />} />
            
            <ReferenceLine 
              y={averageRank} 
              stroke="#FF4655" 
              strokeDasharray="4 4" 
              label={{ position: 'insideTopLeft', value: 'MÉDIA', fill: '#FF4655', fontSize: 10, fontFamily: 'JetBrains Mono' }} 
            />
            
            <Area 
              type="monotone" 
              dataKey="rankAfter" 
              stroke="#00E5FF" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorRank)" 
              activeDot={{ r: 8, stroke: '#00E5FF', strokeWidth: 2, fill: '#0F1113' }}
              dot={<CustomDot />}
              isAnimationActive={true}
              animationDuration={1200}
              animationEasing="ease-out"
              style={{ filter: 'drop-shadow(0 0 10px rgba(0,229,255,0.4))' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
