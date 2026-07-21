const fs = require('fs');
let code = fs.readFileSync('src/components/LandingPage.tsx', 'utf-8');

// Add import if not exists
if (!code.includes("import logoPng")) {
  code = code.replace('import { Search } from "lucide-react";', 'import { Search } from "lucide-react";\nimport logoPng from "../assets/logo.png";');
}

// Replace src="/logo.svg" or src="/logo.png" with src={logoPng}
code = code.replace(/src="\/logo\.(svg|png)"/g, 'src={logoPng}');

fs.writeFileSync('src/components/LandingPage.tsx', code);
