import { resolveLidToRealJid } from "../../nucleo/utils.js"

export default {
  command: ['fantasmas', 'topinactive', 'topinactivos', 'topactivos', 'activos', 'delfantasmas', 'purgafantasmas'],
  category: 'group',
  isAdmin: true,
  run: async (client, m, args, command, text, prefix) => {
    if (!m.isGroup) return m.reply(`💖 Comando exclusivo de grupos.`)
    
    const chatId = m.chat
    const isDel = ['delfantasmas', 'purgafantasmas'].includes(command)
    const isTop = ['topactivos', 'activos'].includes(command)

    // Obtener participantes reales de WhatsApp
    const groupMetadata = await client.groupMetadata(chatId).catch(() => null)
    if (!groupMetadata) return m.reply(`💋 No pude obtener la información del grupo.`)

    const botJid = client.user?.id?.split(':')[0] + '@s.whatsapp.net'
    const admins = groupMetadata.participants.filter(p => p.admin).map(p => p.id)

    // Consultar SQL para stats del grupo
    const sqlStats = await new Promise((resolve, reject) => {
      if (!global.sqlDb) return resolve([])
      global.sqlDb.all(
        `SELECT jid, SUM(msgs) as totalMsgs FROM chat_stats WHERE chat_id = ? GROUP BY jid`,
        [chatId],
        (err, rows) => {
          if (err) { console.error('[SQL]', err); resolve([]); }
          else resolve(rows || []);
        }
      )
    })

    // Crear mapa de stats
    const statsMap = {}
    for (const row of sqlStats) {
      const cleanJid = row.jid.split(':')[0] + (row.jid.includes('@lid') ? '@lid' : '@s.whatsapp.net')
      statsMap[cleanJid] = (statsMap[cleanJid] || 0) + row.totalMsgs
    }

    // También revisar db.data.chats[chatId].activity como fallback
    const chatData = global.db?.data?.chats?.[chatId] || {}
    if (chatData.activity) {
      for (const [jid, ts] of Object.entries(chatData.activity)) {
        const cleanJid = jid.split(':')[0] + (jid.includes('@lid') ? '@lid' : '@s.whatsapp.net')
        if (!statsMap[cleanJid]) statsMap[cleanJid] = 1 // Al menos 1 si tiene actividad registrada
      }
    }

    let fantasmas = []
    let habladores = []

    for (let p of groupMetadata.participants) {
      let rawJid = p.id
      if (rawJid.includes('@lid')) {
        try { rawJid = await resolveLidToRealJid(rawJid, client, chatId) } catch {}
      }

      const cleanJid = rawJid.split(':')[0] + (rawJid.includes('@lid') ? '@lid' : '@s.whatsapp.net')
      if (cleanJid === botJid) continue

      const msgs = statsMap[cleanJid] || 0
      const isLid = cleanJid.includes('@lid')
      const nameDb = global.db?.data?.users?.[cleanJid]?.name
      const number = cleanJid.split('@')[0]
      const isAdmin = admins.some(a => a.split(':')[0] === cleanJid.split('@')[0])

      let displayName = nameDb ? nameDb : (isLid ? 'Usuario Oculto' : `@${number}`)

      if (msgs === 0) {
        fantasmas.push({ jid: cleanJid, originalJid: p.id, msgs, displayName, isAdmin })
      } else {
        habladores.push({ jid: cleanJid, originalJid: p.id, msgs, displayName, isAdmin })
      }
    }

    // ═══ COMANDO: .topactivos / .activos ═══
    if (isTop) {
      habladores.sort((a, b) => b.msgs - a.msgs)
      const top15 = habladores.slice(0, 15)

      let report = `╭━━〔 🏆 𝐓𝐎𝐏 𝐀𝐂𝐓𝐈𝐕𝐎𝐒 〕━━⬣\n`
      report += `┃ 📊 Total participantes: ${groupMetadata.participants.length}\n`
      report += `┃ 🗣️ Activos: ${habladores.length} | 👻 Fantasmas: ${fantasmas.length}\n`
      report += `┃\n`

      if (top15.length === 0) {
        report += `┃ Nadie ha hablado aún.\n`
      } else {
        const medals = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟', '1️⃣1️⃣', '1️⃣2️⃣', '1️⃣3️⃣', '1️⃣4️⃣', '1️⃣5️⃣']
        top15.forEach((u, i) => {
          report += `┃ ${medals[i] || `${i+1}.`} *${u.displayName}* » \`${u.msgs} msgs\`\n`
        })
      }

      report += `╰━━━━━━━━━━━━━━━━━━⬣`

      const mentions = top15.map(u => u.jid).filter(j => j.includes('@s.whatsapp.net'))
      return client.reply(chatId, report, m, { mentions })
    }

    // ═══ COMANDO: .delfantasmas ═══
    if (isDel) {
      // Solo owner o admin puede purgar
      const senderIsOwner = global.owner.map(num => num + '@s.whatsapp.net').includes(m.sender)
      const senderIsAdmin = admins.some(a => a.split(':')[0] === m.sender.split(':')[0])

      if (!senderIsOwner && !senderIsAdmin) {
        return m.reply(`╭━━〔 🛑 𝐀𝐂𝐂𝐄𝐒𝐎 𝐃𝐄𝐍𝐄𝐆𝐀𝐃𝐎 〕━━⬣\n┃ Solo los Administradores pueden purgar fantasmas.\n╰━━━━━━━━━━━━━━━━━━⬣`)
      }

      // Filtrar: no expulsar admins ni LIDs no resueltos
      const toKick = fantasmas.filter(u => !u.isAdmin && u.jid.includes('@s.whatsapp.net'))

      if (toKick.length === 0) {
        return m.reply(`╭━━〔 ✅ 𝐒𝐈𝐍 𝐅𝐀𝐍𝐓𝐀𝐒𝐌𝐀𝐒 〕━━⬣\n┃ No hay fantasmas que se puedan expulsar.\n┃ (Los admins están protegidos)\n╰━━━━━━━━━━━━━━━━━━⬣`)
      }

      await m.reply(`╭━━〔 ☠️ 𝐏𝐔𝐑𝐆𝐀 𝐅𝐀𝐍𝐓𝐀𝐒𝐌𝐀 〕━━⬣\n┃ Expulsando a *${toKick.length}* fantasmas...\n┃ (Admins protegidos ✅)\n╰━━━━━━━━━━━━━━━━━━⬣`)

      let kicked = 0
      let failed = 0
      for (const ghost of toKick) {
        try {
          await client.groupParticipantsUpdate(chatId, [ghost.originalJid], 'remove')
          kicked++
          // Pequeña pausa para no saturar
          await new Promise(r => setTimeout(r, 1500))
        } catch (e) {
          failed++
        }
      }

      return m.reply(`╭━━〔 ✅ 𝐏𝐔𝐑𝐆𝐀 𝐂𝐎𝐌𝐏𝐋𝐄𝐓𝐀 〕━━⬣\n┃ 👻 Expulsados: ${kicked}\n┃ ❌ Fallidos: ${failed}\n┃ 🛡️ Admins protegidos: ${fantasmas.filter(u => u.isAdmin).length}\n╰━━━━━━━━━━━━━━━━━━⬣`)
    }

    // ═══ COMANDO: .fantasmas / .topinactivos ═══
    habladores.sort((a, b) => b.msgs - a.msgs)

    let report = `╭━━〔 👻 𝐈𝐍𝐅𝐎𝐑𝐌𝐄 𝐃𝐄 𝐀𝐂𝐓𝐈𝐕𝐈𝐃𝐀𝐃 〕━━⬣\n`
    report += `┃ 📊 Total participantes: ${groupMetadata.participants.length}\n`
    report += `┃ 🗣️ Activos: ${habladores.length} | 👻 Fantasmas: ${fantasmas.length}\n`
    report += `┃\n`

    report += `┃ 🗣️ *𝐓𝐎𝐏 𝐂𝐇𝐀𝐑𝐋𝐀𝐓𝐀𝐍𝐄𝐒 (𝐌𝐀́𝐒 𝐀𝐂𝐓𝐈𝐕𝐎𝐒)*\n`
    const topHabladores = habladores.slice(0, 5)
    if (topHabladores.length === 0) {
      report += `┃ > Nadie ha hablado aún.\n`
    } else {
      const medals = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣']
      topHabladores.forEach((u, i) => {
        report += `┃ ${medals[i]} *${u.displayName}* » \`${u.msgs} msgs\`\n`
      })
    }

    report += `┃\n`
    report += `┃ ☠️ *𝐅𝐀𝐍𝐓𝐀𝐒𝐌𝐀𝐒 𝐑𝐄𝐀𝐋𝐄𝐒 (0 𝐌𝐄𝐍𝐒𝐀𝐉𝐄𝐒)*\n`

    if (fantasmas.length === 0) {
      report += `┃ > ¡Increíble! No hay fantasmas en este grupo.\n`
    } else {
      report += `┃ > Hay *${fantasmas.length}* fantasmas rondando...\n`
      const listFantasmas = fantasmas.slice(0, 20)
      listFantasmas.forEach(u => {
        const adminBadge = u.isAdmin ? ' 🛡️' : ''
        report += `┃ > 👻 ${u.displayName}${adminBadge}\n`
      })
      if (fantasmas.length > 20) {
        report += `┃ > ... y ${fantasmas.length - 20} fantasmas más.\n`
      }
      const kickable = fantasmas.filter(u => !u.isAdmin && u.jid.includes('@s.whatsapp.net')).length
      if (kickable > 0) {
        report += `┃\n┃ 💡 Usa *.delfantasmas* para expulsar a los ${kickable} fantasmas no-admin.\n`
      }
    }

    report += `╰━━━━━━━━━━━━━━━━━━⬣`

    const mentions = [...topHabladores, ...fantasmas.slice(0, 20)].map(u => u.jid).filter(j => j.includes('@s.whatsapp.net'))
    await client.reply(chatId, report, m, { mentions })
  }
}