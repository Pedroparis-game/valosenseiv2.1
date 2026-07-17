import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  BookOpen, Search, Target, Shield, Zap, TrendingUp, Brain, 
  ChevronRight, Award, Crosshair, HelpCircle, Layers, Info
} from "lucide-react";

interface LibraryItem {
  id: string;
  title: string;
  alias: string;
  category: 'mira' | 'posicionamento' | 'economia' | 'utilitarias' | 'gameSense';
  categoryLabel: string;
  difficulty: 'Iniciante' | 'Intermediário' | 'Avançado';
  description: string;
  howToApply: string;
  proTip: string;
}

const libraryData: LibraryItem[] = [
  {
    id: "crosshair-placement",
    title: "Crosshair Placement",
    alias: "Posicionamento de Mira",
    category: "mira",
    categoryLabel: "Mira & Mecânica",
    difficulty: "Iniciante",
    description: "A arte de manter a mira constantemente na altura da cabeça do oponente, antecipando onde ele estará ao abrir o ângulo. Isso minimiza a necessidade de correções bruscas de flick, resultando em abates muito mais velozes e consistentes.",
    howToApply: "Mantenha a mira na linha do queixo do oponente (use referências visuais no cenário, como caixas e linhas horizontais nas paredes) e afaste-a levemente da parede ao andar para dar tempo de reação caso o inimigo abra correndo.",
    proTip: "No aquecimento, ande pelos mapas mirando apenas nos pontos em que a cabeça do inimigo apareceria. Desative o hábito de mirar no chão."
  },
  {
    id: "counter-strafing",
    title: "Counter-Strafing",
    alias: "Parada Brusca",
    category: "mira",
    categoryLabel: "Mira & Mecânica",
    difficulty: "Avançado",
    description: "Técnica de movimentação usada para zerar a imprecisão de movimento instantaneamente. Consiste em pressionar a tecla oposta à direção do seu movimento (por exemplo, soltar 'A' e dar um toque rápido em 'D') logo antes de atirar.",
    howToApply: "Quando estiver se movendo para a esquerda (A), solte a tecla e toque rapidamente no 'D'. No momento exato em que a velocidade do agente chega a zero, faça o disparo. Se feito corretamente, a bala irá perfeitamente reta.",
    proTip: "Treine no estande de tiro com o indicador de erro de movimento ativado na mira para entender o timing exato da precisão."
  },
  {
    id: "spray-control",
    title: "Spray Transfer & Control",
    alias: "Controle de Recuo",
    category: "mira",
    categoryLabel: "Mira & Mecânica",
    difficulty: "Intermediário",
    description: "Habilidade de compensar o recuo da arma movendo o mouse no padrão inverso ao disparo contínuo, ou transferir esse disparo para um segundo inimigo durante a mesma rajada de balas.",
    howToApply: "Com a Vandal ou Phantom, as primeiras 3 balas são altamente precisas. Do 4º disparo em diante, puxe o mouse para baixo de forma constante. A partir do 9º, a arma começa a oscilar lateralmente.",
    proTip: "Evite disparar mais de 5 a 6 balas por rajada em médias e longas distâncias. Prefira rajadas curtas (bursts) ou tiros únicos (tapping)."
  },
  {
    id: "default-play",
    title: "Default",
    alias: "Estrutura Padrão",
    category: "gameSense",
    categoryLabel: "Táticas & Mindset",
    difficulty: "Intermediário",
    description: "Uma estratégia de início de round em que a equipe se espalha pelo mapa para obter informações, controlar áreas importantes, gastar utilitários inimigos e punir avanços agressivos dos defensores, sem comprometer-se com nenhum bomb site específico.",
    howToApply: "Distribua os jogadores em um padrão como 1-3-1 ou 2-1-2. Segure os ângulos passivamente, espere os utilitários de contenção inimigos (como smokes e barreiras) expirarem e só então decida qual site atacar com base nas brechas identificadas.",
    proTip: "Fazer 'Default' é a melhor solução contra defensores que jogam avançando agressivamente para conseguir abates fáceis."
  },
  {
    id: "clutch-mindset",
    title: "Clutch Isolation",
    alias: "Isolamento em Desvantagem",
    category: "gameSense",
    categoryLabel: "Táticas & Mindset",
    difficulty: "Avançado",
    description: "Abordagem mental e tática quando você é o último sobrevivente contra múltiplos inimigos. Em vez de lutar contra todos de uma vez, o objetivo é isolar cada confronto em duelos individuais de 1v1 usando cobertura e movimentação inteligente.",
    howToApply: "Não se desespere. Use passos falsos ou silêncio total para confundir a localização dos adversários. Faça o plant/defuse de forma a forçá-los a vir até você individualmente e use utilitárias para bloquear linhas de visão indesejadas.",
    proTip: "Inimigos em vantagem numérica tendem a ficar gananciosos e buscar o abate correndo individualmente. Use essa impaciência a seu favor."
  },
  {
    id: "lurk",
    title: "Lurking",
    alias: "Jogo Furtivo",
    category: "posicionamento",
    categoryLabel: "Posicionamento",
    difficulty: "Avançado",
    description: "Jogar longe do foco principal da sua equipe para coletar informações na retaguarda inimiga, cortar as rotas de rotação dos defensores ou pegar inimigos flanqueando desprevenidos.",
    howToApply: "Enquanto sua equipe faz barulho ou executa uma entrada em um bomb site, esgueire-se silenciosamente pelo lado oposto ou pelo meio. Escute os passos das rotações rápidas e elimine os inimigos que estão correndo de costas.",
    proTip: "Um bom lurker não é aquele que se esconde o round inteiro, mas sim o que sabe exatamente quando agir para quebrar a defesa por trás."
  },
  {
    id: "off-angle",
    title: "Off-Angle",
    alias: "Ângulo Incomum",
    category: "posicionamento",
    categoryLabel: "Posicionamento",
    difficulty: "Intermediário",
    description: "Posicionar-se em um local onde o inimigo não espera que você esteja ao abrir a mira (pré-aim). Ao contrário dos ângulos comuns de cobertura (onde os inimigos já abrem atirando), o off-angle pega o oponente de surpresa no meio do movimento.",
    howToApply: "Fique de pé em espaços abertos ou locais planos, ligeiramente afastado das paredes habituais de pixel. Garanta que você consiga pelo menos um abate antes de recuar para uma posição segura de cobertura.",
    proTip: "Excelente para agentes de mobilidade como Jett (com dash) ou Chamber (com teletransporte), que conseguem atirar de locais expostos e escapar instantaneamente."
  },
  {
    id: "one-way-smoke",
    title: "One-Way Smokes",
    alias: "Smokes de Sentido Único",
    category: "utilitarias",
    categoryLabel: "Utilidades",
    difficulty: "Intermediário",
    description: "Smokes posicionadas em superfícies elevadas (como caixas ou quinas) que cobrem a linha de visão do inimigo ao nível dos olhos dele, mas deixam os pés dele visíveis para você de longe, permitindo abates sem que ele consiga te ver.",
    howToApply: "Coloque a fumaça de forma que ela fique travada em uma quina de parede ou caixa alta. Afaste-se do pixel e olhe por baixo da fumaça para observar as pernas do inimigo avançando.",
    proTip: "Use de forma consistente em gargalos de entrada (choke points) como a Main da Ascent ou a B do Bind com controladores como Omen ou Cypher."
  },
  {
    id: "economy-buy",
    title: "Thrifty & Eco Management",
    alias: "Gestão Econômica",
    category: "economia",
    categoryLabel: "Gestão de Economia",
    difficulty: "Iniciante",
    description: "O controle rigoroso dos créditos da equipe. Dividido em: Full Buy (compra completa de rifles/escudo/utilitárias), Force Buy (comprar tudo o que puder mesmo sem dinheiro suficiente para rifles), Semi-Buy (compra parcial mantendo dinheiro para o próximo round) e Eco (gastar quase nada para economizar).",
    howToApply: "Abra o menu de compras (B) e observe o campo 'Compra Mínima Próx. Round'. Esse valor deve ser mantido acima de 3900 créditos para garantir que você compre Vandal/Phantom + Escudo Pesado no round seguinte.",
    proTip: "Nunca compre individualmente se sua equipe estiver fazendo Eco. Economizar juntos garante rounds armados com chance real de vitória."
  }
];

export default function TacticalLibrary() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedItem, setSelectedItem] = useState<LibraryItem | null>(null);

  const filteredItems = useMemo(() => {
    return libraryData.filter(item => {
      const matchesSearch = 
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.alias.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  const categoryIcons: Record<string, any> = {
    all: Layers,
    mira: Crosshair,
    posicionamento: Shield,
    economia: Zap,
    utilitarias: TrendingUp,
    gameSense: Brain
  };

  const getDifficultyStyles = (diff: string) => {
    if (diff === 'Iniciante') return 'bg-[#00ffaa]/10 text-[#00ffaa] border-[#00ffaa]/20';
    if (diff === 'Intermediário') return 'bg-amber-400/10 text-amber-400 border-amber-400/20';
    return 'bg-brand-red/10 text-brand-red border-brand-red/20';
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-brand-gray/20 pb-6 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <BookOpen size={16} className="text-brand-red" />
            <span className="text-[10px] font-sans font-bold uppercase tracking-[0.3em] text-brand-red">Protocolo de Treinamento</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-heading uppercase tracking-widest text-brand-light">
            Biblioteca Tática do Sensei
          </h2>
          <p className="text-sm font-sans text-brand-gray mt-1 font-medium">
            Domine as terminologias, táticas e dinâmicas de jogo essenciais para subir de elo de forma inteligente.
          </p>
        </div>
      </div>

      {/* FILTER & SEARCH BAR */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-4 relative">
          <input
            type="text"
            placeholder="Buscar termo ou tática..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#11161d] border border-brand-gray/20 focus:border-brand-red text-brand-light placeholder:text-brand-gray/40 px-5 py-3 pl-12 font-sans font-medium focus:outline-none transition-colors"
            style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%)' }}
          />
          <Search className="absolute left-4 top-3.5 text-brand-gray/50" size={18} />
        </div>

        <div className="lg:col-span-8 flex flex-wrap gap-2">
          {[
            { id: "all", label: "Tudo" },
            { id: "mira", label: "Mira" },
            { id: "posicionamento", label: "Posicionamento" },
            { id: "economia", label: "Economia" },
            { id: "utilitarias", label: "Utilidades" },
            { id: "gameSense", label: "Táticas" },
          ].map((cat) => {
            const Icon = categoryIcons[cat.id];
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2 text-xs font-sans font-bold uppercase tracking-widest transition-all ${
                  isActive 
                    ? "bg-brand-red text-white" 
                    : "bg-[#11161d] text-brand-gray hover:text-brand-light border border-brand-gray/10 hover:border-brand-gray/30"
                }`}
                style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%)' }}
              >
                {Icon && <Icon size={12} />}
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* CONTENT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LIST COLUMN */}
        <div className="lg:col-span-5 space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
          {filteredItems.length === 0 ? (
            <div className="bg-[#11161d] border border-brand-gray/10 p-12 text-center">
              <HelpCircle className="text-brand-gray/30 mx-auto mb-4" size={48} />
              <div className="text-brand-gray font-heading text-xl uppercase tracking-widest">Nenhum termo encontrado</div>
              <p className="text-xs font-sans text-brand-gray/60 mt-1">Tente buscar por palavras chaves ou mude a categoria de filtros.</p>
            </div>
          ) : (
            filteredItems.map((item) => {
              const Icon = categoryIcons[item.category] || BookOpen;
              const isSelected = selectedItem?.id === item.id;
              return (
                <motion.div
                  key={item.id}
                  onClick={() => setSelectedItem(item)}
                  whileHover={{ x: 4 }}
                  className={`p-4 border transition-all cursor-pointer flex items-center justify-between ${
                    isSelected 
                      ? "bg-[#1a222d] border-brand-red/80 shadow-[0_0_15px_rgba(255,70,85,0.15)]" 
                      : "bg-[#0f141c] border-brand-gray/10 hover:border-brand-gray/30"
                  }`}
                  style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%)' }}
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-2.5 rounded-sm ${isSelected ? 'bg-brand-red/10 text-brand-red' : 'bg-brand-darker text-brand-gray'}`}>
                      <Icon size={18} />
                    </div>
                    <div>
                      <h4 className="font-heading text-lg tracking-wider text-brand-light leading-none mb-1">{item.title}</h4>
                      <p className="text-[10px] font-sans font-semibold text-brand-gray/70 uppercase tracking-widest">{item.alias}</p>
                    </div>
                  </div>
                  <ChevronRight size={16} className={`transition-transform ${isSelected ? 'text-brand-red translate-x-1' : 'text-brand-gray/30'}`} />
                </motion.div>
              );
            })
          )}
        </div>

        {/* DETAIL VIEW COLUMN */}
        <div className="lg:col-span-7">
          <AnimatePresence mode="wait">
            {selectedItem ? (
              <motion.div
                key={selectedItem.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-[#11161d] border border-brand-gray/15 relative flex flex-col overflow-hidden"
                style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%)' }}
              >
                {/* Accent line */}
                <div className="absolute top-0 left-0 w-full h-1 bg-brand-red" />
                
                {/* Header detail */}
                <div className="p-8 border-b border-brand-gray/15 bg-brand-dark/30 relative">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-brand-red/5 blur-[50px] pointer-events-none rounded-full" />
                  
                  <div className="flex flex-wrap justify-between items-start gap-4 mb-3 relative z-10">
                    <span className="text-[10px] font-sans font-bold uppercase tracking-[0.25em] text-brand-red bg-brand-red/10 border border-brand-red/20 px-3 py-1">
                      {selectedItem.categoryLabel}
                    </span>
                    <span className={`text-[10px] font-sans font-bold uppercase tracking-[0.15em] border px-3 py-1 ${getDifficultyStyles(selectedItem.difficulty)}`}>
                      Complexidade: {selectedItem.difficulty}
                    </span>
                  </div>

                  <h3 className="text-4xl font-heading uppercase tracking-widest text-brand-light mt-4 relative z-10">
                    {selectedItem.title}
                  </h3>
                  <div className="text-sm font-sans font-bold uppercase tracking-widest text-brand-gray/80 mt-1 relative z-10 flex items-center gap-2">
                    <Info size={14} className="text-brand-red/70" />
                    {selectedItem.alias}
                  </div>
                </div>

                {/* Content detail */}
                <div className="p-8 space-y-6">
                  {/* Definition */}
                  <div className="space-y-2">
                    <h5 className="text-[10px] font-sans font-bold uppercase tracking-widest text-brand-gray">Definição Operacional</h5>
                    <p className="text-sm font-sans text-brand-light/90 leading-relaxed font-medium">
                      {selectedItem.description}
                    </p>
                  </div>

                  {/* How to Apply */}
                  <div className="p-5 bg-brand-dark/40 border-l-2 border-brand-gray/20 space-y-2">
                    <h5 className="text-[10px] font-sans font-bold uppercase tracking-widest text-brand-light flex items-center gap-2">
                      <Target size={12} className="text-brand-red" />
                      Como Aplicar em Jogo
                    </h5>
                    <p className="text-xs font-sans text-brand-light/70 leading-relaxed">
                      {selectedItem.howToApply}
                    </p>
                  </div>

                  {/* Pro Tip */}
                  <div className="p-5 bg-brand-red/5 border-l-2 border-brand-red/50 space-y-2">
                    <h5 className="text-[10px] font-sans font-bold uppercase tracking-widest text-brand-red flex items-center gap-2">
                      <Award size={12} className="text-brand-red" />
                      Dica de Especialista (Pro Tip)
                    </h5>
                    <p className="text-xs font-sans text-brand-light/85 leading-relaxed font-medium italic">
                      "{selectedItem.proTip}"
                    </p>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-[#11161d]/50 border border-brand-gray/10 p-16 text-center flex flex-col items-center justify-center min-h-[450px]"
                style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%)' }}
              >
                <div className="w-16 h-16 bg-[#0f141c] border border-brand-gray/10 flex items-center justify-center rounded-sm text-brand-gray/30 mb-6 shadow-inner">
                  <BookOpen size={28} />
                </div>
                <h4 className="font-heading text-2xl uppercase tracking-widest text-brand-light">Selecione uma Tática</h4>
                <p className="text-xs font-sans text-brand-gray max-w-sm mt-2 leading-relaxed">
                  Clique em qualquer item da biblioteca ao lado para abrir o dossiê tático completo do Sensei sobre o fundamento selecionado.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
