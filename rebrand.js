import fs from 'fs';
import path from 'path';

const dirs = [
  path.join(process.cwd(), 'interruptores'),
  path.join(process.cwd(), 'nucleo')
];

const emojis = ['💅', '✨', '🙄', '🔥', '👑', '💖', '💋'];

function getRandomEmoji() {
    return emojis[Math.floor(Math.random() * emojis.length)];
}

function getFiles(dir, files) {
  const dirents = fs.readdirSync(dir, { withFileTypes: true });
  for (const dirent of dirents) {
    const res = path.resolve(dir, dirent.name);
    if (dirent.isDirectory()) {
      getFiles(res, files);
    } else if (res.endsWith('.js')) {
      files.push(res);
    }
  }
}

const allFiles = [];
dirs.forEach(dir => getFiles(dir, allFiles));

let replacedCount = 0;

for (const file of allFiles) {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  // Reemplazo de corazones azules con emojis sassy aleatorios
  // Lo hacemos línea por línea para poner un emoji diferente si es posible
  let lines = content.split('\n');
  let newLines = [];
  for (let i = 0; i < lines.length; i++) {
      let line = lines[i];
      if (line.includes('💙')) {
          // Reemplazo sarcástico si detecta un error de 'Por favor'
          if (line.includes('Por favor') && line.includes('m.reply')) {
              line = line.replace(/Por favor,?/gi, 'Bruh,');
          }
          if (line.includes('Debes') && line.includes('m.reply')) {
              line = line.replace(/Debes/gi, 'O sea, debes');
          }
          if (line.includes('No se encontró') || line.includes('No encontré')) {
              line = line.replace(/No se encontró/gi, 'Literalmente no encontré');
              line = line.replace(/No encontré/gi, 'Literalmente no encontré');
          }
          
          // Cambiar todos los 💙 por un emoji sassy
          line = line.replace(/💙/g, () => getRandomEmoji());
      }
      newLines.push(line);
  }
  content = newLines.join('\n');

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    replacedCount++;
    console.log(`Rebranded: ${file}`);
  }
}

console.log(`Total files rebranded: ${replacedCount}`);
