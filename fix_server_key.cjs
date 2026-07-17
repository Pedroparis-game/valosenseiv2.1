const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');
content = content.replace(
  /if \(\!apiKey \|\| apiKey === "" \|\| apiKey\.includes\("MY_"\) \|\| apiKey === "undefined"\) \{[\s\S]*?\}\s*try \{/g,
  'try {'
);
fs.writeFileSync('server.ts', content);
