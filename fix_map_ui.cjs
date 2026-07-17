const fs = require('fs');

const content = `import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { MapPerformance } from "../../types";
import AgentImage from "./AgentImage";
import { Map, Crosshair, Target, TrendingUp, ChevronRight, BarChart4 } from "lucide-react";

interface Props {
  maps: MapPerformance[];
}

let mapCache: any[] | null = null;
let mapFetchPromise: Promise<any> | null = null;

const MapBackground = ({ mapName }: { mapName: string }) => {
  const [bgUrl, setBgUrl] = useState<string | null>(null);

  useEffect(() => {
    const getMap = async () => {
      try {
        if (!mapCache) {
          if (!mapFetchPromise) {
            mapFetchPromise = fetch("https://valorant-api.com/v1/maps").then(res => res.json());
          }
          const data = await mapFetchPromise;
          if (data && data.data) {
            mapCache = data.data;
          }
        }
        
        if (mapCache) {
          const map = mapCache.find((m: any) => m.displayName.toLowerCase() === mapName.toLowerCase());
          if (map && map.listViewIcon) {
            setBgUrl(map.listViewIcon);
          }
        }
      } catch (e) {
      }
    };
    getMap();
  }, [mapName]);

  if (!bgUrl) return null;

  return (
     <img 
        src={bgUrl} 
        referrerPolicy="no-referrer" 
        alt={mapName} 
        className="absolute inset-0 w-full h-full object-cover opacity-[0.15] mix-blend-luminosity filter transition-all duration-1000 group-hover:scale-110 group-hover:opacity-[0.35] pointer-events-none" 
     />
  );
};

export default function MapMastery({ maps }: Props) {
  return (
    <div className="mt-16">
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-brand-gray/20 pb-4 mb-8 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
             <BarChart4 size={16} className="text-brand-red" />
             <div className="text-[10px] font-sans font-bold uppercase tracking-[0.3em] text-brand-red">Estatísticas de Setor</div>
          </div>
          <h3 className="text-4xl font-heading uppercase tracking-widest text-brand-light">
            Domínio de Mapas
          </h3>
        </div>
        <div className="text-brand-gray/50 text-[10px] uppercase font-bold tracking-[0.3em]">
           // TOP {maps.length} MAPAS REGISTRADOS
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {maps.map((m, idx) => (
          <motion.div
            key={m.mapName}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            className="group relative bg-[#0f1923] border border-brand-gray/10 hover:border-brand-red transition-all duration-500 flex flex-col h-full overflow-hidden"
            style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%)' }}
          >
            {/* Top Red Bar Accent */}
            <div className="absolute top-0 left-0 w-full h-1 bg-brand-red transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out z-20" />

            {/* MAP HEADER */}
            <div className="relative h-48 overflow-hidden shrink-0 bg-[#1a212a] border-b-2 border-transparent group-hover:border-brand-red/50 transition-colors duration-300">
               <MapBackground mapName={m.mapName} />
               <div className="absolute inset-0 bg-gradient-to-t from-[#0f1923] via-transparent to-transparent" />
               <div className="absolute inset-0 bg-gradient-to-r from-[#0f1923]/80 via-transparent to-transparent" />
               
               <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end z-10">
                 <div>
                    <h4 className="text-white font-heading text-5xl uppercase tracking-widest drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)] relative">
                      {m.mapName}
                      <span className="absolute -left-4 -top-2 text-brand-red text-6xl opacity-20 pointer-events-none select-none">
                        {m.mapName.charAt(0)}
                      </span>
                    </h4>
                 </div>
                 {m.winRate > 0 && (
                   <div className="text-right bg-brand-dark/80 backdrop-blur-sm px-4 py-2 border-l-2 border-brand-red shadow-lg">
                     <div className="text-brand-gray font-sans font-bold text-[9px] tracking-[0.2em] uppercase mb-0.5">Win Rate</div>
                     <div className="text-brand-light font-heading text-3xl tracking-widest leading-none">
                       {m.winRate}<span className="text-sm opacity-50 ml-1">%</span>
                     </div>
                   </div>
                 )}
               </div>
            </div>
            
            {/* CARD BODY */}
            <div className="p-6 flex-grow flex flex-col relative bg-[#11161d] group-hover:bg-[#141b24] transition-colors duration-300">
               
               {/* AGENT FOCUS */}
               <div className="mb-6 flex-grow">
                 {m.bestAgent && m.bestAgent !== "N/A" ? (
                   <div>
                     <div className="flex items-center justify-between mb-3 border-b border-brand-gray/10 pb-2">
                        <div className="flex items-center gap-2">
                           <Crosshair size={14} className="text-brand-red" />
                           <span className="text-[10px] font-sans font-bold uppercase text-brand-gray tracking-[0.2em]">Melhor Desempenho</span>
                        </div>
                     </div>
                     <div className="flex items-center gap-5 relative overflow-hidden group/agent">
                        <div className="w-16 h-16 shrink-0 bg-brand-darker border border-brand-gray/20 p-1 flex items-center justify-center relative overflow-hidden">
                           <div className="absolute inset-0 bg-brand-red/10 group-hover/agent:bg-brand-red/30 transition-colors" />
                           <AgentImage agentName={m.bestAgent} />
                        </div>
                        <div>
                           <div className="text-[9px] font-bold uppercase tracking-[0.3em] text-brand-red mb-1">Agente</div>
                           <span className="font-heading uppercase text-3xl text-brand-light tracking-widest">{m.bestAgent}</span>
                        </div>
                     </div>
                   </div>
                 ) : (
                   m.recommendedAgents && m.recommendedAgents.length > 0 && (
                     <div>
                       <div className="flex items-center justify-between mb-3 border-b border-brand-gray/10 pb-2">
                          <div className="flex items-center gap-2">
                             <Target size={14} className="text-brand-red" />
                             <span className="text-[10px] font-sans font-bold uppercase text-brand-gray tracking-[0.2em]">Recomendados</span>
                          </div>
                       </div>
                       <div className="flex gap-3 mt-4">
                         {m.recommendedAgents.map(ag => (
                           <div key={ag} className="flex-1 bg-brand-darker border border-brand-gray/10 p-2 flex flex-col items-center justify-center gap-2 hover:border-brand-red/40 transition-colors">
                             <div className="w-10 h-10">
                               <AgentImage agentName={ag} />
                             </div>
                             <span className="font-heading uppercase text-xs text-brand-light tracking-wider truncate">{ag}</span>
                           </div>
                         ))}
                       </div>
                     </div>
                   )
                 )}
               </div>
               
               {/* TACTICS */}
               <div className="mt-auto space-y-4 pt-4 border-t border-brand-gray/10">
                 {m.tendency && m.tendency !== "N/A" && (
                   <div className="relative">
                      <div className="flex items-center gap-2 mb-1.5">
                         <TrendingUp size={12} className="text-brand-gray" />
                         <span className="text-[9px] font-sans font-bold uppercase text-brand-gray tracking-[0.2em]">Tendência</span>
                      </div>
                      <p className="text-sm font-sans text-brand-light/90 font-medium">
                        {m.tendency}
                      </p>
                   </div>
                 )}
                 
                 {m.metaContext && (
                   <div className="relative">
                      <div className="flex items-center gap-2 mb-1.5">
                         <ChevronRight size={12} className="text-brand-red" />
                         <span className="text-[9px] font-sans font-bold uppercase text-brand-red tracking-[0.2em]">Sinergia do Mapa</span>
                      </div>
                      <p className="text-xs font-sans text-brand-light/60 leading-relaxed">
                        {m.metaContext}
                      </p>
                   </div>
                 )}
               </div>
               
            </div>
            
            {/* CARD DECORATIONS */}
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-brand-gray/30 group-hover:border-brand-red transition-colors" />
            <div className="absolute top-0 right-0 w-2 h-2 bg-brand-red/20 group-hover:bg-brand-red transition-colors" />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
`;

fs.writeFileSync('src/components/dashboard/MapMastery.tsx', content);
