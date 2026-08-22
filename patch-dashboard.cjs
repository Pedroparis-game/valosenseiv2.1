const fs = require('fs');
let code = fs.readFileSync('src/components/DashboardView.tsx', 'utf8');

code = code.replace(
  "{ id: 'maps', label: 'Mapas', icon: <Map size={18} /> },", ""
);
code = code.replace(
  "{ id: 'library', label: 'Biblioteca', icon: <BookOpen size={18} /> },", ""
);
code = code.replace(
  /<div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-auto">[\s\S]*?<MatchHistory matches={stats\.recentMatches} \/>[\s\S]*?<div className="flex flex-col gap-8 h-full">[\s\S]*?<WeaponStats weapons={analysis\.weaponStats \|\| \[\]} \/>[\s\S]*?<\/div>[\s\S]*?<\/div>/,
  '<div className="grid grid-cols-1 gap-8 h-auto"><MatchHistory matches={stats.recentMatches} /></div>'
);
code = code.replace(
  /\{activeTab === 'maps' && \([\s\S]*?<MapPerformanceGrid[\s\S]*?\/>[\s\S]*?\)\}/,
  ''
);
code = code.replace(
  /\{activeTab === 'library' && \([\s\S]*?<TacticalLibrary \/>[\s\S]*?\)\}/,
  ''
);

fs.writeFileSync('src/components/DashboardView.tsx', code);
