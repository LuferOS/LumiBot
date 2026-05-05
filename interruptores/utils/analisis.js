import moment from 'moment'

export default {
  command: ['listado', 'analisis', 'reporte', 'fantasmas'],
  category: 'fun',
  run: async (client, m, args, usedPrefix, command) => {
    try {
      if (!m.isGroup) return m.reply('╭⋯ ⚠️ ERROR TÁCTICO ⋯》\n┊ Este escáner es exclusivo para sectores grupales.\n╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》')

      await m.react('🔬')

      const groupMetadata = await client.groupMetadata(m.chat).catch(() => null)
      const participants = groupMetadata?.participants || []
      const usersDB = global.db.data.users || {}
      
      const now = Date.now()
      const fantasmas = []
      const inactivos = []
      const habladores = []
      
      // 1. CLASIFICACIÓN DE ACTIVOS Y PASIVOS
      for (let p of participants) {
        const user = usersDB[p.id]
        const lastSeen = user?.lastCmd || 0
        const totalMsgs = user?.usedcommands || 0

        if (!user || totalMsgs === 0) {
          fantasmas.push(p.id)
        } else if (now - lastSeen > 24 * 60 * 60 * 1000) { 
          inactivos.push({ id: p.id, time: lastSeen })
        } else {
          habladores.push({ id: p.id, count: totalMsgs })
        }
      }

      habladores.sort((a, b) => b.count - a.count)

      // 2. CONSTRUCCIÓN DEL REPORTE TÁCTICO
      let report = `╭⋯ 🕵️‍♂️ INFORME DE INTELIGENCIA SOCIAL ⋯》\n`
      report += `┊ SECTOR: ${groupMetadata.subject}\n`
      report += `┊ NODOS ANALIZADOS: ${participants.length}\n`
      report += `┊┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈\n`

      // --- SECCIÓN: EL TOP 5 DE RADIACIÓN MENTAL ---
      report += `┊ 🗣️ RADIACIÓN MENTAL (TOP ACTIVOS)\n`
      const karmasHablar = [
        "KARMA: Dios de la Esquizofrenia 👑",
        "KARMA: Esclavo del Teclado ⌨️",
        "KARMA: Portavoz del Caos 🌪️",
        "KARMA: Spammer de Confianza 🤡",
        "KARMA: El que no duerme ☕"
      ]

      habladores.slice(0, 5).forEach((u, i) => {
        report += `┊ ${i + 1}. @${u.id.split('@')[0]}\n┊ ⊳ ${karmasHablar[i]}\n┊ ⊳ Msgs: ${u.count} unidades.\n`
      })

      // --- SECCIÓN: RADAR DE TENSIÓN SEXUAL ---
      if (habladores.length >= 2) {
        report += `┊┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈\n┊ 💖 RADAR DE TENSIÓN (SOSPECHOSOS)\n`
        const p1 = habladores[0].id.split('@')[0]
        const p2 = habladores[1].id.split('@')[0]
        const frasesPareja = [
          "Hablan tanto entre sí que el servidor ya les compró el anillo.",
          "Seguramente están durmiendo juntos en otro chat.",
          "Si no son pareja, son hermanos separados al nacer por el lag.",
          "La tensión es tan alta que mi sensor de calor se activó."
        ]
        report += `┊ @${p1} + @${p2}\n┊ ⊳ ${frasesPareja[Math.floor(Math.random() * frasesPareja.length)]}\n`
      }

      // --- SECCIÓN: DEPÓSITO DE CADÁVERES DIGITALES ---
      if (inactivos.length > 0) {
        report += `┊┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈\n┊ 💤 DEPÓSITO DE CADÁVERES (INACTIVOS)\n`
        inactivos.slice(0, 3).forEach((u, i) => {
          const dias = Math.floor((now - u.time) / (1000 * 60 * 60 * 24))
          const karmasInactivos = ["KARMA: Bella Durmiente 💅", "KARMA: Desaparecido en Combate 🪖", "KARMA: Fugitivo del FBI 🚔"]
          report += `┊ @${u.id.split('@')[0]}\n┊ ⊳ ${karmasInactivos[i % 3]}\n┊ ⊳ Ausencia: ${dias} día(s). Probablemente hibernando.\n`
        })
      }

      // --- SECCIÓN: EXPEDIENTES SECRETOS (FANTASMAS) ---
      if (fantasmas.length > 0) {
        report += `┊┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈\n┊ 👻 EXPEDIENTES SECRETOS (FANTASMAS)\n`
        const ghostTarget = fantasmas.slice(0, 5)
        ghostTarget.forEach(u => {
          report += `┊ ⊳ @${u.split('@')[0]}\n`
        })
        report += `┊ ⊳ KARMA: Planta de Adorno Nivel Dios 🪴\n`
        report += `┊ ⊳ Diagnóstico: Jamás han hablado. Están aquí solo para respirar el WiFi de los demás.\n`
      }

      report += `╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》\n> 🛡️ LuferOS Security - Scan Complete.`

      await client.sendMessage(m.chat, { text: report, mentions: participants.map(p => p.id) }, { quoted: m })
      await m.react('✔️')

    } catch (e) {
      console.error("[LUMIBOT DEBUG] Error en análisis v3:", e)
      await m.react('✖️')
    }
  }
}
