export default {
  command: ['realofake', 'verdadofalso', 'rof', 'mito'],
  category: 'fun',
  run: async (client, m, args, usedPrefix, command, text) => {
    try {
      if (!text) {
        return m.reply(`╭⋯ 🔎 *Falta la hipótesis, bro* ⋯》\n┊ Escribe algo para que mi motor lógico lo analice.\n┊ Ejemplo: ${usedPrefix + command} este grupo son feos?\n╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》`)
      }

      // Animación de escaneo rápida
      const { key } = await client.sendMessage(m.chat, { 
        text: `╭⋯ 🧠 *PROCESANDO HIPÓTESIS...* ⋯》\n┊ [▓▓▓░░░░░░░] Analizando variables...\n╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》` 
      }, { quoted: m })

      const delay = ms => new Promise(res => setTimeout(res, ms))
      await delay(1200) // Suspenso dramático para que el Exynos procese xd

      // Lógica aleatoria
      const isReal = Math.random() > 0.5
      const certainty = Math.floor(Math.random() * (100 - 85 + 1)) + 85 // Certeza entre 85% y 100%

      // Comentarios sarcásticos aleatorios
      const verdades = [
        "Las matemáticas no mienten, bro.",
        "Confirmado por mis redes neuronales.",
        "Duele, pero es la pura y cruda verdad.",
        "El Exynos 1580 lo analizó y da positivo.",
        "Es tan real que asusta."
      ]
      
      const mentiras = [
        "Pura cortina de humo, wey.",
        "Más falso que los corazoncitos azules de la bot anterior.",
        "Ni en un universo paralelo eso es cierto.",
        "Alerta de Fake News. No te creas eso.",
        "Mis sensores de mentiras acaban de explotar."
      ]

      const veredicto = isReal ? '✅ VERDAD ABSOLUTA' : '❌ FALSO / MENTIRA'
      const comentario = isReal 
        ? verdades[Math.floor(Math.random() * verdades.length)] 
        : mentiras[Math.floor(Math.random() * mentiras.length)]

      // Resultado final editando el mensaje
      const respuesta = `╭⋯ 🔮 *ESCÁNER DE VERACIDAD* ⋯》
┊ ⊳ *Análisis:* "${text}"
┊ ⊳ *Veredicto:* ${veredicto}
┊ ⊳ *Certeza del sistema:* ${certainty}%
┊┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
┊ 💡 *Nota:* ${comentario}
╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》`

      await client.sendMessage(m.chat, { 
        text: respuesta, 
        edit: key 
      })

    } catch (e) {
      console.error("[LUMIBOT DEBUG] Error en realofake.js:", e)
      await m.reply(`╭⋯ ❌ *Error lógico* ⋯》\n┊ El procesador se confundió con tanta mentira junta.\n╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》`)
    }
  }
}
