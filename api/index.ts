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
        timestamp: new Date(match.metadata.game_start * 1000).toISOString(),
        kills: stats.kills,
        deaths: stats.deaths
      };
    });

    // Calculate overall stats from these matches
    const avgHs = recentMatches.length > 0 ? recentMatches.reduce((acc: number, m: any) => acc + m.hsPercentage, 0) / recentMatches.length : 0;
    const totalKills = recentMatches.reduce((acc: number, m: any) => acc + m.kills, 0);
    const totalDeaths = recentMatches.reduce((acc: number, m: any) => acc + m.deaths, 0);
    const overallKd = totalDeaths > 0 ? totalKills / totalDeaths : totalKills;

    let mmrData = null;
    try {
      const mmrRes = await axios.get(
        `https://api.henrikdev.xyz/valorant/v1/mmr/${region}/${encodeURIComponent(name)}/${encodeURIComponent(tag)}`,
        { headers: { "Authorization": apiKey } }
      );
      mmrData = mmrRes.data.data;
    } catch (e) {
       console.warn("Could not fetch MMR data");
    }

    let rankImageUrl = "";
    try {
      const valApiRes = await axios.get("https://valorant-api.com/v1/competitivetiers");
      const tiers = valApiRes.data.data[valApiRes.data.data.length - 1].tiers;
      const currentRank = mmrData?.currenttierpatched || matches[0]?.players.all_players.find((p: any) => p.puuid === puuid)?.currenttier_patched;
      const tierData = tiers.find((t: any) => t.tierName.toLowerCase() === currentRank?.toLowerCase());
      if (tierData && tierData.largeIcon) {
        rankImageUrl = tierData.largeIcon;
      }
    } catch (e) {
      console.warn("Could not fetch tier image");
    }

    res.json({
      name: formalName || name,
      tag: formalTag || tag,
      rank: mmrData?.currenttierpatched || matches[0]?.players.all_players.find((p: any) => p.puuid === puuid)?.currenttier_patched || "Sem Rank",
      overallHs: parseFloat(avgHs.toFixed(1)) || 0,
      overallWinRate: recentMatches.length > 0 ? Math.round((recentMatches.filter((m: any) => m.outcome === "Victory").length / recentMatches.length) * 100) : 0,
      overallKd: parseFloat(overallKd.toFixed(2)) || 0,
      rr: mmrData?.ranking_in_tier || 0,
      rankImageUrl: rankImageUrl || "https://media.valorant-api.com/competitivetiers/03621f13-4c37-ad53-9043-695333d57551/0/largeicon.png",
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
    
    const systemInstruction = `Você é o "Sensei", um treinador de Valorant amigável e focado em dicas práticas.
Sua missão é dar conselhos táticos e mecânicos de forma CLARA, USANDO PALAVRAS SIMPLES que qualquer iniciante entenda.
Diretrizes:
1. Respostas curtas e diretas (máximo 3-4 frases).
2. Explique os termos técnicos de Valorant se precisar usá-los (ex: "Strafe, que é andar pros lados atirando").
3. Sem conversas fúteis: foque no que o jogador deve FAZER de prático.
4. Personalidade: Animado, encorajador e como um "irmão mais velho" que manja do jogo.
5. Use exemplos práticos ("Coloque a mira na altura da caixa", "Esconda atrás da parede e espere o barulho").
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

export default app;
