const fs = require('fs');
let content = fs.readFileSync('vite.config.ts', 'utf8');
content = content.replace(/define:\s*\{\s*'process\.env\.GEMINI_API_KEY': JSON\.stringify\(env\.GEMINI_API_KEY\),\s*\},/g, '');
fs.writeFileSync('vite.config.ts', content);
