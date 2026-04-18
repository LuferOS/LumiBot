import fs from 'fs';
import path from 'path';
import ws from 'ws';
import { fileURLToPath } from 'url';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default {
  command: ['bots', 'sockets'],
  category: 'socket',
  run: async (client, m) => {
    const botId = client.user.id.split(':')[0] + '@s.whatsapp.net'
    const bot = global.db.data.settings[botId]
    const botname = bot.botname
    const namebot = bot.namebot
    const banner = bot.icon
    const from = m.key.remoteJid
    const groupMetadata = m.isGroup ? await client.groupMetadata(from).catch(() => {}) : ''
    const groupParticipants = groupMetadata?.participants?.map((p) => p.phoneNumber || p.jid || p.lid || p.id) || []
    const mainBotJid = global.client.user.id.split(':')[0] + '@s.whatsapp.net'
    const isMainBotInGroup = groupParticipants.includes(mainBotJid)
    const basePath = path.join(dirname, '../../Sessions')
    const getBotsFromFolder = (folderName) => {
      const folderPath = path.join(basePath, folderName)
      if (!fs.existsSync(folderPath)) return []
      return fs.readdirSync(folderPath).filter((dir) => {
          const credsPath = path.join(folderPath, dir, 'creds.json')
          return fs.existsSync(credsPath)
        }).map((id) => id.replace(/\D/g, ''))
    }
    const subs = getBotsFromFolder('Subs')
    const categorizedBots = { Owner: [], Sub: [] }
    const mentionedJid = []
    const formatBot = (number, emoji, label) => {
      const jid = number + '@s.whatsapp.net'
      mentionedJid.push(jid)
      const data = global.db.data.settings[jid]
      const name = data?.namebot || 'Bot'
      const inGroup = groupParticipants.includes(jid) ? '✅' : '❌'
      return `🌱 *${name}* › wa.me/${number} ${inGroup}`
    }
    if (global.db.data.settings[mainBotJid]) {
      const name = global.db.data.settings[mainBotJid].namebot || 'Bot'
      const handle = `@${mainBotJid.split('@')[0]}`
      if (isMainBotInGroup) {
        mentionedJid.push(mainBotJid)
        categorizedBots.Owner.push(`💙 *${name}* › wa.me/${mainBotJid.split('@')[0]} ✅`)
      }
    }
    subs.forEach((num) => {
      const line = formatBot(num, '🤖', 'Sub')
      categorizedBots.Sub.push(line)
    })

    const inGroupCounts = {
      Owner: isMainBotInGroup ? 1 : 0,
      Sub: subs.filter(num => groupParticipants.includes(`${num}@s.whatsapp.net`)).length
    }

    const totalCounts = {
      Owner: global.db.data.settings[mainBotJid] ? 1 : 0,
      Sub: subs.length,
    }
    const totalBots = totalCounts.Owner + totalCounts.Sub
    const totalInGroup = inGroupCounts.Owner + inGroupCounts.Sub
    let message = ''
    message += `💙🎵 *BOTS ACTIVOS* 🎵💙\n\n`
    message += `🌱 *Total registrados:* ${totalBots}\n`
    message += `💙 *En este grupo:* ${totalInGroup}\n`
    message += `❌ *No en grupo:* ${totalBots - totalInGroup}\n\n`
    message += `━━━━━━━━━━━━━━━━━━\n\n`
    message += `👑 *PRINCIPAL* (${totalCounts.Owner})\n\n`
    if (categorizedBots.Owner.length) {
      message += categorizedBots.Owner.join('\n') + '\n\n'
    } else {
      message += `  ∅ No registrado\n\n`
    }

    message += `━━━━━━━━━━━━━━━━━━\n\n`
    message += `🤖 *SUBS* (${totalCounts.Sub})\n\n`

    if (categorizedBots.Sub.length) {
      message += categorizedBots.Sub.join('\n') + '\n\n'
    } else {
      message += `  ∅ Ninguno registrado\n\n`
    }

    message += `✨ Leyenda: ✅ En grupo | ❌ Fuera del grupo\n\n`
    message += `✨ *HATSUNE MIKU BOT*`

    await client.sendContextInfoIndex(m.chat, message, {}, m, true, mentionedJid)
  },
};
