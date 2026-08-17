import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface Props {
  content: React.ReactNode;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

export default function Tooltip({ content, children, position = 'top' }: Props) {
  const [isVisible, setIsVisible] = useState(false);

  const getPositionStyles = () => {
    switch (position) {
      case 'top': return { bottom: '100%', left: '50%', transform: 'translateX(-50%)', marginBottom: '8px' };
      case 'bottom': return { top: '100%', left: '50%', transform: 'translateX(-50%)', marginTop: '8px' };
      case 'left': return { right: '100%', top: '50%', transform: 'translateY(-50%)', marginRight: '8px' };
      case 'right': return { left: '100%', top: '50%', transform: 'translateY(-50%)', marginLeft: '8px' };
    }
  };

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
    >
      {children}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            style={getPositionStyles()}
            className="absolute z-50 px-3 py-2 bg-hud-surface border border-hud-border text-xs font-mono text-text-main shadow-xl whitespace-nowrap clip-chamfer-sm pointer-events-none"
          >
            {content}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
