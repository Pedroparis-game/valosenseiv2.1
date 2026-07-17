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
    <div className="flex flex-col gap-4">
      {metrics.map(([key, metric], idx) => (
        <motion.div
          key={key}
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: idx * 0.05 }}
        >
          <div className="valo-card flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left !p-5 group relative gap-5">
            <div className="p-4 bg-brand-red/10 group-hover:bg-brand-red/20 border border-brand-red/20 transition-colors shrink-0">
              {getIcon(key)}
            </div>
            
            <div className="flex-grow w-full">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
                <div className="text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-brand-gray">
                  {metric.label}
                </div>
                <div className="text-3xl font-heading tracking-widest text-brand-light drop-shadow-md">
                  {metric.value}<span className="text-sm opacity-40 ml-1">%</span>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="w-full bg-brand-darker h-2 overflow-hidden border border-brand-gray/20 mb-3">
                <motion.div 
                  initial={{ width: 0 }}
                  whileInView={{ width: `${metric.value}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.2 + (idx * 0.1) }}
                  className="h-full bg-brand-red shadow-[0_0_10px_rgba(255,70,85,0.5)]"
                />
              </div>

              <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-2">
                <p className="text-xs font-sans text-brand-light/70 leading-relaxed font-medium flex-grow">
                  "{metric.description}"
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
