import express from "express";
import cors from "cors";
import axios from "axios";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

let geminiKey = process.env.GEMINI_API_KEY;
if (geminiKey) geminiKey = geminiKey.replace(/^["']|["']$/g, "").trim();
const ai = new GoogleGenAI({ apiKey: geminiKey });

app.get("/api/player/:name/:tag", async (req, res) => {
  const { name, tag } = req.params;
  let apiKey = process.env.HENRIK_API_KEY;
  if (apiKey) apiKey = apiKey.replace(/^["']|["']$/g, "").trim();

  if (!apiKey || apiKey === "" || apiKey === "undefined") {
    return res.status(400).json({ 
       error: "A Chave da API (HENRIK_API_KEY) ainda não foi carregada pelo Vercel. Você precisa fazer um REDEPLOY (Redeploy) no painel do Vercel para que as novas variáveis tenham efeito." 
     });
  }

  try {
    const accountRes = await axios.get(
      `https://api.henrikdev.xyz/valorant/v1/account/${encodeURIComponent(name)}/${encodeURIComponent(tag)}`,
      { headers: { "Authorization": apiKey } }
    );

    const { puuid, name: formalName, tag: formalTag, region } = accountRes.data.data;

    const matchRes = await axios.get(
      `https://api.henrikdev.xyz/valorant/v3/matches/${region}/${encodeURIComponent(name)}/${encodeURIComponent(tag)}?filter=competitive&size=3`,
      { headers: { "Authorization": apiKey } }
    );

    const matches = matchRes.data.data;

    const recentMatches = matches.map((match: any) => {
      const player = match.players.all_players.find((p: any) => p.puuid === puuid);
      const stats = player.stats;
      
      return {
        id: match.metadata.matchid,
        map: match.metadata.map,
        agent: player.character,
        score: `${match.teams.red.rounds_won}-${match.teams.blue.rounds_won}`,
        outcome: player.team.toLowerCase() === (match.teams.red.has_won ? "red" : "blue") ? "Victory" : "Defeat",
        kda: `${stats.kills}/${stats.deaths}/${stats.assists}`,
        kdRatio: stats.deaths > 0 ? stats.kills / stats.deaths : stats.kills,
        hsPercentage: Math.round((stats.headshots / (stats.headshots + stats.bodyshots + stats.legshots)) * 100),
        adr: Math.round(stats.damage / match.metadata.rounds_played),
        timestamp: new Date(match.metadata.game_start * 1000).toISOString()
      };
    });

    const avgHs = recentMatches.reduce((acc: number, m: any) => acc + m.hsPercentage, 0) / recentMatches.length;

    res.json({
      name: formalName || name,
      tag: formalTag || tag,
      rank: matches[0]?.players.all_players.find((p: any) => p.puuid === puuid)?.currenttier_patched || "Sem Rank",
      overallHs: parseFloat(avgHs.toFixed(1)) || 0,
      overallWinRate: recentMatches.length > 0 ? Math.round((recentMatches.filter((m: any) => m.outcome === "Victory").length / recentMatches.length) * 100) : 0,
      recentMatches
    });
  } catch (error: any) {
    const errorData = error.response?.data;
    console.error("Henrik API Error JSON:", JSON.stringify(errorData || error.message, null, 2));
    
    const status = error.response?.status || 500;
    let message = "Erro ao conectar com a API do Henrik.";
    
    if (status === 401 || status === 403) {
      message = "Chave da API do Henrik inválida (Unauthorized). Verifique no Vercel se a secret HENRIK_API_KEY está correta e faça um novo Deploy.";
    } else if (errorData?.errors && Array.isArray(errorData.errors) && errorData.errors.length > 0) {
      message = errorData.errors.map((e: any) => e.message || JSON.stringify(e)).join(" | ");
    } else if (errorData?.message) {
      message = errorData.message;
    }
    
    res.status(status).json({ error: `Henrik API: ${message}` });
  }
});

app.post("/api/chat", async (req, res) => {
  try {
    const { message, history } = req.body;
    const model = "gemini-2.5-flash";
    
    const systemInstruction = `Você é o "Sensei", um treinador de elite de Valorant focado em resultados imediatos.
Sua missão é dar conselhos táticos e mecânicos de forma EXTREMAMENTE OBJETIVA e CLARA.
Diretrizes:
1. Respostas curtas e diretas (máximo 3-4 frases ou uma lista de pontos).
2. Use terminologia técnica de Valorant corretamente.
3. Sem conversas fúteis: foque no que o jogador deve FAZER para ganhar a próxima partida.
4. Se o jogador divagar, traga-o de volta para o foco do treinamento.
5. Personalidade: Sério, pragmático e focado na disciplina.
Responda sempre em Português do Brasil.`;

    const chat = ai.chats.create({
      model: model,
      config: {
        systemInstruction,
      },
      history: history,
    });

    const result = await chat.sendMessage({ message });
    res.json({ text: result.text });
  } catch (error: any) {
    console.error("Chat API Error:", error);
    res.status(500).json({ error: error.message || "Erro no servidor de chat." });
  }
});

app.post("/api/analyze", async (req, res) => {
  try {
    const { playerData } = req.body;

    const prompt = `
      # INSTRUÇÃO DE SISTEMA (SYSTEM PROMPT) - VALOSENSEI
      ## 1. Seu Papel e Regra de Ouro
      Você é o ValoSensei, um analista de dados rigoroso e treinador de Valorant de nível Radiante e especialista em análise de desempenho.
      **REGRA DE OURO ESTRITA:** Você deve basear 100% da sua análise EXCLUSIVAMENTE nos dados em formato JSON fornecidos na entrada do usuário. É terminantemente proibido inventar, deduzir ou presumir qualquer estatística, partida, arma, mapa ou taxa de vitória que não esteja explicitamente declarada no texto do JSON.

      ## 2. Processamento dos Dados
      - Leia os números fornecidos (KDA, Headshot %, Win Rate, First Bloods, ACS, etc.) exatamente como eles aparecem.
      - Se uma informação não estiver presente no JSON, você NÃO DEVE adivinhar.
      - Não alucine eventos específicos da partida.

      ## 3. Diretrizes de Análise Tática
      - Toda afirmação que você fizer sobre o desempenho do jogador deve ter uma raiz direta nos números fornecidos.
      - **Exemplo de abordagem correta:** "Seu Headshot rate global está em 14% de acordo com os dados, o que está abaixo da média para o seu elo. Isso sugere que..."

      ## 4. Estrutura de Resposta (Mapeada para JSON)
      Apesar de seguir a lógica abaixo, você DEVE retornar o resultado no formato JSON especificado.
      1. **Os Dados Dizem:** Refletido no resumo factual e estatísticas.
      2. **Diagnóstico Tático:** Refletido no campo 'coachVerdict' e 'insights'.

      ## 5. Tratamento de Falhas e Dados Insuficientes
      Se o JSON recebido estiver vazio, apontar erros da API ou contiver apenas zeros, você deve preencher os campos do JSON com valores neutros e no 'coachVerdict' escrever exatamente:
      { "summary": "Os dados fornecidos estão incompletos, inacessíveis ou o perfil é privado. Verifique sua conexão com o Tracker.", "strengths": ["Sem dados"], "weaknesses": ["Sem dados"], "recommendations": ["Jogue mais partidas e verifique sua conta"], "stats": { "headshotRate": "0%", "kda": "0.0", "winRate": "0%", "impactScore": "0", "bestAgent": "-", "bestMap": "-" }, "conclusion": "Aguardando mais dados para análise." }

      DADOS DO JOGADOR:
      Riot ID: ${playerData.name}#${playerData.tag}
      Estatísticas das Partidas Recentes: ${JSON.stringify(playerData.recentMatches)}
      Média de Headshot: ${playerData.overallHs}%
      Média de WinRate: ${playerData.overallWinRate}%
      
      REGRAS DE NEGÓCIO DO APP:
      1. Analise KDA, ADR e HS% para determinar a qualidade da mira.
      2. Use o ADR (Average Damage per Round) para julgar o impacto real.
      3. O 'coachVerdict' deve ser um objeto estruturado (NÃO APENAS UMA STRING). Preencha-o com um 'summary' (resumo curto de 2-3 linhas), 'strengths' (até 3 bullets de uma linha), 'weaknesses' (até 3 bullets objetivos), 'recommendations' (até 3 dicas curtas < 15 palavras), e estatísticas chaves ('stats').
      4. Na seção 'mapMastery', preencha informações avançadas sobre quais agentes o jogador deve focar em cada mapa. Baseie-se no META ATUAL do Valorant (referências estatísticas como VLR.gg ou similar) para recomendar os 2 melhores agentes para o jogador em cada mapa e explique o porquê ("metaContext"). ATENÇÃO MÁXIMA: O array 'mapMastery' DEVE CONTER ESTES E APENAS ESTES 7 MAPAS, SEM EXCEÇÃO:
1. Ascent
2. Breeze
3. Fracture
4. Haven
5. Lotus
6. Pearl
7. Split
NÃO RETORNE BIND, NÃO RETORNE SUNSET, NÃO RETORNE ABYSS, NÃO RETORNE ICEBOX. RETORNE EXATAMENTE OS 7 MAPAS LISTADOS ACIMA, INDEPENDENTE DA ROTAÇÃO OFICIAL.
Recomende os melhores agentes (recommendedAgents) e o seu melhor agente (bestAgent) com base nas ESTATÍSTICAS GERAIS do jogador (KDA, ADR, estilo de jogo) e não apenas win rate. Mesmo se os dados forem insuficientes, preencha OS 7 MAPAS EXACTOS (Ascent, Breeze, Fracture, Haven, Lotus, Pearl, Split), coloque winRate: 0, mas sugira recommendedAgents e metaContext baseado no meta.
      5. RESPONDA APENAS UM JSON VÁLIDO.
      
      FORMATO ESPERADO:
      {
        "overallScore": number (0-100),
        "tacticalBreakdown": {
          "mira": { "label": "Mira", "value": 0-100, "average": 0-100, "description": "string" },
          "gameSense": { "label": "Game Sense", "value": 0-100, "average": 0-100, "description": "string" },
          "economia": { "label": "Economia", "value": 0-100, "average": 0-100, "description": "string" },
          "posicionamento": { "label": "Posicionamento", "value": 0-100, "average": 0-100, "description": "string" },
          "utilitarias": { "label": "Utilitárias", "value": 0-100, "average": 0-100, "description": "string" }
        },
        "mapMastery": [
          { "mapName": "string", "winRate": number, "bestAgent": "string", "tendency": "string", "recommendedAgents": ["string", "string"], "metaContext": "string" }
        ],
        "insights": [
           { "category": "mira" | "posicionamento" | "economia" | "utilitarias", "title": "string", "description": "string", "priority": "low" | "medium" | "high", "actionableStep": "string" }
        ],
        "coachVerdict": {
          "summary": "string (Resumo Geral em 2-3 linhas sobre o desempenho)",
          "strengths": ["string", "string", "string"], // max 3, curtos
          "weaknesses": ["string", "string", "string"], // max 3, diretos
          "recommendations": ["string", "string", "string"], // max 3, práticas, < 15 words
          "stats": {
            "headshotRate": "string (ex: 25%)",
            "kda": "string (ex: 1.2)",
            "winRate": "string (ex: 55%)",
            "impactScore": "string (ex: 85/100)",
            "bestAgent": "string",
            "bestMap": "string"
          },
          "conclusion": "string (Uma frase motivadora)"
        }
      }
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const responseText = response.text;
    if (!responseText) throw new Error("IA retornou resposta vazia");
    
    const analysis = JSON.parse(responseText);
    res.json(analysis);

  } catch (error: any) {
    console.error("Gemini Analysis Error:", error);
    res.status(500).json({ error: error.message || "Falha na análise da IA" });
  }
});

export default app;
