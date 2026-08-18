const fs = require('fs');
const file = fs.readFileSync('src/components/LandingPage.tsx', 'utf8');
const newFile = file
  .replace('className="relative min-h-[calc(100vh-120px)] flex flex-col justify-center overflow-hidden -mt-10"', 'className="relative min-h-[calc(100vh-120px)] flex flex-col justify-center items-center overflow-hidden -mt-20"')
  .replace('className="relative z-10 max-w-4xl mx-auto px-6 w-full flex flex-col items-center justify-center pt-10 pb-12"', 'className="relative z-10 max-w-4xl mx-auto px-6 w-full flex flex-col items-center justify-center pt-2 pb-6"');
fs.writeFileSync('src/components/LandingPage.tsx', newFile);
