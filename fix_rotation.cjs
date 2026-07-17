const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

content = content.replace(
  /O array 'mapMastery' DEVE TER EXATAMENTE OS 7 MAPAS DA ROTAÇÃO ATUAL: Ascent, Bind, Haven, Lotus, Sunset, Abyss, Icebox\. NÃO ADICIONE OUTROS MAPAS\. NÃO OMITA NENHUM DESTES 7 MAPAS\. Se o jogador não jogou um mapa, coloque winRate: 0, bestAgent: "N\/A" e tendency: "N\/A", mas PREENCHA recommendedAgents e metaContext com o meta atual \(VLR\.gg\)\./,
  `O array 'mapMastery' DEVE TER EXATAMENTE OS 7 MAPAS DA ROTAÇÃO ATUAL: Ascent, Breeze, Fracture, Haven, Lotus, Pearl, Split. NÃO ADICIONE OUTROS MAPAS. NÃO OMITA NENHUM DESTES 7 MAPAS. Recomende os melhores agentes (recommendedAgents) e o seu melhor agente (bestAgent) com base nas ESTATÍSTICAS GERAIS do jogador (KDA, ADR, estilo de jogo) e não apenas win rate. Mesmo se os dados forem insuficientes, preencha os 7 mapas, coloque winRate: 0, mas sugira recommendedAgents e metaContext baseado no meta.`
);

fs.writeFileSync('server.ts', content);
