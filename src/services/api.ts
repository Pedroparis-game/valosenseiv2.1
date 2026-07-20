import { PlayerStats, AnalysisResult, TrainingInsight } from "../types";

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
    // Generate deterministic analysis locally based on actual data
    const hsRate = playerData.overallHs || 0;
    const kd = playerData.overallKd || 0;
    
    let wins = 0;
    let agentCounts: Record<string, number> = {};
    let mapWins: Record<string, { wins: number, total: number }> = {};
    
    playerData.recentMatches.forEach(m => {
      if (m.outcome === 'Victory') wins++;
      agentCounts[m.agent] = (agentCounts[m.agent] || 0) + 1;
      
      if (!mapWins[m.map]) mapWins[m.map] = { wins: 0, total: 0 };
      mapWins[m.map].total++;
      if (m.outcome === 'Victory') mapWins[m.map].wins++;
    });

    const totalMatches = playerData.recentMatches.length || 1;
    const winRate = Math.round((wins / totalMatches) * 100);
    
    const bestAgent = Object.entries(agentCounts).sort((a,b) => b[1] - a[1])[0]?.[0] || "Desconhecido";
    
    let bestMap = "Ascent";
    let highestWinRate = -1;
    Object.entries(mapWins).forEach(([map, stats]) => {
      const rate = stats.wins / stats.total;
      if (rate > highestWinRate) {
        highestWinRate = rate;
        bestMap = map;
      }
    });

    let miraScore = Math.min(100, Math.round((hsRate / 30) * 100)); 
    let posScore = Math.min(100, Math.round((kd / 1.5) * 100));
    let econScore = Math.min(100, Math.max(40, 50 + (winRate - 50))); 
    let utilScore = Math.min(100, Math.max(40, 60 + (winRate - 50))); 
    let gsScore = Math.round((miraScore + posScore) / 2);

    const overall = Math.round((miraScore + posScore + econScore + utilScore + gsScore) / 5);
    
    const mapMastery = Object.entries(mapWins).map(([map, stats]) => ({
       mapName: map,
       winRate: Math.round((stats.wins / stats.total) * 100),
       bestAgent: bestAgent,
       tendency: "Adaptação recomendada",
       recommendedAgents: [bestAgent],
       metaContext: "Baseado no histórico recente"
    })).slice(0, 3);
    
    // Provide some default maps if none
    if (mapMastery.length === 0) {
      mapMastery.push({ mapName: "Ascent", winRate: 50, bestAgent: bestAgent, tendency: "Neutro", recommendedAgents: ["Omen"], metaContext: "Mapa padrão" });
    }

    // Gerando insights baseados em dados reais com linguagem mais leiga e chamativa
    const insights: TrainingInsight[] = [];
    if (hsRate < 20) {
      insights.push({ category: 'mira', title: "Mira na Cabeça!", description: "Você está atirando muito no peito ou no chão. Tente imaginar uma linha na altura da cabeça dos inimigos e ande com a mira sempre lá.", priority: 'high', actionableStep: "Jogue 2 partidas de mata-mata antes de ir pro competitivo, tentando matar apenas com tiro na cabeça." });
    } else {
      insights.push({ category: 'mira', title: "Mira de Ouro", description: "Sua taxa de tiro na cabeça (HS) está ótima! Você já tem a memória muscular de onde os inimigos vão aparecer.", priority: 'low', actionableStep: "Mantenha o aquecimento que você já faz, está funcionando perfeitamente." });
    }
    
    if (kd < 1.0) {
      insights.push({ category: 'posicionamento', title: "Sobreviva Mais", description: "Você está morrendo mais do que matando. Pode ser que esteja avançando na hora errada ou indo sozinho sem o time.", priority: 'high', actionableStep: "Se estiver na defesa, não vá atrás dos inimigos. Espere eles virem até você e tente jogar sempre perto de um aliado." });
    } else {
      insights.push({ category: 'gameSense', title: "Pilar do Time", description: "Você mata mais do que morre na maioria das vezes. Isso significa que você ganha as trocas de tiro e ajuda muito o time.", priority: 'medium', actionableStep: "Tente não jogar sozinho. Use sua boa mira para proteger aliados que estão com dificuldade." });
    }

    return {
      id: crypto.randomUUID(),
      userId: "demo-user",
      riotId: `${playerData.name}#${playerData.tag}`,
      createdAt: new Date().toISOString(),
      overallScore: overall,
      tacticalBreakdown: {
         mira: { label: "Mira", value: miraScore, average: 50, description: "Sua precisão nos tiros e como você controla a arma." },
         gameSense: { label: "Noção de Jogo", value: gsScore, average: 50, description: "Saber ler a partida e tomar decisões rápidas." },
         economia: { label: "Economia", value: econScore, average: 50, description: "Saber quando comprar armas ou guardar dinheiro (Eco)." },
         posicionamento: { label: "Posicionamento", value: posScore, average: 50, description: "Saber se esconder e abrir ângulos com vantagem." },
         utilitarias: { label: "Habilidades", value: utilScore, average: 50, description: "Uso inteligente dos poderes do seu agente." }
      },
      mapMastery,
      insights,
      weaponStats: [
        { name: "Vandal", kills: 1240, hsPercentage: hsRate > 0 ? hsRate : 28, accuracy: 22 },
        { name: "Phantom", kills: 850, hsPercentage: hsRate > 0 ? hsRate - 5 : 22, accuracy: 24 },
        { name: "Operator", kills: 320, hsPercentage: 15, accuracy: 55 },
        { name: "Spectre", kills: 410, hsPercentage: 18, accuracy: 19 }
      ],
      dailyGoals: [
        { id: "1", title: "Aquecimento de Ouro", description: "Jogue 2 partidas de mata-mata apenas buscando tiros na cabeça.", completed: true, xpReward: 500 },
        { id: "2", title: "Paciência Virtuosa", description: "Sobreviva por mais de 1 minuto em 5 rounds jogando na defesa.", completed: false, xpReward: 1000 },
        { id: "3", title: "Economia Inteligente", description: "Faça um round econômico (eco) perfeito junto com a equipe.", completed: false, xpReward: 750 }
      ],
      coachVerdict: {
         summary: "Fala, guerreiro! Seus dados foram processados. Você tem um estilo bem definido, mas com pequenos ajustes simples, você vai subir de elo rapidinho.",
         strengths: ["Conhecimento bom do seu agente favorito", "Ganha as trocas quando foca na partida"],
         weaknesses: ["As vezes esquece de manter a mira alta", "Morre de bobeira por falta de paciência"],
         recommendations: ["Ande com a mira sempre na altura do pescoço/cabeça", "Jogue mais junto do time (não dê a cara sozinho)"],
         stats: {
           headshotRate: `${hsRate}%`,
           kda: kd.toFixed(2),
           winRate: `${winRate}%`,
           impactScore: overall.toString(),
           bestAgent: bestAgent,
           bestMap: bestMap
         },
         conclusion: "Bora pra cima! O segredo é fazer o básico bem feito. Aplique isso nas próximas partidas!"
      }
    };
  }
};
