import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.resolve(__dirname, '../../../lumi_markov.db');

// Iniciar DB
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) console.error('[LUMIBOT DEBUG] Error abriendo SQLite Markov:', err.message);
});

// Crear tabla si no existe
db.serialize(() => {
  // Optimizaciones de rendimiento de Queen
  db.run(`PRAGMA journal_mode = WAL;`);
  db.run(`PRAGMA synchronous = NORMAL;`);
  
  db.run(`CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    chat_id TEXT NOT NULL,
    sender_jid TEXT NOT NULL,
    sender_name TEXT,
    message_text TEXT NOT NULL,
    timestamp INTEGER NOT NULL,
    message_id TEXT
  )`);
  
  // Añadir columna si venimos de la versión antigua (sin romper la BD)
  db.run(`ALTER TABLE messages ADD COLUMN message_id TEXT`, (err) => {
    // Si da error es porque la columna ya existe, lo cual está perfecto.
  });

  // Índices para búsquedas más rápidas
  db.run(`CREATE INDEX IF NOT EXISTS idx_chat ON messages(chat_id)`);
  db.run(`CREATE INDEX IF NOT EXISTS idx_message_id ON messages(message_id)`);
});

/**
 * Inserta un nuevo mensaje en la base de datos de aprendizaje.
 */
export function insertMessage(chatId, senderJid, senderName, messageText, timestamp, messageId = null) {
  return new Promise((resolve, reject) => {
    // Evitar textos vacíos, puros comandos o placeholders multimedia
    if (!messageText || messageText.startsWith('.') || messageText.startsWith('[')) return resolve();
    
    db.run(
      `INSERT INTO messages (chat_id, sender_jid, sender_name, message_text, timestamp, message_id) VALUES (?, ?, ?, ?, ?, ?)`,
      [chatId, senderJid, senderName, messageText, timestamp, messageId],
      function (err) {
        if (err) {
          reject(err);
        } else {
          // Log chismoso
          const shortMsg = messageText.length > 30 ? messageText.substring(0, 30) + '...' : messageText;
          console.log(chalk.gray(`[🧠 MARKOV-DB] Recolectando -> [${senderName || 'Desconocido'}]: ${shortMsg}`));
          resolve(this.lastID);
        }
      }
    );
  });
}

/**
 * Obtiene los N mensajes más recientes de un chat.
 */
export function getRecentMessages(chatId, limit = 5) {
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT sender_jid, sender_name, message_text, message_id FROM messages WHERE chat_id = ? ORDER BY id DESC LIMIT ?`,
      [chatId, limit],
      (err, rows) => {
        if (err) reject(err);
        else resolve(rows.reverse()); // De más antiguo a más reciente
      }
    );
  });
}

/**
 * Obtiene hasta N mensajes anteriores a un message_id específico, incluyendo el citado.
 */
export function getMessagesBeforeId(chatId, messageId, limit = 5) {
  return new Promise((resolve, reject) => {
    db.get(`SELECT id FROM messages WHERE message_id = ? AND chat_id = ?`, [messageId, chatId], (err, row) => {
      if (err) return reject(err);
      if (!row) return resolve([]); // Mensaje no encontrado
      
      const targetId = row.id;
      db.all(
        `SELECT sender_jid, sender_name, message_text, message_id FROM messages WHERE chat_id = ? AND id <= ? ORDER BY id DESC LIMIT ?`,
        [chatId, targetId, limit],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows.reverse());
        }
      );
    });
  });
}

/**
 * Obtiene una secuencia de N mensajes consecutivos de una posición aleatoria en el chat.
 */
export function getRandomConsecutiveMessages(chatId, numMessages = 3) {
  return new Promise((resolve, reject) => {
    db.get(`SELECT id FROM messages WHERE chat_id = ? ORDER BY RANDOM() LIMIT 1`, [chatId], (err, row) => {
      if (err) return reject(err);
      if (!row) return resolve([]);
      
      const targetId = row.id;
      db.all(
        `SELECT sender_jid, sender_name, message_text FROM messages WHERE chat_id = ? AND id >= ? ORDER BY id ASC LIMIT ?`,
        [chatId, targetId, numMessages],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    });
  });
}

/**
 * Obtiene los mensajes más recientes del chat para entender de qué se está hablando (contexto actual).
 */
export function getRecentContext(chatId, limit = 5) {
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT sender_name, message_text FROM messages WHERE chat_id = ? ORDER BY timestamp DESC LIMIT ?`,
      [chatId, limit],
      (err, rows) => {
        if (err) reject(err);
        // Los resultados vienen del más nuevo al más viejo, hay que invertirlos para lectura cronológica
        else resolve(rows.reverse());
      }
    );
  });
}

/**
 * Obtiene el contexto histórico específico de un usuario para que la IA sepa cómo habla.
 */
export function getUserContext(chatId, senderJid, limit = 10) {
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT message_text FROM messages WHERE chat_id = ? AND sender_jid = ? AND message_text NOT LIKE '[Envió %' ORDER BY timestamp DESC LIMIT ?`,
      [chatId, senderJid, limit],
      (err, rows) => {
        if (err) reject(err);
        else resolve(rows.map(r => r.message_text));
      }
    );
  });
}

/**
 * Obtiene mensajes aleatorios del chat de cualquier fecha en el pasado.
 */
export function getRandomQuotes(chatId, limit = 3) {
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT sender_name, message_text FROM messages WHERE chat_id = ? ORDER BY RANDOM() LIMIT ?`,
      [chatId, limit],
      (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      }
    );
  });
}

/**
 * Extrae una masa gigante de texto puro para el algoritmo de N-gramas matemáticos.
 * Excluye mensajes multimedia de la lectura para evitar basura en el algoritmo.
 */
export function getMassiveCorpus(chatId, limit = 500) {
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT message_text FROM messages WHERE chat_id = ? AND message_text NOT LIKE '[Envió %' ORDER BY RANDOM() LIMIT ?`,
      [chatId, limit],
      (err, rows) => {
        if (err) reject(err);
        else resolve(rows.map(r => r.message_text));
      }
    );
  });
}

/**
 * Obtiene el total de mensajes procesados por el Cerebro Markoviano.
 */
export function getMarkovMessageCount() {
  return new Promise((resolve, reject) => {
    db.get(`SELECT COUNT(*) as count FROM messages`, (err, row) => {
      if (err) reject(err);
      else resolve(row ? row.count : 0);
    });
  });
}
