import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface AttributeData {
  attribute: string;
  value: number; // 0-100
  secondaryValue?: number; // 0-100 (for comparison)
}

interface Props {
  data: AttributeData[];
  primaryAgentName: string;
  secondaryAgentName?: string;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-hud-surface border border-hud-border p-3 clip-chamfer-sm shadow-xl">
        <p className="text-xs font-mono font-bold text-text-muted uppercase tracking-widest mb-2 border-b border-hud-border pb-1">
          {label}
        </p>
        <div className="space-y-1">
          {payload.map((entry: any, index: number) => (
            <p key={`item-${index}`} className="text-xs font-mono font-bold" style={{ color: entry.color }}>
              {entry.name}: {entry.value.toFixed(0)}/100
            </p>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

export default function AgentRadarChart({ data, primaryAgentName, secondaryAgentName }: Props) {
  if (!data || data.length === 0) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center text-text-muted tactical-card p-6 min-h-[300px]">
        <span className="font-mono text-xs uppercase tracking-widest">Sem perfil mapeado</span>
        <span className="font-body text-sm mt-2 opacity-70">Jogue com este agente para calibrar o perfil.</span>
      </div>
    );
  }

  return (
    <div className="tactical-card p-4 md:p-6 w-full h-[400px] flex flex-col">
      <div className="mb-2">
        <h3 className="font-display text-xl uppercase tracking-widest text-text-main">Perfil de Agente</h3>
        <p className="font-mono text-[10px] text-text-muted uppercase tracking-[0.1em]">Atributos (Escala 0-100)</p>
      </div>

      <div className="flex-grow w-full">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="60%" data={data}>
            <PolarGrid stroke="#2A323C" />
            <PolarAngleAxis 
              dataKey="attribute" 
              tick={{ fill: '#8B97A3', fontSize: 10, fontFamily: 'JetBrains Mono',  }} 
            />
            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: '10px', fontFamily: 'JetBrains Mono',  }} />
            
            <Radar
              name={primaryAgentName}
              dataKey="value"
              stroke="#FF4655"
              fill="#FF4655"
              fillOpacity={0.4}
              strokeWidth={3}
              isAnimationActive={true}
              animationDuration={1200}
              animationEasing="ease-out"
            />

            {secondaryAgentName && (
              <Radar
                name={secondaryAgentName}
                dataKey="secondaryValue"
                stroke="#00E5FF"
                fill="#00E5FF"
                fillOpacity={0.3}
                strokeWidth={2}
                isAnimationActive={true}
                animationDuration={1200}
                animationEasing="ease-out"
              />
            )}
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
