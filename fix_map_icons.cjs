const fs = require('fs');
let content = fs.readFileSync('src/components/dashboard/MapMastery.tsx', 'utf8');

content = content.replace(
  /import \{ MapPerformance \} from "\.\.\/\.\.\/types";/,
  `import { MapPerformance } from "../../types";\nimport AgentImage from "./AgentImage";`
);

content = content.replace(
  /<div className="flex gap-2">\s*\{m\.recommendedAgents\.map\(ag => \(\s*<div key=\{ag\} className="flex-1 bg-brand-darker border border-brand-gray\/20 text-brand-light p-2 font-heading uppercase text-center text-sm tracking-wider">\s*\{ag\}\s*<\/div>\s*\)\)\}\s*<\/div>/,
  `<div className="flex gap-2">
                      {m.recommendedAgents.map(ag => (
                        <div key={ag} className="flex-1 bg-brand-darker border border-brand-gray/20 text-brand-light p-2 flex items-center gap-2">
                          <AgentImage agentName={ag} />
                          <span className="font-heading uppercase text-sm tracking-wider leading-none truncate">{ag}</span>
                        </div>
                      ))}
                    </div>`
);

fs.writeFileSync('src/components/dashboard/MapMastery.tsx', content);
