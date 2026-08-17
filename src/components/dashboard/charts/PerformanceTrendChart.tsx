import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface TrendData {
  playedAt: string;
  kda: number;
  winrate: number;
  map: string;
  agent: string;
  result: string;
}

interface PerformanceTrendChartProps {
  data: TrendData[];
  loading?: boolean;
}

export const PerformanceTrendChart: React.FC<PerformanceTrendChartProps> = ({
  data,
  loading = false,
}) => {
  if (loading) {
    return (
      <div className="w-full h-80 flex items-center justify-center text-zinc-500 font-sans border border-zinc-800/50 rounded-xl bg-zinc-900/20">
        Calculando tendências táticas...
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="w-full h-80 flex items-center justify-center text-zinc-500 font-sans border border-zinc-800/50 rounded-xl bg-zinc-900/20">
        Partidas insuficientes para análise de tendência.
      </div>
    );
  }

  // Custom tooltip strictly typed without any
  const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: any[]; label?: string }) => {
    if (active && payload && payload.length) {
      const pointData = payload[0].payload as TrendData;
      const resultColor = 
        pointData.result === "win" ? "text-emerald-400" :
        pointData.result === "loss" ? "text-brand-red" : "text-zinc-400";
        
      const resultText = 
        pointData.result === "win" ? "Vitória" :
        pointData.result === "loss" ? "Derrota" : "Empate";

      return (
        <div className="bg-zinc-950/90 border border-zinc-800 p-4 rounded-lg shadow-xl backdrop-blur-md">
          <p className="text-zinc-400 text-xs mb-2">{new Date(pointData.playedAt).toLocaleDateString()}</p>
          <div className="flex gap-4 mb-3">
            <div>
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Mapa</p>
              <p className="text-white font-medium">{pointData.map}</p>
            </div>
            <div>
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Agente</p>
              <p className="text-white font-medium">{pointData.agent}</p>
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-bold text-white flex justify-between gap-4">
              <span className="text-zinc-400 font-normal">Resultado:</span> 
              <span className={resultColor}>{resultText}</span>
            </p>
            <p className="text-sm font-bold text-brand-red flex justify-between gap-4">
              <span className="text-zinc-400 font-normal">KDA Ratio:</span> 
              <span>{pointData.kda.toFixed(2)}</span>
            </p>
            <p className="text-sm font-bold text-blue-400 flex justify-between gap-4">
              <span className="text-zinc-400 font-normal">Winrate Móvel:</span> 
              <span>{pointData.winrate.toFixed(1)}%</span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full bg-[#0f1923] border border-zinc-800/50 rounded-xl p-6 shadow-lg">
      <div className="mb-6">
        <h3 className="text-xl font-heading uppercase text-white tracking-widest">
          Evolução de Desempenho
        </h3>
        <p className="text-sm text-zinc-500 font-sans">KDA Ratio e Winrate (Média móvel das últimas 10 partidas)</p>
      </div>
      
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
            <XAxis 
              dataKey="playedAt" 
              tickFormatter={(val) => new Date(val).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
              stroke="#52525b" 
              fontSize={12}
              tickMargin={10}
            />
            <YAxis 
              yAxisId="left" 
              stroke="#ff4655" 
              fontSize={12} 
              tickFormatter={(val) => val.toFixed(1)}
              domain={['auto', 'auto']}
            />
            <YAxis 
              yAxisId="right" 
              orientation="right" 
              stroke="#60a5fa" 
              fontSize={12}
              tickFormatter={(val) => `${val}%`}
              domain={[0, 100]}
            />
            <Tooltip content={<CustomTooltip />} />
            
            <Line 
              yAxisId="left" 
              type="monotone" 
              dataKey="kda" 
              stroke="#ff4655" 
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6, fill: "#ff4655", stroke: "#fff" }}
              name="KDA Ratio"
            />
            <Line 
              yAxisId="right" 
              type="monotone" 
              dataKey="winrate" 
              stroke="#60a5fa" 
              strokeWidth={2}
              strokeDasharray="4 4"
              dot={false}
              activeDot={{ r: 6, fill: "#60a5fa", stroke: "#fff" }}
              name="Winrate %"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
