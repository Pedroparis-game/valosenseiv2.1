const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

content = content.replace(
  /"coachVerdict": "string \(Os Dados Dizem \+ Diagnóstico Tático\)"/,
  `"coachVerdict": {
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
          }`
);

// Also we need to fix the instruction 3.
content = content.replace(
  /3\. O 'coachVerdict' deve conter o "Diagnóstico Tático" \(o que os números significam na prática\)\./,
  `3. O 'coachVerdict' deve ser um objeto estruturado (NÃO APENAS UMA STRING). Preencha-o com um 'summary' (resumo curto de 2-3 linhas), 'strengths' (até 3 bullets de uma linha), 'weaknesses' (até 3 bullets objetivos), 'recommendations' (até 3 dicas curtas < 15 palavras), e estatísticas chaves ('stats').`
);

// And update the fallback instruction for missing data
content = content.replace(
  /"Os dados fornecidos estão incompletos, inacessíveis ou o perfil é privado\. Verifique sua conexão com o Tracker para que eu possa gerar uma análise com dados verídicos\."/,
  `{ "summary": "Os dados fornecidos estão incompletos, inacessíveis ou o perfil é privado. Verifique sua conexão com o Tracker.", "strengths": ["Sem dados"], "weaknesses": ["Sem dados"], "recommendations": ["Jogue mais partidas e verifique sua conta"], "stats": { "headshotRate": "0%", "kda": "0.0", "winRate": "0%", "impactScore": "0", "bestAgent": "-", "bestMap": "-" }, "conclusion": "Aguardando mais dados para análise." }`
);

fs.writeFileSync('server.ts', content);
