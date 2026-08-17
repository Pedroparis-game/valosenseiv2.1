import React from "react";
import { X } from "lucide-react";
import { MapDashboardData } from "../../types";

interface MapDetailModalProps {
  mapData: MapDashboardData;
  onClose: () => void;
}

// Mock array of X/Y coordinates for glowing radar markers
const MOCK_HEATMAP_POINTS = [
  { id: 1, x: 42, y: 35, color: "bg-brand-red", shadow: "shadow-[0_0_15px_#ff4655]" },
  { id: 2, x: 75, y: 68, color: "bg-emerald-400", shadow: "shadow-[0_0_15px_#34d399]" },
  { id: 3, x: 28, y: 78, color: "bg-brand-red", shadow: "shadow-[0_0_15px_#ff4655]" },
];

export const MapDetailModal: React.FC<MapDetailModalProps> = ({ mapData, onClose }) => {
  // Prevent clicks inside the modal from bubbling up and closing it
  const handleContentClick = (e: React.MouseEvent) => e.stopPropagation();

  return (
    <div 
      className="fixed inset-0 bg-zinc-950/90 backdrop-blur-sm z-50 flex items-center justify-center p-4 sm:p-6"
      onClick={onClose}
    >
      {/* Modal Container */}
      <div 
        className="relative w-full max-w-6xl max-h-[90vh] bg-zinc-900 border border-zinc-800 rounded-2xl flex flex-col shadow-2xl overflow-hidden"
        onClick={handleContentClick}
      >
        {/* Header / Controls */}
        <div className="flex justify-between items-center p-6 border-b border-zinc-800 bg-zinc-950/50">
          <h2 className="text-3xl sm:text-4xl font-heading uppercase text-white tracking-widest flex items-baseline gap-3">
            {mapData.mapName} 
            <span className="text-zinc-600 text-lg sm:text-xl hidden sm:inline-block">/ Radar Tático</span>
          </h2>
          <button 
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-full transition-colors outline-none"
            aria-label="Fechar Modal"
          >
            <X size={24} />
          </button>
        </div>

        {/* Layout Split */}
        <div className="grid grid-cols-1 lg:grid-cols-2 flex-grow overflow-y-auto">
          
          {/* Left Column: The Radar */}
          <div className="p-6 sm:p-10 flex flex-col items-center justify-center bg-zinc-950/30 relative">
            <div className="relative w-full max-w-md aspect-square bg-zinc-950/50 rounded-xl border border-zinc-800/50 shadow-inner overflow-hidden">
              
              {/* Radar Image */}
              <img 
                src={mapData.images.radar} 
                alt={`Minimap do mapa ${mapData.mapName}`} 
                className="absolute inset-0 w-full h-full object-contain p-4 opacity-90"
                referrerPolicy="no-referrer"
              />
              
              {/* Radar Overlay System: Heatmap Points */}
              <div className="absolute inset-0 pointer-events-none">
                {MOCK_HEATMAP_POINTS.map((point) => (
                  <div 
                    key={point.id}
                    className={`absolute w-3 h-3 sm:w-4 sm:h-4 rounded-full ${point.color} ${point.shadow} animate-pulse transform -translate-x-1/2 -translate-y-1/2 border border-white/20`}
                    style={{ left: `${point.x}%`, top: `${point.y}%` }}
                  />
                ))}
              </div>

            </div>
            <div className="mt-6 text-zinc-500 text-[10px] uppercase tracking-[0.2em] font-bold">
              Telemetria Ativa
            </div>
          </div>

          {/* Right Column: AI Insights Area */}
          <div className="p-6 sm:p-10 border-t lg:border-t-0 lg:border-l border-zinc-800 bg-zinc-900/50 flex flex-col">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-1.5 h-6 bg-brand-red rounded-sm" />
              <h3 className="text-2xl font-heading uppercase tracking-widest text-white">
                ValoSensei AI Insights
              </h3>
            </div>
            
            {/* Placeholder */}
            <div className="flex-grow flex items-center justify-center border-2 border-dashed border-zinc-800 rounded-xl bg-zinc-950/30 p-8 text-center">
              <p className="text-zinc-500 font-sans text-sm font-medium">
                Área reservada para análises táticas detalhadas, setups recomendados e insights dinâmicos da inteligência artificial.
              </p>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};
