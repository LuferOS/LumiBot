import axios from 'axios'

export default {
  command: ['p', 'pendejo', 'testpendejo', 'pendejometro'],
  category: 'fun',
  run: async (client, m, args, usedPrefix, command) => {
    try {
      // Definimos la víctima
      let target = m.quoted ? m.quoted.sender : (m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.sender)
      const phone = target.split('@')[0]

      await m.react('🕒')

      // Intentamos sacar su foto de perfil. Si no tiene o está oculta, usamos el logo de LumiBOT.
      let pp = await client.profilePictureUrl(target, 'image').catch(() => 'https://i.imgur.com/8Q9N49Q.jpeg')

      // Calculamos el porcentaje 100% real no fake
      const porcentaje = Math.floor(Math.random() * 101)

      let imageUrl = ''
      let diagnostico = ''

      // Lista de frases informativas y casuales
      const frases = [
        "Mano, ve a estudiar... neta.",
        "La inteligencia te sigue... pero eres más rápido.",
        "El más inteligente de su casa... y vive solo.",
        "Está peleando con él mismo... y va perdiendo.",
        "Bro, el cerebro no es un adorno, úsalo.",
        "Tu IQ es el mismo que el porcentaje de batería que te queda.",
        "Confirmado: eres un pendejo de grado avanzado.",
        "No eres pendejo, solo tienes una forma alternativa de inteligencia... muy alternativa.",
        "El sistema dice que tu pendejez ya es contagiosa."
      ]

      // Lógica de distorsión con las RUTAS CORREGIDAS
      if (porcentaje >= 70) {
        // Distorsión TOTAL (Triggered)
        imageUrl = `https://some-random-api.com/canvas/overlay/triggered?avatar=${encodeURIComponent(pp)}`
        diagnostico = `⚠️ *¡Nivel Crítico de Pendejez!* ${frases[Math.floor(Math.random() * frases.length)]}`
      } else if (porcentaje >= 31) {
        // Distorsión Media (Pixelate)
        imageUrl = `https://some-random-api.com/canvas/filter/pixelate?avatar=${encodeURIComponent(pp)}`
        diagnostico = `🧠 *Análisis de Inteligencia:* Regular. ${frases[Math.floor(Math.random() * 4)]}` 
      } else {
        // Bajo %: Solo invertimos colores
        imageUrl = `https://some-random-api.com/canvas/filter/invert?avatar=${encodeURIComponent(pp)}`
        diagnostico = `✅ *Pendejo Controlado.* Pero no te confíes, todavía andas dudando. ${frases[Math.floor(Math.random() * frases.length)]}`
      }

      let finalBuffer;
      try {
        // Descargamos la imagen procesada de la API
        const response = await axios.get(imageUrl, { responseType: 'arraybuffer' })
        finalBuffer = Buffer.from(response.data, 'binary')
      } catch (apiError) {
        // ⚡ LUMIBOT OVERRIDE: Si la API de filtros falla, mandamos la foto original sin quebrar el bot
        const fallbackResponse = await axios.get(pp, { responseType: 'arraybuffer' })
        finalBuffer = Buffer.from(fallbackResponse.data, 'binary')
        diagnostico += `\n*(Ojo: Tanta pendejez rompió el filtro de la cámara, va foto normal xd)*`
      }

      // Interfaz de resultados
      const caption = `╭⋯ 🧠 *DETECTOR DE PENDEJO v1.1* ⋯》
┊ ⊳ *Análisis a:* @${phone}
┊ ⊳ *Nivel de Pendejez:* ${porcentaje}%
┊┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
┊ 📝 *Diagnóstico:* ┊ ${diagnostico}
╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》\n> ⚡ *Powered by LuferOS*`

      await client.sendMessage(m.chat, { 
        image: finalBuffer, 
        caption: caption,
        mentions: [target]
      }, { quoted: m })

      await m.react('✔️')

    } catch (e) {
      console.error("[LUMIBOT DEBUG] Error en p.js:", e)
      await m.react('✖️')
      await m.reply(`╭⋯ ❌ *Error del escáner* ⋯》\n┊ El sistema reventó procesando a este wey. Intenta de nuevo.\n╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》`)
    }
  }
}
