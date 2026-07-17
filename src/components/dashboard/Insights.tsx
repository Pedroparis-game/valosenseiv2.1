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

import { Flame } from "lucide-react";
import { getOfficialRankIcon } from "../../utils/rankUtils";
export default function Insights({ analysis, stats }: InsightsProps) {
  const MINDSET_QUOTES = [
    "A diferença entre o bom e o melhor é a consistência.",
    "Mire na cabeça, mas jogue com a mente.",
    "Cada derrota é apenas uma lição de como não perder da próxima vez.",
    "A paciência vence mais duelos do que a velocidade.",
    "Sua utilitária é tão letal quanto o seu tiro, se usada corretamente.",
    "Mantenha a calma sob pressão. O pânico é o maior inimigo do clutch.",
    "Não se importe com o rank, importe-se com a evolução diária.",
    "Comunicação clara ganha mais rounds do que jogadas individuais."
  ];
  const quoteIndex = stats.name.charCodeAt(0) % MINDSET_QUOTES.length;
  const quote = MINDSET_QUOTES[quoteIndex];

  const [selectedInsight, setSelectedInsight] = React.useState<any>(null);
  const [rankIconUrl, setRankIconUrl] = React.useState<string>(
    stats.rankImageUrl || "https://media.valorant-api.com/competitivetiers/03621f13-4c37-ad53-9043-695333d57551/0/largeicon.png"
  );

  React.useEffect(() => {
    if (stats.rankImageUrl) {
      setRankIconUrl(stats.rankImageUrl);
      return;
    }
    const loadIcon = async () => {
      const url = await getOfficialRankIcon(stats.rank);
      setRankIconUrl(url);
    };
    loadIcon();
  }, [stats.rank, stats.rankImageUrl]);
  const prioritizedInsights = useMemo(() => {
    return [...(analysis?.insights || [])].sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return (priorityOrder[a.priority as keyof typeof priorityOrder] || 0) - (priorityOrder[b.priority as keyof typeof priorityOrder] || 0);
    });
  }, [(analysis?.insights || [])]);

  const getPriorityColor = (priority: string) => {
    if (priority === 'high') return 'bg-brand-red text-white border-brand-red';
    return 'bg-brand-dark text-brand-red border-brand-gray/30';
  };

  // Determine a Grade (S, A+, A, B+, etc.) based on Impact Score
  const score = analysis?.overallScore || 0;
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
        
        <div className="valo-card !p-8 md:!p-12 relative overflow-hidden bg-[#0c121a]/95 border border-brand-gray/15 hover:border-brand-red/30 transition-all duration-300">
          <Quote className="absolute top-6 left-6 text-brand-gray/5 pointer-events-none" size={80} />
          
          <div className="relative z-10 w-full text-left">
             <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-brand-red/5 border border-brand-red/20">
                  <Brain size={24} className="text-brand-red" />
                </div>
                <h3 className="text-2xl font-heading uppercase tracking-widest text-brand-light">Diagnóstico do Sensei</h3>
             </div>
             
             <p className="text-base font-sans font-medium leading-relaxed text-white mb-8 opacity-90 border-l-2 border-brand-red pl-5">
               {analysis?.coachVerdict?.summary || "Sem resumo disponível."}
             </p>
             
             {/* BLOCOS (Fortes, Melhorar, Dicas) */}
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <div className="bg-[#11161d]/50 border border-brand-gray/10 p-6 rounded-sm hover:border-[#00ffaa]/30 transition-colors">
                   <div className="flex items-center gap-3 mb-4 border-b border-[#00ffaa]/10 pb-3">
                     <CheckCircle2 className="text-[#00ffaa]" size={18} />
                     <h4 className="font-heading uppercase tracking-widest text-brand-light text-sm">Pontos Fortes</h4>
                   </div>
                   <ul className="space-y-3">
                     {(analysis?.coachVerdict?.strengths || []).map((str, idx) => (
                       <li key={idx} className="flex items-start gap-2.5">
                         <span className="text-[#00ffaa] mt-1 text-[10px]">▶</span>
                         <span className="text-xs font-sans text-brand-light/90 leading-relaxed">{str}</span>
                       </li>
                     ))}
                   </ul>
                </div>

                <div className="bg-[#11161d]/50 border border-brand-gray/10 p-6 rounded-sm hover:border-amber-400/30 transition-colors">
                   <div className="flex items-center gap-3 mb-4 border-b border-amber-400/10 pb-3">
                     <AlertTriangle className="text-amber-400" size={18} />
                     <h4 className="font-heading uppercase tracking-widest text-brand-light text-sm">Para Melhorar</h4>
                   </div>
                   <ul className="space-y-3">
                     {(analysis?.coachVerdict?.weaknesses || []).map((wk, idx) => (
                       <li key={idx} className="flex items-start gap-2.5">
                         <span className="text-amber-400 mt-1 text-[10px]">▶</span>
                         <span className="text-xs font-sans text-brand-light/90 leading-relaxed">{wk}</span>
                       </li>
                     ))}
                   </ul>
                </div>

                <div className="bg-[#11161d]/50 border border-brand-gray/10 p-6 rounded-sm hover:border-brand-red/30 transition-colors">
                   <div className="flex items-center gap-3 mb-4 border-b border-brand-red/10 pb-3">
                     <Brain className="text-brand-red" size={18} />
                     <h4 className="font-heading uppercase tracking-widest text-brand-light text-sm">Recomendações</h4>
                   </div>
                   <ul className="space-y-3">
                     {(analysis?.coachVerdict?.recommendations || []).map((rec, idx) => (
                       <li key={idx} className="flex items-start gap-2.5">
                         <span className="text-brand-red mt-1 text-[10px]">▶</span>
                         <span className="text-xs font-sans text-brand-light/90 leading-relaxed">{rec}</span>
                       </li>
                     ))}
                   </ul>
                </div>
             </div>

             <div className="text-center pt-6 border-t border-brand-gray/10">
                 <p className="text-lg font-heading tracking-widest text-brand-light/80 italic">"{analysis?.coachVerdict?.conclusion || ""}"</p>
             </div>
          </div>
        </div>
      </motion.section>

      {/* SEÇÃO 2: MÉTRICAS E COMPETÊNCIAS (BENTO GRID) */}
      <section className="space-y-6 lg:space-y-8">
        
        {/* ROW 1: HEADER & STATS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          <div className="lg:col-span-4 flex flex-col">
            {/* 1. Cabeçalho do Perfil & Classificação */}
            <div className="valo-card !p-6 flex items-center justify-between border-l-2 border-brand-red bg-[#11161d] shadow-sm relative overflow-hidden group h-full">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-brand-gray/30 p-1 bg-brand-dark relative group-hover:border-brand-red/50 transition-colors">
                  <div className="absolute inset-0 bg-brand-red/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  {rankIconUrl ? (
                    <img src={rankIconUrl} alt="Rank" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
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
                <div className={`text-5xl font-heading ${gradeColor} drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]`}>{grade}</div>
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
                <Flame size={22} className="text-[#00ffaa]" />
                <h4 className="font-heading text-xl uppercase tracking-widest text-brand-light">Mindset Pro</h4>
              </div>
              <p className="text-sm font-sans text-brand-light/90 leading-relaxed font-medium italic">
                "{quote}"
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
              <div className="h-1.5 w-full bg-brand-darker border border-brand-gray/15 rounded-none overflow-hidden relative z-10">
                <motion.div 
                  className="h-full bg-brand-red"
                  initial={{ width: 0 }}
                  whileInView={{ width: `${analysis?.overallScore || 0}%` }}
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

      {/* SEÇÃO 3: MAPAS & TERRITÓRIO */}
      <section>
        <MapMastery maps={analysis.mapMastery} />
      </section>

      {/* SEÇÃO 4: PLANO DE TREINO E VULNERABILIDADES */}
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
                className={`h-full ${isHero ? 'lg:col-span-2' : 'lg:col-span-1'}`}
              >
                <div className={`valo-card h-full flex flex-col !p-0 overflow-hidden group transition-all duration-300 border-2 border-transparent ${prioGlow} bg-[#11161d]`}>
                  
                  {/* HEADER */}
                  <div className="p-6 relative flex flex-col justify-between border-b border-brand-gray/10">
                    {/* Background Accent */}
                    <div className={`absolute top-0 right-0 w-64 h-64 ${prioBg}/5 blur-[60px] rounded-full group-hover:${prioBg}/10 transition-colors pointer-events-none`} />
                    <div className={`absolute top-0 left-0 w-1 h-full ${prioBg}`} />
                    
                    <div className="flex justify-between items-start relative z-10 mb-4">
                      <div className="flex items-center gap-4">
                        <div className={`p-3 bg-brand-darker border ${prioBorder} rounded-sm shadow-inner`}>
                          <Icon size={24} className={prioColor} />
                        </div>
                        <div>
                          <div className={`font-sans font-bold uppercase text-[10px] tracking-[0.3em] ${prioColor} mb-1`}>
                            {insight.category}
                          </div>
                          <h4 className={`font-heading uppercase tracking-wider text-brand-light ${isHero ? 'text-3xl' : 'text-xl'}`}>
                            {insight.title}
                          </h4>
                        </div>
                      </div>
                      <div className={`px-3 py-1 font-sans font-bold text-[10px] uppercase border ${prioBorder} ${prioColor} bg-brand-darker`}>
                        Severidade: {severity}
                      </div>
                    </div>
                  </div>
                  
                  {/* CONTENT */}
                  <div className="p-6 flex-grow flex flex-col justify-between relative z-10 bg-brand-dark/20">
                    <div>
                      <p className={`font-sans text-brand-light/70 leading-relaxed mb-8 ${isHero ? 'text-lg' : 'text-sm'}`}>
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
                             <div className={`mt-1 w-1.5 h-1.5 rounded-none rotate-45 ${prioBg}`} />
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
                        className={`px-6 py-2 text-xs font-heading uppercase tracking-widest transition-all duration-300 ${isHero ? 'bg-brand-light text-brand-dark hover:bg-white hover:shadow-[0_0_15px_rgba(255,255,255,0.3)]' : 'border border-brand-gray/30 text-brand-light hover:bg-brand-gray/10 hover:border-brand-gray/50'}`}
                     >
                        Ver Detalhes
                     </button>
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