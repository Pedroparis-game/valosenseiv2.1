import React from "react";
import { MapDashboardData } from "../../types";
import AgentImage from "./AgentImage";

interface MapCardProps {
  mapData: MapDashboardData;
  onClick: (mapId: string) => void;
}

export const MapCard: React.FC<MapCardProps> = ({ mapData, onClick }) => {
  const { mapId, mapName, images, stats, topAgents } = mapData;
  const isPositiveWinRate = stats.winRate >= 50;

  return (
    <div
      onClick={() => onClick(mapId)}
      className="relative overflow-hidden rounded-xl cursor-pointer group border border-zinc-800 bg-zinc-950 transition-all duration-300 hover:border-accent-primary hover:shadow-[0_0_15px_rgba(255,70,85,0.3)] flex flex-col min-h-[260px]"
    >
      {/* Splash Art Background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img
          src={images.splash}
          alt={`${mapName} splash`}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          referrerPolicy="no-referrer"
        />
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-zinc-950 via-zinc-950/80 to-transparent" />

      {/* Content */}
      <div className="relative z-20 p-5 flex flex-col h-full justify-between flex-grow">
        
        {/* Top: Map Name */}
        <div>
          <h3 className="text-3xl font-heading uppercase text-white font-bold tracking-wider drop-shadow-md">
            {mapName}
          </h3>
        </div>

        {/* Middle: Stats */}
        <div className="mt-auto mb-4">
          <div className="flex items-baseline gap-2">
            <span
              className={`text-4xl font-heading font-bold tracking-wide ${
                isPositiveWinRate ? "text-emerald-400" : "text-accent-primary"
              }`}
            >
              {stats.winRate}%
            </span>
            <span className="text-zinc-400 font-sans text-xs font-bold uppercase tracking-widest">
              Win Rate
            </span>
          </div>

          <div className="flex gap-5 mt-1 text-zinc-300 font-sans text-sm font-medium">
            <div className="flex items-center gap-1.5">
              <span className="text-zinc-500 text-[10px] uppercase tracking-wider font-bold">
                ACS
              </span>
              <span>{stats.acs}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-zinc-500 text-[10px] uppercase tracking-wider font-bold">
                K/D
              </span>
              <span>{stats.kdRatio}</span>
            </div>
          </div>
        </div>

        {/* Bottom: Top Agents */}
        <div>
          <div className="text-zinc-500 text-[10px] uppercase tracking-widest font-bold mb-2">
            Top Agentes
          </div>
          <div className="flex -space-x-3">
            {topAgents.map((agent, index) => (
              <div
                key={`${agent.name}-${index}`}
                className="relative w-9 h-9 rounded-full border-2 border-zinc-950 bg-zinc-800 overflow-hidden z-10 hover:z-20 transition-all duration-200 hover:scale-110"
                title={agent.name}
              >
                <AgentImage agentName={agent.name} className="w-full h-full object-cover bg-hud-surface/50" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
