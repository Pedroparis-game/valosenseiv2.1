import React from 'react';
import { motion } from 'motion/react';

export default function CinematicLogo() {
  // Vamos criar 25 camadas da mesma imagem para dar "espessura" e volume 3D real
  const depthLayers = Array.from({ length: 25 });

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
                transform: `translateZ(${zOffset * 1.5}px)`,
                // Suavização do material: reduz o contraste duro da camada frontal e adiciona um blur sutil simulando o "subsurface glow" orgânico
                filter: i === 0 
                  ? 'drop-shadow(0 0 25px rgba(255,40,50,0.8)) brightness(1.05) contrast(0.9) saturate(1.1) drop-shadow(0 0 2px rgba(255,255,255,0.2))' 
                  : i === depthLayers.length - 1
                    ? 'brightness(0.2) drop-shadow(0px 0px 30px rgba(255,20,30,0.9))'
                    : 'brightness(0.15) contrast(1.5)', // Miolo ainda escuro mas com menos ruído
                // Para dar um aspecto menos "low-poly facetado", reduzimos a opacidade das bordas intermediárias
                opacity: (i > 0 && i < depthLayers.length - 1) ? 0.8 : 1,
                WebkitUserDrag: 'none'
              }}
              onError={(e) => {
                (e.target as HTMLImageElement).src = "https://via.placeholder.com/400x400/0a0f16/FF4655?text=Faça+Upload+da+Imagem";
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
                transform: `translateZ(${zOffset * 1.5}px)`,
                filter: i === 0 
                  ? 'brightness(1.05) contrast(0.9) saturate(1.1)' 
                  : 'brightness(0.15) contrast(1.5)',
                opacity: (i > 0 && i < depthLayers.length - 1) ? 0.8 : 1,
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
