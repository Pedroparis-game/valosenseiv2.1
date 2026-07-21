import re

svg = open('src/assets/logo.svg').read()
path_match = re.search(r'd="([^"]+)"', svg)
if not path_match:
    print("No path found")
    exit()

path_data = path_match.group(1)

# Split into subpaths
subpaths = re.split(r'(?=[Mm])', path_data)

boxes = []

for sp in subpaths:
    if not sp.strip(): continue
    # Find all coordinates
    # Coordinates in potrace are typically like "M123 456" or "c12 -34..."
    # Let's just extract all numbers
    nums = [int(n) for n in re.findall(r'-?\d+', sp)]
    if len(nums) < 2: continue
    
    # Wait, potrace uses relative coordinates for 'c', 'l', etc!
    # M is absolute, m is relative.
    # It's better to just use a library like svgpathtools
