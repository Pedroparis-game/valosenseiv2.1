import React from 'react';
import { WeaponStat } from '../../types';
import { Crosshair, Target, Zap } from 'lucide-react';
import { motion } from 'motion/react';

interface Props {
  weapons: WeaponStat[];
}

export default function WeaponStats({ weapons }: Props) {
  if (!weapons || weapons.length === 0) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="valo-card col-span-1 flex flex-col h-full"
    >
      <div className="flex items-center gap-3 mb-6">
         <div className="p-2 bg-brand-red/10 border border-brand-red/40 shadow-[0_0_15px_rgba(255,70,85,0.4)]">
           <Crosshair size={20} className="text-brand-red drop-shadow-[0_0_5px_rgba(255,70,85,0.8)]" />
         </div>
         <h3 className="text-2xl font-heading uppercase tracking-widest text-brand-light drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">Arsenal (Armas)</h3>
      </div>

      <div className="flex flex-col gap-4 flex-grow">
        {weapons.map((w, idx) => (
          <div key={idx} className="bg-[#0a0f16]/60 border border-brand-gray/10 p-4 hover:border-brand-red/30 transition-colors group">
            <div className="flex justify-between items-center mb-2">
              <span className="font-heading uppercase text-xl text-brand-light tracking-wide group-hover:text-brand-red transition-colors">{w.name}</span>
              <span className="text-sm font-sans font-bold text-brand-gray">{w.kills} abates</span>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-3">
              <div className="flex items-center gap-2">
                <Target size={14} className="text-brand-gray" />
                <div className="flex flex-col">
                  <span className="text-[10px] font-sans font-bold text-brand-gray uppercase tracking-wider">HS%</span>
                  <span className="font-heading text-brand-light text-lg">{w.hsPercentage}%</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Zap size={14} className="text-brand-gray" />
                <div className="flex flex-col">
                  <span className="text-[10px] font-sans font-bold text-brand-gray uppercase tracking-wider">Precisão</span>
                  <span className="font-heading text-brand-light text-lg">{w.accuracy}%</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
