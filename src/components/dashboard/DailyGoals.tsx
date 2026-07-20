import React from 'react';
import { DailyGoal } from '../../types';
import { CheckCircle2, Circle, ListTodo } from 'lucide-react';
import { motion } from 'motion/react';

interface Props {
  goals: DailyGoal[];
}

export default function DailyGoals({ goals }: Props) {
  if (!goals || goals.length === 0) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      className="valo-card col-span-1 flex flex-col h-full"
    >
      <div className="flex items-center gap-3 mb-6">
         <div className="p-2 bg-brand-red/10 border border-brand-red/40 shadow-[0_0_15px_rgba(255,70,85,0.4)]">
           <ListTodo size={20} className="text-brand-red drop-shadow-[0_0_5px_rgba(255,70,85,0.8)]" />
         </div>
         <h3 className="text-2xl font-heading uppercase tracking-widest text-brand-light drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">Metas de Treino</h3>
      </div>

      <div className="flex flex-col gap-3 flex-grow">
        {goals.map((goal) => (
          <div key={goal.id} className={`flex items-start gap-4 p-4 border transition-all ${goal.completed ? 'bg-[#16c68a]/10 border-[#16c68a]/30' : 'bg-[#0a0f16]/60 border-brand-gray/10 hover:border-brand-red/30'}`}>
            <div className="mt-1 shrink-0">
              {goal.completed ? (
                <CheckCircle2 size={20} className="text-[#16c68a] drop-shadow-[0_0_5px_rgba(22,198,138,0.5)]" />
              ) : (
                <Circle size={20} className="text-brand-gray" />
              )}
            </div>
            <div>
              <h4 className={`font-heading uppercase tracking-wide text-lg mb-1 ${goal.completed ? 'text-[#16c68a]' : 'text-brand-light'}`}>{goal.title}</h4>
              <p className="text-sm font-sans text-brand-gray leading-relaxed">{goal.description}</p>
              <div className="mt-2 inline-block px-2 py-0.5 bg-brand-darker border border-brand-gray/20 text-xs font-bold text-brand-red tracking-widest uppercase">
                +{goal.xpReward} XP
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
