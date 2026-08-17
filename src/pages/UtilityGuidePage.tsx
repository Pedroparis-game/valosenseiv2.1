import React, { useState } from 'react';
import { motion } from 'motion/react';
import UtilityMapPanel from '../components/dashboard/UtilityMapPanel';
import LineupCard from '../components/dashboard/LineupCard';
import Modal from '../components/ui/Modal';
import { Search, Filter } from 'lucide-react';

const mockLineups = [
  { id: '1', title: 'Smoke B Main', agent: 'Omen', map: 'Ascent', type: 'smoke', difficulty: 'easy', verified: true },
  { id: '2', title: 'Flash God A', agent: 'KAY/O', map: 'Ascent', type: 'flash', difficulty: 'hard', verified: true },
  { id: '3', title: 'Molotov Gerador', agent: 'Viper', map: 'Ascent', type: 'molotov', difficulty: 'medium', verified: false },
];

const mockMarkers = [
  { id: '1', from: { x: 20, y: 80 }, to: { x: 35, y: 40 }, type: 'smoke' },
  { id: '2', from: { x: 80, y: 85 }, to: { x: 70, y: 30 }, type: 'flash' },
];

export default function UtilityGuidePage() {
  const [view, setView] = useState<'cards' | 'map'>('map');
  const [selectedLineup, setSelectedLineup] = useState<string | null>(null);

  return (
    <div className="w-full flex flex-col gap-6 h-[calc(100vh-8rem)]">
      
      {/* Toolbar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-hud-surface border border-hud-border p-4 clip-chamfer-sm">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
            <input 
              type="text" 
              placeholder="Buscar lineups..." 
              className="valo-input !pl-10 !py-2 !text-sm"
            />
          </div>
          <button className="p-2 border border-hud-border text-text-muted hover:text-accent-primary hover:border-accent-primary transition-colors clip-chamfer-sm bg-hud-base">
            <Filter size={18} />
          </button>
        </div>

        <div className="flex bg-hud-base border border-hud-border clip-chamfer-sm p-1 w-full md:w-auto">
          <button 
            onClick={() => setView('cards')}
            className={`flex-1 md:w-24 py-1.5 text-xs font-mono font-bold uppercase tracking-widest clip-chamfer-sm transition-colors ${view === 'cards' ? 'bg-hud-surface text-accent-primary' : 'text-text-muted hover:text-text-main'}`}
          >
            Grid
          </button>
          <button 
            onClick={() => setView('map')}
            className={`flex-1 md:w-24 py-1.5 text-xs font-mono font-bold uppercase tracking-widest clip-chamfer-sm transition-colors ${view === 'map' ? 'bg-hud-surface text-accent-primary' : 'text-text-muted hover:text-text-main'}`}
          >
            Mapa
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <motion.div 
        key={view}
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="flex-grow min-h-0 relative"
      >
        {view === 'map' ? (
          <UtilityMapPanel 
            mapName="Ascent" 
            markers={mockMarkers} 
            onMarkerClick={setSelectedLineup} 
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 overflow-y-auto custom-scrollbar h-full pr-2 pb-6">
            {mockLineups.map(l => (
              <motion.div 
                key={l.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="h-72"
              >
                <LineupCard {...l} onClick={() => setSelectedLineup(l.id)} />
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Detail Modal */}
      <Modal 
        isOpen={!!selectedLineup} 
        onClose={() => setSelectedLineup(null)}
        title="Detalhes da Lineup"
      >
        <div className="space-y-4">
          <div className="aspect-video bg-hud-base border border-hud-border flex items-center justify-center relative overflow-hidden clip-chamfer-sm">
             <div className="absolute inset-0 opacity-20 bg-[url('https://media.valorant-api.com/maps/7eaecc1b-4337-bbf6-6ab9-04b8f06b3319/displayicon.png')] bg-cover bg-center" />
             <span className="font-mono text-text-muted uppercase tracking-widest relative z-10">Mídia / Vídeo Placeholder</span>
          </div>
          <p className="font-body text-sm text-text-main leading-relaxed">
            Alinhe sua mira com a quina da caixa principal. Avance um passo e atire com o botão esquerdo para cobrir a visão da rampa no site B.
          </p>
          <div className="flex justify-end pt-4 border-t border-hud-border">
            <button className="tactical-btn !text-sm !py-2" onClick={() => setSelectedLineup(null)}>
              Fechar
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
