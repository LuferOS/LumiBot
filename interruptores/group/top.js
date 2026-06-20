import { resolveLidToRealJid } from "../../nucleo/utils.js"

export default {
  command: ['top', 'topglobal'],
  category: 'rpg',
  run: async (client, m, args, command, text, prefix) => {
    const chatId = m.chat;

    // Ejecutar consulta pura SQL para obtener las estadísticas consolidadas del grupo de forma ultra rápida
    const query = `
      SELECT 
        jid, 
        SUM(msgs) as totalMsgs, 
        SUM(audios) as totalAudios, 
        SUM(stickers) as totalStickers, 
        SUM(media) as totalMedia
      FROM chat_stats
      WHERE chat_id = ?
      GROUP BY jid
    `;

    global.sqlDb.all(query, [chatId], async (err, rows) => {
      if (err) {
        console.error('[LUMIBOT SQL] Error consultando top:', err);
        return m.reply('🙄 Ocurrió un error al consultar las estadísticas en la base de datos.');
      }

      if (!rows || rows.length === 0) {
        return m.reply(`💖 Aún no hay registros de actividad en este grupo.`);
      }

      // Función para obtener los 3 mejores y armar el texto
      const getTop3 = (array, key, icon, unit) => {
        const sorted = [...array].filter(u => u[key] > 0).sort((a, b) => b[key] - a[key]).slice(0, 3)
        if (sorted.length === 0) return `> ${icon} Sin registros aún.\n`
        let str = ''
        sorted.forEach((u, i) => {
          const medals = ['🥇', '🥈', '🥉']
          const name = global.db.data.users[u.jid]?.name || '@' + u.jid.split('@')[0]
          str += `> ${medals[i]} *${name}* » ${u[key]} ${unit}\n`
        })
        return str
      }

      let report = `╭⋯ 🏆 *RANKING DEL GRUPO* 🏆 ⋯》\n`
      report += `┊\n`
      
      report += `┊ 💬 *TOP MENSAJES*\n`
      report += getTop3(rows, 'totalMsgs', '💬', 'msgs')
      report += `┊\n`
      
      report += `┊ 🎵 *TOP AUDIOS*\n`
      report += getTop3(rows, 'totalAudios', '🎵', 'audios')
      report += `┊\n`
      
      report += `┊ 🎭 *TOP STICKERS*\n`
      report += getTop3(rows, 'totalStickers', '🎭', 'stickers')
      report += `┊\n`
      
      report += `┊ 🖼️ *TOP MEDIA (FOTOS/VIDEOS)*\n`
      report += getTop3(rows, 'totalMedia', '🖼️', 'archivos')
      
      report += `╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》`

      // Extraer JIDs de los que están en el top 10 general
      const topOverall = [...rows].sort((a, b) => (b.totalMsgs + b.totalAudios + b.totalStickers + b.totalMedia) - (a.totalMsgs + a.totalAudios + a.totalStickers + a.totalMedia)).slice(0, 10);
      const mentions = topOverall.map(u => u.jid);

      await client.reply(chatId, report, m, { mentions });
    });
  }
}
