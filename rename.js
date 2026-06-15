import fs from 'fs';
import path from 'path';

const dirs = [
  path.join(process.cwd(), 'interruptores'),
  path.join(process.cwd(), 'nucleo')
];

const filesToProcess = [
  path.join(process.cwd(), 'main.js')
];

function getFiles(dir) {
  const dirents = fs.readdirSync(dir, { withFileTypes: true });
  for (const dirent of dirents) {
    const res = path.resolve(dir, dirent.name);
    if (dirent.isDirectory()) {
      getFiles(res);
    } else if (res.endsWith('.js')) {
      filesToProcess.push(res);
    }
  }
}

dirs.forEach(dir => getFiles(dir));

let replacedCount = 0;

for (const file of filesToProcess) {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  // Replace global.miku with global.lumi
  content = content.replace(/global\.miku/g, 'global.lumi');
  // Replace GitHub links
  content = content.replace(/https:\/\/github\.com\/Brauliovh3\/HATSUNE-MIKU/g, 'https://github.com/LuferOS/LumiBot');
  // Replace miku inside string templates if they directly refer to global.miku logic or similar
  // It's safer to only replace global.miku, but let's also replace isolated 'miku' variables if used
  content = content.replace(/\{ \.\.\.global\.miku \}/g, '{ ...global.lumi }');

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    replacedCount++;
    console.log(`Updated: ${file}`);
  }
}

console.log(`Total files updated: ${replacedCount}`);
