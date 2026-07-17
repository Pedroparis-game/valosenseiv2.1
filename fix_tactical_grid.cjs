const fs = require('fs');
let file = 'src/components/dashboard/TacticalBreakdown.tsx';
let content = fs.readFileSync(file, 'utf8');

// Change from flex-col to a grid layout
content = content.replace(
  /<div className="flex flex-col gap-4">/,
  '<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">'
);

// Make items stretch vertically to fit the grid evenly
content = content.replace(
  /className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left p-5 group relative gap-5 bg-brand-dark\/40 border border-brand-gray\/10 hover:border-brand-red\/30 transition-all duration-300 hover:bg-brand-dark\/80 rounded-sm"/,
  'className="flex flex-col items-start p-6 group relative gap-5 bg-brand-dark/40 border border-brand-gray/10 hover:border-brand-red/30 transition-all duration-300 hover:bg-brand-dark/80 rounded-sm h-full"'
);

// Update icon container
content = content.replace(
  /className="p-4 bg-brand-darker group-hover:bg-brand-red\/10 border border-brand-gray\/20 group-hover:border-brand-red\/40 transition-colors shrink-0 rounded-sm shadow-inner"/,
  'className="p-4 bg-brand-darker group-hover:bg-brand-red/10 border border-brand-gray/20 group-hover:border-brand-red/40 transition-colors shrink-0 rounded-sm shadow-inner mb-2"'
);

// We need to change the header of the card so icon and title are side-by-side or stacked.
content = content.replace(
  /<div className="p-4 bg-brand-darker group-hover:bg-brand-red\/10 border border-brand-gray\/20 group-hover:border-brand-red\/40 transition-colors shrink-0 rounded-sm shadow-inner mb-2">\s*\{getIcon\(key\)\}\s*<\/div>\s*<div className="flex-grow w-full">/g,
  `<div className="flex items-center gap-4 w-full">
              <div className="p-4 bg-brand-darker group-hover:bg-brand-red/10 border border-brand-gray/20 group-hover:border-brand-red/40 transition-colors shrink-0 rounded-full shadow-[0_0_15px_rgba(0,0,0,0.5)]">
                {getIcon(key)}
              </div>
              <div className="flex-grow flex justify-between items-baseline">
                <h4 className="font-heading uppercase tracking-widest text-lg text-brand-light">{metric.label}</h4>
                <div className="flex items-baseline gap-1">
                  <span className="font-heading text-2xl text-white">{metric.value}</span>
                  <span className="text-xs font-sans text-brand-gray">%</span>
                </div>
              </div>
            </div>
            
            <div className="flex-grow flex flex-col justify-end w-full mt-2">`
);

// Remove the old title/value block since it's now at the top
content = content.replace(
  /<div className="flex justify-between items-baseline mb-2">\s*<h4 className="font-heading uppercase tracking-widest text-lg text-brand-light">\{metric.label\}<\/h4>\s*<div className="flex items-baseline gap-1">\s*<span className="font-heading text-3xl text-white">\{metric.value\}<\/span>\s*<span className="text-sm font-sans text-brand-gray">%<\/span>\s*<\/div>\s*<\/div>/g,
  ''
);

fs.writeFileSync(file, content);
