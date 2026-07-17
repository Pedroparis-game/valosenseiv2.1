const fs = require('fs');
let content = fs.readFileSync('src/components/dashboard/MapMastery.tsx', 'utf8');

// Replace the incorrect backslash version with correct backticks
content = content.replace("backgroundImage: \\`url(\\${bgUrl})\\`", "backgroundImage: `url(${bgUrl})`");
fs.writeFileSync('src/components/dashboard/MapMastery.tsx', content);
