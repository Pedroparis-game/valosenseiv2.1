const fs = require('fs');
let code = fs.readFileSync('src/components/DashboardView.tsx', 'utf8');

// Restore tabs
code = code.replace(
  "{ id: 'charts', label: 'Evolução', icon: <Target size={18} /> },",
  "{ id: 'charts', label: 'Evolução', icon: <Target size={18} /> },\n            { id: 'maps', label: 'Mapas', icon: <Map size={18} /> },\n            { id: 'library', label: 'Biblioteca', icon: <BookOpen size={18} /> },"
);

// Restore WeaponStats import and component call if missing
if (!code.includes('<WeaponStats')) {
  code = code.replace(
    '<div className="grid grid-cols-1 gap-8 h-auto"><MatchHistory matches={stats.recentMatches} /></div>',
    '<div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-auto">\n                   <MatchHistory matches={stats.recentMatches} />\n                   <div className="flex flex-col gap-8 h-full">\n                     <WeaponStats weapons={analysis.weaponStats || []} />\n                   </div>\n                </div>'
  );
}

// Restore Tab Views
if (!code.includes('activeTab === \'maps\'')) {
  code = code.replace(
    '</motion.div>\n        </AnimatePresence>\n      </div>\n\n      {/* MODAL LAYER */}',
    `        {activeTab === 'maps' && (
           <MapPerformanceGrid 
             maps={mockMapPerformanceData} 
             onClick={(id) => setSelectedMapId(id)} 
           />
        )}

        {activeTab === 'library' && (
          <TacticalLibrary />
        )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* MODAL LAYER */}`
  );
}

fs.writeFileSync('src/components/DashboardView.tsx', code);
