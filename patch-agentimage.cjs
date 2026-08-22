const fs = require('fs');
let code = fs.readFileSync('src/components/dashboard/AgentImage.tsx', 'utf8');

// Add className?: string to Props
code = code.replace(
  'interface Props {\n  agentName: string;\n}',
  'interface Props {\n  agentName: string;\n  className?: string;\n}'
);

// Add className prop to the function signature
code = code.replace(
  'export default function AgentImage({ agentName }: Props) {',
  'export default function AgentImage({ agentName, className }: Props) {'
);

// Replace fixed w-10 h-10 with dynamic class
code = code.replace(
  'return <div className="w-10 h-10 bg-hud-surface rounded-full border border-accent-primary flex items-center justify-center shrink-0"><User size={20} className="text-text-muted" /></div>;',
  'return <div className={className || "w-10 h-10 bg-hud-surface rounded-full border border-accent-primary flex items-center justify-center shrink-0"}><User size={20} className="text-text-muted" /></div>;'
);

code = code.replace(
  '<img src={iconUrl} referrerPolicy="no-referrer" alt={agentName} className="w-10 h-10 rounded-full border border-accent-primary shrink-0 object-cover bg-hud-surface/50" />',
  '<img src={iconUrl} referrerPolicy="no-referrer" alt={agentName} className={className || "w-10 h-10 rounded-full border border-accent-primary shrink-0 object-cover bg-hud-surface/50"} />'
);

fs.writeFileSync('src/components/dashboard/AgentImage.tsx', code);
