const fs = require('fs');

function updateFile(file) {
  let content = fs.readFileSync(file, 'utf8');
  
  content = content.replace(
    /data=\{analysis\?\.tacticalBreakdown \|\| \{\}\}/g,
    'data={analysis?.tacticalBreakdown || { mira: { label: "Mira", value: 0, average: 0, description: "" }, gameSense: { label: "Game Sense", value: 0, average: 0, description: "" }, economia: { label: "Economia", value: 0, average: 0, description: "" }, posicionamento: { label: "Posicionamento", value: 0, average: 0, description: "" }, utilitarias: { label: "Utilitárias", value: 0, average: 0, description: "" } }}'
  );
  
  fs.writeFileSync(file, content);
}

updateFile('src/components/dashboard/Insights.tsx');
