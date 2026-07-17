import { motion } from "motion/react";

export const ThemeBackground = () => {
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden bg-brand-darker">
      <div className="absolute inset-0 bg-brand-red/10 mix-blend-color-burn" />
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-screen"
        src="https://assets.contentstack.io/v3/assets/bltb6530b271fddd0b1/blt29d7c4f6bc077e9e/5eb26f54402b8b4d13a56656/agent-background-generic.mp4"
      />
      
      {/* Grid overlay */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(236,232,225,0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(236,232,225,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
      />
      
      {/* Large background text */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center overflow-hidden mix-blend-overlay opacity-10">
        <h1 className="text-[20vw] font-heading font-bold text-white whitespace-nowrap tracking-tighter leading-none select-none">
          VALOSENSEI
        </h1>
      </div>
    </div>
  );
};
