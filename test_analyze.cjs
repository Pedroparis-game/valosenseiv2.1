const fs = require('fs');
fetch('http://localhost:3000/api/analyze', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    playerData: {
      name: "Pedro",
      tag: "123",
      overallHs: 14,
      overallWinRate: 45,
      recentMatches: []
    }
  })
}).then(r => r.json()).then(data => console.log(JSON.stringify(data, null, 2))).catch(e => console.error(e));
