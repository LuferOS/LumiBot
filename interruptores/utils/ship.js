export default {
  command: ['ship', 'shipear', 'amor', 'pareja'],
  category: 'fun',
  run: async (client, m, args, usedPrefix, command) => {
    try {
      if (!m.isGroup) {
        return m.reply(`╭⋯ ⚠️ *ERROR TÁCTICO* ⋯》\n┊ Bro, esto es para emparejar gente en grupos.\n┊ En privado solo estamos tú y yo, no te pases. 💅\n╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》`)
      }

      await m.react('🕒')

      // Obtenemos los miembros del grupo para la selección aleatoria
      const groupMetadata = await client.groupMetadata(m.chat).catch(() => null)
      const participants = groupMetadata?.participants || []
      const members = participants.map(p => p.id)

      let user1 = m.sender
      let user2 = ''

      // Lógica de selección de víctimas
      if (m.mentionedJid && m.mentionedJid.length >= 2) {
        // Mencionó a 2 personas
        user1 = m.mentionedJid[0]
        user2 = m.mentionedJid[1]
      } else if (m.mentionedJid && m.mentionedJid.length === 1) {
        // Mencionó a 1 persona (El que ejecuta + el mencionado)
        user1 = m.sender
        user2 = m.mentionedJid[0]
      } else {
        // No mencionó a nadie (El que ejecuta + alguien random del grupo)
        user1 = m.sender
        // Filtramos para que no se shipee a sí mismo xd
        const filteredMembers = members.filter(u => u !== user1)
        user2 = filteredMembers[Math.floor(Math.random() * filteredMembers.length)] || user1 
      }

      // Si por alguna razón el bot se shipea con alguien, lo permitimos por el meme xd
      const phone1 = user1.split('@')[0]
      const phone2 = user2.split('@')[0]

      // Cálculo del algoritmo del amor (Puro Exynos)
      const porcentaje = Math.floor(Math.random() * 101)
      let diagnostico = ''
      let corazones = ''

      // Frases xd y asignación de corazones
      if (porcentaje >= 70) {
        corazones = '💖🔥💞'
        const frasesGod = [
          "Boda inminente, wey. Ya consigan un cuarto.",
          "Hasta mi procesador se calentó con esta pareja.",
          "Romeo y Julieta se quedan pendejos al lado de ustedes.",
          "Nacieron para estar juntos, el algoritmo no miente.",
          "Ya bésense, todo el grupo lo está esperando."
        ]
        diagnostico = frasesGod[Math.floor(Math.random() * frasesGod.length)]
      } else if (porcentaje >= 51) {
        corazones = '❤️✨'
        const frasesMidHigh = [
          "Hay onda, tensión sexual no resuelta detectada.",
          "Con unas caguamas esto fluye, te lo aseguro.",
          "Hacen bonita pareja, para qué te digo que no.",
          "Mi escáner detecta química letal. Denle una oportunidad.",
          "Aquí hay material para una buena telenovela."
        ]
        diagnostico = frasesMidHigh[Math.floor(Math.random() * frasesMidHigh.length)]
      } else if (porcentaje >= 49) {
        corazones = '💔'
        const frasesMidLow = [
          "Más falsos que billete de 3 pesos.",
          "Podría ser... si fuéramos los últimos humanos en la tierra.",
          "Pura lástima, mejor queden como amigos (y de lejitos).",
          "Tienen menos química que una piedra y un zapato.",
          "Ni con WiFi de la NASA se conectan ustedes dos."
        ]
        diagnostico = frasesMidLow[Math.floor(Math.random() * frasesMidLow.length)]
      } else {
        corazones = '☠️💩'
        const frasesLow = [
          "Enemigos naturales. Se acercan y explota el chat.",
          "Alerta: Riesgo de toxicidad nivel Chernóbil.",
          "Ni en un multiverso donde todos sean ciegos funcionarían.",
          "Error 404: Amor no encontrado. Vayan a terapia.",
          "Mano, esto es un crimen contra la naturaleza."
        ]
        diagnostico = frasesLow[Math.floor(Math.random() * frasesLow.length)]
      }

      // Interfaz Táctica LuferOS
      const caption = `╭⋯ 🔬 *ESCÁNER DE COMPATIBILIDAD* ⋯》
┊ ⊳ *Objetivo 1:* @${phone1}
┊ ⊳ *Objetivo 2:* @${phone2}
┊┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
┊ 📊 *Compatibilidad:* ${porcentaje}% ${corazones}
┊ 📝 *Veredicto:* ${diagnostico}
╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》\n> ⚡ *Powered by LuferOS AI*`

      await client.sendMessage(m.chat, { 
        text: caption,
        mentions: [user1, user2]
      }, { quoted: m })

      await m.react('✔️')

    } catch (e) {
      console.error("[LUMIBOT DEBUG] Error en ship.js:", e)
      await m.react('✖️')
      await m.reply(`╭⋯ ❌ *Error del escáner* ⋯》\n┊ El sistema reventó procesando a estos dos. Demasiada tensión en el ambiente.\n╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》`)
    }
  }
}
