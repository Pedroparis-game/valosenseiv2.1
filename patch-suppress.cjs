const fs = require('fs');
let server = fs.readFileSync('server.ts', 'utf8');

// The code currently has this line which is spamming the console:
// console.warn("Henrik API Auth/Error:", JSON.stringify(errorData || error.message));
server = server.replace(
  'console.warn("Henrik API Auth/Error:", JSON.stringify(errorData || error.message));',
  '// Silenced expected authentication errors to clean up terminal'
);

// Remove the other console log as well
server = server.replace(
  'console.log("Henrik API failed or no key present. Returning mock data.");',
  '// Silenced mock data log'
);

fs.writeFileSync('server.ts', server);
