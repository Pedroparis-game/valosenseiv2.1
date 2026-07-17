const fs = require('fs');

const content = `import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { MapPerformance } from "../../types";
import AgentImage from "./AgentImage";
import { Map, Crosshair, Target, TrendingUp, ChevronRight } from "lucide-react";

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
        className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-luminosity filter blur-[1px] transition-transform duration-1000 group-hover:scale-110 group-hover:opacity-60 pointer-events-none" 
     />
  );
};

export default function MapMastery({ maps }: Props) {
  return (
    <div className="mt-16">
      <div className="flex items-center gap-4 border-b border-brand-gray/20 pb-4 mb-8">
        <Map className="text-brand-red" size={28} />
        <div>
          <div className="text-[10px] font-sans font-bold uppercase tracking-[0.3em] text-brand-red mb-1">Performance Global</div>
          <h3 className="text-3xl font-heading uppercase tracking-widest text-brand-light">
            Domínio Territorial
          </h3>
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
            className="group relative bg-[#0f1923] border border-brand-gray/10 hover:border-brand-red/50 transition-colors duration-300 flex flex-col h-full overflow-hidden"
            style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%)' }}
          >
            {/* Top Red Bar Accent */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-red to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20" />

            {/* MAP HEADER */}
            <div className="relative h-44 overflow-hidden shrink-0 border-b border-brand-gray/20">
               <MapBackground mapName={m.mapName} />
               <div className="absolute inset-0 bg-gradient-to-b from-[#0f1923]/10 via-[#0f1923]/50 to-[#0f1923]" />
               
               <div className="absolute bottom-5 left-6 right-6 flex justify-between items-end z-10">
                 <div>
                    <div className="text-brand-red font-sans font-bold text-[10px] tracking-[0.4em] uppercase mb-1 drop-shadow-md">Setor</div>
                    <h4 className="text-white font-heading text-4xl uppercase tracking-[0.15em] drop-shadow-lg">
                      {m.mapName}
                    </h4>
                 </div>
                 {m.winRate > 0 && (
                   <div className="text-right">
                     <div className="text-brand-gray font-sans font-bold text-[10px] tracking-[0.2em] uppercase mb-1">Win Rate</div>
                     <div className="text-brand-light font-heading text-2xl tracking-wider">
                       {m.winRate}<span className="text-sm opacity-50 ml-1">%</span>
                     </div>
                   </div>
                 )}
               </div>
            </div>
            
            {/* CARD BODY */}
            <div className="p-6 flex-grow flex flex-col relative bg-[#11161d] group-hover:bg-[#141b24] transition-colors duration-300">
               
               {/* AGENT FOCUS */}
               <div className="mb-6">
                 {m.bestAgent && m.bestAgent !== "N/A" ? (
                   <div>
                     <div className="flex items-center gap-2 mb-3">
                        <Crosshair size={14} className="text-brand-red" />
                        <span className="text-[10px] font-sans font-bold uppercase text-brand-gray tracking-[0.2em]">Agente Primário</span>
                     </div>
                     <div className="bg-[#0f1923] border-l-2 border-brand-red p-3 flex items-center gap-4 relative overflow-hidden group/agent shadow-inner">
                        <div className="absolute right-0 top-0 bottom-0 w-32 bg-brand-red/5 blur-[20px] transition-all duration-500 group-hover/agent:bg-brand-red/15 pointer-events-none" />
                        <AgentImage agentName={m.bestAgent} />
                        <span className="font-heading uppercase text-2xl text-brand-light tracking-widest relative z-10 drop-shadow-md">{m.bestAgent}</span>
                     </div>
                   </div>
                 ) : (
                   m.recommendedAgents && m.recommendedAgents.length > 0 && (
                     <div>
                       <div className="flex items-center gap-2 mb-3">
                          <Target size={14} className="text-brand-red" />
                          <span className="text-[10px] font-sans font-bold uppercase text-brand-gray tracking-[0.2em]">Recomendações Táticas</span>
                       </div>
                       <div className="grid grid-cols-2 gap-3">
                         {m.recommendedAgents.map(ag => (
                           <div key={ag} className="bg-[#0f1923] border border-brand-gray/10 p-2.5 flex items-center justify-center gap-3 hover:border-brand-red/40 transition-colors shadow-inner">
                             <AgentImage agentName={ag} />
                             <span className="font-heading uppercase text-sm text-brand-light tracking-wider truncate drop-shadow-sm">{ag}</span>
                           </div>
                         ))}
                       </div>
                     </div>
                   )
                 )}
               </div>
               
               {/* TACTICS */}
               <div className="mt-auto space-y-5">
                 {m.tendency && m.tendency !== "N/A" && (
                   <div className="relative">
                      <div className="flex items-center gap-2 mb-2">
                         <TrendingUp size={12} className="text-brand-gray" />
                         <span className="text-[9px] font-sans font-bold uppercase text-brand-gray tracking-[0.2em]">Tendência Tática</span>
                      </div>
                      <p className="text-sm font-sans text-brand-light/90 font-medium pl-4 border-l border-brand-gray/30">
                        {m.tendency}
                      </p>
                   </div>
                 )}
                 
                 {m.metaContext && (
                   <div className="relative pt-5 border-t border-brand-gray/10">
                      <div className="flex items-center gap-2 mb-2">
                         <ChevronRight size={12} className="text-brand-red" />
                         <span className="text-[9px] font-sans font-bold uppercase text-brand-red tracking-[0.2em]">Leitura do Mapa</span>
                      </div>
                      <p className="text-xs font-sans text-brand-light/60 leading-relaxed pl-4">
                        {m.metaContext}
                      </p>
                   </div>
                 )}
               </div>
               
            </div>
            
          </motion.div>
        ))}
      </div>
    </div>
  );
}
`;

fs.writeFileSync('src/components/dashboard/MapMastery.tsx', content);
