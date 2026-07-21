import fs from 'fs';
import path from 'path';

const DB_PATH = path.resolve('database/coins.json');

// Asegurar que el directorio existe
const dir = path.dirname(DB_PATH);
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

// Cargar o inicializar
let _data = {};
try {
  if (fs.existsSync(DB_PATH)) {
    _data = JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
  }
} catch (e) {
  console.error('[COINS DB] Error al cargar coins.json, reiniciando:', e.message);
  _data = {};
}

// Guardar cada 10 segundos automáticamente
setInterval(() => {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(_data, null, 2));
  } catch (e) {
    console.error('[COINS DB] Error al guardar:', e.message);
  }
}, 10000);

// Guardar al cerrar el proceso
process.on('beforeExit', () => {
  try { fs.writeFileSync(DB_PATH, JSON.stringify(_data, null, 2)); } catch {}
});
process.on('SIGINT', () => {
  try { fs.writeFileSync(DB_PATH, JSON.stringify(_data, null, 2)); } catch {}
  process.exit();
});

/**
 * Obtener las coins de un usuario
 * @param {string} jid 
 * @returns {number}
 */
export function getCoins(jid) {
  return _data[jid] || 0;
}

/**
 * Obtener todos los balances (para topcoins)
 * @returns {object}
 */
export function getAllCoins() {
  return _data;
}

/**
 * Establecer las coins de un usuario
 * @param {string} jid 
 * @param {number} amount 
 */
export function setCoins(jid, amount) {
  _data[jid] = Math.floor(amount);
  return _data[jid];
}

/**
 * Agregar coins a un usuario
 * @param {string} jid 
 * @param {number} amount 
 * @returns {number} nuevo saldo
 */
export function addCoins(jid, amount) {
  _data[jid] = (_data[jid] || 0) + Math.floor(amount);
  return _data[jid];
}

/**
 * Quitar coins a un usuario
 * @param {string} jid 
 * @param {number} amount 
 * @returns {number} nuevo saldo
 */
export function removeCoins(jid, amount) {
  _data[jid] = (_data[jid] || 0) - Math.floor(amount);
  return _data[jid];
}

/**
 * Verificar si el usuario tiene suficientes coins
 * @param {string} jid 
 * @param {number} amount 
 * @returns {boolean}
 */
export function hasCoins(jid, amount) {
  return (_data[jid] || 0) >= amount;
}

/**
 * Obtener el top de usuarios por coins
 * @param {number} limit 
 * @returns {Array<{jid: string, coins: number}>}
 */
export function getTop(limit = 10) {
  return Object.entries(_data)
    .map(([jid, coins]) => ({ jid, coins }))
    .sort((a, b) => b.coins - a.coins)
    .slice(0, limit);
}

/**
 * Forzar guardado inmediato
 */
export function save() {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(_data, null, 2));
  } catch (e) {
    console.error('[COINS DB] Error al guardar:', e.message);
  }
}

export default { getCoins, setCoins, addCoins, removeCoins, hasCoins, getTop, save };
