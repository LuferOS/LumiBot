import { resolveLidToRealJid } from "../../nucleo/utils.js"

export default {
  command: ['top', 'topglobal'],
  category: 'rpg',
  run: async (client, m, args, command, text, prefix) => {
    const db = global.db.data
    const chatId = m.chat
    const chatData = db.chats[chatId]
    if (!chatData || !chatData.users) return m.reply(`💖 Aún no hay registros de actividad en este grupo.`)

    // Recolectar estadísticas totales de cada usuario
    const stats = Object.entries(chatData.users).map(([jid, user]) => {
      let totalMsgs = 0, totalAudios = 0, totalStickers = 0, totalMedia = 0;
      
      if (user.stats) {
        Object.values(user.stats).forEach(dayStat => {
          totalMsgs += (dayStat.msgs || 0)
          totalAudios += (dayStat.audios || 0)
          totalStickers += (dayStat.stickers || 0)
          totalMedia += (dayStat.media || 0)
        })
      }
      
      return { jid, totalMsgs, totalAudios, totalStickers, totalMedia, name: global.db.data.users[jid]?.name || '@' + jid.split('@')[0] }
    })

    // Función para obtener los 3 mejores y armar el texto
    const getTop3 = (array, key, icon, unit) => {
      const sorted = [...array].filter(u => u[key] > 0).sort((a, b) => b[key] - a[key]).slice(0, 3)
      if (sorted.length === 0) return `> ${icon} Sin registros aún.\n`
      let str = ''
      sorted.forEach((u, i) => {
        const medals = ['🥇', '🥈', '🥉']
        str += `> ${medals[i]} *${u.name}* » ${u[key]} ${unit}\n`
      })
      return str
    }

    let report = `╭⋯ 🏆 *RANKING DEL GRUPO* 🏆 ⋯》\n`
    report += `┊\n`
    
    report += `┊ 💬 *TOP MENSAJES*\n`
    report += getTop3(stats, 'totalMsgs', '💬', 'msgs')
    report += `┊\n`
    
    report += `┊ 🎵 *TOP AUDIOS*\n`
    report += getTop3(stats, 'totalAudios', '🎵', 'audios')
    report += `┊\n`
    
    report += `┊ 🎭 *TOP STICKERS*\n`
    report += getTop3(stats, 'totalStickers', '🎭', 'stickers')
    report += `┊\n`
    
    report += `┊ 🖼️ *TOP MEDIA (FOTOS/VIDEOS)*\n`
    report += getTop3(stats, 'totalMedia', '🖼️', 'archivos')
    
    report += `╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》`

    // Extraer JIDs para mencionarlos y que no aparezcan como números feos si no tienen nombre guardado
    // Pero en WhatsApp, usar `name` directo es más limpio si está disponible. Mencionarlos puede causar mucho spam de notificaciones.
    // Usaremos menciones silenciosas o normales.
    const mentions = stats.slice(0, 10).map(u => u.jid) // Solo para asegurar que se formatee bien si enviamos el texto.

    await client.reply(chatId, report, m, { mentions })
  }
}
