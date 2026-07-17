const fs = require('fs');

// Add no-referrer to AgentImage
let agentFile = 'src/components/dashboard/AgentImage.tsx';
let agentContent = fs.readFileSync(agentFile, 'utf8');
agentContent = agentContent.replace(
  /<img src=\{iconUrl\}/g,
  '<img src={iconUrl} referrerPolicy="no-referrer"'
);
fs.writeFileSync(agentFile, agentContent);

// Fix vercel.json
let vercelFile = 'vercel.json';
let vercelContent = fs.readFileSync(vercelFile, 'utf8');
vercelContent = vercelContent.replace(
  /\{ "source": "\/\(\.\*\)", "destination": "\/index\.html" \}/g,
  '{ "source": "/((?!api/|ranks/|assets/|.*\\\\..*).*)*", "destination": "/index.html" }'
);
fs.writeFileSync(vercelFile, vercelContent);
