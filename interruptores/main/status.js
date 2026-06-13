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

      const textoEstado = `╭⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》
┊ 💅 ✨ *STATUS DE LA REINA* ✨ 💅
┊┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
┊ 📊 *MI POPULARIDAD*
┊ ⊳ *Identidad:* ${botname}
┊ ⊳ *Simps (Usuarios):* ${userCount.toLocaleString()}
┊ ⊳ *Grupos de Chisme:* ${registeredGroups.toLocaleString()}
┊ ⊳ *Órdenes dadas:* ${toNum(totalCommands)}
┊┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
┊ ⚙️ *MI CUERPAZO (SERVIDOR)*
┊ ⊳ *Sistema:* ${sistema} (${arquitectura})
┊ ⊳ *Cerebros:* ${cpu} Cores
┊ ⊳ *Energía Total:* ${ramTotal}
┊ ⊳ *Energía Gastada:* ${ramUsada}
┊ ⊳ *Casa:* ${hostId}
┊┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
┊ 🧠 *MI SALUD MENTAL (NODE.JS)*
┊ ⊳ *Estrés:* ${rss}
┊ ⊳ *Memoria ocupada:* ${heapUsed} / ${heapTotal}
╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》`

      await client.reply(m.chat, textoEstado, m)
      
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
