const fs = require('fs');

function updateFile(file) {
  let content = fs.readFileSync(file, 'utf8');
  
  content = content.replace(
    /rank: matches\[0\]\?\.players\.all_players\.find/g,
    'rank: matches[0]?.players?.all_players?.find'
  );
  
  fs.writeFileSync(file, content);
}

updateFile('api/index.ts');
updateFile('server.ts');
