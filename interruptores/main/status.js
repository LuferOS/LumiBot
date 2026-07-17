import os from 'os'
import { sizeFormatter } from 'human-readable'

function getDefaultHostId() {
  if (process.env.HOSTNAME) {
    return process.env.HOSTNAME.split('-')[0]
  }
  return 'LuferOS_Server'
}

const format = sizeFormatter({ std: 'JEDEC', decimalPlaces: 2, keepTrailingZeroes: false, render: (literal, symbol) => `${literal} ${symbol}B` })

export default {
  command: ['status', 'estado', 'info', 'infobot'],
  category: 'info',
  run: async (client, m) => {
    try {
      const hostId = getDefaultHostId()
      const db = global.db?.data || {}
      
      const registeredGroups = db.chats ? Object.keys(db.chats).length : 0
      const userCount = db.users ? Object.keys(db.users).length : 0
      const totalCommands = db.users ? Object.values(db.users).reduce((acc, user) => acc + (user.usedcommands || 0), 0) : 0
      
      const botId = client.user?.id?.split(':')[0] + "@s.whatsapp.net" || false
      const botSettings = db.settings?.[botId] || {}
      const botname = botSettings.botname || 'LumiBOT'
      
      const sistema = os.type()
      const cpu = os.cpus().length
      const ramTotal = format(os.totalmem())
      const ramUsada = format(os.totalmem() - os.freemem())
      const arquitectura = os.arch()
      
      const rss = format(process.memoryUsage().rss)
      const heapTotal = format(process.memoryUsage().heapTotal)
      const heapUsed = format(process.memoryUsage().heapUsed)

      // Cálculos de Uptime (agregado)
      const formatUptime = (seconds) => {
          const d = Math.floor(seconds / (3600 * 24));
          const h = Math.floor((seconds % (3600 * 24)) / 3600);
          const m = Math.floor((seconds % 3600) / 60);
          const s = Math.floor(seconds % 60);
          return `${d > 0 ? d + 'd ' : ''}${h}h ${m}m ${s}s`;
      };

      const textoEstado = `╭〔 📊 𝐋𝐔𝐌𝐈𝐁𝐎𝐓 〕⬣\n` +
                          `┃ ⚙️ 𝐄𝐒𝐓𝐀𝐃𝐎 𝐃𝐄𝐋 𝐒𝐈𝐒𝐓𝐄𝐌𝐀\n` +
                          `╰━━━━━━━━━━━━⬣\n\n` +
                          `┃ ⏱️ 𝐔𝐩𝐭𝐢𝐦𝐞: ${formatUptime(process.uptime())}\n` +
                          `┃ 🧠 𝐌𝐞𝐦. 𝐔𝐬𝐚𝐝𝐚: ${format(process.memoryUsage().rss)}\n` +
                          `┃ 🖥️ 𝐒.𝐎.: ${sistema} ${arquitectura}\n` +
                          `┃ 💎 𝐌𝐞𝐦. 𝐓𝐨𝐭𝐚𝐥: ${ramTotal}\n` +
                          `┃ 🍃 𝐌𝐞𝐦. 𝐋𝐢𝐛𝐫𝐞: ${format(os.freemem())}\n\n` +
                          `╰〔 ⚡ 𝐒𝐘𝐒𝐓𝐄𝐌 〕⬣`

      await client.sendMessage(m.chat, { 
        video: { url: 'https://i.pinimg.com/originals/a4/0b/4c/a40b4cd48a39cceabfbe2f1e6211bfcc.gif' }, 
        caption: textoEstado, 
        gifPlayback: true 
      }, { quoted: m })
      
    } catch (e) {
      console.error("[LUMIBOT DEBUG] Error en comando status:", e)
      await client.reply(m.chat, `╭⋯ ❌ *AY POR FAVOR* ⋯》\n┊ Me dio amnesia y no pude ver mi estado.\n╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》`, m)
    }
  }
}

function toNum(number) {
  if (number >= 1000 && number < 1000000) {
    return (number / 1000).toFixed(1) + 'k'
  } else if (number >= 1000000) {
    return (number / 1000000).toFixed(1) + 'M'
  } else {
    return number.toString()
  }
}
