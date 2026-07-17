const fs = require('fs');
let content = fs.readFileSync('src/components/dashboard/Insights.tsx', 'utf8');
content = content.replace("insight.category === 'gameSense'", "insight.category === 'posicionamento'");
fs.writeFileSync('src/components/dashboard/Insights.tsx', content);
