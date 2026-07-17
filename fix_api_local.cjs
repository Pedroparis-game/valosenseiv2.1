const fs = require('fs');
let content = fs.readFileSync('src/services/api.ts', 'utf8');

// Replace geminiService entirely
content = content.replace(
  /export const geminiService = \{[\s\S]*\}\};/,
  `export const analysisService = {
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

    // Gerando insights baseados em dados reais
    const insights: TrainingInsight[] = [];
    if (hsRate < 20) {
      insights.push({ category: 'mira', title: "Ajuste de Crosshair Placement", description: "Seu Headshot Rate está baixo. Mantenha a mira na altura da cabeça em todos os ângulos.", priority: 'high', actionableStep: "Aqueça 15 min de Deathmatch focando apenas em headshots." });
    } else {
      insights.push({ category: 'mira', title: "Mira Sólida", description: "Seu HS rate está excelente. Continue com a disciplina de mira atual.", priority: 'low', actionableStep: "Mantenha sua rotina de aquecimento atual." });
    }
    
    if (kd < 1.0) {
      insights.push({ category: 'posicionamento', title: "Sobrevivência", description: "Seu KD está negativo. Tente não ser o primeiro a morrer no round (First Death). Jogue mais recuado na defesa.", priority: 'high', actionableStep: "Na defesa, troque de posição após um abate." });
    } else {
      insights.push({ category: 'gameSense', title: "Impacto no Round", description: "Seu KD é positivo, o que mostra que você vence duelos de forma consistente. Procure ser ativo nas rotações.", priority: 'medium', actionableStep: "Assuma o papel de trade killer para o time." });
    }

    return {
      id: crypto.randomUUID(),
      userId: "demo-user",
      riotId: \`\${playerData.name}#\${playerData.tag}\`,
      createdAt: new Date().toISOString(),
      overallScore: overall,
      tacticalBreakdown: {
         mira: { label: "Mira", value: miraScore, average: 50, description: "Precisão de headshot e controle de recuo." },
         gameSense: { label: "Game Sense", value: gsScore, average: 50, description: "Leitura de jogo e rotações." },
         economia: { label: "Economia", value: econScore, average: 50, description: "Gestão de créditos e buys." },
         posicionamento: { label: "Posicionamento", value: posScore, average: 50, description: "Aproveitamento de ângulos e sobrevivência." },
         utilitarias: { label: "Utilitárias", value: utilScore, average: 50, description: "Uso eficaz de habilidades." }
      },
      mapMastery,
      insights,
      coachVerdict: {
         summary: "Análise processada. Seu perfil mostra tendências claras que podem ser otimizadas.",
         strengths: ["Conhecimento de agente"],
         weaknesses: ["Adaptação em mapas desfavoráveis"],
         recommendations: ["Treinar rotinas específicas", "Melhorar taxa de sobrevivência"],
         stats: {
           headshotRate: \`\${hsRate}%\`,
           kda: kd.toFixed(2),
           winRate: \`\${winRate}%\`,
           impactScore: overall.toString(),
           bestAgent: bestAgent,
           bestMap: bestMap
         },
         conclusion: "Aplique os insights táticos para alcançar a próxima patente."
      }
    };
  }
};`
);

fs.writeFileSync('src/services/api.ts', content);
