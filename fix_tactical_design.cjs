const fs = require('fs');
let content = fs.readFileSync('src/components/dashboard/TacticalBreakdown.tsx', 'utf8');

// Tweak the tactical breakdown card design
content = content.replace(
  /className="valo-card flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left !p-5 group relative gap-5"/,
  'className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left p-5 group relative gap-5 bg-brand-dark/40 border border-brand-gray/10 hover:border-brand-red/30 transition-all duration-300 hover:bg-brand-dark/80 rounded-sm"'
);

// Tweak icon wrapper
content = content.replace(
  /className="p-4 bg-brand-red\/10 group-hover:bg-brand-red\/20 border border-brand-red\/20 transition-colors shrink-0"/,
  'className="p-4 bg-brand-darker group-hover:bg-brand-red/10 border border-brand-gray/20 group-hover:border-brand-red/40 transition-colors shrink-0 rounded-sm shadow-inner"'
);

// Make progress bar look sharper
content = content.replace(
  /className="w-full bg-brand-darker h-2 overflow-hidden border border-brand-gray\/20 mb-3"/,
  'className="w-full bg-[#0a0f16] h-1.5 overflow-hidden border border-brand-gray/10 mb-3 rounded-sm relative shadow-inner"'
);

// Add a glowing trail to the progress bar
content = content.replace(
  /className="h-full bg-brand-red shadow-\[0_0_10px_rgba\(255,70,85,0\.5\)\]"/,
  'className="h-full bg-brand-red shadow-[0_0_15px_rgba(255,70,85,0.8)] relative"\n                  style={{ boxShadow: "0 0 20px rgba(255, 70, 85, 0.4), inset 0 0 5px rgba(255,255,255,0.5)" }}'
);

fs.writeFileSync('src/components/dashboard/TacticalBreakdown.tsx', content);
