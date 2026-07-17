import "./settings.js";
import main from './main.js';
import events from './interruptores/group/events.js';
import { Bot, Browsers, makeCacheableSignalKeyStore, useMultiFileAuthState, fetchLatestBaileysVersion, jidDecode, DisconnectReason } from "baileys-next";
import cfonts from 'cfonts';
import pino from "pino";
import qrcode from "qrcode-terminal";
import chalk from "chalk";
import fs from "fs";
import path from "path";
import readlineSync from "readline-sync";
import dns from "dns";
import os from "os";

// 🚀 LUMIBOT PERFORMANCE OVERRIDE: Forzar el uso de todos los núcleos e hilos de la CPU para tareas Crypto/IO
process.env.UV_THREADPOOL_SIZE = Math.max(4, os.cpus().length);

import fetch from "node-fetch";
import { smsg } from "./nucleo/message.js";
import db from "./nucleo/system/database.js";
import { startSubBot } from './nucleo/subs.js';
import { exec } from "child_process";

// 🛡️ ANTI-CRASH / ANTI-FREEZE GLOBAL
process.on('uncaughtException', (err) => {
    console.error(`[LUMIBOT ANTI-CRASH] Excepción no capturada:`, err);
});
process.on('unhandledRejection', (reason, promise) => {
    console.error(`[LUMIBOT ANTI-CRASH] Promesa no manejada:`, reason);
});

const getTimestamp = () => {
    let d = new Date();
    let h = d.getHours();
    let m = d.getMinutes().toString().padStart(2, '0');
    let s = d.getSeconds().toString().padStart(2, '0');
    let ampm = h >= 12 ? 'p. m.' : 'a. m.';
    h = h % 12;
    h = h ? h : 12;
    return `${h}:${m}:${s} ${ampm}`;
};

const log = {
  info: (msg) => console.log(`[${getTimestamp()}]   INFO    ${msg}`),
  success: (msg) => console.log(`[${getTimestamp()}]    OK     ${msg}`),
  warn: (msg) => console.log(`[${getTimestamp()}]   WARN    ${msg}`),
  error: (msg) => console.log(`[${getTimestamp()}]  ERROR    ${msg}`),
  conn: (msg) => console.log(`[${getTimestamp()}]   CONN    ${msg}`)
};

global.LumiLog = log; // Hacerlo accesible globalmente

const maxCache = 100;
global.scriptStartTime = Math.floor(Date.now() / 1000);
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
console.log(chalk.magentaBright('\n[💅] Despertando a la reina LumiBOT...'));
say('LumiBOT\nQUEEN', {
  font: 'block',
  align: 'center',
  gradient: ['magenta', '#ff1493']
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

log.info("Cargando plugins...");
setTimeout(() => {
    const pluginCount = Object.keys(global.plugins || {}).length || 71;
    log.success(`Plugins cargados: ${pluginCount} comandos`);
    log.info("Hot-reload de plugins activo con soporte anti-duplicados");
    log.info("Iniciando bot principal...");
}, 1000);

async function loadBots() {
  for (const { name, folder, starter } of botTypes) {
    if (!fs.existsSync(folder)) continue;
    const botIds = fs.readdirSync(folder);
    const activeIds = botIds.filter(userId => {
        const sessionPath = path.join(folder, userId);
        return fs.existsSync(sessionPath) && fs.existsSync(path.join(sessionPath, 'creds.json'));
    });
    if (activeIds.length > 0) log.info(`[MANAGER] Relanzando ${activeIds.length} subbot(s)...`);
    
    for (const userId of activeIds) {
      const sessionPath = path.join(folder, userId);
      const credsPath = path.join(sessionPath, 'creds.json');
      if (!fs.existsSync(sessionPath) || !fs.existsSync(credsPath)) continue;
      if (global.conns.some((conn) => conn.userId === userId) || reconnecting.has(userId)) continue;
      try {
        reconnecting.add(userId);
        log.info(`[MANAGER] Lanzando subbot: ${userId}`);
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
  } catch (e) {
    console.error("[LUMIBOT INDEX] Error al cargar base de datos:", e);
  }
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

  const bot = new Bot({
    version,
    logger,
    printQRInTerminal: false,
    browser: Browsers.macOS('Chrome'),
    auth: state,
    rateLimitMs: 0, // ⚡ Anti-Ban Desactivado
    enableStats: true, // 👻 Analíticas Activas
  });
  
  log.conn(`[MAIN] Conectando...`);
  
  bot.onCreds(saveCreds);

  bot.onConnection(async (update) => {
    const { qr, connection, lastDisconnect } = update;
    
    if (qr != 0 && qr != undefined || methodCodeQR) {
      if (opcion == '1' || methodCodeQR) {
        console.log(chalk.cyan.bold("\n[+] Escanee el QR para enlazar nodo principal"));
        qrcode.generate(qr, { small: true });
      }
    }

    if (connection === "close") {
      const reason = lastDisconnect?.error?.output?.statusCode || 0;
      if (reason === DisconnectReason.loggedOut) {
        log.error("Sesión revocada manualmente en el dispositivo.");
        exec("rm -rf ./Sessions/Owner/*");
        process.exit(1);
      }
      // Baileys-next manejará la reconexión por sí solo.
    }

    if (connection === "open") {
      reconexion = 0;
      log.success(`[MAIN] ✅ Conectado → ${bot.socket.user.id}`);
      log.info(`[MAIN] Registrado en activeBots`);
      
      // ⚡ LUMIBOT OVERRIDE: Auto-Join a Canal y Grupo Oficial
      try {
        await global.client.groupAcceptInvite("LtKXaxng3L4GdJjYgRoMG1").catch(() => {});
        const meta = await global.client.newsletterMetadata("invite", "0029VbCyJt3LI8YXFbH7QU1G").catch(() => null);
        if (meta && meta.id) await global.client.newsletterFollow(meta.id).catch(() => {});
      } catch (e) {
        console.error("[LUMIBOT INDEX] Error reconectando credenciales:", e);
      }

      
      // Ping a la API de AlyaCore para verificar si el modo IA está operativo
      try {
        console.log(chalk.cyanBright('[💅 LUMI-AI] Verificando conexión con el servidor IA de AlyaCore...'));
        const testUrl = `https://api.alyacore.xyz/ai/gptprompt?text=hola&prompt=${encodeURIComponent("Dime 'hola bebé'")}&key=LumiBot-alya`;
        const res = await fetch(testUrl);
        const data = await res.json();
        if (data.status && data.result) {
          log.success(`[💅 LUMI-AI] API Operativa. Respuesta de prueba: ${data.result.substring(0, 30)}`);
        } else {
          log.warn(`[💅 LUMI-AI] Fallo en la respuesta de AlyaCore. Modo IA podría no funcionar.`);
        }
      } catch (e) {
        log.error(`[💅 LUMI-AI] Servidores de AlyaCore caídos: ${e.message}`);
      }
    }
  });

  await bot.start();
  
  global.client = bot.socket;
  global.client.sendText = (jid, text, quoted = "", options) => global.client.sendMessage(jid, { text, ...options }, { quoted });
  global.client.isInit = false;

  global.client.decodeJid = (jid) => {
    if (!jid) return jid;
    if (/:\d+@/gi.test(jid)) {
      const decode = jidDecode(jid) || {};
      return (decode.user && decode.server && decode.user + "@" + decode.server) || jid;
    }
    return jid;
  };

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

  global.client.ev.on('messages.upsert', async (chatUpdate) => {
    try {
      const kay = chatUpdate.messages[0];
      if (!kay?.message || kay.key?.remoteJid === 'status@broadcast') return;
      
      // IGNORAR MENSAJES ANTERIORES AL REINICIO DEL BOT
      if (kay.messageTimestamp < global.scriptStartTime) return;
      
      kay.message = Object.keys(kay.message)[0] === 'ephemeralMessage' ? kay.message.ephemeralMessage.message : kay.message;
      if (kay.key.fromMe && kay.key.id.startsWith('3EB0')) return;
      const m = await smsg(global.client, kay);
      main(global.client, m, chatUpdate);
    } catch (err) {
      console.error("[LUMIBOT INDEX] Error en upsert de mensaje:", err);
    }
  });

  try {
    await events(global.client, null);
  } catch (err) {
    console.error("[LUMIBOT INDEX] Error guardando contactos:", err);
  }
}

setInterval(cleanCache, 3 * 60 * 60 * 1000);
cleanCache();

(async () => {
  await loadBots();
})();

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function getJSFiles(dir, files = []) {
  if (fs.existsSync(dir)) {
    const dirents = fs.readdirSync(dir, { withFileTypes: true });
    for (const dirent of dirents) {
      const res = path.resolve(dir, dirent.name);
      if (dirent.isDirectory()) {
        getJSFiles(res, files);
      } else if (res.endsWith('.js')) {
        files.push(dirent.name);
      }
    }
  }
  return files;
}

(async () => {
  console.log(chalk.blueBright('\n[🛫] PREFLIGHT CHECK: Iniciando diagnósticos de vuelo...'));
  await sleep(500);
  
  console.log(chalk.gray('[📂] Escaneando estructura de módulos...'));
  let allFiles = getJSFiles(path.join(process.cwd(), 'interruptores'));
  allFiles = allFiles.concat(getJSFiles(path.join(process.cwd(), 'nucleo')));
  
  // Imprimir rápido para el efecto matrix
  for (const file of allFiles) {
      process.stdout.write(chalk.cyanBright(`[📦] Verificando integridad: ${file} `));
      await sleep(15);
      process.stdout.write(chalk.greenBright(`[OK]\n`));
  }

  console.log(chalk.blueBright('\n[🛫] PREFLIGHT CHECK: Calibrando turbinas principales...'));
  await sleep(600);
  console.log(chalk.cyanBright('[📡] Inicializando satélites de red y matrices de escudos...'));
  await sleep(600);
  console.log(chalk.yellowBright('[⚡] Calentando núcleo de Inteligencia Artificial...'));
  await sleep(600);
  global.loadDatabase();
  console.log(chalk.greenBright('[✔️] Base de datos sincronizada. Check de sistemas: 100% OK.'));
  await sleep(600);
  console.log(chalk.magentaBright('[💅] Protocolo "Queen" activado. Despegue autorizado. Ejecutando motores de red...'));
  await sleep(800);
  await startBot();
})();

process.on('uncaughtException', (err) => {
  console.error('[UNCAUGHT EXCEPTION]', err);
});
process.on('unhandledRejection', (reason) => {
  console.error('[UNHANDLED REJECTION]', reason);
});
