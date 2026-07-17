const fs = require('fs');

let file = 'src/components/dashboard/PerformanceRadar.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  '<ResponsiveContainer width="100%" height="100%">',
  '<ResponsiveContainer width="100%" height="100%" minWidth={100} minHeight={100}>'
);

fs.writeFileSync(file, content);
