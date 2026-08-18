import React from 'react';
import { motion, useReducedMotion } from 'motion/react';

export default function LandingBackground() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0 bg-[#06090e]">
      
      {/* Slow Breathing Ambient Glows */}
      {!shouldReduceMotion && (
        <>
          <motion.div
            className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full opacity-30 mix-blend-screen blur-[120px]"
            style={{ background: 'radial-gradient(circle, rgba(255, 70, 85, 0.4), transparent 70%)' }}
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.2, 0.4, 0.2] 
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full opacity-20 mix-blend-screen blur-[120px]"
            style={{ background: 'radial-gradient(circle, rgba(0, 229, 255, 0.3), transparent 70%)' }}
            animate={{ 
              scale: [1.2, 1, 1.2],
              opacity: [0.1, 0.3, 0.1] 
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          />
        </>
      )}

      {/* Fallback para prefers-reduced-motion */}
      {shouldReduceMotion && (
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,70,85,0.05)_0%,rgba(6,9,14,0)_60%)]" />
      )}

      {/* Grid abstrato estático de fundo para textura (Anti-gravity tech feel) */}
      <div 
        className="absolute inset-0 opacity-[0.03] mix-blend-overlay"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255, 255, 255, 1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 1) 1px, transparent 1px)
          `,
          backgroundSize: '4rem 4rem',
          transform: 'perspective(1000px) rotateX(60deg) translateY(-100px) translateZ(-200px)',
          transformOrigin: 'top center'
        }}
      />

      {/* Vinheta escura pesada nas bordas para focar o centro e esconder as bordas do grid */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,#06090e_80%)]" />
    </div>
  );
}
