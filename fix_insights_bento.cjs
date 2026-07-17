const fs = require('fs');
let file = 'src/components/dashboard/Insights.tsx';
let content = fs.readFileSync(file, 'utf8');

const oldSection2Regex = /\{\/\* SEÇÃO 2: MÉTRICAS E COMPETÊNCIAS \*\/\}\s*<section className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">[\s\S]*?\{\/\* SEÇÃO 3: MAPAS & TERRITÓRIO \*\/\}/;

const newSection2 = `{/* SEÇÃO 2: MÉTRICAS E COMPETÊNCIAS (BENTO GRID) */}
      <section className="space-y-6 lg:space-y-8">
        
        {/* ROW 1: HEADER & STATS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          <div className="lg:col-span-4 flex flex-col">
            {/* 1. Cabeçalho do Perfil & Classificação */}
            <div className="valo-card !p-6 flex items-center justify-between border-b-4 border-b-brand-red bg-[#11161d] shadow-lg relative overflow-hidden group h-full">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-brand-gray/30 p-1 bg-brand-dark relative group-hover:border-brand-red/50 transition-colors">
                  <div className="absolute inset-0 bg-brand-red/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  {stats.rankImageUrl ? (
                    <img src={stats.rankImageUrl} alt="Rank" className="w-full h-full object-contain" />
                  ) : (
                    <User className="w-full h-full p-2 text-brand-gray" />
                  )}
                </div>
                <div>
                  <div className="text-[10px] font-sans font-bold uppercase tracking-widest text-brand-gray">{stats.rank || "Unranked"}</div>
                  <div className="font-heading text-2xl tracking-wider text-brand-light uppercase">{stats.name} <span className="text-brand-red/80 text-sm">#{stats.tag}</span></div>
                </div>
              </div>
              <div className="text-center pr-2">
                <div className="text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-brand-gray mb-1">Classificação</div>
                <div className={\`text-5xl font-heading \${gradeColor} drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]\`}>{grade}</div>
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-8 flex flex-col">
            {/* 5. Estatísticas Rápidas */}
            <div className="valo-card !p-6 h-full flex flex-col justify-center bg-gradient-to-br from-brand-darker/90 to-[#0a0f16]">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 lg:gap-4">
                {[
                  { label: "HS%", value: analysis.coachVerdict.stats?.headshotRate || "0%", icon: Crosshair },
                  { label: "KDA", value: analysis.coachVerdict.stats?.kda || "0", icon: Activity },
                  { label: "Vitórias", value: analysis.coachVerdict.stats?.winRate || "0%", icon: TrendingUp },
                  { label: "Score", value: analysis.coachVerdict.stats?.impactScore || "0", icon: Zap },
                  { label: "Agente", value: analysis.coachVerdict.stats?.bestAgent || "-", icon: Brain },
                  { label: "Partidas", value: stats.recentMatches.length || 0, icon: Target },
                ].map((stat, i) => {
                  const IconCmp = stat.icon;
                  return (
                    <div key={i} className="bg-brand-dark/40 border border-brand-gray/10 p-4 flex flex-col items-center justify-center text-center hover:bg-brand-gray/5 hover:border-brand-red/30 transition-colors rounded-sm shadow-inner group">
                       <IconCmp size={18} className="text-brand-gray mb-2 opacity-50 group-hover:text-brand-red group-hover:opacity-100 transition-colors" />
                       <div className="text-xl font-heading tracking-wider text-brand-light mb-1">{stat.value}</div>
                       <div className="text-[10px] uppercase font-bold tracking-widest text-brand-gray">{stat.label}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* ROW 2: RADAR, INSIGHT, EVOLUÇÃO */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          
          {/* Coluna Esquerda: Estilo Tático + Insight */}
          <div className="lg:col-span-4 flex flex-col gap-6 lg:gap-8">
            <div className="valo-card !p-6 relative overflow-hidden group hover:border-brand-light/30 transition-colors h-full flex flex-col justify-center">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-light/5 blur-[40px] rounded-full group-hover:bg-brand-light/10 transition-colors pointer-events-none" />
              <div className="flex items-start gap-3 mb-4">
                <Target size={22} className="text-brand-light" />
                <h4 className="font-heading text-xl uppercase tracking-widest text-brand-light">Estilo Tático</h4>
              </div>
              <p className="text-sm font-sans text-brand-light/80 leading-relaxed">
                Foco no duelo e controle. O impacto primário depende da precisão inicial.
              </p>
            </div>
            
            <div className="valo-card !p-6 relative overflow-hidden border-l-4 border-l-brand-red bg-brand-dark/95 h-full flex flex-col justify-center group">
              <div className="absolute top-0 right-0 w-40 h-40 bg-brand-red/5 blur-[50px] rounded-full group-hover:bg-brand-red/10 transition-colors pointer-events-none" />
              <div className="flex items-center gap-3 mb-4">
                <Zap size={20} className="text-brand-red" />
                <h4 className="font-heading text-sm uppercase tracking-[0.2em] text-brand-red">Principal Insight</h4>
              </div>
              <p className="text-sm font-sans text-white/90 leading-relaxed font-medium">
                {prioritizedInsights[0]?.description || "Sem insights no momento. Jogue mais partidas."}
              </p>
            </div>
          </div>

          {/* Coluna Central: Radar (Destaque Maior) */}
          <div className="lg:col-span-4 flex flex-col">
            <div className="valo-card relative overflow-hidden bg-brand-darker group hover:border-brand-red/40 transition-colors duration-500 shadow-[0_0_30px_rgba(0,0,0,0.5)] h-full flex flex-col justify-center py-10 min-h-[350px]">
               <h4 className="absolute top-6 left-6 text-xs font-sans font-bold uppercase tracking-[0.4em] text-brand-gray z-10">Análise de Performance</h4>
               <div className="absolute inset-0 bg-gradient-to-br from-brand-red/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />
               <PerformanceRadar analysis={analysis} />
            </div>
          </div>

          {/* Coluna Direita: Evolução Tática + Medalhas */}
          <div className="lg:col-span-4 flex flex-col gap-6 lg:gap-8">
            <div className="valo-card !p-6 h-full flex flex-col justify-center group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-bl from-brand-red/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
              <div className="flex justify-between items-end mb-6 relative z-10">
                <div>
                  <h4 className="text-xs font-sans font-bold uppercase tracking-[0.2em] text-brand-gray mb-1">Evolução Tática</h4>
                  <div className="text-brand-light font-heading uppercase text-3xl">Nível {analysis?.overallScore || 0}</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] font-sans font-bold uppercase tracking-widest text-brand-red mb-1">Próximo Foco</div>
                  <div className="text-brand-light text-xs font-sans font-bold uppercase tracking-wider">{nextFocus}</div>
                </div>
              </div>
              <div className="h-3 w-full bg-[#0a0f16] border border-brand-gray/10 rounded-full overflow-hidden shadow-inner relative z-10">
                <motion.div 
                  className="h-full bg-brand-red shadow-[0_0_15px_rgba(255,70,85,0.8)]"
                  initial={{ width: 0 }}
                  whileInView={{ width: \`\${analysis?.overallScore || 0}%\` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                />
              </div>
            </div>
            
            <div className="flex flex-col gap-3 justify-center h-full">
               <div className="w-full bg-brand-darker/60 border border-brand-gray/20 px-4 py-4 flex items-center gap-4 hover:bg-brand-gray/5 transition-colors cursor-default rounded-sm">
                 <div className="p-2 bg-[#00ffaa]/10 rounded-full">
                   <Award size={20} className="text-[#00ffaa]" />
                 </div>
                 <span className="text-xs font-sans font-bold uppercase tracking-widest text-brand-light">Potencial de Subida Alto</span>
               </div>
               <div className="w-full bg-brand-darker/60 border border-brand-gray/20 px-4 py-4 flex items-center gap-4 hover:bg-brand-gray/5 transition-colors cursor-default rounded-sm">
                 <div className="p-2 bg-amber-400/10 rounded-full">
                   <Crosshair size={20} className="text-amber-400" />
                 </div>
                 <span className="text-xs font-sans font-bold uppercase tracking-widest text-brand-light">Foco Tático na Mira</span>
               </div>
            </div>
          </div>
        </div>

        {/* ROW 3: COMPETÊNCIAS ESPECÍFICAS */}
        <div className="valo-card relative overflow-hidden bg-gradient-to-b from-brand-dark/95 to-brand-darker/95 border-t-4 border-t-brand-red shadow-[0_0_40px_rgba(255,70,85,0.05)] !p-8">
           <h4 className="text-xs font-sans font-bold uppercase tracking-[0.4em] mb-8 text-brand-gray border-b border-brand-gray/20 pb-4 w-full text-center">
             Análise Detalhada de Fundamentos
           </h4>
           <TacticalBreakdown data={analysis?.tacticalBreakdown || { mira: { label: "Mira", value: 0, average: 0, description: "" }, gameSense: { label: "Game Sense", value: 0, average: 0, description: "" }, economia: { label: "Economia", value: 0, average: 0, description: "" }, posicionamento: { label: "Posicionamento", value: 0, average: 0, description: "" }, utilitarias: { label: "Utilitárias", value: 0, average: 0, description: "" } }} />
        </div>
      </section>

      {/* SEÇÃO 3: MAPAS & TERRITÓRIO */}`;

if (oldSection2Regex.test(content)) {
  content = content.replace(oldSection2Regex, newSection2);
  fs.writeFileSync(file, content);
  console.log("Successfully replaced Bento layout");
} else {
  console.error("Failed to find section 2 regex");
}
