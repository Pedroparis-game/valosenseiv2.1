const fs = require('fs');
let content = fs.readFileSync('src/components/dashboard/Insights.tsx', 'utf8');

// Insert the logic at the top of Insights component
content = content.replace(
  /export default function Insights\(\{ analysis, stats \}: InsightsProps\) \{/,
  `import { Flame } from "lucide-react";\nexport default function Insights({ analysis, stats }: InsightsProps) {
  const MINDSET_QUOTES = [
    "A diferença entre o bom e o melhor é a consistência.",
    "Mire na cabeça, mas jogue com a mente.",
    "Cada derrota é apenas uma lição de como não perder da próxima vez.",
    "A paciência vence mais duelos do que a velocidade.",
    "Sua utilitária é tão letal quanto o seu tiro, se usada corretamente.",
    "Mantenha a calma sob pressão. O pânico é o maior inimigo do clutch.",
    "Não se importe com o rank, importe-se com a evolução diária.",
    "Comunicação clara ganha mais rounds do que jogadas individuais."
  ];
  const quoteIndex = stats.name.charCodeAt(0) % MINDSET_QUOTES.length;
  const quote = MINDSET_QUOTES[quoteIndex];
`
);

// Replace Estilo Tático with Mentalidade Radiante
content = content.replace(
  /<Target size=\{22\} className="text-brand-light" \/>\s*<h4 className="font-heading text-xl uppercase tracking-widest text-brand-light">Estilo Tático<\/h4>\s*<\/div>\s*<p className="text-sm font-sans text-brand-light\/80 leading-relaxed">\s*Foco no duelo e controle. O impacto primário depende da precisão inicial.\s*<\/p>/,
  `<Flame size={22} className="text-[#00ffaa]" />
                <h4 className="font-heading text-xl uppercase tracking-widest text-brand-light">Mindset Pro</h4>
              </div>
              <p className="text-sm font-sans text-[#00ffaa]/90 leading-relaxed font-medium italic">
                "{quote}"
              </p>`
);

fs.writeFileSync('src/components/dashboard/Insights.tsx', content);
