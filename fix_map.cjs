const fs = require('fs');
let content = fs.readFileSync('src/components/dashboard/MapMastery.tsx', 'utf8');

content = content.replace(
  /<div className="flex justify-between items-center mb-6 border-b border-brand-gray\/20 pb-4">\s*<span className="text-\[10px\] font-sans font-bold uppercase text-brand-gray tracking-\[0\.2em\]">Win Rate<\/span>\s*<div className="text-3xl font-heading tracking-widest text-brand-light">\s*\{m\.winRate\}<span className="text-sm opacity-40 ml-1">%<\/span>\s*<\/div>\s*<\/div>/,
  `{m.winRate > 0 && (
              <div className="flex justify-between items-center mb-6 border-b border-brand-gray/20 pb-4">
                <span className="text-[10px] font-sans font-bold uppercase text-brand-gray tracking-[0.2em]">Win Rate</span>
                <div className="text-3xl font-heading tracking-widest text-brand-light">
                  {m.winRate}<span className="text-sm opacity-40 ml-1">%</span>
                </div>
              </div>
              )}`
);

content = content.replace(
  /<div>\s*<div className="text-\[10px\] font-sans font-bold uppercase text-brand-gray opacity-80 mb-2 tracking-widest">Melhor Agente<\/div>\s*<div className="bg-brand-red\/10 border border-brand-red\/30 text-brand-red p-3 font-heading uppercase text-center text-xl tracking-widest">\s*\{m\.bestAgent\}\s*<\/div>\s*<\/div>/,
  `{m.bestAgent && (
                <div>
                  <div className="text-[10px] font-sans font-bold uppercase text-brand-gray opacity-80 mb-2 tracking-widest">Melhor Agente</div>
                  <div className="bg-brand-red/10 border border-brand-red/30 text-brand-red p-3 font-heading uppercase text-center text-xl tracking-widest">
                    {m.bestAgent}
                  </div>
                </div>
                )}`
);

content = content.replace(
  /<div className="text-\[10px\] font-sans font-bold uppercase text-brand-gray opacity-80 mb-2 tracking-widest">Tendência Tática<\/div>\s*<p className="text-xs font-sans text-brand-light\/80 leading-relaxed font-medium mb-3">\{m\.tendency\}<\/p>/,
  `{m.tendency && (
                    <>
                      <div className="text-[10px] font-sans font-bold uppercase text-brand-gray opacity-80 mb-2 tracking-widest">Tendência Tática</div>
                      <p className="text-xs font-sans text-brand-light/80 leading-relaxed font-medium mb-3">{m.tendency}</p>
                    </>
                  )}`
);

content = content.replace(
  /Foco no Meta/g,
  "Meta Picks VLR.gg"
);

fs.writeFileSync('src/components/dashboard/MapMastery.tsx', content);
