import { resolveLidToRealJid } from "../../nucleo/utils.js"

export default {
  command: ['fantasmas', 'topinactive', 'topinactivos'],
  category: 'group',
  isAdmin: true,
  run: async (client, m, args, command, text, prefix) => {
    if (!m.isGroup) return m.reply(`💖 Comando exclusivo de grupos.`)

    const db = global.db.data
    const chatId = m.chat
    const chatData = db.chats[chatId] || { users: {} }

    // Obtener participantes reales de WhatsApp
    const groupMetadata = await client.groupMetadata(chatId).catch(() => null)
    if (!groupMetadata) return m.reply(`💋 No pude obtener la información del grupo.`)

    const botJid = client.user?.id?.split(':')[0] + '@s.whatsapp.net'

    // Mapa de estadísticas desde DB
    const dbStats = {}
    Object.entries(chatData.users).forEach(([jid, user]) => {
      let totalMsgs = 0
      if (user.stats) {
        Object.values(user.stats).forEach(dayStat => {
          totalMsgs += (dayStat.msgs || 0)
        })
      }
      // Asegurar que el JID de la DB sea limpio
      const cleanJid = jid.split(':')[0] + (jid.includes('@lid') ? '@lid' : '@s.whatsapp.net')
      dbStats[cleanJid] = totalMsgs
    })

    let fantasmas = []
    let habladores = []

    for (let p of groupMetadata.participants) {
      // Intentar resolver LID si es necesario
      let rawJid = p.id
      if (rawJid.includes('@lid')) {
        rawJid = await resolveLidToRealJid(rawJid, client, chatId)
      }
      
      const cleanJid = rawJid.split(':')[0] + (rawJid.includes('@lid') ? '@lid' : '@s.whatsapp.net')
      if (cleanJid === botJid) continue

      const msgs = dbStats[cleanJid] || 0
      const isLid = cleanJid.includes('@lid')
      const nameDb = db.users[cleanJid]?.name
      const number = cleanJid.split('@')[0]
      
      // Si es LID y no tenemos nombre, lo llamamos Usuario Oculto
      let displayName = nameDb ? nameDb : (isLid ? 'Usuario Oculto' : `@${number}`)

      if (msgs === 0) {
        fantasmas.push({ jid: cleanJid, msgs, displayName })
      } else {
        habladores.push({ jid: cleanJid, msgs, displayName })
      }
    }

    // Ordenar habladores (Mayor a Menor)
    habladores.sort((a, b) => b.msgs - a.msgs)

    let report = `╭⋯ 👻 *INFORME DE ACTIVIDAD* 👻 ⋯》\n`
    report += `┊\n`

    report += `┊ 🗣️ *TOP CHARLATANES (MÁS ACTIVOS)*\n`
    const topHabladores = habladores.slice(0, 5)
    if (topHabladores.length === 0) {
      report += `> Nadie ha hablado aún.\n`
    } else {
      topHabladores.forEach((u, i) => {
        report += `> *${i + 1}.* ${u.displayName} » \`${u.msgs} msgs\`\n`
      })
    }
    
    report += `┊\n`
    report += `┊ ☠️ *FANTASMAS REALES (0 MENSAJES)*\n`
    
    if (fantasmas.length === 0) {
      report += `> ¡Increíble! No hay fantasmas en este grupo.\n`
    } else {
      report += `> Hay *${fantasmas.length}* fantasmas rondando...\n`
      const listFantasmas = fantasmas.slice(0, 15)
      listFantasmas.forEach(u => {
        report += `> 👻 ${u.displayName}\n`
      })
      if (fantasmas.length > 15) {
        report += `> ... y ${fantasmas.length - 15} fantasmas más.\n`
      }
    }

    report += `╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》`

    // Menciones: Filtramos los LIDs porque no son mencionables directamente y causan texto plano feo
    const mentions = [...topHabladores, ...fantasmas.slice(0, 15)].map(u => u.jid).filter(j => j.includes('@s.whatsapp.net'))

    await client.reply(chatId, report, m, { mentions })
  }
}