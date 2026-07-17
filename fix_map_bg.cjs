const fs = require('fs');
let content = fs.readFileSync('src/components/dashboard/MapMastery.tsx', 'utf8');

if (!content.includes('import { useState, useEffect }')) {
  content = content.replace('import { motion } from "motion/react";', 'import React, { useState, useEffect } from "react";\nimport { motion } from "motion/react";');
}

// We need to fetch maps for backgrounds
const mapBgComponent = `
const MapBackground = ({ mapName }: { mapName: string }) => {
  const [bgUrl, setBgUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchMap = async () => {
      try {
        const res = await fetch("https://valorant-api.com/v1/maps");
        const data = await res.json();
        if (data.data) {
          const map = data.data.find((m: any) => m.displayName.toLowerCase() === mapName.toLowerCase());
          if (map && map.listViewIcon) {
            setBgUrl(map.listViewIcon);
          }
        }
      } catch (e) {
      }
    };
    fetchMap();
  }, [mapName]);

  if (!bgUrl) return null;
  return <div className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-luminosity filter blur-[1px] transition-all group-hover:scale-110 group-hover:opacity-50" style={{ backgroundImage: \`url(\${bgUrl})\` }} />;
};
`;

content = content.replace('export default function MapMastery({ maps }: Props) {', mapBgComponent + '\nexport default function MapMastery({ maps }: Props) {');

content = content.replace(
  /<div className="bg-brand-red\/10 h-24 flex items-center justify-center overflow-hidden relative border-b border-brand-red\/30">/,
  `<div className="bg-brand-darker h-32 flex items-center justify-center overflow-hidden relative border-b border-brand-red/30">
               <MapBackground mapName={m.mapName} />
               <div className="absolute inset-0 bg-gradient-to-t from-brand-darker to-transparent" />`
);

fs.writeFileSync('src/components/dashboard/MapMastery.tsx', content);
