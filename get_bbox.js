const fs = require('fs');
const svg = fs.readFileSync('public/favicon.svg', 'utf8');
const match = svg.match(/d="([^"]+)"/);
if (!match) {
    console.log("No path found");
    process.exit(1);
}
// Rough estimation based on path coordinates (which are integers)
// Just look for all numbers in the path string
const numbers = match[1].match(/-?\d+/g).map(Number);

// It's a sequence of M, c, l, m commands, and coordinates.
// Since we have transform="translate(0.000000,1076.000000) scale(0.100000,-0.100000)"
// The path numbers are multiplied by 0.1, and Y is flipped and shifted.
// Let's just find min/max x and y from the raw numbers and apply transform?
// That's hard because of relative commands (c, m, l).
console.log("Too hard to parse relative SVG paths accurately in a quick script.");
