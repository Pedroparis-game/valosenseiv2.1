const fs = require('fs');
let content = fs.readFileSync('api/index.ts', 'utf8');
content = content.replace(
  '  try {',
  `  if (!apiKey || apiKey === "" || apiKey === "undefined") {
    return res.status(400).json({ 
       error: "A Chave da API (HENRIK_API_KEY) ainda não foi carregada pelo Vercel. Você precisa fazer um REDEPLOY (Redeploy) no painel do Vercel para que as novas variáveis tenham efeito." 
     });
  }

  try {`
);
fs.writeFileSync('api/index.ts', content);

let serverContent = fs.readFileSync('server.ts', 'utf8');
serverContent = serverContent.replace(
  '    try {',
  `    if (!apiKey || apiKey === "" || apiKey === "undefined") {
      return res.status(400).json({ 
         error: "A Chave da API (HENRIK_API_KEY) ainda não foi carregada. Você precisa fazer um REDEPLOY no painel do Vercel." 
       });
    }

    try {`
);
fs.writeFileSync('server.ts', serverContent);
