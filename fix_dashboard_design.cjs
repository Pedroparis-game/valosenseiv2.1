const fs = require('fs');
let content = fs.readFileSync('src/components/DashboardView.tsx', 'utf8');

// Use variants for staggering
content = content.replace(
  /return \(\s*<motion.div\s*initial=\{\{ opacity: 0, y: 30 \}\}\s*animate=\{\{ opacity: 1, y: 0 \}\}\s*transition=\{\{ type: "spring", stiffness: 100, damping: 20 \}\}/,
  `const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 20 } }
  };

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"`
);

content = content.replace(
  /<div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-12 gap-6 border-b border-brand-gray\/20 pb-10">/,
  '<motion.div variants={item} className="flex flex-col md:flex-row justify-between items-center md:items-end mb-12 gap-6 border-b border-brand-gray/20 pb-10">'
);
content = content.replace(
  /<\/div>\s*<div className="space-y-12">/,
  '</motion.div>\n      <div className="space-y-12">'
);

fs.writeFileSync('src/components/DashboardView.tsx', content);
