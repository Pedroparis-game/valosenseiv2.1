const fs = require('fs');
let file = 'src/components/dashboard/Insights.tsx';
let content = fs.readFileSync(file, 'utf8');

const oldSection4Regex = /\{\/\* SEÇÃO 4: VULNERABILIDADES & PLANO DE AÇÃO \*\/\}[\s\S]*?<\/section>/;

const newSection4 = `{/* SEÇÃO 4: PLANO DE TREINO E VULNERABILIDADES */}
      <section className="space-y-8 mt-16 relative">
        <div className="absolute -left-4 top-0 bottom-0 w-1 bg-brand-red/50" />
        
        <div className="flex items-end justify-between border-b border-brand-gray/20 pb-4">
          <div>
            <div className="text-[10px] font-sans font-bold uppercase tracking-[0.3em] text-brand-red mb-1">Análise Crítica</div>
            <h3 className="text-4xl font-heading uppercase tracking-widest text-brand-light flex items-center gap-3">
              <AlertTriangle className="text-brand-red" size={32} />
              Protocolo de Otimização
            </h3>
          </div>
          <div className="hidden md:block text-right">
             <div className="text-xs font-sans font-bold uppercase tracking-widest text-brand-gray">Itens Identificados</div>
             <div className="text-2xl font-heading text-brand-light">{prioritizedInsights.length}</div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {prioritizedInsights.map((insight, idx) => {
            const isHero = idx === 0;
            const Icon = categoryIcons[insight.category] || Zap;
            
            // Determinar cores e severidade baseado na prioridade
            let prioColor = "text-brand-red";
            let prioBg = "bg-brand-red";
            let prioBorder = "border-brand-red/30";
            let prioGlow = "group-hover:border-brand-red";
            let severity = 85;
            let time = "5 Sessões";
            let difficulty = "Difícil";
            let benefit = "📈 Win Rate +4%";
            
            if (insight.priority === 'medium') {
              prioColor = "text-amber-400";
              prioBg = "bg-amber-400";
              prioBorder = "border-amber-400/30";
              prioGlow = "group-hover:border-amber-400";
              severity = 65;
              time = "3 Partidas";
              difficulty = "Média";
              benefit = "⚡ Consistência +10%";
            } else if (insight.priority === 'low') {
              prioColor = "text-[#00ffaa]";
              prioBg = "bg-[#00ffaa]";
              prioBorder = "border-[#00ffaa]/30";
              prioGlow = "group-hover:border-[#00ffaa]";
              severity = 40;
              time = "1 Partida";
              difficulty = "Fácil";
              benefit = "🎯 Precisão Otimizada";
            }
            
            if (insight.category === 'mira') benefit = "🎯 Headshot +3%";
            if (insight.category === 'economia') benefit = "💰 Gestão +20%";
            if (insight.category === 'posicionamento') benefit = "🧠 Sobrevivência +5%";
            
            // Criar checklist
            const checklist = [
              "Focar em " + insight.category,
              insight.actionableStep.slice(0, 45) + (insight.actionableStep.length > 45 ? "..." : ""),
              "Monitorar resultados nas próximas partidas"
            ];
            
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className={\`h-full \${isHero ? 'lg:col-span-2' : 'lg:col-span-1'}\`}
              >
                <div className={\`valo-card h-full flex flex-col !p-0 overflow-hidden group transition-all duration-300 border-2 border-transparent \${prioGlow} bg-[#11161d]\`}>
                  
                  {/* HEADER */}
                  <div className="p-6 relative flex flex-col justify-between border-b border-brand-gray/10">
                    {/* Background Accent */}
                    <div className={\`absolute top-0 right-0 w-64 h-64 \${prioBg}/5 blur-[60px] rounded-full group-hover:\${prioBg}/10 transition-colors pointer-events-none\`} />
                    <div className={\`absolute top-0 left-0 w-1 h-full \${prioBg}\`} />
                    
                    <div className="flex justify-between items-start relative z-10 mb-4">
                      <div className="flex items-center gap-4">
                        <div className={\`p-3 bg-brand-darker border \${prioBorder} rounded-sm shadow-inner\`}>
                          <Icon size={24} className={prioColor} />
                        </div>
                        <div>
                          <div className={\`font-sans font-bold uppercase text-[10px] tracking-[0.3em] \${prioColor} mb-1\`}>
                            {insight.category}
                          </div>
                          <h4 className={\`font-heading uppercase tracking-wider text-brand-light \${isHero ? 'text-3xl' : 'text-xl'}\`}>
                            {insight.title}
                          </h4>
                        </div>
                      </div>
                      <div className={\`px-3 py-1 font-sans font-bold text-[10px] uppercase border \${prioBorder} \${prioColor} bg-brand-darker\`}>
                        Severidade: {severity}
                      </div>
                    </div>
                  </div>
                  
                  {/* CONTENT */}
                  <div className="p-6 flex-grow flex flex-col justify-between relative z-10 bg-brand-dark/20">
                    <div>
                      <p className={\`font-sans text-brand-light/70 leading-relaxed mb-8 \${isHero ? 'text-lg' : 'text-sm'}\`}>
                        {insight.description}
                      </p>
                      
                      {isHero && (
                        <div className="mb-8 grid grid-cols-2 gap-4">
                          <div className="p-4 border border-brand-gray/10 bg-brand-darker/80 shadow-inner group-hover:border-brand-gray/30 transition-colors">
                            <div className="text-[10px] font-sans font-bold uppercase text-brand-gray tracking-widest mb-2 flex items-center gap-2">
                               <TrendingUp size={14} className="text-brand-gray" />
                               Impacto Estimado
                            </div>
                            <div className="font-heading text-xl text-brand-light">{benefit}</div>
                          </div>
                          <div className="p-4 border border-brand-gray/10 bg-brand-darker/80 shadow-inner group-hover:border-brand-gray/30 transition-colors">
                            <div className="text-[10px] font-sans font-bold uppercase text-brand-gray tracking-widest mb-2 flex items-center gap-2">
                               <Activity size={14} className="text-brand-gray" />
                               Esforço / Tempo
                            </div>
                            <div className="font-heading text-xl text-brand-light">{time}</div>
                          </div>
                        </div>
                      )}
                      
                      <div className="space-y-4 mb-6">
                         <div className="flex items-center gap-2 border-b border-brand-gray/10 pb-2">
                            <Target size={14} className="text-brand-gray" />
                            <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-brand-gray">Diretrizes de Execução</span>
                         </div>
                         {checklist.map((item, i) => (
                           <div key={i} className="flex items-start gap-3">
                             <div className={\`mt-1 w-1.5 h-1.5 rounded-none rotate-45 \${prioBg}\`} />
                             <span className="text-sm font-sans text-brand-light/90 font-medium">{item}</span>
                           </div>
                         ))}
                      </div>
                    </div>
                  </div>
                  
                  {/* FOOTER */}
                  <div className="p-4 bg-brand-darker border-t border-brand-gray/10 flex items-center justify-between mt-auto">
                     <div className="flex gap-6">
                        <div className="flex items-center gap-2">
                           <ShieldAlert size={14} className="text-brand-gray" />
                           <span className="text-[10px] font-bold uppercase tracking-widest text-brand-gray">{difficulty}</span>
                        </div>
                        {!isHero && (
                          <div className="flex items-center gap-2">
                             <Target size={14} className="text-brand-gray" />
                             <span className="text-[10px] font-bold uppercase tracking-widest text-brand-gray">{time}</span>
                          </div>
                        )}
                     </div>
                     <button 
                        onClick={() => setSelectedInsight({ ...insight, severity, time, difficulty, benefit, checklist, prioColor, prioBg, prioBorder })}
                        className={\`px-6 py-2 text-xs font-heading uppercase tracking-widest transition-all duration-300 \${isHero ? 'bg-brand-light text-brand-dark hover:bg-white hover:shadow-[0_0_15px_rgba(255,255,255,0.3)]' : 'border border-brand-gray/30 text-brand-light hover:bg-brand-gray/10 hover:border-brand-gray/50'}\`}
                     >
                        Ver Detalhes
                     </button>
                  </div>
                  
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>`;

if (oldSection4Regex.test(content)) {
  content = content.replace(oldSection4Regex, newSection4);
  fs.writeFileSync(file, content);
  console.log("Successfully replaced Vulnerabilidades section");
} else {
  console.error("Failed to find section 4 regex");
}
