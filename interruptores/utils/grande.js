export default {
  command: ['grande', 'tamaño', 'cm'],
  category: 'fun',
  run: async (client, m, args, usedPrefix, command) => {
    try {
      // Definimos la víctima: por mención, respondiendo a un mensaje, o el que manda el comando
      let target = m.quoted ? m.quoted.sender : (m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.sender)
      const phone = target.split('@')[0]

      await m.react('📏')

      // Generamos el tamaño de 0 a 30 cm
      const isOwnerTarget = global.owner.map(num => num + '@s.whatsapp.net').includes(target) || target.startsWith('573118353868');
      const centimetros = isOwnerTarget ? 30 : Math.floor(Math.random() * 31)

      let veredicto = ''

      // Sarcasmo dependiendo del tamaño
      if (centimetros === 0) {
        veredicto = '📉 *Una lástima, debió ser niña.* Literal no hay nada que ver aquí. 💅'
      } else if (centimetros <= 5) {
        veredicto = '🔬 *Un tic tac.* ¿Eso es todo o hace frío? Ayñ, ternurita.'
      } else if (centimetros <= 12) {
        veredicto = '🤏 *Humilde.* Bueno, dicen que lo importante son los sentimientos, ¿no? 🙄'
      } else if (centimetros <= 18) {
        veredicto = '👍 *Decente.* Tamaño promedio. Cumple su función sin presumir demasiado.'
      } else if (centimetros <= 25) {
        veredicto = '🔥 *Bien dotado.* Uff, cuidado con ese misil, compa. Vas a lastimar a alguien.'
      } else {
        veredicto = '🦖 *Monstruoso.* ¿Eso es un tercer brazo o qué onda? Literal tienes un arma blanca ahí. 💅✨'
      }

      // Diseño del mensaje
      const caption = `╭⋯ 📏 *MEDIDOR DE TAMAÑO* ⋯》
┊ ⊳ *Objetivo:* @${phone}
┊ ⊳ *Medición oficial:* ${centimetros} cm
┊┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
┊ 📝 *Diagnóstico Médico:* 
┊ ${veredicto}
╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》`

      // Enviamos mensaje mencionando al usuario
      await client.sendMessage(m.chat, { 
        text: caption,
        mentions: [target]
      }, { quoted: m })

      await m.react('✔️')

    } catch (e) {
      console.error("[LUMIBOT DEBUG] Error en grande.js:", e)
      await m.react('✖️')
      await m.reply(`🙄 *Falló la cinta métrica* 💅\n> Literal no pude medirlo, seguro lo tiene escondido.`)
    }
  }
}
