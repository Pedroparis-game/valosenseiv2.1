const fs = require('fs');
const getBounds = require('svg-path-bounds');

const svg = fs.readFileSync('public/favicon.svg', 'utf8');
const match = svg.match(/d="([^"]+)"/);
if (!match) {
    console.log("No path found");
    process.exit(1);
}

// The bounds are for the path in its own coordinate space
let [left, top, right, bottom] = getBounds(match[1]);
console.log("Raw path bounds:", {left, top, right, bottom});

// Transform: translate(0.000000,1076.000000) scale(0.100000,-0.100000)
// This means the actual x in the SVG is: x * 0.1 + 0
// Actual y in the SVG is: y * -0.1 + 1076
// Let's compute actual SVG bounds:

const actualLeft = left * 0.1;
const actualRight = right * 0.1;
const actualBottom = bottom * -0.1 + 1076; // smaller y
const actualTop = top * -0.1 + 1076;    // larger y

console.log("Actual SVG bounds:");
console.log(`x: ${actualLeft} to ${actualRight}`);
console.log(`y: ${actualBottom} to ${actualTop}`); // Top is actually bottom in SVG?
// Wait, y goes from 0 at top to 1076 at bottom.
// If actualBottom < actualTop, then top is actualBottom, bottom is actualTop.
const minY = Math.min(actualBottom, actualTop);
const maxY = Math.max(actualBottom, actualTop);

console.log(`Bbox: left=${actualLeft}, top=${minY}, right=${actualRight}, bottom=${maxY}`);
console.log(`Width: ${actualRight - actualLeft}`);
console.log(`Height: ${maxY - minY}`);

const cx = (actualLeft + actualRight) / 2;
const cy = (minY + maxY) / 2;
// To make a square viewBox centered on the logo with 10% padding
const size = Math.max(actualRight - actualLeft, maxY - minY) * 1.1;
const viewBox = `${Math.round(cx - size/2)} ${Math.round(cy - size/2)} ${Math.round(size)} ${Math.round(size)}`;
console.log("Suggested viewBox:", viewBox);
