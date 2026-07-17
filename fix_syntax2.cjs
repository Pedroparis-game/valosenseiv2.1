const fs = require('fs');
let content = fs.readFileSync('src/components/dashboard/MapMastery.tsx', 'utf8');

// Just replace everything between {{ backgroundImage: and }}
content = content.replace(
  /style=\{\{ backgroundImage: [^}]* \}\}/,
  "style={{ backgroundImage: `url(${bgUrl})` }}"
);

fs.writeFileSync('src/components/dashboard/MapMastery.tsx', content);
