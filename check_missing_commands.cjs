const fs = require('fs');
const path = require('path');

const menuContent = fs.readFileSync('interruptores/main/menu.js', 'utf8');
const commandRegex = /\.([a-zA-Z0-9_-]+)/g;
const menuCommands = new Set();
let match;
while ((match = commandRegex.exec(menuContent)) !== null) {
  if (match[1] !== 'js' && match[1] !== 'test') {
    menuCommands.add(match[1]);
  }
}

// Find all command definitions in interruptores
const walkSync = (dir, filelist = []) => {
  fs.readdirSync(dir).forEach(file => {
    const dirFile = path.join(dir, file);
    if (fs.statSync(dirFile).isDirectory()) {
      filelist = walkSync(dirFile, filelist);
    } else if (file.endsWith('.js')) {
      filelist.push(dirFile);
    }
  });
  return filelist;
};

const allFiles = walkSync('interruptores');
const implementedCommands = new Set();

allFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  // simple heuristic to find command array
  const cmdMatch = content.match(/command:\s*\[([^\]]+)\]/);
  if (cmdMatch) {
    const cmds = cmdMatch[1].replace(/['"\s]/g, '').split(',');
    cmds.forEach(c => implementedCommands.add(c.toLowerCase()));
  }
});

const missing = [];
menuCommands.forEach(cmd => {
  if (!implementedCommands.has(cmd.toLowerCase())) {
     missing.push(cmd);
  }
});

console.log('Missing commands listed in menu but not implemented:');
console.log(missing.join(', '));
