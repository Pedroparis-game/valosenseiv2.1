import React, { useEffect, useState } from "react";
import { motion } from "motion/react";

export const ThemeBackground = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: e.clientX,
        y: e.clientY,
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden bg-[#0a0f16]">
      {/* Dynamic Cursor Glow */}
      <motion.div 
        className="absolute w-[600px] h-[600px] bg-brand-red/10 rounded-full blur-[100px] mix-blend-screen"
        animate={{
          x: mousePos.x - 300,
          y: mousePos.y - 300,
        }}
        transition={{ type: "tween", ease: "circOut", duration: 0.8 }}
      />

      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0f16]/80 via-transparent to-[#0a0f16] z-10" />

      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-luminosity filter blur-[2px]"
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
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-brand-red/40 rounded-full blur-[1px]"
            style={{
              width: Math.random() * 4 + 1 + "px",
              height: Math.random() * 4 + 1 + "px",
              top: Math.random() * 100 + "%",
              left: Math.random() * 100 + "%",
            }}
            animate={{
              y: [0, Math.random() * -100 - 50],
              x: [0, (Math.random() - 0.5) * 50],
              opacity: [0, 0.8, 0],
            }}
            transition={{
              duration: Math.random() * 5 + 5,
              repeat: Infinity,
              ease: "linear",
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>

      {/* Large background text */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center overflow-hidden mix-blend-overlay opacity-[0.03] z-10">
        <h1 className="text-[25vw] font-heading font-bold text-white whitespace-nowrap tracking-tighter leading-none select-none">
          VALOSENSEI
        </h1>
      </div>
    </div>
  );
};
