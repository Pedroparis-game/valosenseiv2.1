const fs = require('fs');

let file = 'src/components/dashboard/MapMastery.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  /return <div className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-luminosity filter blur-\[1px\] transition-all group-hover:scale-110 group-hover:opacity-50" style=\{\{ backgroundImage: \`url\(\$\{bgUrl\}\)\` \}\} \/>;/g,
  'return <img src={bgUrl} referrerPolicy="no-referrer" alt={mapName} className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-luminosity filter blur-[1px] transition-all group-hover:scale-110 group-hover:opacity-50 pointer-events-none" />;'
);

fs.writeFileSync(file, content);
