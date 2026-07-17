const fs = require('fs');

function updateFile(file) {
  let content = fs.readFileSync(file, 'utf8');
  
  // Update apiKey reading to trim spaces and quotes
  content = content.replace(
    /const apiKey = process\.env\.HENRIK_API_KEY;/g,
    'let apiKey = process.env.HENRIK_API_KEY;\n  if (apiKey) apiKey = apiKey.replace(/^["\']|["\']$/g, "").trim();'
  );
  
  // Update error handling
  content = content.replace(
    /if \(errorData\?\.errors && Array\.isArray\(errorData\.errors\)/g,
    `if (status === 401 || status === 403) {
      message = "Chave da API do Henrik inválida (Unauthorized). Verifique no Vercel se a secret HENRIK_API_KEY está correta e faça um novo Deploy.";
    } else if (errorData?.errors && Array.isArray(errorData.errors)`
  );
  
  fs.writeFileSync(file, content);
}

updateFile('api/index.ts');
updateFile('server.ts');
