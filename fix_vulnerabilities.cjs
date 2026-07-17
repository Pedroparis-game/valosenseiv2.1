const fs = require('fs');
let content = fs.readFileSync('src/components/dashboard/Insights.tsx', 'utf8');

const targetPattern = /\{\/\* SEÇÃO 4: INSIGHTS & CORREÇÕES \*\/\}\s*<section className="space-y-8">[\s\S]*?<\/section>/m;

const newSection = `{/* SEÇÃO 4: VULNERABILIDADES & PLANO DE AÇÃO */}
      <section className="space-y-8">
        <div className="flex items-center gap-4 border-b border-brand-gray/20 pb-4">
          <AlertTriangle className="text-brand-red" size={28} />
          <h3 className="text-3xl font-heading uppercase tracking-widest text-brand-light">Vulnerabilidades Identificadas</h3>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {prioritizedInsights.map((insight, idx) => {
            const isHero = idx === 0;
            const Icon = categoryIcons[insight.category] || Zap;
            
            // Determinar cores e severidade baseado na prioridade
            let prioColor = "text-brand-red";
            let prioBg = "bg-brand-red/10";
            let prioBorder = "border-brand-red/30";
            let prioGlow = "group-hover:shadow-[0_0_25px_rgba(255,70,85,0.2)]";
            let severity = 85;
            let time = "5 Sessões";
            let difficulty = "Difícil";
            let benefit = "📈 Win Rate +4%";
            
            if (insight.priority === 'medium') {
              prioColor = "text-amber-400";
              prioBg = "bg-amber-400/10";
              prioBorder = "border-amber-400/30";
              prioGlow = "group-hover:shadow-[0_0_25px_rgba(251,191,36,0.15)]";
              severity = 65;
              time = "3 Partidas";
              difficulty = "Média";
              benefit = "⚡ Consistência +10%";
            } else if (insight.priority === 'low') {
              prioColor = "text-[#00ffaa]";
              prioBg = "bg-[#00ffaa]/10";
              prioBorder = "border-[#00ffaa]/30";
              prioGlow = "group-hover:shadow-[0_0_25px_rgba(0,255,170,0.15)]";
              severity = 40;
              time = "1 Partida";
              difficulty = "Fácil";
              benefit = "🎯 Precisão Otimizada";
            }
            
            if (insight.category === 'mira') benefit = "🎯 Headshot +3%";
            if (insight.category === 'economia') benefit = "💰 Gestão +20%";
            if (insight.category === 'gameSense') benefit = "🧠 Sobrevivência +5%";
            
            // Criar checklist (fake split for demonstration, but based on actionableStep)
            const checklist = [
              "Focar em " + insight.category,
              insight.actionableStep.slice(0, 45) + (insight.actionableStep.length > 45 ? "..." : ""),
              "Monitorar resultados nas próximas partidas"
            ];
            
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className={\`h-full \${isHero ? 'lg:col-span-2' : 'lg:col-span-1'}\`}
              >
                <div className={\`valo-card h-full flex flex-col !p-0 overflow-hidden group transition-all duration-300 hover:border-brand-light/30 \${prioGlow}\`}>
                  {/* HEADER */}
                  <div className={\`p-6 border-b \${prioBorder} \${prioBg} relative overflow-hidden\`}>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-[40px] rounded-full group-hover:bg-white/10 transition-colors" />
                    <div className="flex justify-between items-start relative z-10">
                      <div className="flex items-center gap-3">
                        <div className={\`p-3 bg-brand-dark/50 border \${prioBorder} rounded-sm\`}>
                          <Icon size={isHero ? 28 : 20} className={prioColor} />
                        </div>
                        <div>
                          <div className={\`font-sans font-bold uppercase text-[10px] tracking-[0.2em] \${prioColor} mb-1\`}>
                            {insight.category}
                          </div>
                          <h4 className={\`font-heading uppercase tracking-wider text-white \${isHero ? 'text-3xl' : 'text-xl'}\`}>
                            {insight.title}
                          </h4>
                        </div>
                      </div>
                      <div className={\`px-3 py-1 font-sans font-bold text-[9px] uppercase border \${prioBorder} \${prioColor} bg-brand-dark/50\`}>
                        Severidade: {severity}/100
                      </div>
                    </div>
                  </div>
                  
                  {/* CONTENT */}
                  <div className="p-6 flex-grow flex flex-col justify-between">
                    <div>
                      <p className={\`font-sans font-medium text-brand-light/80 leading-relaxed mb-6 \${isHero ? 'text-base' : 'text-sm'}\`}>
                        {insight.description}
                      </p>
                      
                      {isHero && (
                        <div className="mb-6 grid grid-cols-2 gap-4">
                          <div className="p-4 border border-brand-gray/20 bg-brand-darker/50">
                            <div className="text-[10px] font-sans font-bold uppercase text-brand-gray mb-2">Impacto Esperado</div>
                            <div className="font-heading text-lg text-brand-light">{benefit}</div>
                          </div>
                          <div className="p-4 border border-brand-gray/20 bg-brand-darker/50">
                            <div className="text-[10px] font-sans font-bold uppercase text-brand-gray mb-2">Tempo Estimado</div>
                            <div className="font-heading text-lg text-brand-light">{time}</div>
                          </div>
                        </div>
                      )}

                      <div className="space-y-3 mb-6">
                         <div className="text-[10px] font-sans font-bold uppercase tracking-widest text-brand-gray border-b border-brand-gray/20 pb-2">Plano de Ação</div>
                         {checklist.map((item, i) => (
                           <div key={i} className="flex items-start gap-3">
                             <CheckCircle2 size={16} className={\`mt-0.5 \${prioColor}\`} />
                             <span className="text-xs font-sans text-brand-light/90">{item}</span>
                           </div>
                         ))}
                      </div>
                    </div>
                  </div>
                  
                  {/* FOOTER */}
                  <div className="p-4 border-t border-brand-gray/20 bg-brand-darker/80 flex items-center justify-between">
                     <div className="flex gap-4">
                        <div className="flex items-center gap-2">
                           <Activity size={14} className="text-brand-gray" />
                           <span className="text-[10px] font-bold uppercase tracking-widest text-brand-gray">{difficulty}</span>
                        </div>
                        {!isHero && (
                          <div className="flex items-center gap-2">
                             <Target size={14} className="text-brand-gray" />
                             <span className="text-[10px] font-bold uppercase tracking-widest text-brand-gray">{time}</span>
                          </div>
                        )}
                     </div>
                     <button className={\`px-4 py-2 text-[10px] font-bold uppercase tracking-widest transition-colors \${isHero ? 'bg-brand-red text-white hover:bg-brand-red/80' : 'bg-brand-gray/10 text-brand-light hover:bg-brand-gray/30'}\`}>
                        {isHero ? 'Iniciar Treino' : 'Ver Detalhes'}
                     </button>
                  </div>
                  
                  {/* SEVERITY BAR */}
                  <div className="h-1 w-full bg-brand-darker">
                     <div className={\`h-full \${prioBg.replace('/10', '')}\`} style={{ width: \`\${severity}%\` }} />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>`;

content = content.replace(targetPattern, newSection);

fs.writeFileSync('src/components/dashboard/Insights.tsx', content);
