import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'motion/react';

interface VictoryCelebrationProps {
  show: boolean;
  type?: 'victory' | 'rank_up' | 'high_kda';
  onComplete?: () => void;
}

export const VictoryCelebration: React.FC<VictoryCelebrationProps> = ({ 
  show, 
  type = 'victory',
  onComplete 
}) => {
  useEffect(() => {
    if (show) {
      const duration = 3000;
      const end = Date.now() + duration;

      const colors = ['#FF4655', '#39FF88', '#00E5FF'];

      (function frame() {
        confetti({
          particleCount: 5,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: colors
        });
        confetti({
          particleCount: 5,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: colors
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        } else if (onComplete) {
          onComplete();
        }
      }());
    }
  }, [show, onComplete]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center"
        >
          <motion.div 
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 1.1, opacity: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="text-8xl font-display uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-accent-success via-accent-secondary to-accent-primary drop-shadow-[0_0_30px_rgba(57,255,136,0.6)]"
          >
            {type === 'victory' && "VITÓRIA"}
            {type === 'rank_up' && "PROMOÇÃO"}
            {type === 'high_kda' && "MVP"}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
