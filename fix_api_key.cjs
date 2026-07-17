const fs = require('fs');
let content = fs.readFileSync('api/index.ts', 'utf8');
content = content.replace(
  /if \(\!apiKey \|\| apiKey === "" \|\| apiKey\.includes\("MY_"\) \|\| apiKey === "undefined"\) \{[\s\S]*?\}\s*try \{/g,
  'try {'
);
fs.writeFileSync('api/index.ts', content);
