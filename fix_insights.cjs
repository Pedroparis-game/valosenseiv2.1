const fs = require('fs');

function updateFile(file) {
  let content = fs.readFileSync(file, 'utf8');
  
  content = content.replace(
    /analysis\.coachVerdict\.summary/g,
    'analysis?.coachVerdict?.summary || "Sem resumo disponível."'
  );
  
  content = content.replace(
    /analysis\.coachVerdict\.conclusion/g,
    'analysis?.coachVerdict?.conclusion || ""'
  );
  
  content = content.replace(
    /\(analysis\.coachVerdict\.strengths \|\| \[\]\)/g,
    '(analysis?.coachVerdict?.strengths || [])'
  );

  content = content.replace(
    /\(analysis\.coachVerdict\.weaknesses \|\| \[\]\)/g,
    '(analysis?.coachVerdict?.weaknesses || [])'
  );

  content = content.replace(
    /\(analysis\.coachVerdict\.recommendations \|\| \[\]\)/g,
    '(analysis?.coachVerdict?.recommendations || [])'
  );
  
  content = content.replace(
    /analysis\.overallScore/g,
    'analysis?.overallScore || 0'
  );

  content = content.replace(
    /analysis\.insights/g,
    '(analysis?.insights || [])'
  );
  
  fs.writeFileSync(file, content);
}

updateFile('src/components/dashboard/Insights.tsx');
