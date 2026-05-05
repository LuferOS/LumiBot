import fetch from 'node-fetch'
let WAMessageStubType = (await import('@whiskeysockets/baileys')).default
import chalk from 'chalk'

// ⚡ LUMIBOT OVERRIDE: Importamos el descifrador de LIDs de tu núcleo
import { resolveLidToRealJid } from '../nucleo/utils.js'

const _welcomeQueue = []
let _welcomeRunning = false

async function drainWelcomeQueue() {
  if (_welcomeRunning) return
  _welcomeRunning = true
  while (_welcomeQueue.length > 0) {
    const task = _welcomeQueue.shift()
    try { await task() } catch {}
    await new Promise(r => setTimeout(r, 8000))
  }
  _welcomeRunning = false
}

function queueWelcome(task) {
  _welcomeQueue.push(task)
  drainWelcomeQueue()
}

async function safeSend(client, jid, content, retries = 5) {
  for (let i = 0; i <= retries; i++) {
    try {
      return await client.sendMessage(jid, content)
    } catch (err) {
      const msg = String(err?.message || '')
      if (msg.includes('rate-overlimit') || msg.includes('rate') || err?.data === 429) {
        if (i < retries) {
          const delay = Math.min(8000 * (i + 1), 30000)
          await new Promise(r => setTimeout(r, delay))
          continue
        }
      }
      return null
    }
  }
  return null
}

export default async (client, m) => {
  client.ev.on('group-participants.update', async (anu) => {
    try {
      if (!anu || !anu.id || !anu.participants || !Array.isArray(anu.participants)) return;
      if (client.ws?.socket?.readyState !== 1) return;

      let metadata = {};
      try {
        const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 10000));
        metadata = await Promise.race([client.groupMetadata(anu.id), timeoutPromise]);
      } catch (err) {
        metadata = { subject: 'Grupo', participants: [] };
      }

      const chat = global?.db?.data?.chats?.[anu.id]
      const botId = client.user.id.split(':')[0] + '@s.whatsapp.net'
      const primaryBotId = chat?.primaryBot
      const memberCount = metadata.participants?.length || 0;
      const isSelf = global.db.data.settings[botId]?.self ?? false
      if (isSelf) return

      const botSettings = global.db.data.settings[botId] || {};
      const groupAdmins = metadata?.participants.filter(p => (p.admin === 'admin' || p.admin === 'superadmin')) || []

      for (const jid of anu.participants) {
        let validJid = jid;
        if (typeof jid === 'object' && jid !== null) validJid = jid.phoneNumber || jid.id || jid;
        if (typeof validJid === 'number') validJid = `${validJid}@s.whatsapp.net`;
        if (typeof validJid === 'string' && !validJid.includes('@')) validJid = `${validJid}@s.whatsapp.net`;
        if (!validJid || typeof validJid !== 'string' || !validJid.includes('@')) continue;
        
        // ⚡ LUMIBOT OVERRIDE: Desencriptar LID si el usuario está oculto
        if (validJid.includes('@lid')) {
          try {
            validJid = await resolveLidToRealJid(validJid, client, anu.id) || validJid;
          } catch (e) {
            console.error('[LUMIBOT DEBUG] Error resolviendo LID en welcome:', e);
          }
        }
        
        const phone = validJid.split('@')[0];
        
        let pp = 'https://i.imgur.com/8Q9N49Q.jpeg';
        for (let i = 0; i < 3; i++) {
          try {
            pp = await Promise.race([
              client.profilePictureUrl(validJid, 'image'),
              new Promise((_, r) => setTimeout(() => r(new Error('timeout')), 10000))
            ])
            break
          } catch {}
          if (i < 2) await new Promise(r => setTimeout(r, 3000))
        }
        
        const contextInfo = {
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
            newsletterJid: botSettings.id || '120363169294281316@newsletter',
            serverMessageId: '0',
            newsletterName: botSettings.nameid || '🛡️ LUMIBOT SECURITY 🛡️'
          },
          externalAdReply: {
            title: botSettings.namebot || 'SISTEMA LUMIBOT',
            body: global.dev || '© Powered by LuferOS Security',
            mediaUrl: null,
            description: null,
            previewType: 'PHOTO',
            thumbnailUrl: botSettings.icon || 'https://i.imgur.com/8Q9N49Q.jpeg',
            sourceUrl: botSettings.link || 'https://whatsapp.com/channel/0029VbCyJt3LI8YXFbH7QU1G',
            mediaType: 1,
            renderLargerThumbnail: false
          },
          mentionedJid: [validJid]
        };
        
        if (anu.action === 'add' && (!primaryBotId || primaryBotId === botId)) {
          queueWelcome(async () => {
            try {
              const caption = `╭⋯ 🚀 *NUEVO INGRESO* ⋯》\n┊ ⊳ *Usuario:* @${phone}\n┊ ⊳ *Grupo:* ${metadata.subject || 'Grupo'}\n┊ ⊳ *Miembros:* ${memberCount}\n┊┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈\n┊ 💡 Escribe *.menu* para ver todo\n┊ lo que puedo hacer por ti.\n╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》`;
              await safeSend(client, anu.id, { image: { url: pp }, caption, contextInfo })
            } catch {}
          })
        }
        
        if ((anu.action === 'remove' || anu.action === 'leave') && (!primaryBotId || primaryBotId === botId)) {
          queueWelcome(async () => {
            try {
              const caption = `╭⋯ 👋 *USUARIO SALIÓ* ⋯》\n┊ ⊳ *Usuario:* @${phone}\n┊ ⊳ *Miembros actuales:* ${memberCount}\n╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》`;
              await safeSend(client, anu.id, { image: { url: pp }, caption, contextInfo })
            } catch {}
          })
        }
        
        // Purga de "global.miku" en eventos administrativos
        if (anu.action === 'promote' && chat?.alerts && (!primaryBotId || primaryBotId === botId)) {
          const usuario = anu.author
          await safeSend(client, anu.id, { text: `[⚡] ⊳ *@${phone}* ahora es *Admin*.\nAcción realizada por: *@${usuario.split('@')[0]}*.`, mentions: [validJid, usuario, ...groupAdmins.map(v => v.id)] })
        }
        if (anu.action === 'demote' && chat?.alerts && (!primaryBotId || primaryBotId === botId)) {
          const usuario = anu.author
          await safeSend(client, anu.id, { text: `[⚠️] ⊳ *@${phone}* dejó de ser Admin.\nAcción realizada por: *@${usuario.split('@')[0]}*.`, mentions: [validJid, usuario, ...groupAdmins.map(v => v.id)] })
        }
      }
    } catch {}
  })
  
  client.ev.on('messages.upsert', async ({ messages }) => {
    const m = messages[0]
    if (!m.messageStubType) return
    const id = m.key.remoteJid
    const chat = global.db.data.chats[id]
    const botId = client.user.id.split(':')[0] + '@s.whatsapp.net'
    const primaryBotId = chat?.primaryBot
    if (!chat?.alerts || (primaryBotId && primaryBotId !== botId)) return
    const isSelf = global.db.data.settings[botId]?.self ?? false
    if (isSelf) return
    
    let actor = m.key?.participant || m.participant || m.key?.remoteJid
    
    if (actor && actor.includes('@lid')) {
      try {
        actor = await resolveLidToRealJid(actor, client, id) || actor;
      } catch (e) {
        console.error('[LUMIBOT DEBUG] Error resolviendo LID en evento stub:', e);
      }
    }
    
    const phone = actor.split('@')[0]
    const groupMetadata = await client.groupMetadata(id).catch(() => null)
    const groupAdmins = groupMetadata?.participants.filter(p => (p.admin === 'admin' || p.admin === 'superadmin')) || []
    
    // Purga de "global.miku" en notificaciones
    if (m.messageStubType == 21) {
      await safeSend(client, id, { text: `[⚙️] ⊳ *@${phone}* cambió el nombre del grupo a *${m.messageStubParameters[0]}*`, mentions: [actor, ...groupAdmins.map(v => v.id)] })
    }
    if (m.messageStubType == 22) {
      await safeSend(client, id, { text: `[🖼️] ⊳ *@${phone}* cambió la foto del grupo.`, mentions: [actor, ...groupAdmins.map(v => v.id)] })
    }
    if (m.messageStubType == 23) {
      await safeSend(client, id, { text: `[🔗] ⊳ *@${phone}* restableció el enlace de invitación.`, mentions: [actor, ...groupAdmins.map(v => v.id)] })
    }
    if (m.messageStubType == 24) {
      await safeSend(client, id, { text: `[📝] ⊳ *@${phone}* modificó la descripción del grupo.`, mentions: [actor, ...groupAdmins.map(v => v.id)] })
    }
    if (m.messageStubType == 25) {
      await safeSend(client, id, { text: `[🔒] ⊳ *@${phone}* ajustó los permisos. Ahora ${m.messageStubParameters[0] == 'on' ? 'solo los *Admins*' : 'todos los *Miembros*'} pueden editar la información del grupo.`, mentions: [actor, ...groupAdmins.map(v => v.id)] })
    }
    if (m.messageStubType == 26) {
      await safeSend(client, id, { text: `[💬] ⊳ *@${phone}* cambió la configuración del chat. ${m.messageStubParameters[0] === 'on' ? 'El grupo está cerrado (Solo Admins).' : 'El grupo está abierto para todos.'}`, mentions: [actor, ...groupAdmins.map(v => v.id)] })
    }
  })
}
