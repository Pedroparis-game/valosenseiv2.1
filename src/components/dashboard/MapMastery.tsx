import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { MapPerformance } from "../../types";
import AgentImage from "./AgentImage";
import { Crosshair, Target, TrendingUp, ChevronRight, BarChart4 } from "lucide-react";

interface Props {
  maps: MapPerformance[];
}

let mapCache: any[] | null = null;
let mapFetchPromise: Promise<any> | null = null;

const STATIC_MAP_SPLASHES: Record<string, string> = {
  ascent: "https://media.valorant-api.com/maps/7eae253f-413f-8e33-6107-2c21c0134018/splash.png",
  bind: "https://media.valorant-api.com/maps/2c963b58-413c-f1b0-f78d-9685a02e43e0/splash.png",
  haven: "https://media.valorant-api.com/maps/2bee0dc9-4aa5-ae9b-77d0-bd8163b325a5/splash.png",
  split: "https://media.valorant-api.com/maps/d96cb365-4577-41d3-9345-565741085491/splash.png",
  fracture: "https://media.valorant-api.com/maps/b5294485-4d60-78a4-e554-7c3ac3ce9485/splash.png",
  breeze: "https://media.valorant-api.com/maps/2fb9b465-41e5-3d09-7a0c-0d17985159c0/splash.png",
  icebox: "https://media.valorant-api.com/maps/e2ad38c4-43f4-a87c-5913-af92a7243a72/splash.png",
  lotus: "https://media.valorant-api.com/maps/2fe4ed3a-450a-9400-69ab-18851b0e8031/splash.png",
  sunset: "https://media.valorant-api.com/maps/92cede8f-4ac3-bc37-63e2-14ac9e2a71f2/splash.png",
  pearl: "https://media.valorant-api.com/maps/fd2673d2-4cc7-4458-34cf-a39197206d24/splash.png",
  abyss: "https://media.valorant-api.com/maps/22697a5c-4ad9-734f-d0d7-5e97e1c504cd/splash.png"
};

const MapBackground = ({ mapName }: { mapName: string }) => {
  const [bgUrl, setBgUrl] = useState<string>(() => {
    const key = mapName.toLowerCase().trim();
    return STATIC_MAP_SPLASHES[key] || "";
  });

  useEffect(() => {
    // Se já resolvemos com a imagem estática mapeada, não precisamos buscar dinamicamente
    if (bgUrl) return;

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
          if (map) {
            // Preferir o splash que é uma imagem de background ampla de alta definição
            if (map.splash) {
              setBgUrl(map.splash);
            } else if (map.listViewIcon) {
              setBgUrl(map.listViewIcon);
            }
          }
        }
      } catch (e) {
      }
    };
    getMap();
  }, [mapName, bgUrl]);

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
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-hud-border/20 pb-4 mb-8 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
             <BarChart4 size={16} className="text-accent-primary" />
             <div className="text-[10px] font-sans font-bold uppercase tracking-[0.3em] text-accent-primary">Estatísticas de Setor</div>
          </div>
          <h3 className="text-4xl font-heading uppercase tracking-widest text-text-main">
            Domínio de Mapas
          </h3>
        </div>
        <div className="text-text-muted/50 text-[10px] uppercase font-bold tracking-[0.3em]">
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
            className="group relative bg-[#0f1923] border border-hud-border/10 hover:border-accent-primary transition-all duration-500 flex flex-col h-full overflow-hidden"
            style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%)' }}
          >
            {/* Top Red Bar Accent */}
            <div className="absolute top-0 left-0 w-full h-1 bg-accent-primary transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out z-20" />

            {/* MAP HEADER */}
            <div className="relative h-48 overflow-hidden shrink-0 bg-[#1a212a] border-b-2 border-transparent group-hover:border-accent-primary/50 transition-colors duration-300">
               <MapBackground mapName={m.mapName} />
               <div className="absolute inset-0 bg-gradient-to-t from-[#0f1923] via-transparent to-transparent" />
               <div className="absolute inset-0 bg-gradient-to-r from-[#0f1923]/80 via-transparent to-transparent" />
               
               <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end z-10">
                 <div>
                    <h4 className="text-white font-heading text-5xl uppercase tracking-widest drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)] relative">
                      {m.mapName}
                      <span className="absolute -left-4 -top-2 text-accent-primary text-6xl opacity-20 pointer-events-none select-none">
                        {m.mapName.charAt(0)}
                      </span>
                    </h4>
                 </div>
                 {m.winRate > 0 && (
                   <div className="text-right bg-hud-surface/80 backdrop-blur-sm px-4 py-2 border-l-2 border-accent-primary shadow-lg">
                     <div className="text-text-muted font-sans font-bold text-[9px] tracking-[0.2em] uppercase mb-0.5">Win Rate</div>
                     <div className="text-text-main font-heading text-3xl tracking-widest leading-none">
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
                     <div className="flex items-center justify-between mb-3 border-b border-hud-border/10 pb-2">
                        <div className="flex items-center gap-2">
                           <Crosshair size={14} className="text-accent-primary" />
                           <span className="text-[10px] font-sans font-bold uppercase text-text-muted tracking-[0.2em]">Melhor Desempenho</span>
                        </div>
                     </div>
                     <div className="flex items-center gap-5 relative overflow-hidden group/agent">
                        <div className="w-16 h-16 shrink-0 bg-hud-base border border-hud-border/20 p-1 flex items-center justify-center relative overflow-hidden">
                           <div className="absolute inset-0 bg-accent-primary/10 group-hover/agent:bg-accent-primary/30 transition-colors" />
                           <AgentImage agentName={m.bestAgent} />
                        </div>
                        <div>
                           <div className="text-[9px] font-bold uppercase tracking-[0.3em] text-accent-primary mb-1">Agente</div>
                           <span className="font-heading uppercase text-3xl text-text-main tracking-widest">{m.bestAgent}</span>
                        </div>
                     </div>
                   </div>
                 ) : (
                   m.recommendedAgents && m.recommendedAgents.length > 0 && (
                     <div>
                       <div className="flex items-center justify-between mb-3 border-b border-hud-border/10 pb-2">
                          <div className="flex items-center gap-2">
                             <Target size={14} className="text-accent-primary" />
                             <span className="text-[10px] font-sans font-bold uppercase text-text-muted tracking-[0.2em]">Recomendados</span>
                          </div>
                       </div>
                       <div className="flex gap-3 mt-4">
                         {m.recommendedAgents.map(ag => (
                           <div key={ag} className="flex-1 bg-hud-base border border-hud-border/10 p-2 flex flex-col items-center justify-center gap-2 hover:border-accent-primary/40 transition-colors">
                             <div className="w-10 h-10">
                               <AgentImage agentName={ag} />
                             </div>
                             <span className="font-heading uppercase text-xs text-text-main tracking-wider truncate">{ag}</span>
                           </div>
                         ))}
                       </div>
                     </div>
                   )
                 )}
               </div>
               
               {/* TACTICS */}
               <div className="mt-auto space-y-4 pt-4 border-t border-hud-border/10">
                 {m.tendency && m.tendency !== "N/A" && (
                   <div className="relative">
                      <div className="flex items-center gap-2 mb-1.5">
                         <TrendingUp size={12} className="text-text-muted" />
                         <span className="text-[9px] font-sans font-bold uppercase text-text-muted tracking-[0.2em]">Tendência</span>
                      </div>
                      <p className="text-sm font-sans text-text-main/90 font-medium">
                        {m.tendency}
                      </p>
                   </div>
                 )}
                 
                 {m.metaContext && (
                   <div className="relative">
                      <div className="flex items-center gap-2 mb-1.5">
                         <ChevronRight size={12} className="text-accent-primary" />
                         <span className="text-[9px] font-sans font-bold uppercase text-accent-primary tracking-[0.2em]">Sinergia do Mapa</span>
                      </div>
                      <p className="text-xs font-sans text-text-main/60 leading-relaxed">
                        {m.metaContext}
                      </p>
                   </div>
                 )}
               </div>
               
            </div>
            
            {/* CARD DECORATIONS */}
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-hud-border/30 group-hover:border-accent-primary transition-colors" />
            <div className="absolute top-0 right-0 w-2 h-2 bg-accent-primary/20 group-hover:bg-accent-primary transition-colors" />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
