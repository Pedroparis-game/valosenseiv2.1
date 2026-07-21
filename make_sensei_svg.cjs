const fs = require('fs');
const parse = require('parse-svg-path');
const abs = require('abs-svg-path');

const svg = fs.readFileSync('src/assets/logo.svg', 'utf8');
const match = svg.match(/d="([^"]+)"/);
if (match) {
    const pathStr = match[1];
    const absoluteSegments = abs(parse(pathStr));
    
    let subpaths = [];
    let currentSubpath = [];
    
    for (const segment of absoluteSegments) {
        if (segment[0] === 'M') {
            if (currentSubpath.length > 0) subpaths.push(currentSubpath);
            currentSubpath = [segment];
        } else {
            currentSubpath.push(segment);
        }
    }
    if (currentSubpath.length > 0) subpaths.push(currentSubpath);
    
    // Subpaths 11 and 12 are the eyes.
    let headSegments = [];
    for (let i = 0; i < 20; i++) {
        if (i !== 11 && i !== 12) {
            headSegments.push(...subpaths[i]);
        }
    }
    
    let eyesSegments = [];
    eyesSegments.push(...subpaths[11]);
    eyesSegments.push(...subpaths[12]);
    
    let headPath = headSegments.map(seg => seg[0] + seg.slice(1).join(' ')).join(' ');
    let eyesPath = eyesSegments.map(seg => seg[0] + seg.slice(1).join(' ')).join(' ');
    
    // Replace the single path with two paths and CSS
    const css = `
    <style>
      @keyframes blink {
        0%, 96%, 98% { opacity: 1; }
        97% { opacity: 0.1; }
      }
      .eyes {
        animation: blink 4s infinite;
        fill: #FF4655;
        filter: drop-shadow(0 0 15px rgba(255, 70, 85, 0.8));
      }
      .head {
        fill: #FF4655;
      }
    </style>
    `;
    
    let newSvg = svg.replace(/<path d="[^"]+"[^>]*\/>/, `${css}<path class="head" d="${headPath}"/><path class="eyes" d="${eyesPath}"/>`);
    
    // Wait, the original had `<path d="..." ...>` inside a `<g>` with fill="#FF4655" and stroke="none".
    // I need to make sure the replacement works. Let's just find the `d="..."` and replace the whole <path> element.
    let pathElemMatch = svg.match(/<path[^>]+d="[^"]+"[^>]*\/>/);
    if (!pathElemMatch) {
       pathElemMatch = svg.match(/<path d="[^"]+"\/>/); // fallback
    }
    
    if (pathElemMatch) {
       let newSvg2 = svg.replace(pathElemMatch[0], `${css}<path class="head" d="${headPath}"/><path class="eyes" d="${eyesPath}"/>`);
       newSvg2 = newSvg2.replace(/viewBox="[^"]+"/, 'viewBox="390 520 680 680"');
       newSvg2 = newSvg2.replace(/width="[^"]+"/, 'width="680"');
       newSvg2 = newSvg2.replace(/height="[^"]+"/, 'height="680"');
       
       fs.writeFileSync('public/logo-sensei.svg', newSvg2);
       fs.writeFileSync('src/assets/logo-sensei.svg', newSvg2);
       fs.writeFileSync('public/favicon.svg', newSvg2);
       console.log('Created animated SVG!');
    } else {
       console.log('Path element not found!');
    }
}
