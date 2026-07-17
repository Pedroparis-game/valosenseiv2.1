import React, { useMemo } from "react";
import { motion } from "motion/react";
import { Zap, Map, CheckCircle2, ShieldAlert, Quote, Target, TrendingUp, AlertTriangle, Brain, Activity, User, Award, Crosshair } from "lucide-react";
import { AnalysisResult, PlayerStats } from "../../types";
import TacticalBreakdown from "./TacticalBreakdown";
import MapMastery from "./MapMastery";
import PerformanceRadar from "./PerformanceRadar";

interface InsightsProps {
  analysis: AnalysisResult;
  stats: PlayerStats;
}

const categoryIcons: Record<string, any> = {
  mira: Target,
  posicionamento: ShieldAlert,
  economia: Zap,
  utilitarias: TrendingUp,
  gameSense: Brain,
};

import { X } from "lucide-react";
import { AnimatePresence } from "motion/react";

export default function Insights({ analysis, stats }: InsightsProps) {
  const [selectedInsight, setSelectedInsight] = React.useState<any>(null);
  const prioritizedInsights = useMemo(() => {
    return [...analysis.insights].sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return (priorityOrder[a.priority as keyof typeof priorityOrder] || 0) - (priorityOrder[b.priority as keyof typeof priorityOrder] || 0);
    });
  }, [analysis.insights]);

  const getPriorityColor = (priority: string) => {
    if (priority === 'high') return 'bg-brand-red text-white border-brand-red';
    return 'bg-brand-dark text-brand-red border-brand-gray/30';
  };

  // Determine a Grade (S, A+, A, B+, etc.) based on Impact Score
  const score = analysis.overallScore;
  let grade = "C";
  let gradeColor = "text-brand-gray";
  if (score >= 90) { grade = "S"; gradeColor = "text-[#00ffaa] drop-shadow-[0_0_15px_rgba(0,255,170,0.5)]"; }
  else if (score >= 80) { grade = "A+"; gradeColor = "text-brand-light drop-shadow-[0_0_15px_rgba(236,232,225,0.5)]"; }
  else if (score >= 70) { grade = "A"; gradeColor = "text-brand-light"; }
  else if (score >= 60) { grade = "B+"; gradeColor = "text-amber-400"; }
  else if (score >= 50) { grade = "B"; gradeColor = "text-amber-400"; }

  const nextFocus = prioritizedInsights[0]?.category || "mira";

  return (
    <div className="space-y-24 py-12 pb-32">
      {/* SEÇÃO 1: VEREDITO DO SENSEI */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <div className="flex items-center gap-4 mb-4">
          <Activity className="text-brand-red" size={24} />
          <span className="text-[10px] font-sans font-bold uppercase tracking-[0.4em] text-brand-gray">Relatório de Inteligência Tática</span>
          <div className="flex-grow h-[1px] bg-brand-gray/20" />
        </div>
        
        <div className="valo-card !p-12 md:!p-16 relative overflow-hidden bg-brand-dark/95 border-brand-red shadow-[0_0_20px_rgba(255,70,85,0.1)]">
          <Quote className="absolute top-6 left-6 text-brand-gray/10" size={120} />
          
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
             
             {/* BLOCOS (Fortes, Melhorar, Dicas) */}
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
                <div className="bg-brand-dark/60 border border-brand-gray/10 p-6 rounded-sm hover:border-[#00ffaa]/50 transition-colors">
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

                <div className="bg-brand-dark/60 border border-brand-gray/10 p-6 rounded-sm hover:border-amber-400/50 transition-colors">
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

                <div className="bg-brand-dark/60 border border-brand-gray/10 p-6 rounded-sm hover:border-brand-red/50 transition-colors">
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
      </motion.section>

      {/* SEÇÃO 2: MÉTRICAS E COMPETÊNCIAS */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* COLUNA ESQUERDA - PERFIL E RADAR (Mais largo) */}
        <div className="lg:col-span-5 space-y-6">
          {/* 1. Cabeçalho do Perfil & Classificação */}
          <div className="valo-card !p-6 flex items-center justify-between border-b-4 border-b-brand-red bg-gradient-to-br from-brand-dark/90 to-brand-darker">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-brand-gray/30 p-1 bg-brand-dark relative group">
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
              <div className={`text-5xl font-heading ${gradeColor}`}>{grade}</div>
            </div>
          </div>

          {/* 3. Perfil do Jogador & 4. Principal Insight */}
          <div className="grid grid-cols-1 gap-6">
            <div className="valo-card !p-6 relative overflow-hidden group hover:border-brand-light/30 transition-colors">
              <div className="absolute top-0 right-0 w-24 h-24 bg-brand-light/5 blur-[40px] rounded-full group-hover:bg-brand-light/10 transition-colors" />
              <div className="flex items-start gap-3 mb-2">
                <Target size={20} className="text-brand-light" />
                <h4 className="font-heading text-xl uppercase tracking-widest text-brand-light">Estilo Tático</h4>
              </div>
              <p className="text-sm font-sans text-brand-light/80 leading-relaxed max-w-sm">
                Foco no duelo e controle. O impacto primário depende da precisão inicial.
              </p>
            </div>
            
            <div className="valo-card !p-6 relative overflow-hidden border-l-4 border-l-brand-red bg-brand-dark/95">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-red/5 blur-[50px] rounded-full" />
              <div className="flex items-center gap-3 mb-3">
                <Zap size={18} className="text-brand-red" />
                <h4 className="font-heading text-sm uppercase tracking-[0.2em] text-brand-red">Principal Insight</h4>
              </div>
              <p className="text-sm font-sans text-white/90 leading-relaxed font-medium">
                {prioritizedInsights[0]?.description || "Sem insights no momento. Jogue mais partidas."}
              </p>
            </div>
          </div>

          {/* 5. Estatísticas Rápidas */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
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
                <div key={i} className="bg-brand-darker/60 border border-brand-gray/10 p-4 flex flex-col items-center justify-center text-center hover:bg-brand-gray/5 transition-colors">
                   <IconCmp size={16} className="text-brand-gray mb-2 opacity-50" />
                   <div className="text-lg font-heading tracking-wider text-brand-light mb-1">{stat.value}</div>
                   <div className="text-[9px] uppercase font-bold tracking-widest text-brand-gray">{stat.label}</div>
                </div>
              );
            })}
          </div>

          {/* 7. Evolução */}
          <div className="valo-card !p-6">
            <div className="flex justify-between items-end mb-4">
              <div>
                <h4 className="text-xs font-sans font-bold uppercase tracking-[0.2em] text-brand-gray mb-1">Evolução Tática</h4>
                <div className="text-brand-light font-heading uppercase text-xl">Nível {analysis.overallScore}</div>
              </div>
              <div className="text-right">
                <div className="text-[10px] font-sans font-bold uppercase tracking-widest text-brand-red mb-1">Próximo Foco</div>
                <div className="text-brand-light text-xs font-sans font-bold uppercase tracking-wider">{nextFocus}</div>
              </div>
            </div>
            <div className="h-2 w-full bg-brand-gray/20 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-brand-red" 
                initial={{ width: 0 }}
                whileInView={{ width: `${analysis.overallScore}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              />
            </div>
          </div>
          
          {/* 8. Medalhas */}
          <div className="flex flex-wrap gap-3">
             <div className="flex-1 bg-brand-darker/60 border border-brand-gray/20 px-3 py-2 flex items-center gap-3">
               <Award size={16} className="text-[#00ffaa]" />
               <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-brand-light">Potencial de Subida</span>
             </div>
             <div className="flex-1 bg-brand-darker/60 border border-brand-gray/20 px-3 py-2 flex items-center gap-3">
               <Crosshair size={16} className="text-amber-400" />
               <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-brand-light">Foco na Mira</span>
             </div>
          </div>

          {/* 6. Radar mais informativo */}
          <div className="valo-card relative">
             <h4 className="absolute top-6 left-6 text-xs font-sans font-bold uppercase tracking-[0.4em] text-brand-gray z-10">Análise de Performance</h4>
             <PerformanceRadar analysis={analysis} />
          </div>

        </div>
        
        {/* COLUNA DIREITA - BREAKDOWN (Mais estreito) */}
        <div className="lg:col-span-7">
           <div className="valo-card h-full">
             <h4 className="text-xs font-sans font-bold uppercase tracking-[0.4em] mb-8 text-brand-gray border-b border-brand-gray/20 pb-2 w-full text-center">Competências Específicas</h4>
             <TacticalBreakdown data={analysis.tacticalBreakdown} />
           </div>
        </div>
      </section>

      {/* SEÇÃO 3: MAPAS & TERRITÓRIO */}
      <section>
        <MapMastery maps={analysis.mapMastery} />
      </section>

      {/* SEÇÃO 4: VULNERABILIDADES & PLANO DE AÇÃO */}
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
            if (insight.category === 'posicionamento') benefit = "🧠 Sobrevivência +5%";
            
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
                className={`h-full ${isHero ? 'lg:col-span-2' : 'lg:col-span-1'}`}
              >
                <div className={`valo-card h-full flex flex-col !p-0 overflow-hidden group transition-all duration-300 hover:border-brand-light/30 ${prioGlow}`}>
                  {/* HEADER */}
                  <div className={`p-6 border-b ${prioBorder} ${prioBg} relative overflow-hidden`}>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-[40px] rounded-full group-hover:bg-white/10 transition-colors" />
                    <div className="flex justify-between items-start relative z-10">
                      <div className="flex items-center gap-3">
                        <div className={`p-3 bg-brand-dark/50 border ${prioBorder} rounded-sm`}>
                          <Icon size={isHero ? 28 : 20} className={prioColor} />
                        </div>
                        <div>
                          <div className={`font-sans font-bold uppercase text-[10px] tracking-[0.2em] ${prioColor} mb-1`}>
                            {insight.category}
                          </div>
                          <h4 className={`font-heading uppercase tracking-wider text-white ${isHero ? 'text-3xl' : 'text-xl'}`}>
                            {insight.title}
                          </h4>
                        </div>
                      </div>
                      <div className={`px-3 py-1 font-sans font-bold text-[9px] uppercase border ${prioBorder} ${prioColor} bg-brand-dark/50`}>
                        Severidade: {severity}/100
                      </div>
                    </div>
                  </div>
                  
                  {/* CONTENT */}
                  <div className="p-6 flex-grow flex flex-col justify-between">
                    <div>
                      <p className={`font-sans font-medium text-brand-light/80 leading-relaxed mb-6 ${isHero ? 'text-base' : 'text-sm'}`}>
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
                             <CheckCircle2 size={16} className={`mt-0.5 ${prioColor}`} />
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
                     <button 
                        onClick={() => setSelectedInsight({ ...insight, severity, time, difficulty, benefit, checklist, prioColor, prioBg, prioBorder })}
                        className={`px-4 py-2 text-[10px] font-bold uppercase tracking-widest transition-colors ${isHero ? 'bg-brand-red text-white hover:bg-brand-red/80' : 'bg-brand-gray/10 text-brand-light hover:bg-brand-gray/30'}`}
                     >
                        Ver Detalhes
                     </button>
                  </div>
                  
                  {/* SEVERITY BAR */}
                  <div className="h-1 w-full bg-brand-darker">
                     <div className={`h-full ${prioBg.replace('/10', '')}`} style={{ width: `${severity}%` }} />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

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
              className={`w-full max-w-2xl bg-brand-dark border ${selectedInsight.prioBorder} shadow-2xl overflow-hidden flex flex-col max-h-[90vh]`}
            >
              {/* MODAL HEADER */}
              <div className={`p-6 border-b ${selectedInsight.prioBorder} ${selectedInsight.prioBg} relative overflow-hidden flex justify-between items-start`}>
                 <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-[40px] rounded-full" />
                 <div className="relative z-10 flex items-center gap-4">
                    <div className={`p-4 bg-brand-dark/50 border ${selectedInsight.prioBorder} rounded-sm`}>
                      {React.createElement(categoryIcons[selectedInsight.category] || Zap, { size: 32, className: selectedInsight.prioColor })}
                    </div>
                    <div>
                      <div className={`font-sans font-bold uppercase text-xs tracking-[0.2em] ${selectedInsight.prioColor} mb-1`}>
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
                             <CheckCircle2 size={20} className={`mt-0.5 shrink-0 ${selectedInsight.prioColor}`} />
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
}