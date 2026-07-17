const fs = require('fs');
let content = fs.readFileSync('src/components/dashboard/MapMastery.tsx', 'utf8');

content = content.replace("backgroundImage: \\`url(\\${bgUrl})\\`", "backgroundImage: `url(${bgUrl})`");
content = content.replace("className={\\`text-[10px] font-sans font-bold uppercase text-brand-gray opacity-80 mb-2 tracking-[0.1em] \\${(m.tendency && m.tendency !== \"N/A\") ? 'pt-3 border-t border-brand-gray/10 mt-3' : ''}\\`}", "className={`text-[10px] font-sans font-bold uppercase text-brand-gray opacity-80 mb-2 tracking-[0.1em] ${(m.tendency && m.tendency !== \"N/A\") ? 'pt-3 border-t border-brand-gray/10 mt-3' : ''}`}");

fs.writeFileSync('src/components/dashboard/MapMastery.tsx', content);
