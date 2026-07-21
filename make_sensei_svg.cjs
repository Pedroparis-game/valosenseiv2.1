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
            if (currentSubpath.length > 0) {
                subpaths.push(currentSubpath);
            }
            currentSubpath = [segment];
        } else {
            currentSubpath.push(segment);
        }
    }
    if (currentSubpath.length > 0) {
        subpaths.push(currentSubpath);
    }
    
    // We want to keep subpaths that belong to the logo.
    // Based on previous analysis, we want to KEEP subpaths where the minimum Y is >= -11348
    // Wait, in path space, Y goes from -2122 to +4812.
    // The logo had translated Y from 594 to 1134.
    // Which means path Y from 1076 - 1134 = -58, so path Y is from -588 to 4812.
    // The text had translated Y from 1161 to 1288.
    // Which means path Y from 1076 - 1288 = -212, so path Y is from -2122 to -850.
    
    let filteredSegments = [];
    for (let sp of subpaths) {
        // find max and min Y of this subpath in path coordinates
        let min_y = Infinity;
        let max_y = -Infinity;
        for (let seg of sp) {
            // Y is usually the last or second to last, for M/L/C it varies.
            // But we know from earlier that the text subpaths were index 20-30.
            // Let's just use the index if there are exactly 31 subpaths!
        }
    }
    
    // Just keep the first 20 subpaths (0 to 19)
    for (let i = 0; i < 20; i++) {
        filteredSegments.push(...subpaths[i]);
    }
    
    // Create new path string
    let newPath = filteredSegments.map(seg => seg[0] + seg.slice(1).join(' ')).join(' ');
    
    // We also want a nice viewBox.
    // X goes from 412 to 1051, Y goes from 594 to 1134 in SVG user space.
    // Let's set viewBox="390 520 680 680"
    
    let newSvg = svg.replace(/d="([^"]+)"/, `d="${newPath}"`);
    newSvg = newSvg.replace(/viewBox="[^"]+"/, 'viewBox="390 520 680 680"');
    newSvg = newSvg.replace(/width="[^"]+"/, 'width="680"');
    newSvg = newSvg.replace(/height="[^"]+"/, 'height="680"');
    
    fs.writeFileSync('public/favicon.svg', newSvg);
    fs.writeFileSync('src/assets/logo-sensei.svg', newSvg);
    fs.writeFileSync('public/logo-sensei.svg', newSvg); // Just in case
    console.log('Created logo-sensei SVGs!');
}
