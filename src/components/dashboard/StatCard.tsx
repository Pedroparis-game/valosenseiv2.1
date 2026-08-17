import React from 'react';
import CountUp from '../ui/CountUp';

interface Props {
  label: string;
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  trend?: number; // e.g. +5.2 or -1.4
  icon?: React.ReactNode;
}

export default function StatCard({ label, value, decimals = 0, prefix, suffix, trend, icon }: Props) {
  const isPositiveTrend = trend && trend > 0;
  const isNegativeTrend = trend && trend < 0;

  return (
    <div className="tactical-card p-5 md:p-6 flex flex-col justify-between h-full group">
      <div className="flex justify-between items-start mb-4">
        <div className="text-text-muted group-hover:text-accent-primary transition-colors duration-300">
          {icon}
        </div>
        {trend !== undefined && (
          <div className={`text-[10px] font-mono font-bold px-2 py-0.5 border ${
            isPositiveTrend ? 'text-accent-primary border-accent-primary/30 bg-accent-primary/10' :
            isNegativeTrend ? 'text-text-muted border-hud-border bg-hud-base' :
            'text-text-muted border-hud-border bg-hud-base'
          }`}>
            {isPositiveTrend ? '+' : ''}{trend}%
          </div>
        )}
      </div>

      <div>
        <div className="text-[10px] font-mono font-bold uppercase text-text-muted tracking-[0.15em] mb-1">
          {label}
        </div>
        <div className="text-4xl md:text-5xl font-display tracking-widest text-text-main group-hover:text-white transition-colors">
          <CountUp value={value} decimals={decimals} prefix={prefix} suffix={suffix} />
        </div>
      </div>
    </div>
  );
}
