import { motion } from "motion/react";
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer,
  Tooltip
} from "recharts";
import { AnalysisResult } from "../../types";

interface Props {
  analysis: AnalysisResult;
}

export default function PerformanceRadar({ analysis }: Props) {
  const data = [
    { subject: 'MIRA', value: analysis?.tacticalBreakdown?.mira?.value || 0, fullMark: 100, desc: "Precisão e consistência de tiros na cabeça." },
    { subject: 'NOÇÃO', value: analysis?.tacticalBreakdown?.gameSense?.value || 0, fullMark: 100, desc: "Leitura de jogo, rotações e tomadas de decisão." },
    { subject: 'ECO', value: analysis?.tacticalBreakdown?.economia?.value || 0, fullMark: 100, desc: "Gestão de créditos e compras inteligentes." },
    { subject: 'POSIÇÃO', value: analysis?.tacticalBreakdown?.posicionamento?.value || 0, fullMark: 100, desc: "Escolha de ângulos e segurança nos duelos." },
    { subject: 'HABILID.', value: analysis?.tacticalBreakdown?.utilitarias?.value || 0, fullMark: 100, desc: "Eficácia no uso de habilidades e ultimates." },
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-hud-surface/95 border border-accent-primary/50 p-4 shadow-[0_0_15px_rgba(255,70,85,0.2)] backdrop-blur-md">
          <p className="font-heading text-xl uppercase tracking-widest text-text-main mb-1">{data.subject}</p>
          <p className="text-3xl font-heading text-accent-primary mb-2">{data.value}<span className="text-sm text-text-muted">/100</span></p>
          <p className="text-xs font-sans text-text-main/70 max-w-[200px] leading-relaxed">{data.desc}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className="pt-16 pb-10 flex flex-col items-center justify-center h-full w-full min-h-[450px]"
    >
      <div className="w-full h-[380px] relative drop-shadow-[0_0_25px_rgba(255,70,85,0.15)]">
        <ResponsiveContainer width="100%" height="100%" minWidth={100} minHeight={100}>
          <RadarChart cx="50%" cy="50%" outerRadius="55%" data={data}>
            <PolarGrid stroke="#00E5FF40" strokeWidth={1} />
            <PolarAngleAxis 
              dataKey="subject" 
              tick={{ fill: '#1B1E22', fontSize: 10, fontFamily: 'Inter, sans-serif', fontWeight: 700, letterSpacing: '0.1em' }} 
            />
            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Radar
              name="Player"
              dataKey="value"
              stroke="#00E5FF"
              strokeWidth={3}
              fill="#00E5FF"
              fillOpacity={0.3}
              animationBegin={500}
              animationDuration={2000}
              isAnimationActive={true}
              dot={{ r: 4, fill: "#00E5FF", strokeWidth: 0 }}
              activeDot={{ r: 6, fill: "#1B1E22", stroke: "#00E5FF", strokeWidth: 2 }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-4 px-6 text-center">
         <p className="text-[10px] font-sans font-bold uppercase tracking-widest text-text-muted/60">Passe o mouse sobre os vértices para ver detalhes</p>
      </div>
    </motion.div>
  );
}
