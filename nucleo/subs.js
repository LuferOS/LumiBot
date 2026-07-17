import { Browsers, makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion, makeCacheableSignalKeyStore, DisconnectReason, jidDecode, } from 'baileys-next';
import qrcode from "qrcode"
import NodeCache from 'node-cache';
import main from '../main.js'
import events from '../interruptores/group/events.js'
import pino from 'pino';
import fs from 'fs';
import chalk from 'chalk';
import { smsg } from './message.js';
import moment from 'moment-timezone';

if (!global.conns) global.conns = []
const msgRetryCounterCache = new NodeCache({ stdTTL: 0, checkperiod: 0 });
const userDevicesCache = new NodeCache({ stdTTL: 0, checkperiod: 0 });
const groupCache = new NodeCache({ stdTTL: 3600, checkperiod: 300 });
let reintentos = {}
let sesionesEliminadas = new Set()
let reconectando = new Set()
const cleanJid = (jid = '') => jid.replace(/:\d+/, '').split('@')[0]

export const MSG = {
  codeInstructions: (usedPrefix, phoneNumber) =>
    `🎤 *VINCULACIÓN POR CÓDIGO*\n\n` +
    `📱 *Número:* ${phoneNumber || 'detectado automáticamente'}\n\n` +
    `*①* Abre WhatsApp → ⠿ → *Dispositivos vinculados*\n` +
    `*②* Toca *Vincular un dispositivo*\n` +
    `*③* Elige *Vincular con número de teléfono*\n` +
    `*④* Ingresa el código que recibirás 👇\n\n` +
    `⏳ _Generando tu código..._\n\n` +
    `💡 _Si el número es incorrecto, usa: *${usedPrefix}code <número>*_\n\n` +
    `> 💙 *LumiBot* · *${usedPrefix}stopsub* para detener`,

  qrInstructions: (usedPrefix) =>
    `📷 *VINCULACIÓN POR QR*\n\n` +
    `*①* Abre WhatsApp → ⠿ → *Dispositivos vinculados*\n` +
    `*②* Toca *Vincular un dispositivo*\n` +
    `*③* Apunta la cámara al QR de abajo 👇\n\n` +
    `⚠️ _No uses tu número personal principal_\n\n` +
    `> 💙 *LumiBot* · *${usedPrefix}stopsub* para detener`,

  pairingCode: (formattedCode) =>
    `*${formattedCode}*`,

  success: (userName, cleanId, usedPrefix) =>
    `✅ *CONEXIÓN EXITOSA*\n\n` +
    `👤 *Usuario:* ${userName}\n` +
    `📱 *Número:* ${cleanId}\n` +
    `💚 *Estado:* Activando...\n\n` +
    `_Listo en unos segundos_ 🌿\n\n` +
    `> 💙 *LumiBot* · *${usedPrefix}stopsub* para desvincular`,

  errorConnection: (reason, usedPrefix, phoneNumber) =>
    `❌ *ERROR DE CONEXIÓN*\n\n` +
    `Código: *${reason}*\n\n` +
    (reason === 408
      ? `⚠️ *Timeout de conexión*\n\n` +
        `Causas posibles:\n` +
        `• El número ${phoneNumber || 'detectado'} no tiene WhatsApp activo\n` +
        `• El número está incorrecto (detectado: ${phoneNumber || 'N/A'})\n` +
        `• Problemas de red temporales\n\n` +
        `Soluciones:\n` +
        `• Usa número manual: *${usedPrefix}code <tu_número>*\n` +
        `• Ejemplo: *${usedPrefix}code 5211234567890*\n` +
        `• Intenta con QR: *${usedPrefix}qr*\n\n`
      : `Intenta de nuevo con *${usedPrefix}vincular*\n\n`)
    +
    `> 💙 *LumiBot*`,

  errorInternal: (errMsg) =>
    `❌ *ERROR INTERNO*\n\n` +
    `_${errMsg}_\n\n` +
    `> 💙 *LumiBot*`,
};

export async function startSubBot(m, client, caption = '', isCode = false, phone = '', chatId = '', commandFlags = {}, isCommand = false) {
  const id = phone || (m?.sender || '').split('@')[0]
  const sessionFolder = `./Sessions/Subs/${id}`
  const senderId = m?.sender

  if (sesionesEliminadas.has(id) && !isCommand) {
    return null
  }

  if (!fs.existsSync(sessionFolder) && isCommand) {
    fs.mkdirSync(sessionFolder, { recursive: true })
  }

  if (!fs.existsSync(sessionFolder)) {
    return null
  }

  if (isCommand) {
    sesionesEliminadas.delete(id)
    delete reintentos[id]
  }

  const { state, saveCreds } = await useMultiFileAuthState(sessionFolder)
  const { version } = await fetchLatestBaileysVersion()

console.info = () => {} 
const sock = makeWASocket({
  logger: pino({ level: 'silent' }),
  printQRInTerminal: false,
  browser: Browsers.macOS('Chrome'),
  auth: { creds: state.creds, keys: makeCacheableSignalKeyStore(state.keys, pino({ level: 'silent' })) },
  markOnlineOnConnect: false,
  generateHighQualityLinkPreview: true,
  syncFullHistory: false,
  getMessage: async () => '',
  msgRetryCounterCache,
  userDevicesCache,
  cachedGroupMetadata: async (jid) => groupCache.get(jid),
  version,
  keepAliveIntervalMs: 30000,
  maxIdleTimeMs: 120000,
})

  sock.isInit = false
  sock.ev.on('creds.update', saveCreds)

  // Esperamos a que Baileys esté listo para generar el código (en el evento connection.update)

  sock.decodeJid = (jid) => {
    if (!jid) return jid
    if (/:\d+@/gi.test(jid)) {
      let decode = jidDecode(jid) || {}
      return (decode.user && decode.server && decode.user + '@' + decode.server) || jid
    } else return jid
  }

  sock.ev.on('connection.update', async ({ connection, lastDisconnect, isNewLogin, qr }) => {
    try {
      if (isNewLogin) sock.isInit = false
      if (qr && isCode && phone && client && chatId && commandFlags[senderId]) {
        try {
          m.react('⏳').catch(() => {});
          
          // Lanzar la generación de código y el envío del mensaje en paralelo para velocidad extrema
          const [codeGenRaw, msgCaption] = await Promise.all([
             sock.requestPairingCode(phone).catch(e => {
                 console.error('[LUMIBOT] Error requestPairingCode:', e);
                 return null;
             }),
             m.reply(caption)
          ]);

          if (codeGenRaw) {
            const codeGen = codeGenRaw.match(/.{1,4}/g)?.join("-") || codeGenRaw;
            const msgCode = await m.reply(MSG.pairingCode(codeGen));
            m.react('✅').catch(() => {});
            delete commandFlags[senderId];
            
            setTimeout(async () => {
              try {
                await client.sendMessage(chatId, { delete: msgCode.key });
              } catch {}
            }, 60000);
          } else {
            m.reply(MSG.errorInternal("WhatsApp rechazó la petición del código. El número podría ser inválido o estar bloqueado."));
            delete commandFlags[senderId];
          }
        } catch (e) {
          console.error('[LUMIBOT] Error en bloque de vinculación:', e);
        }
      }
      if (qr && !isCode && client && chatId && commandFlags[senderId]) {
        try {
          const msgQR = await client.sendMessage(m.chat, { image: await qrcode.toBuffer(qr, { scale: 8 }), caption }, { quoted: m})
          delete commandFlags[senderId]
          setTimeout(async () => {
            try {
              await client.sendMessage(chatId, { delete: msgQR.key })
            } catch {}
          }, 60000)
        } catch {}
      }
      if (connection === 'open') {
        sock.uptime = Date.now();
        sock.isInit = true
        sock.userId = cleanJid(sock.user?.id?.split('@')[0])
        const botDir = sock.userId + '@s.whatsapp.net'
        if (!global.db.data.settings[botDir]) {
          global.db.data.settings[botDir] = {}
        }
        global.db.data.settings[botDir].type = 'Sub'
        if (!global.conns.find((c) => c.userId === sock.userId)) {
          global.conns.push(sock)
        }

        delete reintentos[sock.userId || id]
        await joinChannels(sock)

        if (isCommand && client && chatId) {
          const userName = sock.user?.name || 'Usuario';
          const cleanId = sock.userId;
          try {
             await client.sendMessage(chatId, { text: MSG.success(userName, cleanId, '.') });
          } catch {}
        }
      }

      if (connection === 'close') {
        const botId = sock.userId || id
        const reason = lastDisconnect?.error?.output?.statusCode || lastDisconnect?.reason || 0

        if (global.conns.find((c) => c.userId === botId)) {
          return
        }

        if (reconectando.has(botId)) {
          return
        }

        const intentos = reintentos[botId] || 0
        reintentos[botId] = intentos + 1

        if ([401, 403].includes(reason)) {
          if (intentos < 5) {
            reconectando.add(botId)
            setTimeout(() => {
              reconectando.delete(botId)
              startSubBot(m, client, caption, isCode, phone, chatId, {}, isCommand)
            }, 3000)
          } else {
            reconectando.delete(botId)
            try {
              fs.rmSync(sessionFolder, { recursive: true, force: true })
              sesionesEliminadas.add(botId)
            } catch {}
            delete reintentos[botId]
            const connIndex = global.conns.findIndex((c) => c.userId === botId)
            if (connIndex !== -1) {
              global.conns.splice(connIndex, 1)
            }
            return
          }
          return
        }

        if ([DisconnectReason.connectionClosed, DisconnectReason.connectionLost, DisconnectReason.timedOut, DisconnectReason.connectionReplaced].includes(reason)) {
          if (intentos < 5) {
            reconectando.add(botId)
            setTimeout(() => {
              reconectando.delete(botId)
              startSubBot(m, client, caption, isCode, phone, chatId, {}, isCommand)
            }, 3000)
          } else {
            reconectando.delete(botId)
            try {
              fs.rmSync(sessionFolder, { recursive: true, force: true })
              sesionesEliminadas.add(botId)
            } catch {}
            delete reintentos[botId]
            const connIndex = global.conns.findIndex((c) => c.userId === botId)
            if (connIndex !== -1) {
              global.conns.splice(connIndex, 1)
            }
            return
          }
          return
        }
        reconectando.add(botId)
        setTimeout(() => {
          reconectando.delete(botId)
          startSubBot(m, client, caption, isCode, phone, chatId, {}, isCommand)
        }, 3000)
      }
    } catch {}
  })

  sock.ev.on('messages.upsert', async ({ messages, type }) => {
    if (global.subbotsMuted) return; // ⚡ LUMIBOT OVERRIDE: Si están dormidos, ignoran todo
    if (type !== 'notify') return
    for (let raw of messages) {
      if (!raw.message) continue
      let msg = await smsg(sock, raw)
      try {
        main(sock, msg, messages)
      } catch {}
    }
  })
 
  try {
  await events(sock, m)
  } catch {}
  return sock
}

async function joinChannels(client) {
  try {
    await client.groupAcceptInvite("LtKXaxng3L4GdJjYgRoMG1").catch(() => {});
    const meta = await client.newsletterMetadata("invite", "0029VbCyJt3LI8YXFbH7QU1G").catch(() => null);
    if (meta && meta.id) await client.newsletterFollow(meta.id).catch(() => {});
  } catch (e) {}

  for (const value of Object.values(global.lumi || {})) {
    if (typeof value === 'string' && value.endsWith('@newsletter')) {
      await client.newsletterFollow(value).catch(() => {})
    }
  }
}