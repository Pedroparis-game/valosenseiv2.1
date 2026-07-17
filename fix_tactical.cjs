const fs = require('fs');

function updateFile(file) {
  let content = fs.readFileSync(file, 'utf8');
  
  content = content.replace(
    /data=\{analysis\.tacticalBreakdown\}/g,
    'data={analysis?.tacticalBreakdown || {}}'
  );
  
  fs.writeFileSync(file, content);
}

updateFile('src/components/dashboard/Insights.tsx');
