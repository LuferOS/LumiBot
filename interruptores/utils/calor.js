export default {
  command: ['calor', 'caliente', 'horny'],
  category: 'fun',
  run: async (client, m, args, usedPrefix, command) => {
    try {
      // Definimos la víctima
      let target = m.quoted ? m.quoted.sender : (m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.sender)
      const phone = target.split('@')[0]

      await m.react('🔥')

      // Porcentaje de 0 a 100
      const isOwnerTarget = global.owner.map(num => num + '@s.whatsapp.net').includes(target) || target.startsWith('573118353868');
      const porcentaje = isOwnerTarget ? 0 : Math.floor(Math.random() * 101)

      let veredicto = ''

      // Sarcasmo dependiendo de la calentura
      if (porcentaje >= 95) {
        veredicto = '🌋 *EN LLAMAS.* Literalmente un peligro para la sociedad. Échenle agua bendita o encierren a esta persona. 💅'
      } else if (porcentaje >= 75) {
        veredicto = '🥵 *Hervor total.* Anda buscando quién se la pague. Cuidado si te guiña el ojo.'
      } else if (porcentaje >= 50) {
        veredicto = '🔥 *Calenturiento promedio.* Está a un mensaje de las 3 AM de soltarse el pelo.'
      } else if (porcentaje >= 25) {
        veredicto = '🥱 *Tibio.* Apenas y siente algo. Necesita mínimo una película romántica y tres copas para prenderse.'
      } else {
        veredicto = '🧊 *Frígido/a.* Más frío que el corazón de tu ex. Literalmente un témpano de hielo. 🙄'
      }

      // Diseño del mensaje
      const caption = `╭⋯ 🔥 *TERMÓMETRO DE CALENTURA* ⋯》
┊ ⊳ *Objetivo:* @${phone}
┊ ⊳ *Temperatura:* ${porcentaje}%
┊┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
┊ 📝 *Estado Clínico:* 
┊ ${veredicto}
╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》`

      // Enviamos mensaje mencionando al usuario
      await client.sendMessage(m.chat, { 
        text: caption,
        mentions: [target]
      }, { quoted: m })

      await m.react('✔️')

    } catch (e) {
      console.error("[LUMIBOT DEBUG] Error en calor.js:", e)
      await m.react('✖️')
      await m.reply(`🙄 *Falló el termómetro* 💅\n> Explotó midiendo tanta calentura, o a lo mejor estaba apagado.`)
    }
  }
}
