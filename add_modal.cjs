const fs = require('fs');
let content = fs.readFileSync('src/components/dashboard/Insights.tsx', 'utf8');

const endPattern = /\s*<\/div>\s*\);\s*}\s*$/;

const modalJsx = `

      {/* DETALHES MODAL */}
      <AnimatePresence>
        {selectedInsight && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-brand-darker/90 backdrop-blur-sm"
            onClick={() => setSelectedInsight(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className={\`w-full max-w-2xl bg-brand-dark border \${selectedInsight.prioBorder} shadow-2xl overflow-hidden flex flex-col max-h-[90vh]\`}
            >
              {/* MODAL HEADER */}
              <div className={\`p-6 border-b \${selectedInsight.prioBorder} \${selectedInsight.prioBg} relative overflow-hidden flex justify-between items-start\`}>
                 <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-[40px] rounded-full" />
                 <div className="relative z-10 flex items-center gap-4">
                    <div className={\`p-4 bg-brand-dark/50 border \${selectedInsight.prioBorder} rounded-sm\`}>
                      {React.createElement(categoryIcons[selectedInsight.category] || Zap, { size: 32, className: selectedInsight.prioColor })}
                    </div>
                    <div>
                      <div className={\`font-sans font-bold uppercase text-xs tracking-[0.2em] \${selectedInsight.prioColor} mb-1\`}>
                        {selectedInsight.category}
                      </div>
                      <h4 className="font-heading uppercase tracking-wider text-white text-2xl">
                        {selectedInsight.title}
                      </h4>
                    </div>
                 </div>
                 <button onClick={() => setSelectedInsight(null)} className="text-brand-gray hover:text-white transition-colors relative z-10 p-2">
                   <X size={24} />
                 </button>
              </div>

              {/* MODAL CONTENT */}
              <div className="p-8 overflow-y-auto custom-scrollbar">
                 <p className="font-sans text-brand-light/90 text-lg leading-relaxed mb-8">
                   {selectedInsight.description}
                 </p>

                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="p-4 border border-brand-gray/20 bg-brand-darker/50">
                      <div className="text-[10px] font-sans font-bold uppercase text-brand-gray mb-2">Impacto</div>
                      <div className="font-heading text-lg text-brand-light">{selectedInsight.benefit}</div>
                    </div>
                    <div className="p-4 border border-brand-gray/20 bg-brand-darker/50">
                      <div className="text-[10px] font-sans font-bold uppercase text-brand-gray mb-2">Tempo</div>
                      <div className="font-heading text-lg text-brand-light">{selectedInsight.time}</div>
                    </div>
                    <div className="p-4 border border-brand-gray/20 bg-brand-darker/50">
                      <div className="text-[10px] font-sans font-bold uppercase text-brand-gray mb-2">Severidade</div>
                      <div className="font-heading text-lg text-brand-light">{selectedInsight.severity}/100</div>
                    </div>
                    <div className="p-4 border border-brand-gray/20 bg-brand-darker/50">
                      <div className="text-[10px] font-sans font-bold uppercase text-brand-gray mb-2">Dificuldade</div>
                      <div className="font-heading text-lg text-brand-light">{selectedInsight.difficulty}</div>
                    </div>
                 </div>

                 <div className="space-y-4">
                    <h5 className="text-sm font-sans font-bold uppercase tracking-widest text-brand-gray border-b border-brand-gray/20 pb-2">Plano de Treino Detalhado</h5>
                    <div className="bg-brand-darker/50 border border-brand-gray/10 p-6">
                       <ul className="space-y-4">
                         {selectedInsight.checklist.map((item, i) => (
                           <li key={i} className="flex items-start gap-3">
                             <CheckCircle2 size={20} className={\`mt-0.5 shrink-0 \${selectedInsight.prioColor}\`} />
                             <span className="text-sm font-sans text-brand-light leading-relaxed">{item}</span>
                           </li>
                         ))}
                       </ul>
                    </div>
                 </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}`;

content = content.replace(endPattern, modalJsx);

fs.writeFileSync('src/components/dashboard/Insights.tsx', content);
