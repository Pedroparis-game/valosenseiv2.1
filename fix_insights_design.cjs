const fs = require('fs');
let content = fs.readFileSync('src/components/dashboard/Insights.tsx', 'utf8');

// Reduce gap between columns
content = content.replace(
  /<section className="grid grid-cols-1 lg:grid-cols-12 gap-10">/,
  '<section className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">'
);

// Tweak TacticalBreakdown container design to be more integrated
content = content.replace(
  /className="valo-card h-full"/,
  'className="valo-card h-full relative overflow-hidden bg-gradient-to-b from-brand-dark/95 to-brand-darker/95 border-t-4 border-t-brand-red shadow-[0_0_40px_rgba(255,70,85,0.05)]"'
);

// Add a glowing sweep effect to the radar card
content = content.replace(
  /className="valo-card relative"/,
  'className="valo-card relative overflow-hidden bg-brand-darker group hover:border-brand-red/40 transition-colors duration-500 shadow-[0_0_30px_rgba(0,0,0,0.5)]"'
);

content = content.replace(
  /<PerformanceRadar analysis=\{analysis\} \/>/,
  `<div className="absolute inset-0 bg-gradient-to-br from-brand-red/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />\n             <PerformanceRadar analysis={analysis} />`
);

// Fix "Classificação" Header
content = content.replace(
  /className="valo-card !p-6 flex items-center justify-between border-b-4 border-b-brand-red bg-gradient-to-br from-brand-dark\/90 to-brand-darker"/,
  'className="valo-card !p-6 flex items-center justify-between border-b-4 border-b-brand-red bg-[#11161d] shadow-lg relative overflow-hidden group"'
);

fs.writeFileSync('src/components/dashboard/Insights.tsx', content);
