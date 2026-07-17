const fs = require('fs');
let content = fs.readFileSync('src/components/dashboard/MapMastery.tsx', 'utf8');

content = content.replace(
  /backgroundImage: \\`url\(\\\$\{bgUrl\}\\)\\`/g,
  "backgroundImage: `url(${bgUrl})`"
);

fs.writeFileSync('src/components/dashboard/MapMastery.tsx', content);
