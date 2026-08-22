const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');
code = code.replace(
/      \/\/ Silenced mock data log\n      return res\.json\(\{[\s\S]*?\}\]\n      \}\);/m,
`      console.error("Henrik API Error:", message);
      return res.status(status).json({ error: message });`
);
fs.writeFileSync('server.ts', code);
