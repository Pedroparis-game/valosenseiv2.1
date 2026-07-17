const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

// Change the cacheKey logic to use latest match ID
content = content.replace(
  /const cacheKey = `analysis_v1\.8_\$\{name\.toLowerCase\(\)\}_\$\{tag\.toLowerCase\(\)\}`;[\s\S]*?if \(!isRefresh\) \{[\s\S]*?const savedAnalysis = localStorage\.getItem\(cacheKey\);[\s\S]*?if \(savedAnalysis\) \{[\s\S]*?setAnalysis\(JSON\.parse\(savedAnalysis\)\);[\s\S]*?setLoading\(false\);[\s\S]*?return;[\s\S]*?\}[\s\S]*?\}/,
  `const latestMatchId = playerStats.recentMatches?.[0]?.id || 'nomatch';
      const cacheKey = \`analysis_v1.9_\$\{name.toLowerCase()\}_\$\{tag.toLowerCase()\}_\$\{latestMatchId\}\`;
      
      const savedAnalysis = localStorage.getItem(cacheKey);
      if (savedAnalysis) {
        setAnalysis(JSON.parse(savedAnalysis));
        setLoading(false);
        return;
      }`
);

fs.writeFileSync('src/App.tsx', content);
