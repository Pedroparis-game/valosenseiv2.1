import React, { useMemo } from "react";
import { motion } from "motion/react";

export const ThemeBackground = () => {
  const particles = useMemo(() => {
    return [...Array(30)].map((_, i) => ({
      id: i,
      width: Math.random() * 5 + 1 + "px",
      height: Math.random() * 5 + 1 + "px",
      top: Math.random() * 100 + "%",
      left: Math.random() * 100 + "%",
      yTarget: Math.random() * -100 - 50,
      xTarget: (Math.random() - 0.5) * 50,
      duration: Math.random() * 5 + 5,
      delay: Math.random() * 5,
    }));
  }, []);

  return (
    <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden bg-[#0a0f16]">
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0f16]/60 via-transparent to-[#0a0f16]/90 z-10" />

      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-luminosity filter blur-[1px]"
        src="https://assets.contentstack.io/v3/assets/bltb6530b271fddd0b1/blt29d7c4f6bc077e9e/5eb26f54402b8b4d13a56656/agent-background-generic.mp4"
      />
      
      {/* Grid overlay */}
      <div 
        className="absolute inset-0 opacity-15 z-10"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(236,232,225,0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(236,232,225,0.05) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
      />
      
      {/* Animated Floating Particles */}
      <div className="absolute inset-0 z-10">
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute bg-brand-red/60 rounded-full blur-[1px] mix-blend-screen shadow-[0_0_10px_rgba(255,70,85,0.8)]"
            style={{
              width: p.width,
              height: p.height,
              top: p.top,
              left: p.left,
            }}
            animate={{
              y: [0, p.yTarget],
              x: [0, p.xTarget],
              opacity: [0, 0.8, 0],
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              ease: "linear",
              delay: p.delay,
            }}
          />
        ))}
      </div>

      {/* Large background text with subtle flowing illumination */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full flex items-center justify-center z-10 pointer-events-none">
        {/* Breathing Glow directly behind the text */}
        <motion.div 
          className="absolute w-[40vw] h-[15vw] bg-brand-red/10 blur-[120px] rounded-full mix-blend-screen" 
          animate={{ 
            opacity: [0.1, 0.4, 0.1],
            scale: [0.9, 1.1, 0.9]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="flex text-[14vw] md:text-[16vw] font-heading font-bold text-brand-red whitespace-nowrap tracking-tight leading-none select-none relative z-10">
          <motion.div
            animate={{ 
              opacity: [0.03, 0.15, 0.03],
              textShadow: [
                "0 0 0px rgba(255,70,85,0)", 
                "0 0 40px rgba(255,70,85,0.4)", 
                "0 0 0px rgba(255,70,85,0)"
              ]
            }}
            transition={{ 
              duration: 8, 
              repeat: Infinity, 
              ease: "easeInOut",
            }}
          >
            VALOSENSEI
          </motion.div>
        </div>
      </div>
    </div>
  );
};
