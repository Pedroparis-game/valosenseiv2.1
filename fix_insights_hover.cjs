const fs = require('fs');
let content = fs.readFileSync('src/components/dashboard/Insights.tsx', 'utf8');

content = content.replace(
  /className="valo-card p-10 h-full flex flex-col justify-between"/,
  'className="valo-card p-10 h-full flex flex-col justify-between transition-all duration-500 hover:border-brand-red/50 hover:shadow-[0_0_30px_rgba(255,70,85,0.1)]"'
);

fs.writeFileSync('src/components/dashboard/Insights.tsx', content);
