import axios from 'axios'

export default {
  command: ['beautytest', 'testbelleza', 'belleza', 'rate'],
  category: 'fun',
  run: async (client, m, args, usedPrefix, command) => {
    try {
      const q = m.quoted || m
      const mime = q?.mimetype || q?.msg?.mimetype || ''
      
      let target = m.quoted ? m.quoted.sender : (m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.sender)
      const phone = target.split('@')[0]
      let imageBuffer;

      await m.react('🕒')

      // 1. FASE DE EXTRACCIÓN
      if (mime && /^image\//.test(mime)) {
        // Si respondieron a una imagen o enviaron una
        imageBuffer = await q.download?.()
      } else {
        // Si solo pusieron el comando, buscamos la foto de perfil
        try {
          let pp = await client.profilePictureUrl(target, 'image')
          const response = await axios.get(pp, { responseType: 'arraybuffer' })
          imageBuffer = Buffer.from(response.data, 'binary')
        } catch (error) {
          // Si no tiene foto de perfil visible, usamos el logo del bot para no crashear
          let fallback = 'https://i.imgur.com/8Q9N49Q.jpeg'
          const response = await axios.get(fallback, { responseType: 'arraybuffer' })
          imageBuffer = Buffer.from(response.data, 'binary')
        }
      }

      // 2. CÁLCULO BIOMÉTRICO (100% Real no Fake por el Exynos 1580 xd)
      const belleza = Math.floor(Math.random() * 101)
      let diagnostico = ''

      // 3. FRASES RANDOM DE INTERNET (Estilo adolescente)
      const frasesGod = [
        "Mano, tú no eres real, eres un render en 4K.",
        "Dioso/a griego/a escaneado con éxito.",
        "Perfección algorítmica. Colapsaste el medidor de facha.",
        "Rompiendo la escala, bro. Tienes filtro de fábrica.",
        "Estás en otro nivel, neta. 10/10 y God."
      ]

      const frasesMidHigh = [
        "Aguantas, normalito.",
        "Pasable en 1080p. Tienes tu encanto.",
        "Belleza estándar certificada por la IA.",
        "Ni feo ni guapo, estás equilibrado en la Fuerza.",
        "Simpático/a, te doy like."
      ]

      const frasesMidLow = [
        "Mano, asustaste un poquito al sensor.",
        "Belleza exótica... muy exótica. Con respeto xd.",
        "La cámara dudó pero logró enfocarte.",
        "Tienes una gran belleza... pero interior.",
        "Eres simpático/a... visto de lejos y con los ojos cerrados."
      ]

      const frasesLow = [
        "Alerta de seguridad: La cámara entró en modo de emergencia.",
        "Error 404: Guapura not found.",
        "Se trabó mi Exynos intentando buscarte el ángulo bueno.",
        "Mano, naciste por cesárea porque ni la naturaleza te quería sacar.",
        "Tanta fealdad casi rompe mis lentes virtuales. F en el chat."
      ]

      if (belleza >= 85) {
        diagnostico = frasesGod[Math.floor(Math.random() * frasesGod.length)]
      } else if (belleza >= 50) {
        diagnostico = frasesMidHigh[Math.floor(Math.random() * frasesMidHigh.length)]
      } else if (belleza >= 20) {
        diagnostico = frasesMidLow[Math.floor(Math.random() * frasesMidLow.length)]
      } else {
        diagnostico = frasesLow[Math.floor(Math.random() * frasesLow.length)]
      }

      // 4. INTERFAZ TÁCTICA
      const caption = `╭⋯ 🔬 *ESCÁNER DE BELLEZA v2.0* ⋯》
┊ ⊳ *Objetivo:* @${phone}
┊ ⊳ *Nivel de facha:* ${belleza}%
┊┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
┊ 📝 *Diagnóstico:* ┊ ${diagnostico}
╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》\n> ⚡ *Powered by LuferOS*`

      await client.sendMessage(m.chat, { 
        image: imageBuffer, 
        caption: caption,
        mentions: [target]
      }, { quoted: m })

      await m.react('✔️')

    } catch (e) {
      console.error("[LUMIBOT DEBUG] Error en belleza.js:", e)
      await m.react('✖️')
      await m.reply(`╭⋯ ❌ *Error del escáner* ⋯》\n┊ El sistema reventó intentando analizar tanta belleza (o fealdad). Intenta de nuevo.\n╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》`)
    }
  }
}
