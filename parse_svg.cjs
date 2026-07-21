const fs = require('fs');
const parse = require('parse-svg-path');
const abs = require('abs-svg-path');
const getBounds = require('svg-path-bounds');

const svg = fs.readFileSync('src/assets/logo.svg', 'utf8');
const match = svg.match(/d="([^"]+)"/);
if (match) {
    const pathStr = match[1];
    const absoluteSegments = abs(parse(pathStr));
    
    // Group into subpaths
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
    
    console.log(`Found ${subpaths.length} absolute subpaths`);
    
    // Find bounds for each subpath
    // convert back to string for svg-path-bounds, or just compute it.
    // actually, let's just create separate paths strings
    let groups = [];
    for (const sp of subpaths) {
        let spStr = sp.map(seg => seg[0] + seg.slice(1).join(' ')).join(' ');
        let bounds = getBounds(spStr);
        // path_Y goes from bounds[1] to bounds[3]
        // mapped to SVG Y: 1076 - (path_Y * 0.1)
        let svg_y1 = 1076 - (bounds[3] * 0.1); // top
        let svg_y2 = 1076 - (bounds[1] * 0.1); // bottom
        let svg_x1 = bounds[0] * 0.1;
        let svg_x2 = bounds[2] * 0.1;
        
        groups.push({
            bounds: [svg_x1, svg_y1, svg_x2, svg_y2],
            str: spStr
        });
    }
    
    groups.sort((a, b) => a.bounds[1] - b.bounds[1]); // sort by top Y
    
    for (let i=0; i<groups.length; i++) {
        let b = groups[i].bounds;
        console.log(`Subpath ${i}: Y: ${b[1].toFixed(1)} to ${b[3].toFixed(1)}, X: ${b[0].toFixed(1)} to ${b[2].toFixed(1)}`);
    }
}
