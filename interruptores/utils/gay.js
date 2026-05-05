import axios from 'axios'

export default {
  command: ['gay', 'testgay', 'medidorgay'],
  category: 'fun',
  run: async (client, m, args, usedPrefix, command) => {
    try {
      // Definimos la víctima: por mención, respondiendo a un mensaje, o el que manda el comando
      let target = m.quoted ? m.quoted.sender : (m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.sender)
      const phone = target.split('@')[0]

      await m.react('🕒')

      // Intentamos sacar su foto de perfil. Si no tiene o está oculta, usamos el logo de LumiBOT.
      let pp = await client.profilePictureUrl(target, 'image').catch(() => 'https://i.imgur.com/8Q9N49Q.jpeg')

      // Calculamos el porcentaje 100% real no fake
      const porcentaje = Math.floor(Math.random() * 101)

      let imageUrl = ''
      let veredicto = ''

      // Lógica de porcentajes
      if (porcentaje >= 60) {
        // Bandera LGBT a full
        imageUrl = `https://some-random-api.com/canvas/overlay/gay?avatar=${encodeURIComponent(pp)}`
        veredicto = '🏳️‍🌈 *¡Alerta de arcoíris!* Ya sal del clóset, wey.'
      } else if (porcentaje >= 40) {
        // Transición (Filtro con opacidad/mezcla)
        imageUrl = `https://some-random-api.com/canvas/overlay/gay?avatar=${encodeURIComponent(pp)}`
        veredicto = '🤨 *Transición en progreso.* Mitad y mitad. Estás dudando de tu sexualidad, compa.'
      } else {
        // Menos de 40: Blanco y negro (hetero)
        imageUrl = `https://some-random-api.com/canvas/filter/greyscale?avatar=${encodeURIComponent(pp)}`
        veredicto = '🗿 *Un gran hetero :D* Puro macho alfa lomo plateado por aquí.'
      }

      // Descargamos la imagen procesada de la API
      const response = await axios.get(imageUrl, { responseType: 'arraybuffer' })
      const buffer = Buffer.from(response.data, 'binary')

      // Interfaz de resultados
      const caption = `╭⋯ 🌈 *ESCÁNER DE SEXUALIDAD* ⋯》
┊ ⊳ *Objetivo:* @${phone}
┊ ⊳ *Nivel detectado:* ${porcentaje}%
┊┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
┊ 📝 *Diagnóstico:* ┊ ${veredicto}
╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》`

      await client.sendMessage(m.chat, { 
        image: buffer, 
        caption: caption,
        mentions: [target]
      }, { quoted: m })

      await m.react('✔️')

    } catch (e) {
      console.error("[LUMIBOT DEBUG] Error en gay.js:", e)
      await m.react('✖️')
      await m.reply(`╭⋯ ❌ *Error del escáner* ⋯》\n┊ El sistema se trabó procesando esta foto. Seguro es demasiada masculinidad (o falta de ella). Intenta de nuevo.\n╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》`)
    }
  }
}
