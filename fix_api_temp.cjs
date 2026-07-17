const fs = require('fs');
let content = fs.readFileSync('api/index.ts', 'utf8');

content = content.replace(
  /responseMimeType: "application\/json"/g,
  'responseMimeType: "application/json",\n        temperature: 0.1'
);

fs.writeFileSync('api/index.ts', content);
