const fs = require('fs');

function updateFile(file) {
  let content = fs.readFileSync(file, 'utf8');
  
  content = content.replace(
    /const ai = new GoogleGenAI\(\{ apiKey: process\.env\.GEMINI_API_KEY \}\);/g,
    `let geminiKey = process.env.GEMINI_API_KEY;
if (geminiKey) geminiKey = geminiKey.replace(/^["']|["']$/g, "").trim();
const ai = new GoogleGenAI({ apiKey: geminiKey });`
  );
  
  fs.writeFileSync(file, content);
}

updateFile('api/index.ts');
updateFile('server.ts');
