const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Change cache key to bust cache
code = code.replace(
  'const cacheKey = `analysis_v3.0_${name.toLowerCase()}_${tag.toLowerCase()}_${latestMatchId}`;',
  'const cacheKey = `analysis_v4.0_${name.toLowerCase()}_${tag.toLowerCase()}_${latestMatchId}`;'
);

fs.writeFileSync('src/App.tsx', code);
