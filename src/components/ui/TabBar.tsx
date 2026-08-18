import React from 'react';
import { motion } from 'motion/react';

interface TabBarProps {
  activeTab: string;
  setActiveTab: (tab: 'training' | 'library' | 'maps' | 'charts') => void;
  tabs: { id: 'training' | 'library' | 'maps' | 'charts'; label: string; icon: React.ReactNode }[];
}

export const TabBar: React.FC<TabBarProps> = ({ activeTab, setActiveTab, tabs }) => {
  return (
    <div className="flex flex-wrap gap-2 border-b border-hud-border pb-6 mb-8 relative">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`relative flex-1 md:flex-initial flex items-center justify-center gap-3 px-6 py-3 font-display text-lg uppercase tracking-widest border transition-all duration-300 clip-chamfer-sm overflow-hidden group ${
              isActive
                ? 'bg-accent-primary/10 text-accent-primary border-accent-primary shadow-[0_0_15px_rgba(255,70,85,0.15)]'
                : 'bg-hud-surface text-text-muted border-hud-border hover:text-text-main hover:border-text-muted hover:shadow-[0_0_10px_rgba(255,255,255,0.05)]'
            }`}
          >
            {/* Hover shine effect */}
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:animate-[shine_1s_ease-in-out]" />
            
            <span className={`transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
              {tab.icon}
            </span>
            <span>{tab.label}</span>
            
            {/* Active indicator line */}
            {isActive && (
              <motion.div
                layoutId="activeTabIndicator"
                className="absolute bottom-0 left-0 right-0 h-1 bg-accent-primary shadow-[0_0_10px_rgba(255,70,85,0.8)]"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
};
