const fs = require('fs');
const path = require('path');

function replaceInDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            if (file !== 'node_modules' && file !== '.git' && file !== 'Sessions' && file !== 'database') {
                replaceInDir(fullPath);
            }
        } else if (fullPath.endsWith('.js') || fullPath.endsWith('.mjs')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            if (content.includes('@whiskeysockets/baileys')) {
                content = content.replace(/@whiskeysockets\/baileys/g, 'baileys-next');
                fs.writeFileSync(fullPath, content);
                console.log('Updated', fullPath);
            }
        }
    }
}
replaceInDir(__dirname);
