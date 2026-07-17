const fs = require('fs');
let content = fs.readFileSync('api/index.ts', 'utf8');

// Remove GoogleGenAI import
content = content.replace(/import \{ GoogleGenAI \} from "@google\/genai";\n/g, "");

// Remove genai init
content = content.replace(/const ai = new GoogleGenAI\(\{ apiKey: process.env.GEMINI_API_KEY \}\);\n/g, "");

// Remove the /api/analyze route
const analyzeRegex = /app\.post\("\/api\/analyze", async \(req, res\) => \{[\s\S]*?\}\);\n/g;
content = content.replace(analyzeRegex, "");

fs.writeFileSync('api/index.ts', content);
