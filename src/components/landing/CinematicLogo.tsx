import React from 'react';
import { motion } from 'motion/react';

export default function CinematicLogo() {
  // Reduzido para 10 camadas para evitar sobrecarga de memória no navegador
  const depthLayers = Array.from({ length: 10 });

  return (
    <div className="relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center mb-8 mt-4 mx-auto" style={{ perspective: '1200px' }}>
      <motion.div
        className="relative z-10 w-full h-full flex items-center justify-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0, rotateY: [-35, 35, -35] }}
        transition={{ 
          opacity: { duration: 0.8 },
          y: { duration: 0.8 },
          rotateY: { duration: 8, repeat: Infinity, ease: "easeInOut" } 
        }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {depthLayers.map((_, i) => {
          // Centraliza o eixo de rotação no meio da espessura
          const zOffset = (depthLayers.length / 2) - i;
          
          return (
            <img 
              key={i}
              src="/logo_capav2.png" 
              alt="Avatar Samurai 3D" 
              className="absolute inset-0 w-[130%] h-[130%] max-w-none object-contain m-auto pointer-events-none"
              style={{
                transform: `translateZ(${zOffset * 2.5}px)`, // Aumentei o espaçamento para compensar menos camadas
                filter: i === 0 
                  ? 'drop-shadow(0 0 15px rgba(255,26,43,0.4))' 
                  : 'brightness(0.15)', 
                opacity: i === 0 ? 1 : 0.85,
                WebkitUserDrag: 'none'
              }}
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/logo.png"; // Fallback interno seguro
              }}
            />
          );
        })}
      </motion.div>

      {/* Mirrored floor reflection - refined for organic look */}
      <motion.div
        className="absolute -bottom-24 z-0 w-full h-full flex items-center justify-center opacity-40 pointer-events-none"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 0.4, y: 0, rotateY: [-35, 35, -35] }}
        transition={{ 
          opacity: { duration: 0.8 },
          y: { duration: 0.8 },
          rotateY: { duration: 8, repeat: Infinity, ease: "easeInOut" } 
        }}
        style={{ 
          transformStyle: 'preserve-3d',
          transformOrigin: 'center center',
          scaleY: -1, // Flips the object upside down perfectly
          maskImage: 'linear-gradient(to bottom, transparent 30%, rgba(0,0,0,0.8) 80%)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 30%, rgba(0,0,0,0.8) 80%)',
          filter: 'blur(2px)' // O reflexo no chão não deve ser um espelho perfeito, e sim polido/difuso
        }}
      >
        {depthLayers.map((_, i) => {
          const zOffset = (depthLayers.length / 2) - i;
          return (
            <img 
              key={`reflection-${i}`}
              src="/logo_capav2.png" 
              alt="" 
              className="absolute inset-0 w-[130%] h-[130%] max-w-none object-contain m-auto"
              style={{
                transform: `translateZ(${zOffset * 2.5}px)`,
                filter: i === 0 ? 'brightness(1)' : 'brightness(0.15)',
                opacity: i === 0 ? 1 : 0.85,
              }}
            />
          );
        })}
      </motion.div>
      
      {/* Luz ambiente orgânica (Ambient Occlusion & Glow) - Passando pelo fundo do modelo */}
      <motion.div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-[#ff1a2b] blur-[80px] rounded-full pointer-events-none opacity-20 -z-10 mix-blend-screen"
        animate={{ scale: [1, 1.05, 1], opacity: [0.15, 0.25, 0.15] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}
