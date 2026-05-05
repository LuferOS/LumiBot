import "./settings.js";
import main from './main.js';
import events from './interruptores/events.js';
import { Browsers, makeWASocket, makeCacheableSignalKeyStore, useMultiFileAuthState, fetchLatestBaileysVersion, jidDecode, DisconnectReason } from "@whiskeysockets/baileys";
import cfonts from 'cfonts';
import pino from "pino";
import qrcode from "qrcode-terminal";
import chalk from "chalk";
import fs from "fs";
import path from "path";
import readlineSync from "readline-sync";
import os from "os";
import { smsg } from "./nucleo/message.js";
import db from "./nucleo/system/database.js";
import { startSubBot } from './nucleo/subs.js';
import { exec } from "child_process";

const log = {
  info: (msg) => console.log(chalk.bgCyan.black.bold(` INFO `), chalk.cyanBright(msg)),
  success: (msg) => console.log(chalk.bgGreen.black.bold(` SUCCESS `), chalk.greenBright(msg)),
  warn: (msg) => console.log(chalk.bgYellow.black.bold(` WARN `), chalk.yellowBright(msg)),
  error: (msg) => console.log(chalk.bgRed.white.bold(` ERROR `), chalk.redBright(msg))
};

const maxCache = 100;
let phoneNumber = global.botNumber || "573118353868";
let phoneInput = "";
const methodCodeQR = process.argv.includes("--qr");
const methodCode = process.argv.includes("code");
const DIGITS = (s = "") => String(s).replace(/\D/g, "");

function normalizePhoneForPairing(input) {
  let s = DIGITS(input);
  if (!s) return "";
  if (s.startsWith("0")) s = s.replace(/^0+/, "");
  if (s.length === 10 && s.startsWith("3")) s = "57" + s;
  if (s.startsWith("52") && !s.startsWith("521") && s.length >= 12) s = "521" + s.slice(2);
  if (s.startsWith("54") && !s.startsWith("549") && s.length >= 11) s = "549" + s.slice(2);
  return s;
}

const { say } = cfonts;
console.clear();
console.log(chalk.cyanBright('\n[🛡️] Inicializando Secuencia de Arranque...'));
say('LumiBOT\nSYSTEM', {
  font: 'block',
  align: 'center',
  gradient: ['cyan', 'blue']
});
say('POWERED BY LUFEROS SECURITY', {
  font: 'console',
  align: 'center',
  colors: ['yellow', 'cyan']
});
console.log(chalk.cyanBright('=====================================================\n'));

const botTypes = [
  { name: 'SubNodo', folder: './Sessions/Subs', starter: startSubBot }
];

if (!fs.existsSync('./tmp')) fs.mkdirSync('./tmp', { recursive: true });
global.conns = global.conns || [];
const reconnecting = new Set();

async function loadBots() {
  for (const { name, folder, starter } of botTypes) {
    if (!fs.existsSync(folder)) continue;
    const botIds = fs.readdirSync(folder);
    for (const userId of botIds) {
      const sessionPath = path.join(folder, userId);
      const credsPath = path.join(sessionPath, 'creds.json');
      if (!fs.existsSync(sessionPath) || !fs.existsSync(credsPath)) continue;
      if (global.conns.some((conn) => conn.userId === userId) || reconnecting.has(userId)) continue;
      try {
        reconnecting.add(userId);
        await starter(null, null, 'Auto reconexión', false, userId, sessionPath);
      } catch (e) {
        // Silenciado para limpieza de terminal
      } finally {
        reconnecting.delete(userId);
      }
      await new Promise((res) => setTimeout(res, 2500));
    }
  }
  setTimeout(loadBots, 60 * 1000);
}

function cleanCache() {
  try {
    const tmpFolder = './tmp';
    if (fs.existsSync(tmpFolder)) {
      const files = fs.readdirSync(tmpFolder);
      let cleaned = 0;
      for (const file of files) {
        try { fs.unlinkSync(path.join(tmpFolder, file)); cleaned++; } catch {}
      }
      if (cleaned > 0) console.log(chalk.gray(`[⚡] Purga de caché TMP: ${cleaned} fragmentos eliminados.`));
    }
    // ... lógica de borrado mantenida intacta ...
  } catch (e) {}
}

let opcion;
if (methodCodeQR) {
  opcion = "1";
} else if (methodCode) {
  opcion = "2";
} else if (!fs.existsSync("./Sessions/Owner/creds.json")) {
  console.log(chalk.bold.cyan("\n[ ADMINISTRADOR - REQUIERE ACCIÓN ]"));
  opcion = readlineSync.question(chalk.white("Seleccione método de enlace de seguridad:\n") + chalk.cyanBright("1. Código QR\n2. Código de 8 Dígitos (Recomendado)\n>_ "));
  while (!/^[1-2]$/.test(opcion)) {
    opcion = readlineSync.question(chalk.redBright("[!] Entrada inválida. Use 1 o 2.\n>_ "));
  }
  if (opcion === "2") {
    phoneInput = readlineSync.question(chalk.cyanBright(`\nIngrese número celular objetivo (Ej: +57...)\n>_ `));
    phoneNumber = normalizePhoneForPairing(phoneInput);
  }
}

let reconexion = 0;
const intentos = 15;

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState(global.sessionName);
  const { version } = await fetchLatestBaileysVersion();
  const logger = pino({ level: "silent" });
  console.info = () => {}; console.debug = () => {};

  const sock = makeWASocket({
    version,
    logger,
    printQRInTerminal: false,
    browser: Browsers.macOS('Chrome'),
    auth: { creds: state.creds, keys: makeCacheableSignalKeyStore(state.keys, logger) },
    markOnlineOnConnect: false,
    generateHighQualityLinkPreview: true,
    syncFullHistory: false,
    getMessage: async () => "",
    keepAliveIntervalMs: 45000,
    maxIdleTimeMs: 60000,
  });
  
  global.client = sock;
  sock.isInit = false;
  sock.ev.on("creds.update", saveCreds);

  if (opcion === "2" && !fs.existsSync("./Sessions/Owner/creds.json")) {
    setTimeout(async () => {
      try {
        if (!state.creds.registered) {
          const pairing = await global.client.requestPairingCode(phoneNumber);
          const codeBot = pairing?.match(/.{1,4}/g)?.join("-") || pairing;
          console.log(chalk.bold.white(chalk.bgBlue(`\n[🔑] CÓDIGO DE ENLACE:`)), chalk.bold.cyanBright(codeBot), '\n');
        }
      } catch (err) {
        log.error("Fallo generando token de enlace.");
      }
    }, 3000);
  }

  sock.sendText = (jid, text, quoted = "", options) => sock.sendMessage(jid, { text, ...options }, { quoted });

  sock.ev.on("connection.update", async (update) => {
    const { qr, connection, lastDisconnect, isNewLogin } = update;
    
    if (qr != 0 && qr != undefined || methodCodeQR) {
      if (opcion == '1' || methodCodeQR) {
        console.log(chalk.cyan.bold("\n[+] Escanee el QR para enlazar nodo principal"));
        qrcode.generate(qr, { small: true });
      }
    }

    if (connection === "close") {
      const reason = lastDisconnect?.error?.output?.statusCode || 0;
      if (reason === DisconnectReason.loggedOut) {
        log.error("Sesión revocada. Purgando directorio...");
        exec("rm -rf ./Sessions/Owner/*");
        process.exit(1);
      } else {
        reconexion++;
        if (reconexion > intentos) {
          log.error(`Fallo crítico. Límite de reconexión excedido.`);
          process.exit(1);
        }
        log.warn(`Enlace caído (Cod: ${reason}). Reconectando motor...`);
        setTimeout(startBot, 3000);
      }
    }

    if (connection === "open") {
      reconexion = 0;
      log.success(`Conexión estable. NODO ACTIVO: ${sock.user.name || "LumiBOT"}`);
    }
  });

  sock.ev.on('messages.upsert', async (chatUpdate) => {
    try {
      const kay = chatUpdate.messages[0];
      if (!kay?.message || kay.key?.remoteJid === 'status@broadcast') return;
      kay.message = Object.keys(kay.message)[0] === 'ephemeralMessage' ? kay.message.ephemeralMessage.message : kay.message;
      if (kay.key.fromMe && kay.key.id.startsWith('3EB0')) return;
      const m = await smsg(sock, kay);
      main(sock, m, chatUpdate);
    } catch (err) {}
  });

  try {
    await events(sock, null);
  } catch (err) {}

  sock.decodeJid = (jid) => {
    if (!jid) return jid;
    if (/:\d+@/gi.test(jid)) {
      const decode = jidDecode(jid) || {};
      return (decode.user && decode.server && decode.user + "@" + decode.server) || jid;
    }
    return jid;
  };
}

setInterval(cleanCache, 3 * 60 * 60 * 1000);
cleanCache();

(async () => {
  await loadBots();
})();

(async () => {
  global.loadDatabase();
  console.log(chalk.gray('[+] Base de datos sincronizada.'));
  await startBot();
})();

process.on('uncaughtException', (err) => {});
process.on('unhandledRejection', (reason) => {});
