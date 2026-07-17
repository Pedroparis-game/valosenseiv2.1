const fs = require('fs');
const content = fs.readFileSync('src/components/dashboard/Insights.tsx', 'utf8');
if (content.includes('DETALHES MODAL')) {
  console.log('Modal is there');
} else {
  console.log('Modal missing');
}
