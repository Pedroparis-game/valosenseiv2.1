const fs = require('fs');

function updateFile(file) {
  let content = fs.readFileSync(file, 'utf8');
  
  content = content.replace(
    /value=\{stats\.overallKd\.toString\(\)\}/g,
    'value={(stats.overallKd ?? 0).toString()}'
  );
  
  fs.writeFileSync(file, content);
}

updateFile('src/components/dashboard/StatsOverview.tsx');
