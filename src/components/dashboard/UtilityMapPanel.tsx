import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
// Assuming we have a TacticalMap3D or 2D available. We will mock the container
// and overlay the SVG markers. In the real app, this would wrap the existing map component.

interface Position {
  x: number;
  y: number; // For a 2D projection, or relative coordinates 0-100%
}

interface LineupMarker {
  id: string;
  from: Position;
  to: Position;
  type: string;
}

interface Props {
  mapName: string;
  markers: LineupMarker[];
  onMarkerClick: (id: string) => void;
  // Allows injecting the existing Map component
  mapComponent?: React.ReactNode; 
}

export default function UtilityMapPanel({ mapName, markers, onMarkerClick, mapComponent }: Props) {
  const [hoveredMarker, setHoveredMarker] = useState<string | null>(null);

  return (
    <div className="w-full h-full min-h-[500px] relative tactical-card bg-hud-base overflow-hidden">
      
      {/* 
        The underlying Tactical Map Component goes here. 
        For now, we place a placeholder structural grid.
      */}
      <div className="absolute inset-0 z-0 opacity-20">
        {mapComponent ? mapComponent : <div className="w-full h-full hud-grid-bg bg-[length:40px_40px]" />}
      </div>
      
      {/* Map Label */}
      <div className="absolute top-6 left-6 z-20">
        <h2 className="font-display text-4xl uppercase tracking-widest text-text-main drop-shadow-lg mix-blend-difference">
          {mapName}
        </h2>
        <p className="font-mono text-xs text-text-muted uppercase tracking-[0.2em]">
          Plano Tático / Utilitários
        </p>
      </div>

      {/* Overlays SVG Layer */}
      <svg className="absolute inset-0 w-full h-full z-10 pointer-events-none">
        <AnimatePresence>
          {markers.map(marker => {
            const isHovered = hoveredMarker === marker.id;
            
            return (
              <g key={marker.id}>
                {/* Connection Line (Drawn on hover) */}
                {isHovered && (
                  <motion.line
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 0.6 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    x1={`${marker.from.x}%`} 
                    y1={`${marker.from.y}%`} 
                    x2={`${marker.to.x}%`} 
                    y2={`${marker.to.y}%`}
                    stroke="#FF4655"
                    strokeWidth="2"
                    strokeDasharray="4 4"
                  />
                )}

                {/* Target Point (Crosshair) */}
                {isHovered && (
                  <motion.g
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ delay: 0.4 }}
                    style={{ transformOrigin: `${marker.to.x}% ${marker.to.y}%` }}
                  >
                    <circle cx={`${marker.to.x}%`} cy={`${marker.to.y}%`} r="6" fill="none" stroke="#FF4655" strokeWidth="2" />
                    <circle cx={`${marker.to.x}%`} cy={`${marker.to.y}%`} r="2" fill="#FF4655" />
                  </motion.g>
                )}
              </g>
            );
          })}
        </AnimatePresence>
      </svg>

      {/* Interactive Markers (HTML elements for better tooltips/hover events) */}
      <div className="absolute inset-0 z-20 pointer-events-none">
        {markers.map(marker => {
          const isHovered = hoveredMarker === marker.id;
          
          return (
            <div
              key={`html-${marker.id}`}
              className="absolute pointer-events-auto"
              style={{ left: `${marker.from.x}%`, top: `${marker.from.y}%`, transform: 'translate(-50%, -50%)' }}
              onMouseEnter={() => setHoveredMarker(marker.id)}
              onMouseLeave={() => setHoveredMarker(null)}
              onClick={() => onMarkerClick(marker.id)}
            >
              <div className="relative w-6 h-6 flex items-center justify-center cursor-pointer group">
                {/* Ripple Effect */}
                {isHovered && (
                  <motion.div
                    className="absolute inset-0 rounded-full border border-accent-primary"
                    initial={{ scale: 0.8, opacity: 1 }}
                    animate={{ scale: 2.5, opacity: 0 }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "easeOut" }}
                  />
                )}
                
                {/* Core Point */}
                <div className={`w-3 h-3 transform rotate-45 transition-colors duration-300 ${isHovered ? 'bg-accent-primary shadow-[0_0_10px_rgba(255,70,85,0.8)]' : 'bg-text-main hover:bg-accent-primary'}`} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
