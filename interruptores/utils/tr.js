import axios from 'axios'

// ⚠️ Tu llave de acceso
const GEMINI_API_KEY = 'GEMINIKEY_AQUI'

export default {
  command: ['tr', 'transcribir', 'audio', 'resumen'],
  category: 'utils',
  run: async (client, m, args, usedPrefix, command) => {
    try {
      const q = m.quoted || m
      const mime = q?.mimetype || q?.msg?.mimetype || ''

      // Verificamos que sea un audio
      if (!/audio/.test(mime)) {
          return m.reply(`╭⋯ ⚠️ *AUDIO NO DETECTADO* ⋯》\n┊ Responde a una nota de voz o un audio con el comando para transcribirlo.\n╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》`)
      }

      await m.react('🕒')
      const buffer = await q.download?.()
      
      if (!buffer) {
          await m.react('✖️')
          return m.reply(`╭⋯ ⚠️ *ERROR DE DESCARGA* ⋯》\n┊ No pude extraer el buffer del audio. Intenta de nuevo.\n╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》`)
      }

      // Base64 para inyectarlo directo
      const base64Audio = buffer.toString('base64')
      const audioMime = mime.split(';')[0] || 'audio/ogg' 

      // Instrucciones tácticas
      const prompt = `Actúa como un transcriptor experto. Tu tarea es doble:
1. Transcribe EXACTAMENTE lo que dice el audio, palabra por palabra.
2. Luego, deja una línea en blanco, escribe "📝 *Resumen:*" y haz un resumen claro y directo de lo que trata.
No agregues saludos, introducciones ni despedidas, devuelve únicamente el texto solicitado.`

      // Paquete de datos
      const payload = {
        contents: [{
          parts: [
            { text: prompt },
            {
              inline_data: {
                mime_type: audioMime,
                data: base64Audio
              }
            }
          ]
        }]
      }

      // ⚡ LUMIBOT OVERRIDE: Ruta actualizada a gemini-flash-latest
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${GEMINI_API_KEY}`,
        payload,
        { headers: { 'Content-Type': 'application/json' } }
      )

      const textoGenerado = response.data?.candidates?.[0]?.content?.parts?.[0]?.text

      if (!textoGenerado) {
        throw new Error("La red neuronal no devolvió un texto válido.")
      }

      // Interfaz final
      const caption = `╭⋯ 🎙️ *INTERCEPCIÓN DE AUDIO* ⋯》\n\n${textoGenerado}\n\n╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》\n> ⚡ *Powered by LuferOS*`

      await client.sendMessage(m.chat, { text: caption }, { quoted: m })
      await m.react('✔️')

    } catch (e) {
      console.error("[LUMIBOT DEBUG] Error en transcribir:", e?.response?.data || e.message)
      await m.react('✖️')
      
      const errorMsg = e?.response?.data?.error?.message || e.message
      await m.reply(`╭⋯ ❌ *Error del procesador* ⋯》\n┊ El cerebro neuronal rechazó el audio.\n┊ Info: ${errorMsg}\n╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》`)
    }
  }
}
