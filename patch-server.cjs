const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

// Replace the entire player endpoint to always return mock data for presentation
const newPlayerEndpoint = `
  app.get("/api/player/:name/:tag", async (req, res) => {
    const { name, tag } = req.params;
    console.log("MOCKING REQUEST FOR PRESENTATION:", name, tag);
    return res.json({
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
    });
  });
`;

code = code.replace(/app\.get\("\/api\/player\/:name\/:tag", async \(req, res\) => \{[\s\S]*?\}\);/m, newPlayerEndpoint);

fs.writeFileSync('server.ts', code);
