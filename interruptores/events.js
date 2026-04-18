import fetch from 'node-fetch'
let WAMessageStubType = (await import('@whiskeysockets/baileys')).default
import chalk from 'chalk'

const _welcomeQueue = []
let _welcomeRunning = false

async function drainWelcomeQueue() {
  if (_welcomeRunning) return
  _welcomeRunning = true
  while (_welcomeQueue.length > 0) {
    const task = _welcomeQueue.shift()
    try { await task() } catch {}
    await new Promise(r => setTimeout(r, 3500))
  }
  _welcomeRunning = false
}

function queueWelcome(task) {
  _welcomeQueue.push(task)
  drainWelcomeQueue()
}

async function safeSend(client, jid, content, retries = 2) {
  for (let i = 0; i <= retries; i++) {
    try {
      return await client.sendMessage(jid, content)
    } catch (err) {
      const msg = String(err?.message || '')
      if (msg.includes('rate-overlimit') || msg.includes('rate') || err?.data === 429) {
        if (i < retries) {
          await new Promise(r => setTimeout(r, 4000 * (i + 1)))
          continue
        }
      }
      throw err
    }
  }
}

export default async (client, m) => {
  client.ev.on('group-participants.update', async (anu) => {
    try {
      if (!anu || !anu.id || !anu.participants || !Array.isArray(anu.participants)) {
        return;
      }

      if (client.ws?.socket?.readyState !== 1) {
        return;
      }

      let metadata = {};
      try {
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Timeout')), 3000)
        );
        metadata = await Promise.race([
          client.groupMetadata(anu.id),
          timeoutPromise
        ]);
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
        
        if (typeof jid === 'object' && jid !== null) {
          validJid = jid.phoneNumber || jid.id || jid;
        }
        
        if (typeof validJid === 'number') {
          validJid = `${validJid}@s.whatsapp.net`;
        }
        
        if (typeof validJid === 'string' && !validJid.includes('@')) {
          validJid = `${validJid}@s.whatsapp.net`;
        }
        
        if (!validJid || typeof validJid !== 'string' || !validJid.includes('@')) {
          continue;
        }
        
        const phone = validJid.split('@')[0];
        
        let pp = 'https://i.pinimg.com/736x/0c/1e/f8/0c1ef8e804983e634fbf13df1044a41f.jpg';
        try {
          pp = await Promise.race([
            client.profilePictureUrl(validJid, 'image'),
            new Promise((_, r) => setTimeout(() => r(new Error('timeout')), 4000))
          ])
        } catch {}
        
        const contextInfo = {
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
            newsletterJid: botSettings.id || '120363315369913363@newsletter',
            serverMessageId: '0',
            newsletterName: botSettings.nameid || '💙 HATSUNE MIKU CHANNEL💙'
          },
          externalAdReply: {
            title: botSettings.namebot || 'HATSUNE MIKU',
            body: global.dev || '© 🄿🄾🅆🄴🅁🄴🄳 (ㅎㅊDEPOOLㅊㅎ)',
            mediaUrl: null,
            description: null,
            previewType: 'PHOTO',
            thumbnailUrl: botSettings.icon || 'https://i.pinimg.com/736x/30/42/b8/3042b89ced13fefda4e75e3bc6dc2a57.jpg',
            sourceUrl: botSettings.link || 'https://www.whatsapp.com/channel/0029VajYamSIHphMAl3ABi1o',
            mediaType: 1,
            renderLargerThumbnail: false
          },
          mentionedJid: [validJid]
        };
        
        if (anu.action === 'add' && (!primaryBotId || primaryBotId === botId)) {
          const customMessage = chat.sWelcome ? chat.sWelcome.replace(/{usuario}/g, `@${phone}`).replace(/{grupo}/g, metadata.subject).replace(/{desc}/g, metadata?.desc || 'Sin descripción') : '';
          
          queueWelcome(async () => {
            try {
              const caption = customMessage || `╭━━━🌸━━━💙━━━🌸━━━╮
┃  🎵 *¡ Bienvenid${phone.endsWith('a') ? 'a' : 'o'} al grupo !* 🎵
╰━━━🌸━━━💙━━━🌸━━━╯
│
├◦ 🌸 *Usuario* ⟶ @${phone}
├◦ 💙 *Grupo* ⟶ ${metadata.subject || 'Grupo'}
├◦ 🌱 *Miembros* ⟶ Ahora somos ${memberCount}
│
├━━━━━━━━━━━━━━━━━━╮
│ 🌱 Usa */menu* para ver comandos.
│ 💙 ¡Que disfrutes tu estancia! ✨
╰━━━🌸━━━💙━━━🌸━━━╯`;
              await safeSend(client, anu.id, { image: { url: pp }, caption, contextInfo })
            } catch (err) {
              if (!err.message?.includes('Connection') && !err.message?.includes('Timeout')) {
                console.log(chalk.yellow(`💙 Welcome: Error bienvenida - ${err.message}`))
              }
            }
          })
        }
        
        if ((anu.action === 'remove' || anu.action === 'leave') && (!primaryBotId || primaryBotId === botId)) {
          const customMessage = chat.sGoodbye ? chat.sGoodbye.replace(/{usuario}/g, `@${phone}`).replace(/{grupo}/g, metadata.subject).replace(/{desc}/g, metadata?.desc || 'Sin descripción') : '';
          
          queueWelcome(async () => {
            try {
              const caption = customMessage || `╭━━━🌸━━━💙━━━🌸━━━╮
┃  🎵 *¡ Hasta pronto !* 🎵
╰━━━🌸━━━💙━━━🌸━━━╯
│
├◦ 🌸 *Usuario* ⟶ @${phone}
├◦ 💙 *Grupo* ⟶ ${metadata.subject || 'Grupo'}
├◦ 🌱 *Miembros* ⟶ Ahora somos ${memberCount}
│
├━━━━━━━━━━━━━━━━━━╮
│ 🌸 Fue un placer tenerte aquí.
│ 💙 ¡Esperamos verte de nuevo! ✨
╰━━━🌸━━━💙━━━🌸━━━╯`;
              await safeSend(client, anu.id, { image: { url: pp }, caption, contextInfo })
            } catch (err) {
              if (!err.message?.includes('Connection') && !err.message?.includes('Timeout')) {
                console.log(chalk.yellow(`💙 Welcome: Error despedida - ${err.message}`))
              }
            }
          })
        }
        if (anu.action === 'promote' && chat?.alerts && (!primaryBotId || primaryBotId === botId)) {
          const usuario = anu.author
          await client.sendMessage(anu.id, { text: `💙 *@${phone}* ha sido promovido a Administrador por *@${usuario.split('@')[0]}.*`, mentions: [validJid, usuario, ...groupAdmins.map(v => v.id)], ...global.miku })
        }
        if (anu.action === 'demote' && chat?.alerts && (!primaryBotId || primaryBotId === botId)) {
          const usuario = anu.author
          await client.sendMessage(anu.id, { text: `💙 *@${phone}* ha sido degradado de Administrador por *@${usuario.split('@')[0]}.*`, mentions: [validJid, usuario, ...groupAdmins.map(v => v.id)], ...global.miku })
        }
      }
    } catch (err) {
      if (!err.message?.includes('Connection Closed') && !err.message?.includes('Timeout')) {
        console.log(chalk.gray(`💙 Welcome Error → ${err.message}`));
      }
    }
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
  const actor = m.key?.participant || m.participant || m.key?.remoteJid
  const phone = actor.split('@')[0]
  const groupMetadata = await client.groupMetadata(id).catch(() => null)
  const groupAdmins = groupMetadata?.participants.filter(p => (p.admin === 'admin' || p.admin === 'superadmin')) || []
  if (m.messageStubType == 21) {
    await client.sendMessage(id, { text: `💙 @${phone} cambió el nombre del grupo a *${m.messageStubParameters[0]}*`, mentions: [actor, ...groupAdmins.map(v => v.id)], ...global.miku })
  }
  if (m.messageStubType == 22) {
    await client.sendMessage(id, { text: `💙 @${phone} cambió el icono del grupo.`, mentions: [actor, ...groupAdmins.map(v => v.id)], ...global.miku })
  }
  if (m.messageStubType == 23) {
    await client.sendMessage(id, { text: `💙 @${phone} restableció el enlace del grupo.`, mentions: [actor, ...groupAdmins.map(v => v.id)], ...global.miku })
  }
  if (m.messageStubType == 24) {
    await client.sendMessage(id, { text: `💙 @${phone} cambió la descripción del grupo.`, mentions: [actor, ...groupAdmins.map(v => v.id)], ...global.miku })
  }
  if (m.messageStubType == 25) {
    await client.sendMessage(id, { text: `💙 @${phone} cambió los ajustes del grupo para permitir que ${m.messageStubParameters[0] == 'on' ? 'solo admins' : 'todos'} puedan configurar el grupo.`, mentions: [actor, ...groupAdmins.map(v => v.id)], ...global.miku })
  }
  if (m.messageStubType == 26) {
    await client.sendMessage(id, { text: `💙 @${phone} cambió los ajustes del grupo para permitir que ${m.messageStubParameters[0] === 'on' ? 'solo los administradores puedan enviar mensajes al grupo.' : 'todos los miembros puedan enviar mensajes al grupo.'}`, mentions: [actor, ...groupAdmins.map(v => v.id)], ...global.miku })
  }
})
}
