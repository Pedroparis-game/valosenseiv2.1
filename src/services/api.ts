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

export const geminiService = {
  async analyzeMatch(playerData: PlayerStats): Promise<AnalysisResult> {
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playerData })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Falha na análise da IA");
      }

      const analysis = await response.json();
      return {
        ...analysis,
        id: crypto.randomUUID(),
        userId: "demo-user",
        riotId: `${playerData.name}#${playerData.tag}`,
        createdAt: new Date().toISOString()
      };
    } catch (error: any) {
      console.error("Gemini Analysis Error:", error);
      throw new Error(error.message || "Falha na análise da IA");
    }
  }
};
