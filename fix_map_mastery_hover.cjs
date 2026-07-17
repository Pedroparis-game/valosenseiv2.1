const fs = require('fs');
let content = fs.readFileSync('src/components/dashboard/MapMastery.tsx', 'utf8');

content = content.replace(
  /className="group flex flex-col h-full bg-\[#0d141e\] border-t-2 border-t-brand-red rounded-sm overflow-hidden"/g,
  'className="group flex flex-col h-full bg-[#0d141e] border-t-2 border-t-brand-red rounded-sm overflow-hidden transition-all duration-300 hover:shadow-[0_0_25px_rgba(255,70,85,0.15)]"'
);

fs.writeFileSync('src/components/dashboard/MapMastery.tsx', content);
