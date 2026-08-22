const fs = require('fs');
let code = fs.readFileSync('src/components/dashboard/MapCard.tsx', 'utf8');

const target = `<img
                  src={agent.iconUrl}
                  alt={agent.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />`;

const replacement = `<AgentImage agentName={agent.name} />`;
// actually because of formatting, it might be in one line:
code = code.replace(/<img[^>]+src={agent\.iconUrl}[^>]+\/>/g, replacement);

fs.writeFileSync('src/components/dashboard/MapCard.tsx', code);
