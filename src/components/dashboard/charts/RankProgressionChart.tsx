import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts";

interface RankData {
  playedAt: string;
  rankAfter: number;
  result: string;
}

interface RankProgressionChartProps {
  data: RankData[];
  loading?: boolean;
}

export const RankProgressionChart: React.FC<RankProgressionChartProps> = ({
  data,
  loading = false,
}) => {
  if (loading) {
    return (
      <div className="w-full h-80 flex items-center justify-center text-zinc-500 font-sans border border-zinc-800/50 rounded-xl bg-zinc-900/20">
        Mapeando histórico de rank...
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="w-full h-80 flex items-center justify-center text-zinc-500 font-sans border border-zinc-800/50 rounded-xl bg-zinc-900/20">
        Sem histórico de variação de rank.
      </div>
    );
  }

  const averageRank = data.reduce((sum, item) => sum + item.rankAfter, 0) / data.length;

  const CustomDot = (props: { cx?: number; cy?: number; payload?: RankData; value?: number }) => {
    const { cx, cy, payload } = props;
    if (cx === undefined || cy === undefined || !payload) return null;
    
    let color = "#6b7280"; // draw
    if (payload.result === "win") color = "#10b981"; // green
    if (payload.result === "loss") color = "#ff4655"; // red

    return <circle cx={cx} cy={cy} r={4} fill={color} stroke="#09090b" strokeWidth={1.5} />;
  };

  const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: any[]; label?: string }) => {
    if (active && payload && payload.length) {
      const pointData = payload[0].payload as RankData;
      const resultText = 
        pointData.result === "win" ? "Vitória" :
        pointData.result === "loss" ? "Derrota" : "Empate";

      return (
        <div className="bg-zinc-950/90 border border-zinc-800 p-3 rounded-lg shadow-xl backdrop-blur-md">
          <p className="text-zinc-400 text-xs mb-1">{new Date(pointData.playedAt).toLocaleDateString()}</p>
          <div className="flex gap-4 items-center">
            <span className="text-zinc-400 text-sm">Resultado:</span>
            <span className={`text-sm font-bold ${pointData.result === 'win' ? 'text-emerald-400' : pointData.result === 'loss' ? 'text-brand-red' : 'text-zinc-400'}`}>
              {resultText}
            </span>
          </div>
          <div className="flex gap-4 items-center mt-1">
            <span className="text-zinc-400 text-sm">MMR/RR:</span>
            <span className="text-white text-lg font-heading tracking-wider">
              {pointData.rankAfter.toFixed(0)}
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  const minRank = Math.min(...data.map(d => d.rankAfter));
  const maxRank = Math.max(...data.map(d => d.rankAfter));
  const padding = Math.max(10, (maxRank - minRank) * 0.1);

  return (
    <div className="w-full bg-[#0f1923] border border-zinc-800/50 rounded-xl p-6 shadow-lg">
      <div className="mb-6">
        <h3 className="text-xl font-heading uppercase text-white tracking-widest">
          Progressão de Rank
        </h3>
        <p className="text-sm text-zinc-500 font-sans">Evolução do MMR/RR ao longo do tempo</p>
      </div>

      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorRank" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ffffff" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#ffffff" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
            <XAxis 
              dataKey="playedAt" 
              tickFormatter={(val) => new Date(val).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
              stroke="#52525b" 
              fontSize={12}
              tickMargin={10}
            />
            <YAxis 
              stroke="#a1a1aa" 
              fontSize={12} 
              domain={[Math.max(0, minRank - padding), maxRank + padding]}
              tickFormatter={(val) => Math.round(val).toString()}
            />
            <Tooltip content={<CustomTooltip />} />
            
            <ReferenceLine 
              y={averageRank} 
              stroke="#6b7280" 
              strokeDasharray="4 4" 
              label={{ value: "Média", position: "insideTopLeft", fill: "#9ca3af", fontSize: 10 }} 
            />

            <Area 
              type="monotone" 
              dataKey="rankAfter" 
              stroke="#ffffff" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorRank)" 
              dot={CustomDot as any}
              activeDot={{ r: 6, fill: "#fff", stroke: "#000" }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
