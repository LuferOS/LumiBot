import path from 'path'
import fs from 'fs'
import _ from 'lodash'
import yargs from 'yargs/yargs'

global.opts = Object(yargs(process.argv.slice(2)).exitProcess(false).parse())

const dbFile = path.join(process.cwd(), 'nucleo', 'database.json')

global.db = {
  data: {
    users: {},
    chats: {},
    settings: {},
    characters: {},
    stickerspack: {}
  },
  chain: null,
  READ: false,
  _snapshot: '{}'
}
global.DATABASE = global.db
global.loadDatabase = function loadDatabase() {
  if (global.db.READ) return global.db.data
  global.db.READ = true
  
  if (fs.existsSync(dbFile)) {
    try {
      const parsed = JSON.parse(fs.readFileSync(dbFile, 'utf8'))
      global.db.data = Object.assign(global.db.data, parsed)
    } catch {}
  }
  global.db.chain = _.chain(global.db.data)
  global.db.READ = false
  global.db._snapshot = JSON.stringify(global.db.data)
  return global.db.data
}

let isSaving = false;

global.saveDatabase = async function saveDatabase() {
  if (isSaving) return;
  
  // Convertimos a string solo en el momento de guardar para no saturar el CPU
  const currentSnapshot = JSON.stringify(global.db.data);
  if (global.db._snapshot === currentSnapshot) return;
  
  isSaving = true;
  try {
    // Escribimos asíncronamente
    await fs.promises.writeFile(dbFile, JSON.stringify(global.db.data, null, 2), 'utf8');
    global.db._snapshot = currentSnapshot;
  } catch (err) {
    console.error("[LUMIBOT DB] Error guardando base de datos:", err);
  } finally {
    isSaving = false;
  }
}

// Subimos el intervalo a 5000ms para evitar congelamientos en el event loop
setInterval(() => {
  global.saveDatabase();
}, 5000)

export default global.db