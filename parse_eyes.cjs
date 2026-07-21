const fs = require('fs');
const getBounds = require('svg-path-bounds');
const parse = require('parse-svg-path');
const abs = require('abs-svg-path');

const svg = fs.readFileSync('src/assets/logo-sensei.svg', 'utf8');
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
    
    for (let i = 0; i < subpaths.length; i++) {
        let sp = subpaths[i];
        let spStr = sp.map(seg => seg[0] + seg.slice(1).join(' ')).join(' ');
        let bounds = getBounds(spStr);
        // Map back to viewbox coords? No, these are already absolute.
        console.log(`Subpath ${i}: width: ${(bounds[2]-bounds[0]).toFixed(0)}, height: ${(bounds[3]-bounds[1]).toFixed(0)}, x: ${(bounds[0]).toFixed(0)}, y: ${(bounds[1]).toFixed(0)}`);
    }
}
