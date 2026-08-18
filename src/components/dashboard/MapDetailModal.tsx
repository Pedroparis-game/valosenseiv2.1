import React from "react";
import { X } from "lucide-react";
import { MapDashboardData } from "../../types";
import { TacticalMapMarker, MarkerType } from "../ui/animations/TacticalMapMarker";

interface MapDetailModalProps {
  mapData: MapDashboardData;
  onClose: () => void;
}

// Mock array of X/Y coordinates for glowing radar markers
const MOCK_HEATMAP_POINTS: { id: number, x: number, y: number, type: MarkerType, label: string }[] = [
  { id: 1, x: 42, y: 35, type: 'molly', label: 'Default Post-Plant' },
  { id: 2, x: 75, y: 68, type: 'smoke', label: 'One-way Heaven' },
  { id: 3, x: 28, y: 78, type: 'enemy', label: 'Hold Comum' },
  { id: 4, x: 50, y: 50, type: 'flash', label: 'Pop Flash Entrada' }
];

export const MapDetailModal: React.FC<MapDetailModalProps> = ({ mapData, onClose }) => {
  // Prevent clicks inside the modal from bubbling up and closing it
  const handleContentClick = (e: React.MouseEvent) => e.stopPropagation();

  return (
    <div 
      className="fixed inset-0 bg-hud-base/90 backdrop-blur-sm z-50 flex items-center justify-center p-4 sm:p-6"
      onClick={onClose}
    >
      {/* Modal Container */}
      <div 
        className="relative w-full max-w-6xl max-h-[90vh] bg-hud-surface border border-hud-border flex flex-col shadow-2xl overflow-hidden clip-chamfer-sm"
        onClick={handleContentClick}
      >
        {/* Header / Controls */}
        <div className="flex justify-between items-center p-6 border-b border-hud-border bg-hud-base/50">
          <h2 className="text-3xl sm:text-4xl font-display uppercase text-text-main tracking-widest flex items-baseline gap-3">
            {mapData.mapName} 
            <span className="text-text-muted text-lg sm:text-xl hidden sm:inline-block font-mono">/ Radar Tático</span>
          </h2>
          <button 
            onClick={onClose}
            className="p-2 text-text-muted hover:text-accent-primary hover:bg-hud-base transition-colors outline-none clip-chamfer-sm border border-transparent hover:border-accent-primary/30"
            aria-label="Fechar Modal"
          >
            <X size={24} />
          </button>
        </div>

        {/* Layout Split */}
        <div className="grid grid-cols-1 lg:grid-cols-2 flex-grow overflow-y-auto">
          
          {/* Left Column: The Radar */}
          <div className="p-6 sm:p-10 flex flex-col items-center justify-center bg-hud-base/30 relative">
            <div className="relative w-full max-w-md aspect-square bg-hud-base/50 border border-hud-border/50 shadow-inner overflow-hidden clip-chamfer-sm">
              
              {/* Radar Image */}
              <img 
                src={mapData.images.radar} 
                alt={`Minimap do mapa ${mapData.mapName}`} 
                className="absolute inset-0 w-full h-full object-contain p-4 opacity-90"
                referrerPolicy="no-referrer"
              />
              
              {/* Radar Overlay System: Heatmap Points */}
              <div className="absolute inset-0 pointer-events-none">
                {MOCK_HEATMAP_POINTS.map((point, i) => (
                  <TacticalMapMarker 
                    key={point.id}
                    x={point.x}
                    y={point.y}
                    type={point.type}
                    label={point.label}
                    delay={i * 0.15}
                  />
                ))}
              </div>
            </div>
            <div className="mt-6 text-text-muted text-[10px] uppercase tracking-[0.2em] font-bold font-mono">
              Telemetria Ativa
            </div>
          </div>

          {/* Right Column: AI Insights Area */}
          <div className="p-6 sm:p-10 border-t lg:border-t-0 lg:border-l border-hud-border bg-hud-surface/50 flex flex-col">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-1.5 h-6 bg-accent-primary" />
              <h3 className="text-2xl font-display uppercase tracking-widest text-text-main">
                ValoSensei AI Insights
              </h3>
            </div>
            
            {/* Empty State Coach */}
            <div className="flex-grow flex flex-col items-center justify-center border border-dashed border-hud-border clip-chamfer-sm bg-hud-base p-8 text-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-accent-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="w-16 h-16 bg-hud-surface rounded-full flex items-center justify-center mb-6 shadow-lg border border-hud-border text-accent-primary group-hover:scale-110 transition-transform duration-500">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
              </div>
              <h4 className="font-display text-xl uppercase tracking-widest text-text-main mb-2">Telemetria Insuficiente</h4>
              <p className="font-body text-sm text-text-muted mb-8 max-w-sm">
                Agente, precisamos de mais dados táticos nesta região. Jogue mais partidas em {mapData.mapName} para que eu possa decodificar padrões inimigos e recomendar setups de utilitários precisos.
              </p>
              <button className="tactical-btn !py-2 !text-sm">
                Sincronizar Partidas
              </button>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};
