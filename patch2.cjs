const fs = require('fs');
let app = fs.readFileSync('src/App.tsx', 'utf8');
app = app.replace('pt-10 pb-20 selection:bg-accent-primary', 'selection:bg-accent-primary');
app = app.replace('<main className="container mx-auto px-4 relative z-10 pt-4 flex-1 flex flex-col justify-center">', '<main className="container mx-auto px-4 relative z-10 flex-1 flex flex-col justify-center min-h-screen">');
app = app.replace('<footer className="mt-32 py-10 border-t border-hud-border/20 text-center">', '<footer className="absolute bottom-4 left-0 w-full text-center opacity-50">');
app = app.replace('<p className="text-xs font-sans tracking-[0.3em] opacity-40 uppercase text-text-main">', '<p className="text-[10px] font-sans tracking-[0.3em] uppercase text-text-main">');
fs.writeFileSync('src/App.tsx', app);

let landing = fs.readFileSync('src/components/LandingPage.tsx', 'utf8');
landing = landing.replace('min-h-[calc(100vh-120px)] flex flex-col justify-center items-center overflow-hidden -mt-20', 'min-h-screen flex flex-col justify-center items-center overflow-hidden pt-24 pb-8');
fs.writeFileSync('src/components/LandingPage.tsx', landing);
