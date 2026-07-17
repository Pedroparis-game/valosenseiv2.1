const fs = require('fs');
let content = fs.readFileSync('src/components/dashboard/Insights.tsx', 'utf8');

// The replacement should be done by looking at the current component content.
const targetPattern = /<div className="relative z-10 flex flex-col items-center text-center">([\s\S]*?)<\/div>\s*<\/div>\s*<\/motion\.section>/m;

const newSection = `
          <div className="relative z-10 w-full text-left">
             <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-brand-red/10 border border-brand-red/30">
                  <Brain size={32} className="text-brand-red" />
                </div>
                <h3 className="text-3xl font-heading uppercase tracking-widest text-brand-light drop-shadow-md">Diagnóstico do Sensei</h3>
             </div>
             
             <p className="text-lg font-sans font-medium leading-relaxed text-white mb-10 opacity-90 border-l-4 border-brand-red pl-5">
               {analysis.coachVerdict.summary}
             </p>
             
             {/* ESTATÍSTICAS */}
             <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-10">
                {[
                  { label: "Headshot", value: analysis.coachVerdict.stats?.headshotRate, icon: Target },
                  { label: "KDA", value: analysis.coachVerdict.stats?.kda, icon: Activity },
                  { label: "Win Rate", value: analysis.coachVerdict.stats?.winRate, icon: TrendingUp },
                  { label: "Impacto", value: analysis.coachVerdict.stats?.impactScore, icon: Zap },
                  { label: "Agente", value: analysis.coachVerdict.stats?.bestAgent, icon: Brain },
                  { label: "Mapa", value: analysis.coachVerdict.stats?.bestMap, icon: Map },
                ].map((stat, i) => {
                  const IconCmp = stat.icon;
                  return (
                    <div key={i} className="bg-brand-darker/50 border border-brand-gray/20 p-4 flex flex-col items-center justify-center text-center hover:bg-brand-gray/5 transition-colors">
                       <IconCmp size={16} className="text-brand-gray mb-3 opacity-60" />
                       <div className="text-xl font-heading tracking-wider text-white mb-1">{stat.value || '-'}</div>
                       <div className="text-[9px] uppercase font-bold tracking-widest text-brand-gray">{stat.label}</div>
                    </div>
                  );
                })}
             </div>

             {/* BLOCOS (Fortes, Melhorar, Dicas) */}
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
                <div className="bg-brand-dark/60 border border-brand-gray/10 p-6 rounded-sm">
                   <div className="flex items-center gap-3 mb-6 border-b border-[#00ffaa]/20 pb-3">
                     <CheckCircle2 className="text-[#00ffaa]" size={20} />
                     <h4 className="font-heading uppercase tracking-widest text-brand-light text-sm">Pontos Fortes</h4>
                   </div>
                   <ul className="space-y-4">
                     {(analysis.coachVerdict.strengths || []).map((str, idx) => (
                       <li key={idx} className="flex items-start gap-3">
                         <span className="text-[#00ffaa] mt-0.5 text-xs">▶</span>
                         <span className="text-sm font-sans text-brand-light/90 leading-tight">{str}</span>
                       </li>
                     ))}
                   </ul>
                </div>

                <div className="bg-brand-dark/60 border border-brand-gray/10 p-6 rounded-sm">
                   <div className="flex items-center gap-3 mb-6 border-b border-amber-400/20 pb-3">
                     <AlertTriangle className="text-amber-400" size={20} />
                     <h4 className="font-heading uppercase tracking-widest text-brand-light text-sm">Para Melhorar</h4>
                   </div>
                   <ul className="space-y-4">
                     {(analysis.coachVerdict.weaknesses || []).map((wk, idx) => (
                       <li key={idx} className="flex items-start gap-3">
                         <span className="text-amber-400 mt-0.5 text-xs">▶</span>
                         <span className="text-sm font-sans text-brand-light/90 leading-tight">{wk}</span>
                       </li>
                     ))}
                   </ul>
                </div>

                <div className="bg-brand-dark/60 border border-brand-gray/10 p-6 rounded-sm">
                   <div className="flex items-center gap-3 mb-6 border-b border-brand-red/20 pb-3">
                     <Brain className="text-brand-red" size={20} />
                     <h4 className="font-heading uppercase tracking-widest text-brand-light text-sm">Recomendações</h4>
                   </div>
                   <ul className="space-y-4">
                     {(analysis.coachVerdict.recommendations || []).map((rec, idx) => (
                       <li key={idx} className="flex items-start gap-3">
                         <span className="text-brand-red mt-0.5 text-xs">▶</span>
                         <span className="text-sm font-sans text-brand-light/90 leading-tight">{rec}</span>
                       </li>
                     ))}
                   </ul>
                </div>
             </div>

             <div className="text-center pt-8 border-t border-brand-gray/20">
                <p className="text-xl font-heading tracking-widest text-brand-light drop-shadow-md italic">"{analysis.coachVerdict.conclusion}"</p>
             </div>
          </div>
        </div>
      </motion.section>`;

content = content.replace(targetPattern, newSection);

// Add missing icon 'Map'
if (!content.includes('Map,')) {
  content = content.replace('import { Zap,', 'import { Zap, Map,');
}

fs.writeFileSync('src/components/dashboard/Insights.tsx', content);
