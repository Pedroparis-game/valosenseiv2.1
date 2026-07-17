const fs = require('fs');
let content = fs.readFileSync('src/components/LandingPage.tsx', 'utf8');
content = content.replace('A evolução do seu jogo guiada por IA', 'TRANSFORMANDO DADOS EM VITÓRIAS');
fs.writeFileSync('src/components/LandingPage.tsx', content);
