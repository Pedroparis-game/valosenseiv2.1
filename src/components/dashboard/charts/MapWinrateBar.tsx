import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  LabelList,
  ResponsiveContainer,
} from "recharts";

interface MapWinrateData {
  map: string;
  winrate: number;
  totalMatches: number;
}

interface MapWinrateBarProps {
  data: MapWinrateData[];
  loading?: boolean;
}

export const MapWinrateBar: React.FC<MapWinrateBarProps> = ({
  data,
  loading = false,
}) => {
  if (loading) {
    return (
      <div className="w-full h-80 flex items-center justify-center text-zinc-500 font-sans border border-zinc-800/50 rounded-xl bg-zinc-900/20">
        Processando winrates por mapa...
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="w-full h-80 flex items-center justify-center text-zinc-500 font-sans border border-zinc-800/50 rounded-xl bg-zinc-900/20">
        Dados insuficientes de mapas jogados.
      </div>
    );
  }

  const getBarColor = (winrate: number) => {
    if (winrate < 45) return "#ff4655"; // red
    if (winrate >= 55) return "#10b981"; // green
    return "#fbbf24"; // yellow/orange
  };

  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: any[] }) => {
    if (active && payload && payload.length) {
      const d = payload[0].payload as MapWinrateData;
      return (
        <div className="bg-zinc-950/90 border border-zinc-800 p-3 rounded-lg shadow-xl backdrop-blur-md">
          <p className="text-white font-heading tracking-widest uppercase mb-2">{d.map}</p>
          <div className="flex gap-4 items-center">
            <span className="text-zinc-400 text-sm">Winrate:</span>
            <span className="text-white text-lg font-bold" style={{ color: getBarColor(d.winrate) }}>
              {d.winrate.toFixed(1)}%
            </span>
          </div>
          <div className="flex gap-4 items-center mt-1">
            <span className="text-zinc-400 text-sm">Partidas:</span>
            <span className="text-zinc-300 text-sm font-medium">
              {d.totalMatches}
            </span>
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
          Winrate por Mapa
        </h3>
        <p className="text-sm text-zinc-500 font-sans">Média de vitórias ordenadas</p>
      </div>

      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            data={data} 
            layout="vertical"
            margin={{ top: 10, right: 40, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" horizontal={true} vertical={false} />
            <XAxis 
              type="number" 
              domain={[0, 100]} 
              stroke="#52525b" 
              fontSize={12}
              tickFormatter={(val) => `${val}%`}
            />
            <YAxis 
              dataKey="map" 
              type="category" 
              stroke="#a1a1aa" 
              fontSize={12}
              width={80}
              tick={{ fill: "#e4e4e7", fontWeight: 600 }}
            />
            <Tooltip cursor={{ fill: '#27272a', opacity: 0.4 }} content={<CustomTooltip />} />
            
            <Bar dataKey="winrate" radius={[0, 4, 4, 0]} maxBarSize={40}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getBarColor(entry.winrate)} />
              ))}
              <LabelList 
                dataKey="totalMatches" 
                position="right" 
                formatter={(val: number) => `${val} ${val === 1 ? 'partida' : 'partidas'}`}
                fill="#9ca3af"
                fontSize={11}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
