import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, CheckCircle, Search, Target } from 'lucide-react';

import MagneticWrapper from '../ui/MagneticWrapper';

interface Props {
  riotId: string;
  setRiotId: (val: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
}

export default function RiotIdForm({ riotId, setRiotId, onSubmit, isSubmitting }: Props) {
  const [isFocused, setIsFocused] = useState(false);
  const [errorShake, setErrorShake] = useState(false);
  
  // Basic Valorant Riot ID RegEx: 3-16 chars # 3-5 alphanumeric chars
  const isValid = /^.{3,16}#[a-zA-Z0-9]{3,5}$/.test(riotId);
  const isTyping = riotId.length > 0;
  const showError = isTyping && !isValid && !isFocused; // Show error when blur and invalid

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) {
      setErrorShake(true);
      setTimeout(() => setErrorShake(false), 500); // reset shake
      return;
    }
    onSubmit(e);
  };

  return (
    <motion.form 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.4, duration: 0.6 }}
      onSubmit={handleSubmit}
      className="relative z-10 w-full max-w-md mx-auto flex flex-col gap-6"
    >
      <div className="relative group">
        {/* Glow de Foco */}
        <div 
          className={`absolute -inset-1 bg-gradient-to-r from-accent-primary to-[#00E5FF] rounded-sm blur opacity-0 transition-opacity duration-300 ${isFocused ? 'opacity-30' : ''} ${showError ? 'from-accent-primary to-accent-primary opacity-40' : ''}`} 
        />
        
        <motion.div
          animate={errorShake ? { x: [-10, 10, -10, 10, 0] } : {}}
          transition={{ duration: 0.4 }}
          className={`relative bg-hud-surface/90 border-2 backdrop-blur-md clip-chamfer transition-colors duration-300 flex items-center ${showError ? 'border-accent-primary' : isFocused ? 'border-[#00E5FF]/50' : 'border-hud-border/50'}`}
        >
          <div className="pl-4 pr-2 text-text-muted">
            <Shield size={20} className={showError ? 'text-accent-primary' : isValid ? 'text-[#39FF88]' : isFocused ? 'text-[#00E5FF]' : ''} />
          </div>
          
          <input
            type="text"
            className="w-full bg-transparent border-none text-xl md:text-2xl font-display tracking-wider text-text-main placeholder:text-text-muted/40 py-4 focus:ring-0 outline-none uppercase"
            placeholder="NOME#TAG"
            value={riotId}
            onChange={(e) => setRiotId(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            disabled={isSubmitting}
            aria-invalid={showError}
          />

          <AnimatePresence>
            {isValid && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                className="pr-4"
              >
                <CheckCircle size={20} className="text-[#39FF88] drop-shadow-[0_0_8px_rgba(57,255,136,0.8)]" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      <MagneticWrapper className="w-full">
        <button
          type="submit"
          disabled={isSubmitting || (isTyping && !isValid && !isFocused)}
          className="relative overflow-hidden w-full bg-hud-base border border-accent-primary/50 text-text-main font-display uppercase tracking-widest text-lg py-4 px-8 clip-chamfer group disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:shadow-[0_0_20px_rgba(255,70,85,0.4)] hover:border-accent-primary active:scale-[0.98]"
        >
          {/* Shine Sweep Effect */}
          <div className="absolute top-0 -inset-full h-full w-1/2 z-0 block transform -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:animate-shine" />
          
          {/* Red/Cyan subtle gradient bg */}
          <div className="absolute inset-0 bg-gradient-to-r from-accent-primary/20 to-[#00E5FF]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <span className="relative z-10 flex items-center justify-center gap-3">
            {isSubmitting ? (
              <>
                <Target size={24} className="animate-spin text-accent-primary" />
                <span>Escaneando Telemetria...</span>
              </>
            ) : (
              <>
                <Search size={24} className="text-accent-primary group-hover:rotate-12 transition-transform" />
                <span>Analisar Protocolos</span>
              </>
            )}
          </span>
        </button>
      </MagneticWrapper>

      <AnimatePresence>
        {showError && (
          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-accent-primary font-sans font-bold text-sm text-center bg-accent-primary/10 py-2 border border-accent-primary/30"
            role="alert"
          >
            FORMATO INVÁLIDO. USE NOME#TAG (EX: JETT#ASP)
          </motion.p>
        )}
      </AnimatePresence>
    </motion.form>
  );
}
