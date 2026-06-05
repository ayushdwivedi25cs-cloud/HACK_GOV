const fs = require('fs');
let code = fs.readFileSync('c:/Users/asadh/projects/HACK_GOV/frontend/src/translations/index.ts', 'utf8');
code = code.replace(/export type Language = 'en' \| 'hi' \| 'kn';/, `export type Language = 'en' | 'hi' | 'kn' | 'ta' | 'te';`);

const enObjMatch = code.match(/en: \{[\s\S]*?\n  \},/);
if (enObjMatch) {
  const enText = enObjMatch[0];
  const taText = enText.replace(/en:/, 'ta:').replace(/'[^']*'/g, "'தமிழ்'");
  const teText = enText.replace(/en:/, 'te:').replace(/'[^']*'/g, "'తెలుగు'");
  
  code = code.replace(/kn: \{[\s\S]*?\n  \},/, match => match + '\n\n  ' + taText + '\n\n  ' + teText);
  fs.writeFileSync('c:/Users/asadh/projects/HACK_GOV/frontend/src/translations/index.ts', code);
  console.log('Translations updated successfully.');
} else {
  console.error('en block not found');
}
