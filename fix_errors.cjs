const fs = require('fs');
let server = fs.readFileSync('server.ts', 'utf8');

server = server.replace(
  'console.error("Henrik API Error JSON:", JSON.stringify(errorData || error.message, null, 2));',
  'console.warn("Henrik API Auth/Error:", JSON.stringify(errorData || error.message));'
);

server = server.replace(
  'message = "Chave da API do Henrik inválida (Unauthorized). Verifique no Vercel se a secret HENRIK_API_KEY está correta e faça um novo Deploy.";',
  'message = "Sua Chave (HENRIK_API_KEY) expirou ou é inválida. Acesse https://api.henrikdev.xyz/dashboard para gerar uma nova chave gratuita e atualizar suas variáveis.";'
);

fs.writeFileSync('server.ts', server);
