import React, { useMemo } from "react";
import { motion } from "motion/react";
import { TacticalMetric } from "../../types";
import { Crosshair, Brain, Wallet, MapPin, Zap } from "lucide-react";

interface Props {
  data: {
    mira: TacticalMetric;
    gameSense: TacticalMetric;
    economia: TacticalMetric;
    posicionamento: TacticalMetric;
    utilitarias: TacticalMetric;
  };
}

export default function TacticalBreakdown({ data }: Props) {
  const metrics = useMemo(() => Object.entries(data), [data]);

  const getIcon = (key: string) => {
    switch (key) {
      case 'mira': return <Crosshair size={24} className="text-brand-red" />;
      case 'gameSense': return <Brain size={24} className="text-brand-red" />;
      case 'economia': return <Wallet size={24} className="text-brand-red" />;
      case 'posicionamento': return <MapPin size={24} className="text-brand-red" />;
      case 'utilitarias': return <Zap size={24} className="text-brand-red" />;
      default: return null;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {metrics.map(([key, metric], idx) => (
        <motion.div
          key={key}
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: idx * 0.05 }}
        >
          <div className="flex flex-col items-start p-6 group relative gap-5 bg-brand-dark/40 border border-brand-gray/10 hover:border-brand-red/30 transition-all duration-300 hover:bg-brand-dark/80 rounded-sm h-full">
            <div className="flex items-center gap-4 w-full">
              <div className="p-4 bg-brand-darker group-hover:bg-brand-red/10 border border-brand-gray/20 group-hover:border-brand-red/40 transition-colors shrink-0 rounded-full shadow-[0_0_15px_rgba(0,0,0,0.5)]">
                {getIcon(key)}
              </div>
              <div className="flex-grow flex justify-between items-baseline">
                <h4 className="font-heading uppercase tracking-widest text-lg text-brand-light">{metric.label}</h4>
                <div className="flex items-baseline gap-1">
                  <span className="font-heading text-2xl text-white">{metric.value}</span>
                  <span className="text-xs font-sans text-brand-gray">%</span>
                </div>
              </div>
            </div>
            
            <div className="flex-grow flex flex-col justify-end w-full mt-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
                <div className="text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-brand-gray">
                  {metric.label}
                </div>
                <div className="text-3xl font-heading tracking-widest text-brand-light drop-shadow-md">
                  {metric.value}<span className="text-sm opacity-40 ml-1">%</span>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="w-full bg-[#0a0f16] h-1.5 overflow-hidden border border-brand-gray/10 mb-3 rounded-sm relative shadow-inner">
                <motion.div 
                  initial={{ width: 0 }}
                  whileInView={{ width: `${metric.value}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.2 + (idx * 0.1) }}
                  className="h-full bg-brand-red shadow-[0_0_15px_rgba(255,70,85,0.8)] relative"
                  style={{ boxShadow: "0 0 20px rgba(255, 70, 85, 0.4), inset 0 0 5px rgba(255,255,255,0.5)" }}
                />
              </div>

              <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-2">
                <p className="text-xs font-sans text-brand-light/70 leading-relaxed font-medium flex-grow">
                  {metric.description}
                </p>
                <div className="text-[9px] font-sans font-bold uppercase px-2 py-1 bg-brand-gray/10 border border-brand-gray/20 whitespace-nowrap shrink-0 text-brand-gray">
                  Rank Avg: <span className="opacity-60">{metric.average}%</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
