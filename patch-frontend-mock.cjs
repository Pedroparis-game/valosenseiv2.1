const fs = require('fs');

const newCode = `import { PlayerStats, AnalysisResult } from "../types";

export const apiService = {
  async getPlayerStats(name: string, tag: string): Promise<PlayerStats> {
    console.log("USING FRONTEND MOCK FOR PRESENTATION");
    // Simulate slight network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return {
        name: name,
        tag: tag,
        rank: "Ascendant 1",
        overallHs: 28.5,
        overallWinRate: 66,
        overallKd: 1.35,
        rr: 55,
        rankImageUrl: "",
        recentMatches: [
          {
            id: "m1", map: "Ascent", agent: "Jett", score: "13-9", outcome: "Victory",
            kda: "22/15/4", kdRatio: 1.46, hsPercentage: 32, adr: 160,
            timestamp: new Date().toISOString(), kills: 22, deaths: 15
          },
          {
            id: "m2", map: "Split", agent: "Reyna", score: "11-13", outcome: "Defeat",
            kda: "18/19/2", kdRatio: 0.94, hsPercentage: 22, adr: 135,
            timestamp: new Date(Date.now() - 3600000).toISOString(), kills: 18, deaths: 19
          },
          {
            id: "m3", map: "Bind", agent: "Jett", score: "13-5", outcome: "Victory",
            kda: "25/9/3", kdRatio: 2.77, hsPercentage: 35, adr: 190,
            timestamp: new Date(Date.now() - 7200000).toISOString(), kills: 25, deaths: 9
          }
        ]
    } as PlayerStats;
  }
};

export const analysisService = {
  async analyzeMatch(playerData: PlayerStats): Promise<AnalysisResult> {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
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

    const analysisData: any = {
      id: crypto.randomUUID(),
      userId: "demo-user",
      riotId: \`\${playerData.name}#\${playerData.tag}\`,
      createdAt: new Date().toISOString(),
      overallScore: overall,
      tacticalBreakdown: {
         mira: { label: "Mira", value: miraScore, average: 50, description: "Precisão e controle consistentes." },
         gameSense: { label: "Noção de Jogo", value: gsScore, average: 50, description: "Leitura de mapa e decisões táticas." },
         economia: { label: "Economia", value: econScore, average: 50, description: "Gestão inteligente de créditos." },
         posicionamento: { label: "Posicionamento", value: posScore, average: 50, description: "Escolha de ângulos e movimentação." },
         utilitarias: { label: "Habilidades", value: utilScore, average: 50, description: "Uso eficaz do kit do agente." }
      },
      mapMastery: [
        { mapName: "Ascent", winRate: 65, bestAgent: "Omen", tendency: "Defensiva", recommendedAgents: ["Omen", "Jett"], metaContext: "Ótimo controle de mid." },
        { mapName: "Split", winRate: 50, bestAgent: "Raze", tendency: "Agressiva", recommendedAgents: ["Raze", "Cypher"], metaContext: "Domínio de espaços verticais." },
        { mapName: "Fracture", winRate: 50, bestAgent: "Raze", tendency: "Agressiva", recommendedAgents: ["Raze", "Cypher"], metaContext: "Domínio de espaços verticais." },
        { mapName: "Haven", winRate: 50, bestAgent: "Raze", tendency: "Agressiva", recommendedAgents: ["Raze", "Cypher"], metaContext: "Domínio de espaços verticais." },
        { mapName: "Lotus", winRate: 50, bestAgent: "Raze", tendency: "Agressiva", recommendedAgents: ["Raze", "Cypher"], metaContext: "Domínio de espaços verticais." },
        { mapName: "Pearl", winRate: 50, bestAgent: "Raze", tendency: "Agressiva", recommendedAgents: ["Raze", "Cypher"], metaContext: "Domínio de espaços verticais." },
        { mapName: "Breeze", winRate: 50, bestAgent: "Raze", tendency: "Agressiva", recommendedAgents: ["Raze", "Cypher"], metaContext: "Domínio de espaços verticais." }
      ],
      insights: [
        { category: "mira", title: "Mira Impecável", description: "Seu HS rate está acima da média do seu elo.", priority: "medium", actionableStep: "Continue o aquecimento atual." }
      ],
      coachVerdict: {
        summary: "Excelente desempenho geral com forte impacto nas vitórias.",
        strengths: ["Boa mira", "Game sense apurado"],
        weaknesses: ["Algumas mortes desnecessárias", "Uso de utilitárias pode melhorar"],
        recommendations: ["Jogue mais passivo na defesa", "Comunique-se mais"],
        stats: {
          headshotRate: hsRate + "%",
          kda: kd.toString(),
          winRate: winRate + "%",
          impactScore: "85/100",
          bestAgent: "Jett",
          bestMap: "Ascent"
        },
        conclusion: "Pronto para subir de elo!"
      }
    };

    analysisData.weaponStats = [
      { name: "Vandal", kills: 1240, hsPercentage: hsRate > 0 ? hsRate : 28, accuracy: 22 },
      { name: "Phantom", kills: 850, hsPercentage: hsRate > 0 ? Math.max(0, hsRate - 5) : 22, accuracy: 24 },
      { name: "Operator", kills: 320, hsPercentage: 15, accuracy: 55 },
      { name: "Spectre", kills: 410, hsPercentage: 18, accuracy: 19 }
    ];
    
    analysisData.dailyGoals = [
      { id: "1", title: "Aquecimento de Ouro", description: "Jogue 2 partidas de mata-mata apenas buscando tiros na cabeça.", completed: true, xpReward: 500 },
      { id: "2", title: "Paciência Virtuosa", description: "Sobreviva por mais de 1 minuto em 5 rounds jogando na defesa.", completed: false, xpReward: 1000 },
      { id: "3", title: "Economia Inteligente", description: "Faça um round econômico (eco) perfeito junto com a equipe.", completed: false, xpReward: 750 }
    ];
    
    return analysisData;
  }
};
`;

fs.writeFileSync('src/services/api.ts', newCode);
