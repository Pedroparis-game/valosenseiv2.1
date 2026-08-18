import React from 'react';
import { motion } from 'motion/react';
import CinematicLogo from './CinematicLogo';

export default function AnimatedLogo() {
  const text = "VALOSENSEI";
  const subtitle = "SUA EVOLUÇÃO TÁTICA COMEÇA AQUI";

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.8,
      },
    },
  };

  const letterVariants = {
    hidden: { 
      opacity: 0, 
      y: 40, 
      filter: 'blur(10px)',
      scale: 0.8
    },
    show: { 
      opacity: 1, 
      y: 0, 
      filter: 'blur(0px)',
      scale: 1,
      transition: { 
        type: 'spring', 
        stiffness: 200, 
        damping: 15 
      } as any
    },
  };

  return (
    <div className="flex flex-col items-center justify-center mb-16 relative z-10">
      
      <CinematicLogo />

      {/* HUD Glow atrás da logo */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="absolute top-3/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[400px] h-32 bg-accent-primary/20 blur-[80px] rounded-full pointer-events-none" 
      />

      <motion.h1
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="text-6xl md:text-8xl font-display font-bold tracking-[0.15em] text-transparent bg-clip-text bg-gradient-to-br from-text-main via-text-main to-accent-primary/50 drop-shadow-[0_0_15px_rgba(255,70,85,0.4)] relative flex overflow-visible"
      >
        {text.split("").map((char, index) => (
          <motion.span 
            key={index} 
            variants={letterVariants}
            className="inline-block"
            style={{ 
              textShadow: '0 0 20px rgba(255, 70, 85, 0.3)',
            }}
          >
            {char}
          </motion.span>
        ))}
      </motion.h1>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.8, duration: 0.8, ease: "easeOut" }}
        className="flex items-center gap-4 mt-6 w-full max-w-lg justify-center"
      >
        <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-accent-primary/50" />
        <p className="text-xs md:text-sm font-sans font-bold text-text-main/90 tracking-[0.4em] uppercase text-center drop-shadow-[0_0_10px_rgba(0,229,255,0.4)]">
          {subtitle}
        </p>
        <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-accent-primary/50" />
      </motion.div>
    </div>
  );
}
