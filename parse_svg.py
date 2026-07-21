import re

svg_content = open('src/assets/logo.svg').read()
match = re.search(r'viewBox="([^"]+)"', svg_content)
if match:
    print(f"Original viewBox: {match.group(1)}")

