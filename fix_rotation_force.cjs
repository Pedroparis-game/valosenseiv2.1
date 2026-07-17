const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

content = content.replace(
  /O array 'mapMastery' DEVE TER EXATAMENTE OS 7 MAPAS DA ROTAÇÃO ATUAL: Ascent, Breeze, Fracture, Haven, Lotus, Pearl, Split\. NÃO ADICIONE OUTROS MAPAS\. NÃO OMITA NENHUM DESTES 7 MAPAS\. Recomende os melhores agentes \(recommendedAgents\) e o seu melhor agente \(bestAgent\) com base nas ESTATÍSTICAS GERAIS do jogador \(KDA, ADR, estilo de jogo\) e não apenas win rate\. Mesmo se os dados forem insuficientes, preencha os 7 mapas, coloque winRate: 0, mas sugira recommendedAgents e metaContext baseado no meta\./,
  `\nATENÇÃO MÁXIMA: O array 'mapMastery' DEVE CONTER ESTES E APENAS ESTES 7 MAPAS, SEM EXCEÇÃO:\n1. Ascent\n2. Breeze\n3. Fracture\n4. Haven\n5. Lotus\n6. Pearl\n7. Split\n\nNÃO RETORNE BIND, NÃO RETORNE SUNSET, NÃO RETORNE ABYSS, NÃO RETORNE ICEBOX. RETORNE EXATAMENTE OS 7 MAPAS LISTADOS ACIMA, INDEPENDENTE DA ROTAÇÃO OFICIAL.\nRecomende os melhores agentes (recommendedAgents) e o seu melhor agente (bestAgent) com base nas ESTATÍSTICAS GERAIS do jogador (KDA, ADR, estilo de jogo) e não apenas win rate. Mesmo se os dados forem insuficientes, preencha OS 7 MAPAS EXACTOS (Ascent, Breeze, Fracture, Haven, Lotus, Pearl, Split), coloque winRate: 0, mas sugira recommendedAgents e metaContext baseado no meta.`
);

fs.writeFileSync('server.ts', content);
