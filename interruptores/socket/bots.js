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
      const name = data?.namebot || 'Sub-Nodo'
      const inGroup = groupParticipants.includes(jid) ? '✅' : '❌'
      return `┊   ${emoji} *${name}*\n┊   ⊳ wa.me/${number}\n┊   ⊳ Estado: ${inGroup}\n`
    }
    if (global.db.data.settings[mainBotJid]) {
      const name = global.db.data.settings[mainBotJid].namebot || 'LumiBOT Central'
      const handle = `@${mainBotJid.split('@')[0]}`
      if (isMainBotInGroup) {
        mentionedJid.push(mainBotJid)
        categorizedBots.Owner.push(`┊   👑 *${name}*\n┊   ⊳ wa.me/${mainBotJid.split('@')[0]}\n┊   ⊳ Estado: ✅\n`)
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
    const connectedSubs = global.conns.filter(c => c.userId && subs.includes(c.userId)).map(c => c.userId)

    let message = ''
    message += `╭⋯ 📡 *TOPOLOGÍA DE RED LUMIBOT* ⋯》\n`
    message += `┊\n`
    message += `┊ 📊 *MÉTRICAS GLOBALES*\n`
    message += `┊ ⊳ Nodos Totales: ${totalBots}\n`
    message += `┊ ⊳ Operativos en Sector: ${totalInGroup}\n`
    message += `┊ ⊳ Desplegados exterior: ${totalBots - totalInGroup}\n`
    message += `┊┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈\n`

    message += `┊ 👑 *NÚCLEO PRINCIPAL* (${totalCounts.Owner})\n`
    if (categorizedBots.Owner.length) {
      message += categorizedBots.Owner.join('\n') + '\n'
    } else {
      message += `┊   ∅ Fuera de este sector\n\n`
    }

    message += `┊┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈\n`
    message += `┊ 🤖 *SUB-NODOS ESCLAVOS* (${totalCounts.Sub})\n`
    if (categorizedBots.Sub.length) {
      message += categorizedBots.Sub.join('\n') + '\n'
    } else {
      message += `┊   ∅ Ninguno registrado\n\n`
    }

    message += `┊┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈\n`
    message += `┊ 📝 *LEYENDA DE DESPLIEGUE:*\n`
    message += `┊ [✅] En grupo | [❌] Fuera del grupo\n`
    message += `╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》`

    // ⚡ LUMIBOT OVERRIDE: Envío en texto puro, cero dependencias multimedia
    await client.sendMessage(m.chat, {
      text: message,
      mentions: mentionedJid
    }, { quoted: m })
  },
};
