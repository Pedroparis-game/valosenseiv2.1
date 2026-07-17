const fs = require('fs');
let content = fs.readFileSync('src/components/dashboard/MapMastery.tsx', 'utf8');

content = content.replace(
  /className=\{\\`text-\[10px\] font-sans font-bold uppercase text-cyan-400 opacity-80 mb-1 tracking-widest \\\$\{m\.tendency \? 'pt-3 border-t border-brand-gray\/20 mt-3' : ''\}\\`\}/g,
  "className={`text-[10px] font-sans font-bold uppercase text-cyan-400 opacity-80 mb-1 tracking-widest ${m.tendency ? 'pt-3 border-t border-brand-gray/20 mt-3' : ''}`}"
);

fs.writeFileSync('src/components/dashboard/MapMastery.tsx', content);
