import React from "react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { AgentRadarData } from "../../../types";

interface AgentRadarChartProps {
  data: AgentRadarData[];
  agent1Name: string;
  agent2Name?: string;
  loading?: boolean;
}

export const AgentRadarChart: React.FC<AgentRadarChartProps> = ({
  data,
  agent1Name,
  agent2Name,
  loading = false,
}) => {
  if (loading) {
    return (
      <div className="w-full h-80 flex items-center justify-center text-zinc-500 font-sans border border-zinc-800/50 rounded-xl bg-zinc-900/20">
        Avaliando perfil do agente...
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="w-full h-80 flex items-center justify-center text-zinc-500 font-sans border border-zinc-800/50 rounded-xl bg-zinc-900/20">
        Dados de radar indisponíveis para este agente.
      </div>
    );
  }

  return (
    <div className="w-full bg-[#0f1923] border border-zinc-800/50 rounded-xl p-6 shadow-lg">
      <div className="mb-2">
        <h3 className="text-xl font-heading uppercase text-white tracking-widest">
          Perfil de Agente
        </h3>
        <p className="text-sm text-zinc-500 font-sans">
          {agent2Name ? `Comparação: ${agent1Name} vs ${agent2Name}` : `Métricas de ${agent1Name}`}
        </p>
      </div>

      <div className="h-72 w-full mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
            <PolarGrid stroke="#27272a" />
            <PolarAngleAxis 
              dataKey="attribute" 
              tick={{ fill: "#a1a1aa", fontSize: 11, fontWeight: 600 }} 
            />
            <PolarRadiusAxis 
              angle={30} 
              domain={[0, 100]} 
              tick={false} 
              axisLine={false} 
            />
            <Tooltip 
              contentStyle={{ backgroundColor: "#09090b", borderColor: "#27272a", borderRadius: "8px" }}
              itemStyle={{ fontWeight: "bold" }}
            />
            <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
            
            <Radar
              name={agent1Name}
              dataKey="valueAgent1"
              stroke="#ff4655"
              fill="#ff4655"
              fillOpacity={0.3}
            />
            
            {agent2Name && (
              <Radar
                name={agent2Name}
                dataKey="valueAgent2"
                stroke="#60a5fa"
                fill="#60a5fa"
                fillOpacity={0.3}
              />
            )}
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
