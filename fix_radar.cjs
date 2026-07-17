const fs = require('fs');

function updateFile(file) {
  let content = fs.readFileSync(file, 'utf8');
  
  content = content.replace(
    /value: analysis\.tacticalBreakdown\.([a-zA-Z]+)\.value/g,
    'value: analysis?.tacticalBreakdown?.$1?.value || 0'
  );
  
  fs.writeFileSync(file, content);
}

updateFile('src/components/dashboard/PerformanceRadar.tsx');
