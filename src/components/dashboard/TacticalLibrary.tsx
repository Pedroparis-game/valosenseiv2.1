import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, Crosshair, Map, ShieldAlert, Target, Info, BookOpen, ChevronRight, Award } from "lucide-react";

export interface LibraryItem {
  id: string;
  title: string;
  alias: string;
  category: string;
  categoryLabel: string;
  difficulty: string;
  description: string;
  howToApply: string;
  proTip: string;
}

const mockLibrary: LibraryItem[] = [
  {
    id: "1",
    title: "Sova Recon Reveal B",
    alias: "B MAIN RECON",
    category: "lineup",
    categoryLabel: "LINEUP",
    difficulty: "Básico",
    description: "Revela os inimigos pressionando a B Main.",
    howToApply: "Posicione-se no canto da parede, alinhe o HUD e atire com força 2.",
    proTip: "Use no início do round para quebrar a default inimiga."
  },
  {
    id: "2",
    title: "Cypher Tripwire Mid",
    alias: "MID CONTROL",
    category: "setup",
    categoryLabel: "SETUP",
    difficulty: "Avançado",
    description: "Fio armadilha indestrutível para coletar informação do Mid.",
    howToApply: "Coloque o fio cruzando o tubo principal de forma diagonal.",
    proTip: "Combine com a smoke (jaula) para pegar kills fáceis varando a parede."
  }
];

const categoryIcons: Record<string, any> = {
  lineup: Target,
  setup: ShieldAlert,
  execute: Crosshair,
  default: Map,
};

const getDifficultyStyles = (difficulty: string) => {
  switch (difficulty) {
    case 'Básico': return 'text-accent-cyan border-accent-cyan/30 bg-accent-cyan/10';
    case 'Intermediário': return 'text-amber-400 border-amber-400/30 bg-amber-400/10';
    case 'Avançado': return 'text-accent-crimson border-accent-crimson/30 bg-accent-crimson/10';
    default: return 'text-text-muted border-hud-border bg-hud-base';
  }
};

export default function TacticalLibrary() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<LibraryItem | null>(null);

  const categories = [
    { id: null, label: "Todos", icon: BookOpen },
    { id: "lineup", label: "Lineups", icon: Target },
    { id: "setup", label: "Setups", icon: ShieldAlert },
    { id: "execute", label: "Executes", icon: Crosshair },
  ];

  const filteredItems = useMemo(() => {
    return mockLibrary.filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            item.alias.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory ? item.category === selectedCategory : true;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  return (
    <div className="w-full">
      {/* TOOLBAR */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-text-muted">
            <Search size={18} />
          </div>
          <input
            type="text"
            className="valo-input pl-11"
            placeholder="Buscar termo técnico, pixel ou setup..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex overflow-x-auto custom-scrollbar gap-2 pb-2 md:pb-0 shrink-0">
          {categories.map(cat => {
            const Icon = cat.icon;
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id || 'all'}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-3 text-[10px] font-mono font-bold uppercase tracking-widest transition-all clip-chamfer-sm border ${
                  isActive 
                    ? "bg-accent-cyan text-hud-base border-accent-cyan" 
                    : "bg-hud-surface text-text-muted hover:text-text-main border-hud-border hover:border-text-muted"
                }`}
              >
                {Icon && <Icon size={14} />}
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
            <div className="tactical-card p-12 text-center flex flex-col items-center">
              <BookOpen className="text-text-muted/30 mb-4" size={48} />
              <div className="text-text-muted font-display text-xl uppercase tracking-widest">Nenhum termo encontrado</div>
              <p className="text-xs font-body text-text-muted/60 mt-1">Tente buscar por palavras chaves ou mude a categoria de filtros.</p>
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
                  className={`p-4 border transition-all cursor-pointer flex items-center justify-between clip-chamfer-sm ${
                    isSelected 
                      ? "bg-hud-surface-hover border-accent-cyan shadow-[0_0_15px_rgba(0,223,216,0.15)]" 
                      : "bg-hud-surface border-hud-border hover:border-hud-border/80"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-2.5 rounded-sm ${isSelected ? 'bg-accent-cyan/10 text-accent-cyan' : 'bg-hud-base text-text-muted'}`}>
                      <Icon size={18} />
                    </div>
                    <div>
                      <h4 className="font-display text-lg tracking-wider text-text-main leading-none mb-1">{item.title}</h4>
                      <p className="text-[10px] font-mono font-bold text-text-muted uppercase tracking-widest">{item.alias}</p>
                    </div>
                  </div>
                  <ChevronRight size={16} className={`transition-transform ${isSelected ? 'text-accent-cyan translate-x-1' : 'text-text-muted/30'}`} />
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
                className="tactical-card flex flex-col"
              >
                {/* Accent line */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent-cyan to-transparent opacity-80" />
                
                {/* Header detail */}
                <div className="p-8 border-b border-hud-border bg-hud-base relative overflow-hidden">
                  <div className="hud-grid-bg absolute inset-0 opacity-20 pointer-events-none" />
                  
                  <div className="flex flex-wrap justify-between items-start gap-4 mb-4 relative z-10">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-accent-cyan bg-accent-cyan/10 border border-accent-cyan/20 px-3 py-1">
                      {selectedItem.categoryLabel}
                    </span>
                    <span className={`text-[10px] font-mono font-bold uppercase tracking-[0.1em] border px-3 py-1 ${getDifficultyStyles(selectedItem.difficulty)}`}>
                      Complexidade: {selectedItem.difficulty}
                    </span>
                  </div>
                  <h3 className="text-4xl font-display uppercase tracking-widest text-text-main relative z-10">
                    {selectedItem.title}
                  </h3>
                  <div className="text-sm font-mono font-bold uppercase tracking-widest text-text-muted mt-2 relative z-10 flex items-center gap-2">
                    <Info size={14} className="text-accent-cyan/70" />
                    {selectedItem.alias}
                  </div>
                </div>

                {/* Content detail */}
                <div className="p-8 space-y-8 bg-hud-surface">
                  {/* Definition */}
                  <div className="space-y-3">
                    <h5 className="text-[10px] font-mono font-bold uppercase tracking-widest text-text-muted flex items-center gap-2">
                      <div className="w-1 h-1 bg-text-muted rounded-full" />
                      Definição Operacional
                    </h5>
                    <p className="text-sm font-body text-text-main/90 leading-relaxed">
                      {selectedItem.description}
                    </p>
                  </div>
                  
                  {/* How to Apply */}
                  <div className="p-5 bg-hud-base border-l-2 border-accent-cyan/50 space-y-3">
                    <h5 className="text-[10px] font-mono font-bold uppercase tracking-widest text-text-main flex items-center gap-2">
                      <Target size={14} className="text-accent-cyan" />
                      Como Aplicar em Jogo
                    </h5>
                    <p className="text-xs font-body text-text-main/70 leading-relaxed">
                      {selectedItem.howToApply}
                    </p>
                  </div>
                  
                  {/* Pro Tip */}
                  <div className="p-5 bg-accent-crimson/5 border-l-2 border-accent-crimson/50 space-y-3">
                    <h5 className="text-[10px] font-mono font-bold uppercase tracking-widest text-accent-crimson flex items-center gap-2">
                      <Award size={14} className="text-accent-crimson" />
                      Dica de Especialista (Pro Tip)
                    </h5>
                    <p className="text-xs font-body text-text-main/85 leading-relaxed font-medium italic">
                      "{selectedItem.proTip}"
                    </p>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="tactical-card p-16 text-center flex flex-col items-center justify-center min-h-[450px]"
              >
                <div className="w-16 h-16 bg-hud-base border border-hud-border flex items-center justify-center clip-chamfer-sm text-text-muted mb-6 shadow-inner">
                  <BookOpen size={28} />
                </div>
                <h4 className="font-display text-2xl uppercase tracking-widest text-text-main">Aguardando Seleção</h4>
                <p className="text-xs font-body text-text-muted max-w-sm mt-3 leading-relaxed">
                  Acesse o painel lateral para carregar a telemetria do fundamento tático desejado.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
