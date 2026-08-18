import React from "react";
import { MapDashboardData } from "../../types";
import { MapCard } from "./MapCard";

interface MapPerformanceGridProps {
  maps: MapDashboardData[];
  onClick?: (mapId: string) => void;
}

export const MapPerformanceGrid: React.FC<MapPerformanceGridProps> = ({ maps, onClick }) => {
  const handleMapClick = (mapId: string) => {
    if (onClick) {
      onClick(mapId);
    } else {
      console.log(`[Valorant Analytics] Expanding tactical view for map ID: ${mapId}`);
    }
  };

  if (!maps || maps.length === 0) {
    return (
      <div className="w-full p-8 text-center text-zinc-500 font-sans border border-zinc-800/50 rounded-xl bg-zinc-900/20">
        Nenhum dado de mapa disponível na rotação atual.
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex items-center gap-3 mb-6">
        <h2 className="text-2xl font-heading uppercase text-white tracking-widest">
          Desempenho por Mapa
        </h2>
        <div className="h-px flex-grow bg-gradient-to-r from-accent-primary/30 to-transparent" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {maps.map((mapData) => (
          <MapCard
            key={mapData.mapId}
            mapData={mapData}
            onClick={handleMapClick}
          />
        ))}
      </div>
    </div>
  );
};
