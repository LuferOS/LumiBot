import path from 'path'
import fs from 'fs'
import _ from 'lodash'
import yargs from 'yargs/yargs'
import sqlite3 from 'sqlite3'

global.opts = Object(yargs(process.argv.slice(2)).exitProcess(false).parse())

const dbFile = path.join(process.cwd(), 'nucleo', 'database.sqlite')
const oldJsonDbFile = path.join(process.cwd(), 'nucleo', 'database.json')

// Inicializar la base de datos SQL
const sqlDb = new sqlite3.Database(dbFile, (err) => {
    if (err) console.error('[LUMIBOT SQL] Error conectando a SQLite:', err);
    else {
        console.log('[LUMIBOT SQL] Conexión SQLite establecida de forma multi sin espera.');
        sqlDb.run(`PRAGMA journal_mode = WAL;`); // Máximo rendimiento multi-thread
    }
});

global.sqlDb = sqlDb;

// Asegurar estructura de tablas
const initTables = () => {
    return new Promise((resolve, reject) => {
        sqlDb.serialize(() => {
            sqlDb.run(`CREATE TABLE IF NOT EXISTS users (jid TEXT PRIMARY KEY, data TEXT)`);
            sqlDb.run(`CREATE TABLE IF NOT EXISTS chats (chat_id TEXT PRIMARY KEY, data TEXT)`);
            sqlDb.run(`CREATE TABLE IF NOT EXISTS settings (bot_jid TEXT PRIMARY KEY, data TEXT)`);
            sqlDb.run(`CREATE TABLE IF NOT EXISTS characters (id TEXT PRIMARY KEY, data TEXT)`);
            sqlDb.run(`CREATE TABLE IF NOT EXISTS stickerspack (id TEXT PRIMARY KEY, data TEXT)`);
            
            // Tabla pura SQL para el TOP de mensajes (Máximo rendimiento)
            sqlDb.run(`CREATE TABLE IF NOT EXISTS chat_stats (
                jid TEXT,
                chat_id TEXT,
                date TEXT,
                msgs INTEGER DEFAULT 0,
                audios INTEGER DEFAULT 0,
                stickers INTEGER DEFAULT 0,
                media INTEGER DEFAULT 0,
                PRIMARY KEY (jid, chat_id, date)
            )`);
            
            // Tablas para el Motor de Diva
            sqlDb.run(`CREATE TABLE IF NOT EXISTS bot_state (key TEXT PRIMARY KEY, value TEXT)`);
            sqlDb.run(`CREATE TABLE IF NOT EXISTS gossip (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                message TEXT,
                author TEXT,
                group_id TEXT,
                date TEXT
            )`);
            
            // Tablas para Bodas y Policía Tóxica
            sqlDb.run(`CREATE TABLE IF NOT EXISTS marriages (
                user1 TEXT,
                user2 TEXT,
                date TEXT,
                group_id TEXT,
                PRIMARY KEY (user1, user2)
            )`);
            sqlDb.run(`CREATE TABLE IF NOT EXISTS infiel_stats (
                jid TEXT PRIMARY KEY,
                points INTEGER DEFAULT 0
            )`, (err) => {
                if (err) reject(err);
                else resolve();
            });
        });
    });
};

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

global.loadDatabase = async function loadDatabase() {
  if (global.db.READ) return global.db.data
  global.db.READ = true
  
  await initTables();

  // Migración desde database.json viejo si SQLite está vacío
  const migrateOldJson = async () => {
      if (fs.existsSync(oldJsonDbFile)) {
          try {
              console.log('[LUMIBOT SQL] Migrando database.json a SQL por primera vez...');
              const parsed = JSON.parse(fs.readFileSync(oldJsonDbFile, 'utf8'));
              
              const insertData = (table, obj) => {
                  const stmt = sqlDb.prepare(`INSERT OR IGNORE INTO ${table} (id, data) VALUES (?, ?)`);
                  for (let key in obj) {
                      stmt.run(key, JSON.stringify(obj[key] || {}));
                  }
                  stmt.finalize();
              };

              const insertJidData = (table, obj, keyCol) => {
                  const stmt = sqlDb.prepare(`INSERT OR IGNORE INTO ${table} (${keyCol}, data) VALUES (?, ?)`);
                  for (let key in obj) {
                      stmt.run(key, JSON.stringify(obj[key] || {}));
                  }
                  stmt.finalize();
              };

              sqlDb.serialize(() => {
                  sqlDb.run('BEGIN TRANSACTION');
                  if (parsed.users) insertJidData('users', parsed.users, 'jid');
                  if (parsed.chats) insertJidData('chats', parsed.chats, 'chat_id');
                  if (parsed.settings) insertJidData('settings', parsed.settings, 'bot_jid');
                  if (parsed.characters) insertData('characters', parsed.characters);
                  if (parsed.stickerspack) insertData('stickerspack', parsed.stickerspack);
                  sqlDb.run('COMMIT');
              });

              // Renombrar el json viejo para evitar migraciones dobles
              fs.renameSync(oldJsonDbFile, oldJsonDbFile + '.backup');
              console.log('[LUMIBOT SQL] Migración completada exitosamente.');
          } catch (e) {
              console.error('[LUMIBOT SQL] Error migrando JSON viejo:', e);
          }
      }
  };

  await migrateOldJson();

  // Cargar datos de SQL a Memoria (Carga inicial)
  const loadTable = (table, keyCol) => {
      return new Promise((resolve) => {
          sqlDb.all(`SELECT * FROM ${table}`, (err, rows) => {
              if (err) return resolve({});
              let obj = {};
              rows.forEach(row => {
                  try {
                      obj[row[keyCol] || row.id] = JSON.parse(row.data);
                  } catch (e) { console.error('[LUMIBOT ERROR] En ' + __filename + ':', e.message || e); }
              });
              resolve(obj);
          });
      });
  };

  const [users, chats, settings, characters, stickerspack] = await Promise.all([
      loadTable('users', 'jid'),
      loadTable('chats', 'chat_id'),
      loadTable('settings', 'bot_jid'),
      loadTable('characters', 'id'),
      loadTable('stickerspack', 'id')
  ]);

  global.db.data = { users, chats, settings, characters, stickerspack };
  
  if (global.db.data.settings) {
      global.db.data.settings.mantenimiento = false;
  }

  global.db.chain = _.chain(global.db.data);
  
  // Load Diva Mood
  sqlDb.get(`SELECT value FROM bot_state WHERE key = 'divaMood'`, (err, row) => {
      if (row && row.value) {
          global.divaMood = parseInt(row.value);
      } else {
          global.divaMood = 100; // Default mood
          sqlDb.run(`INSERT INTO bot_state (key, value) VALUES ('divaMood', '100')`);
      }
      console.log(`[LUMIBOT DIVA] Estado de ánimo de la Queen: ${global.divaMood}%`);
  });

  global.db.READ = false;
  
  // Guardamos un deep clone o snapshot para detectar cambios
  global.db._snapshot = JSON.stringify(global.db.data);
  return global.db.data;
}

let isSaving = false;

global.saveDatabase = async function saveDatabase() {
  if (isSaving || !global.db.data) return;
  
  const currentSnapshot = JSON.stringify(global.db.data);
  if (global.db._snapshot === currentSnapshot) return;
  
  isSaving = true;
  try {
      // Guardado híbrido: Guardar en SQL los registros que hayan cambiado
      const oldData = JSON.parse(global.db._snapshot || '{}');
      const newData = global.db.data;

      const saveTableChanges = (table, keyCol, oldObj, newObj) => {
          return new Promise((resolve) => {
              let updates = [];
              for (let key in newObj) {
                  const newVal = JSON.stringify(newObj[key] || {});
                  const oldVal = JSON.stringify((oldObj && oldObj[key]) || {});
                  if (newVal !== oldVal) {
                      updates.push([key, newVal]);
                  }
              }

              if (updates.length === 0) return resolve();

              sqlDb.serialize(() => {
                  sqlDb.run('BEGIN TRANSACTION');
                  const stmt = sqlDb.prepare(`INSERT OR REPLACE INTO ${table} (${keyCol}, data) VALUES (?, ?)`);
                  updates.forEach(row => {
                      stmt.run(row[0], row[1]);
                  });
                  stmt.finalize();
                  sqlDb.run('COMMIT', () => resolve());
              });
          });
      };

      await Promise.all([
          saveTableChanges('users', 'jid', oldData.users, newData.users),
          saveTableChanges('chats', 'chat_id', oldData.chats, newData.chats),
          saveTableChanges('settings', 'bot_jid', oldData.settings, newData.settings),
          saveTableChanges('characters', 'id', oldData.characters, newData.characters),
          saveTableChanges('stickerspack', 'id', oldData.stickerspack, newData.stickerspack)
      ]);

      global.db._snapshot = currentSnapshot;
  } catch (err) {
      console.error("[LUMIBOT DB] Error guardando SQL:", err);
  } finally {
      isSaving = false;
  }
}

setInterval(() => {
  global.saveDatabase();
}, 5000)

export default global.db