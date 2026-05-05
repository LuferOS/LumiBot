import fetch from 'node-fetch'
let WAMessageStubType = (await import('@whiskeysockets/baileys')).default
import chalk from 'chalk'

const linkRegex = /(https?:\/\/)?(chat\.whatsapp\.com\/[0-9A-Za-z]{20,24}|whatsapp\.com\/channel\/[0-9A-Za-z]{20,24})/i

// ⚡ LUMIBOT OVERRIDE: Canal oficial autorizado. Brecha de seguridad sellada.
const allowedLinks = [
  'https://whatsapp.com/channel/0029VbCyJt3LI8YXFbH7QU1G',
  '0029VbCyJt3LI8YXFbH7QU1G' // Por si mandan solo el ID
]

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
  if (!m.isGroup || !m.text) return
  const groupMetadata = await client.groupMetadata(m.chat).catch(() => null)
  if (!groupMetadata) return
  
  const participants = groupMetadata.participants || []
  const groupAdmins = participants.filter(p => p.admin).map(p => p.phoneNumber || p.jid || p.id || p.lid)
  const isAdmin = groupAdmins.includes(m.sender)
  
  const botId = client.user.id.split(':')[0] + '@s.whatsapp.net'
  const isBotAdmin = groupAdmins.includes(botId)
  const isSelf = global.db.data.settings[botId]?.self ?? false
  if (isSelf) return
  
  const chat = global?.db?.data?.chats?.[m.chat]
  const primaryBotId = chat?.primaryBot
  const isPrimary = !primaryBotId || primaryBotId === botId
  
  const fullText = m.text + ' ' + (m.args || []).join(' ')
  const isGroupLink = linkRegex.test(fullText)
  const hasAllowedLink = allowedLinks.some(link => fullText.includes(link))
  const command = (m.command || '').toLowerCase();
  
  if (hasAllowedLink || !isGroupLink || !chat?.antilinks || isAdmin || !isBotAdmin || !isPrimary) return
  
  try {
    await safeSend(client, m.chat, { delete: { remoteJid: m.chat, fromMe: false, id: m.key.id, participant: m.key.participant }})
  } catch {}
  
  if (!(command === 'invite')) {
    const isChannelLink = /whatsapp\.com\/channel\//i.test(fullText)
    const userName = global.db.data.users[m.sender]?.name || 'Operativo'
    
    try {
      // ⚡ LUMIBOT OVERRIDE: Reporte de neutralización táctica
      const aviso = `╭⋯ ⚠️ *AMENAZA NEUTRALIZADA* ⋯》\n┊ ⊳ *Objetivo:* ${userName}\n┊ ⊳ *Infracción:* Spam de ${isChannelLink ? 'canal externo' : 'grupo no autorizado'}\n┊ ⊳ *Acción:* Eliminación de mensaje y expulsión.\n╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》`
      await safeSend(client, m.chat, { text: aviso, mentions: [m.sender], ...global.miku })
    } catch {}
    
    try {
      await client.groupParticipantsUpdate(m.chat, [m.sender], 'remove')
    } catch {}
  }
}
