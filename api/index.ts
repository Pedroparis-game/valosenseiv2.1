import express from "express";
import cors from "cors";
import axios from "axios";
import dotenv from "dotenv";

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
      rank: matches[0]?.players?.all_players?.find((p: any) => p.puuid === puuid)?.currenttier_patched || "Sem Rank",
      overallHs: parseFloat(avgHs.toFixed(1)) || 0,
      overallWinRate: recentMatches.length > 0 ? Math.round((recentMatches.filter((m: any) => m.outcome === "Victory").length / recentMatches.length) * 100) : 0,
      overallKd: parseFloat((recentMatches.reduce((acc: number, m: any) => acc + (m.kdRatio || 0), 0) / (recentMatches.length || 1)).toFixed(2)) || 0,
      rr: 0,
      rankImageUrl: "",
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
