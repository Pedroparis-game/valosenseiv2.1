const fs = require('fs');

function updateFile(file) {
  let content = fs.readFileSync(file, 'utf8');
  
  content = content.replace(
    /overallWinRate:.*\n\s*recentMatches\n\s*\}\);/g,
    `overallWinRate: recentMatches.length > 0 ? Math.round((recentMatches.filter((m: any) => m.outcome === "Victory").length / recentMatches.length) * 100) : 0,
      overallKd: parseFloat((recentMatches.reduce((acc: number, m: any) => acc + (m.kdRatio || 0), 0) / (recentMatches.length || 1)).toFixed(2)) || 0,
      rr: 0,
      rankImageUrl: "",
      recentMatches
    });`
  );
  
  fs.writeFileSync(file, content);
}

updateFile('api/index.ts');
updateFile('server.ts');
