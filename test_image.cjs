const fs = require('fs');
console.log('logo256.png size:', fs.statSync('src/assets/logo256.png').size);
console.log('logo.png size:', fs.statSync('src/assets/logo.png').size);
console.log('logo.svg size:', fs.statSync('src/assets/logo.svg').size);
