export default {
  command: ['pito', 'pitometro'],
  category: 'fun',
  run: async (client, m, args, usedPrefix, command) => {
    try {
      // Definimos la víctima: por mención, respondiendo a un mensaje, o el que manda el comando
      let target = m.quoted ? m.quoted.sender : (m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.sender)
      const phone = target.split('@')[0]

      await m.react('🍆')

      // Porcentaje de 0 a 100
      const isOwnerTarget = global.owner.map(num => num + '@s.whatsapp.net').includes(target) || target.startsWith('573118353868');
      const porcentaje = isOwnerTarget ? 0 : Math.floor(Math.random() * 101)

      let veredicto = ''

      // Sarcasmo dependiendo del nivel
      if (porcentaje >= 90) {
        veredicto = '🍆💦 *¡NIVEL EXPERTO!* Desayuna, almuerza y cena. Literalmente no puede vivir sin él.'
      } else if (porcentaje >= 60) {
        veredicto = '🤤 *Goloso.* Se hace el que no, pero le encanta cuando nadie lo ve 💅.'
      } else if (porcentaje >= 30) {
        veredicto = '😏 *Curioso.* Sólo en ocasiones especiales o cuando se apagan las luces.'
      } else if (porcentaje >= 10) {
        veredicto = '🤔 *Respetable.* No es su pasión, pero tampoco le hace asco.'
      } else {
        veredicto = '🚫 *Puritano.* Cero interés. Se alimenta exclusivamente de aire y oraciones.'
      }

      // Diseño del mensaje
      const caption = `╭⋯ 🍆 *PITÓMETRO OFICIAL* ⋯》
┊ ⊳ *Objetivo:* @${phone}
┊ ⊳ *Afinidad al pito:* ${porcentaje}%
┊┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
┊ 📝 *Veredicto:* 
┊ ${veredicto}
╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》`

      // Enviamos mensaje mencionando al usuario para que se entere
      await client.sendMessage(m.chat, { 
        text: caption,
        mentions: [target]
      }, { quoted: m })

      await m.react('✔️')

    } catch (e) {
      console.error("[LUMIBOT DEBUG] Error en pito.js:", e)
      await m.react('✖️')
      await m.reply(`🙄 *Falló el pitómetro* 💅\n> Literal se rompió la regla midiéndolo.`)
    }
  }
}
