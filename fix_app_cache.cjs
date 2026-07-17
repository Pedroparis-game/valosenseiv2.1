const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace(
  /const savedAnalysis = localStorage\.getItem\(cacheKey\);\s*if \(savedAnalysis\) \{\s*setAnalysis\(JSON\.parse\(savedAnalysis\)\);\s*setLoading\(false\);\s*return;\s*\}/,
  `if (!isRefresh) {
        const savedAnalysis = localStorage.getItem(cacheKey);
        if (savedAnalysis) {
          setAnalysis(JSON.parse(savedAnalysis));
          setLoading(false);
          return;
        }
      }`
);

fs.writeFileSync('src/App.tsx', content);
