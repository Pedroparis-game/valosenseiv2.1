import { PlayerStats, AnalysisResult } from "../types";

export const apiService = {
  async getPlayerStats(name: string, tag: string): Promise<PlayerStats> {
    try {
      const response = await fetch(`/api/player/${name.trim()}/${tag.trim()}`);
      
      if (!response.ok) {
        let serverError = "Falha na varredura tática. O perfil pode estar privado ou inacessível.";
        try {
          const errorData = await response.json();
          if (errorData && errorData.error) {
            serverError = errorData.error;
          }
        } catch (e) {
          // ignore json parse error
        }
        
        if (response.status === 404) {
          if (serverError.includes("Account not found")) {
            throw new Error("Agente não encontrado. Verifique se o Riot ID (Nome e Tag) está correto.");
          } else if (serverError.includes("Error while fetching needed match data")) {
            throw new Error("A API encontrou o perfil, mas não há dados de partidas recentes. Jogue algumas partidas e tente novamente.");
          }
          throw new Error("Agente não encontrado ou sem dados suficientes.\nDetalhes: " + serverError);
        } else if (response.status === 429) {
          throw new Error("Sistemas sobrecarregados (Rate Limit). Aguarde alguns instantes e tente novamente.");
        } else {
          throw new Error(serverError);
        }
      }
      return response.json();
    } catch (error: any) {
      throw new Error(error.message || "Erro desconhecido na rede neural");
    }
  }
};

export const analysisService = {
  async analyzeMatch(playerData: PlayerStats): Promise<AnalysisResult> {
    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ playerData })
      });
      
      if (!response.ok) {
        throw new Error("Falha na comunicação com o servidor neural (Gemini).");
      }
      
      const analysisData = await response.json();
      
      // Inject hardcoded elements that were previously generated locally
      // but preserve the AI-generated tactical insights and breakdown
      analysisData.id = crypto.randomUUID();
      analysisData.userId = "demo-user";
      analysisData.riotId = `${playerData.name}#${playerData.tag}`;
      analysisData.createdAt = new Date().toISOString();
      
      // Determine deterministic scores based on real data
      const hsRate = playerData.overallHs || 0;
      const kd = playerData.overallKd || 0;
      
      let wins = 0;
      let totalMatches = playerData.recentMatches.length || 1;
      playerData.recentMatches.forEach(m => {
        if (m.outcome === 'Victory') wins++;
      });
      const winRate = Math.round((wins / totalMatches) * 100);

      let miraScore = Math.min(100, Math.round((hsRate / 30) * 100)); 
      let posScore = Math.min(100, Math.round((kd / 1.5) * 100));
      let econScore = Math.min(100, Math.max(40, 50 + (winRate - 50))); 
      let utilScore = Math.min(100, Math.max(40, 60 + (winRate - 50))); 
      let gsScore = Math.round((miraScore + posScore) / 2);
      const overall = Math.round((miraScore + posScore + econScore + utilScore + gsScore) / 5);

      analysisData.overallScore = overall;
      analysisData.tacticalBreakdown = {
         mira: { label: "Mira", value: miraScore, average: 50, description: analysisData.tacticalBreakdown?.mira?.description || "Precisão e controle." },
         gameSense: { label: "Noção de Jogo", value: gsScore, average: 50, description: analysisData.tacticalBreakdown?.gameSense?.description || "Leitura e decisões." },
         economia: { label: "Economia", value: econScore, average: 50, description: analysisData.tacticalBreakdown?.economia?.description || "Gestão de créditos." },
         posicionamento: { label: "Posicionamento", value: posScore, average: 50, description: analysisData.tacticalBreakdown?.posicionamento?.description || "Escolha de ângulos." },
         utilitarias: { label: "Habilidades", value: utilScore, average: 50, description: analysisData.tacticalBreakdown?.utilitarias?.description || "Uso do agente." }
      };

      // We still want to add weapon stats and daily goals since the AI might not generate them
      // (The prompt in server.ts doesn't include weaponStats or dailyGoals in the schema)
      analysisData.weaponStats = [
        { name: "Vandal", kills: 1240, hsPercentage: playerData.overallHs > 0 ? playerData.overallHs : 28, accuracy: 22 },
        { name: "Phantom", kills: 850, hsPercentage: playerData.overallHs > 0 ? Math.max(0, playerData.overallHs - 5) : 22, accuracy: 24 },
        { name: "Operator", kills: 320, hsPercentage: 15, accuracy: 55 },
        { name: "Spectre", kills: 410, hsPercentage: 18, accuracy: 19 }
      ];
      
      analysisData.dailyGoals = [
        { id: "1", title: "Aquecimento de Ouro", description: "Jogue 2 partidas de mata-mata apenas buscando tiros na cabeça.", completed: true, xpReward: 500 },
        { id: "2", title: "Paciência Virtuosa", description: "Sobreviva por mais de 1 minuto em 5 rounds jogando na defesa.", completed: false, xpReward: 1000 },
        { id: "3", title: "Economia Inteligente", description: "Faça um round econômico (eco) perfeito junto com a equipe.", completed: false, xpReward: 750 }
      ];
      
      return analysisData;
    } catch (error: any) {
      throw new Error(error.message || "Erro na análise tática");
    }
  }
};
