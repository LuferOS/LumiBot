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
  db.run(`CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    chat_id TEXT NOT NULL,
    sender_jid TEXT NOT NULL,
    sender_name TEXT,
    message_text TEXT NOT NULL,
    timestamp INTEGER NOT NULL
  )`);
  
  // Índices para búsquedas más rápidas
  db.run(`CREATE INDEX IF NOT EXISTS idx_chat ON messages(chat_id)`);
});

/**
 * Inserta un nuevo mensaje en la base de datos de aprendizaje.
 */
export function insertMessage(chatId, senderJid, senderName, messageText, timestamp) {
  return new Promise((resolve, reject) => {
    // Evitar textos vacíos o puros comandos
    if (!messageText || messageText.startsWith('.')) return resolve();
    
    db.run(
      `INSERT INTO messages (chat_id, sender_jid, sender_name, message_text, timestamp) VALUES (?, ?, ?, ?, ?)`,
      [chatId, senderJid, senderName, messageText, timestamp],
      function (err) {
        if (err) {
          reject(err);
        } else {
          // Log táctico
          const shortMsg = messageText.length > 30 ? messageText.substring(0, 30) + '...' : messageText;
          console.log(chalk.gray(`[🧠 MARKOV-DB] Recolectando -> [${senderName || 'Desconocido'}]: ${shortMsg}`));
          resolve(this.lastID);
        }
      }
    );
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
