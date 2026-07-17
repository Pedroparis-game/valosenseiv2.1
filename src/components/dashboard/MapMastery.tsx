import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { MapPerformance } from "../../types";
import AgentImage from "./AgentImage";

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
  return <div className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-luminosity filter blur-[1px] transition-all group-hover:scale-110 group-hover:opacity-50" style={{ backgroundImage: `url(${bgUrl})` }} />;
};

export default function MapMastery({ maps }: Props) {
  return (
    <div className="mt-12">
      <h3 className="text-xl font-heading uppercase tracking-widest text-brand-light border-l-4 border-brand-red pl-4 mb-6">
        Melhores Agentes por Mapa (Meta VLR.gg)
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {maps.map((m, idx) => (
          <motion.div
            key={m.mapName}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            whileHover={{ y: -4 }}
            transition={{ delay: idx * 0.1, type: "spring", stiffness: 150 }}
            className="group flex flex-col h-full bg-[#0d141e] border-t-2 border-t-brand-red rounded-sm overflow-hidden"
          >
            <div className="h-32 flex items-center justify-center relative border-b border-brand-gray/10 shrink-0">
               <MapBackground mapName={m.mapName} />
               <div className="absolute inset-0 bg-gradient-to-t from-[#0d141e] to-transparent" />
               <motion.div
                  animate={{ rotate: [12, 15, 12], scale: [1.8, 2, 1.8] }}
                 transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                 className="text-brand-red/5 text-6xl font-heading uppercase tracking-widest absolute select-none"
               >
                 {m.mapName}
               </motion.div>
               <div className="relative text-white font-heading text-2xl uppercase tracking-[0.2em] group-hover:scale-110 group-hover:text-brand-red transition-all duration-300 drop-shadow-md">
                 {m.mapName}
               </div>
            </div>
            
            <div className="p-6 flex-grow flex flex-col border-b-2 border-b-brand-red/50">
              {m.winRate > 0 && (
              <div className="flex justify-between items-center mb-6 border-b border-brand-gray/10 pb-4 shrink-0">
                <span className="text-[10px] font-sans font-bold uppercase text-brand-gray tracking-[0.1em]">Win Rate</span>
                <div className="text-2xl font-heading tracking-widest text-brand-light">
                  {m.winRate}<span className="text-xs opacity-40 ml-1">%</span>
                </div>
              </div>
              )}
              
              <div className="space-y-6 flex-grow flex flex-col">
                {/* User's Best Agent or Recommended Agents */}
                {m.bestAgent && m.bestAgent !== "N/A" ? (
                  <div>
                    <div className="text-[10px] font-sans font-bold uppercase text-brand-gray opacity-80 mb-3 tracking-[0.1em]">Melhor Agente (Seus Dados)</div>
                    <div className="bg-[#1a151b] border border-brand-red/40 p-4 flex items-center gap-4">
                      <AgentImage agentName={m.bestAgent} />
                      <span className="font-heading uppercase text-lg text-brand-red tracking-widest">{m.bestAgent}</span>
                    </div>
                  </div>
                ) : (
                  m.recommendedAgents && m.recommendedAgents.length > 0 && (
                    <div>
                      <div className="text-[10px] font-sans font-bold uppercase text-brand-gray opacity-80 mb-3 tracking-[0.1em]">Meta Picks VLR.gg</div>
                      <div className="flex gap-3">
                        {m.recommendedAgents.map(ag => (
                          <div key={ag} className="flex-1 bg-[#1a151b] border border-brand-red/40 p-3 flex items-center justify-center gap-3">
                            <AgentImage agentName={ag} />
                            <span className="font-heading uppercase text-sm text-brand-red tracking-wider leading-none truncate">{ag}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                )}
                
                <div className="p-4 bg-[#11161d] border border-brand-gray/10 border-l-2 border-l-brand-red mt-auto">
                  {m.tendency && m.tendency !== "N/A" && (
                    <>
                      <div className="text-[10px] font-sans font-bold uppercase text-brand-gray opacity-80 mb-2 tracking-[0.1em]">Tendência Tática</div>
                      <p className="text-xs font-sans text-brand-light/90 font-semibold mb-3">{m.tendency}</p>
                    </>
                  )}
                  
                  {m.metaContext && (
                    <>
                      <div className={`text-[10px] font-sans font-bold uppercase text-brand-gray opacity-80 mb-2 tracking-[0.1em] ${(m.tendency && m.tendency !== "N/A") ? 'pt-3 border-t border-brand-gray/10 mt-3' : ''}`}>Contexto Meta</div>
                      <p className="text-xs font-sans text-brand-light/70 leading-relaxed font-medium">{m.metaContext}</p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
