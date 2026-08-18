import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import LandingBackground from "./landing/LandingBackground";
import AnimatedLogo from "./landing/AnimatedLogo";
import RiotIdForm from "./landing/RiotIdForm";

interface LandingPageProps {
  riotId: string;
  setRiotId: (val: string) => void;
  handleSearch: (e: React.FormEvent) => void;
  loading: boolean;
  error?: string;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  riotId,
  setRiotId,
  handleSearch,
  loading,
  error
}) => {
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(e);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, filter: 'blur(10px)', scale: 1.05 }}
      transition={{ duration: 0.5 }}
      className="relative min-h-[calc(100vh-120px)] flex flex-col justify-center overflow-hidden -mt-10"
    >
      <LandingBackground />

      <div className="relative z-10 max-w-4xl mx-auto px-6 w-full flex flex-col items-center justify-center pt-10 pb-12">
        <AnimatedLogo />
        
        <RiotIdForm 
          riotId={riotId}
          setRiotId={setRiotId}
          onSubmit={onSubmit}
          isSubmitting={loading}
        />

        <AnimatePresence>
          {error && !loading && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="mt-8 bg-hud-surface/90 backdrop-blur-md text-accent-primary p-4 border-l-4 border-accent-primary font-sans font-bold uppercase shadow-[0_0_20px_rgba(255,70,85,0.2)] max-w-md w-full mx-auto"
              role="alert"
            >
              <span className="text-[10px] tracking-widest opacity-80 block mb-1">ERRO NO SISTEMA</span>
              <p className="text-sm">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </motion.div>
  );
};
