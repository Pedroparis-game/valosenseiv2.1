const fs = require('fs');
let content = fs.readFileSync('src/components/dashboard/StatsOverview.tsx', 'utf8');

content = content.replace(
  /className="valo-card flex flex-col sm:flex-row items-center gap-8 p-10 h-full group"/,
  'className="valo-card flex flex-col sm:flex-row items-center gap-8 p-10 h-full group relative overflow-hidden transition-all duration-500 hover:border-brand-red/50 hover:shadow-[0_0_30px_rgba(255,70,85,0.15)]"'
);

// Add a glowing sweep effect to the first card
content = content.replace(
  /<\/div>(\s*<div className="flex-grow text-center sm:text-left">)/,
  `</div>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-brand-light/5 to-transparent -translate-x-[100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out pointer-events-none" />
$1`
);

content = content.replace(
  /className="valo-card grid grid-cols-3 gap-4 h-full p-10 divide-x divide-brand-gray\/20"/,
  'className="valo-card grid grid-cols-3 gap-4 h-full p-10 divide-x divide-brand-gray/20 transition-all duration-500 hover:border-brand-red/50 hover:shadow-[0_0_30px_rgba(255,70,85,0.15)]"'
);

fs.writeFileSync('src/components/dashboard/StatsOverview.tsx', content);
