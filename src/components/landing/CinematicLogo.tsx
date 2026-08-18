import React from 'react';
import { motion } from 'motion/react';

export default function CinematicLogo() {
  return (
    <div className="relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center mb-8 mt-4 mx-auto">
      <motion.div
        className="relative z-10 w-full h-full rounded-full flex items-center justify-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <img 
          src="/imagen_capa.jpg" 
          alt="Avatar Samurai" 
          className="w-[130%] h-[130%] max-w-none object-contain relative z-10"
          style={{
            /* 
              Como a imagem é um JPG com fundo sólido, usamos uma combinação pesada de 
              filtros para escurecer o fundo cinza até virar preto, e o blend-mode 'screen' 
              para fazer o que é preto ficar transparente, deixando só o vermelho passar.
            */
            mixBlendMode: 'screen',
            filter: 'contrast(1.8) brightness(0.6) saturate(1.2)',
            maskImage: 'radial-gradient(circle at center, black 40%, transparent 65%)',
            WebkitMaskImage: 'radial-gradient(circle at center, black 40%, transparent 65%)'
          }}
          onError={(e) => {
            (e.target as HTMLImageElement).src = "https://via.placeholder.com/400x400/0a0f16/FF4655?text=Faça+Upload+da+Imagem";
          }}
        />
      </motion.div>
    </div>
  );
}
