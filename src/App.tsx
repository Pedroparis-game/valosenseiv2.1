/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, type FormEvent, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Loader2, Target } from "lucide-react";
import { AnalysisResult, PlayerStats } from "./types";
import { apiService, analysisService } from "./services/api";
import { LandingPage } from "./components/LandingPage";
import { DashboardView } from "./components/DashboardView";

export default function App() {
  const [riotId, setRiotId] = useState("");
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<PlayerStats | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState("");

  const handleSearch = useCallback(async (e?: FormEvent, isRefresh = false) => {
    if (e) e.preventDefault();
    
    const formattedId = riotId.trim();
    if (!formattedId.includes("#")) {
      setError("Assinatura inválida. Use Nome#Tag.");
      return;
    }

    setLoading(true);
    setError("");
    
    if (!isRefresh) {
      setStats(null);
      setAnalysis(null);
    }

    try {
      const [name, tag] = formattedId.split("#");
      const playerStats = await apiService.getPlayerStats(name, tag);
      setStats(playerStats);
      
      const latestMatchId = playerStats.recentMatches?.[0]?.id || 'nomatch';
      const cacheKey = `analysis_v3.0_${name.toLowerCase()}_${tag.toLowerCase()}_${latestMatchId}`;
      
      if (!isRefresh) {
        const savedAnalysis = localStorage.getItem(cacheKey);
        if (savedAnalysis) {
          setAnalysis(JSON.parse(savedAnalysis));
          setLoading(false);
          return;
        }
      }

      const analysisData = await analysisService.analyzeMatch(playerStats);
      setAnalysis(analysisData);
      localStorage.setItem(cacheKey, JSON.stringify(analysisData));
    } catch (err: any) {
      console.warn("Search Error:", err.message);
      setError(err.message || "Falha na sincronização dos sistemas");
      setStats(null);
    } finally {
      setLoading(false);
    }
  }, [riotId]);

  return (
    <div className="min-h-screen relative overflow-x-hidden selection:bg-accent-primary selection:text-white">
      <div className="bg-glow-blob" />
      <div className="bg-glow-blob-2" />
      
      <AnimatePresence mode="wait">
        {loading && (
          <motion.div 
            key="global-loader"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center backdrop-blur-xl bg-hud-base/90"
          >
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
              className="absolute w-[400px] h-[400px] border border-accent-primary/20 rounded-full"
            />
            <div className="relative">
              <motion.div 
                animate={{ 
                  scale: [1, 1.1, 1],
                  filter: ["brightness(1)", "brightness(1.8)", "brightness(1)"]
                }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                <Target size={120} className="text-accent-primary drop-shadow-[0_0_20px_rgba(255,70,85,0.4)]" />
              </motion.div>
            </div>
            <h3 className="mt-12 text-3xl font-display tracking-widest text-text-main">
              Sincronizando Protocolos...
            </h3>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="container mx-auto px-4 relative z-10 flex-1 flex flex-col justify-center min-h-screen">
        <AnimatePresence mode="wait">
          {!stats ? (
            <LandingPage 
              key="landing"
              riotId={riotId}
              setRiotId={setRiotId}
              handleSearch={handleSearch}
              loading={loading}
              error={error}
            />
          ) : (
            <DashboardView 
              key="dashboard"
              stats={stats}
              analysis={analysis}
              loading={loading}
              handleRefresh={() => handleSearch(undefined, true)}
              handleNewSearch={() => setStats(null)}
            />
          )}
        </AnimatePresence>
      </main>

      <footer className="absolute bottom-4 left-0 w-full text-center opacity-50">
        <p className="text-[10px] font-sans tracking-[0.3em] uppercase text-text-main">
          Designed for Radiance <span className="text-accent-primary mx-2">●</span> Defy the Limits
        </p>
      </footer>

    </div>
  );
}
