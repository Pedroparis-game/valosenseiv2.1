import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Crosshair, BarChart3, Map, User } from 'lucide-react';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Crosshair },
  { id: 'insights', label: 'Insights', icon: BarChart3 },
  { id: 'library', label: 'Guias & Utilidades', icon: Map },
  { id: 'profile', label: 'Perfil', icon: User },
];

export default function NavBar() {
  const [active, setActive] = useState('dashboard');

  return (
    <nav className="w-full border-b border-hud-border/50 bg-hud-base/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
        
        {/* Logo */}
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="w-8 h-8 bg-accent-primary clip-chamfer-sm flex items-center justify-center text-hud-base">
            <Crosshair size={18} strokeWidth={2.5} />
          </div>
          <span className="font-display text-2xl uppercase tracking-widest font-bold group-hover:text-accent-primary transition-colors">
            ValoSensei
          </span>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center h-full gap-2 relative">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = active === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => setActive(item.id)}
                className={`h-full px-4 flex items-center gap-2 relative font-mono text-xs font-bold uppercase tracking-widest transition-colors ${
                  isActive ? 'text-text-main' : 'text-text-muted hover:text-text-main'
                }`}
              >
                <Icon size={14} className={isActive ? 'text-accent-primary' : ''} />
                {item.label}
                
                {/* Active Indicator Line */}
                {isActive && (
                  <motion.div
                    layoutId="nav-active-indicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent-primary shadow-[0_-2px_10px_rgba(255,70,85,0.5)]"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Mobile menu button (placeholder) */}
        <button className="md:hidden text-text-muted hover:text-text-main">
          <div className="space-y-1.5">
            <span className="block w-6 h-0.5 bg-current"></span>
            <span className="block w-6 h-0.5 bg-current"></span>
            <span className="block w-4 h-0.5 bg-current"></span>
          </div>
        </button>
      </div>
    </nav>
  );
}
