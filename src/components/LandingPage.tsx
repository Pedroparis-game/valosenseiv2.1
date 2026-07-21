import React from "react";
import { motion } from "motion/react";
import { Search } from "lucide-react";

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
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-3xl mx-auto text-center py-12 md:py-20"
    >
      <div className="mb-10 inline-block w-full">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="flex flex-col items-center justify-center mb-16"
        >
          <div className="w-full max-w-[250px] md:max-w-[300px] flex items-center justify-center mb-8 relative">
            <div className="absolute inset-0 bg-brand-red/10 blur-[60px] rounded-full" />
            <img 
              src="/logo-sensei.svg?v=4" 
              alt="ValoSensei Logo" 
              className="w-full h-auto object-contain drop-shadow-[0_0_25px_rgba(255,70,85,0.6)] relative z-10" 
            />
          </div>
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="flex flex-col items-center gap-3 mt-4"
          >
            <div className="h-[1px] w-32 bg-gradient-to-r from-transparent via-brand-red/50 to-transparent mb-2" />
            <p className="text-sm md:text-base font-sans font-bold text-brand-light/80 tracking-[0.4em] uppercase text-center drop-shadow-[0_0_10px_rgba(255,255,255,0.2)] px-4">
              TRANSFORMANDO DADOS EM VITÓRIAS
            </p>
            <div className="h-[1px] w-32 bg-gradient-to-r from-transparent via-brand-red/50 to-transparent mt-2" />
          </motion.div>
        </motion.div>
      </div>

      <motion.form 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8 }}
        onSubmit={handleSearch} 
        className="relative mb-6 flex flex-col gap-6"
      >
        <div className="relative">
          <input
            type="text"
            className="valo-input text-xl text-center placeholder:text-brand-gray/50"
            placeholder="NOME#TAG (ex: Jett#ASP)"
            value={riotId}
            onChange={(e) => setRiotId(e.target.value)}
          />
        </div>
        <button 
          type="submit" 
          disabled={loading}
          className="valo-btn flex items-center justify-center gap-3 w-full group disabled:opacity-50"
        >
          <Search size={24} className="group-hover:rotate-12 transition-transform" />
          <span>{loading ? "Sincronizando..." : "Analisar Protocolos"}</span>
        </button>
      </motion.form>
    
      {error && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-brand-dark/80 backdrop-blur-md text-brand-red p-6 border-l-4 border-brand-red font-sans font-bold uppercase shadow-[0_0_20px_rgba(255,70,85,0.2)] mt-8 text-left"
        >
          <span className="text-sm tracking-widest opacity-80 block mb-1">ERRO NO SISTEMA</span>
          {error}
        </motion.div>
      )}
    </motion.div>
  );
};
