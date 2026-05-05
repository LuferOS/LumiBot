import axios from 'axios'

export default {
  command: ['chica', 'miku', 'quintillizas'],
  category: 'fun',
  run: async (client, m, args, usedPrefix, command) => {
    try {
      const q = m.quoted || m
      const mime = (q.msg || q).mimetype || ''
      const GEMINI_API_KEY = 'API_KEY_GEMINI'

      if (!/image/.test(mime)) {
        return m.reply('╭⋯ ⚠️ ERROR DE ENTRADA ⋯》\n┊ Bro, responde a una imagen para que el bot la use de base.\n╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》')
      }

      await m.react('🎨')

      const imgBuffer = await q.download()
      if (!imgBuffer) return m.reply('No pude extraer los datos de la imagen original.')

      const base64Image = imgBuffer.toString('base64')
      
      const promptChicas = "Haz un selfie granulado, con gran desenfoque de movimiento, tomado con un iPhone frente a un espejo, en formato 9:16, en una habitación oscura, con cama y sábanas despeinadas al fondo. en primer plano, Miku Nakano está a la izquierda de Nino Nakano, quien sostiene la barbilla de un hombre de la foto con la mano, Itsuki Nakano se inclina desde un ángulo más alto para unirse a la selfie e Ichika Nakano mantiene su mano en su cabello, a su derecha está Yotsuba Nakano y a su lado derecho Itsuki Nakano. Las seis miran directamente al lente de la camara con expresiones espontáneas. Fuerte iluminación del flash del móvil, ligero reflejo de la luz en la lente, un auténtico ambiente casual sin parecer artificial."

      const payload = {
        contents: [{
          parts: [
            { text: promptChicas },
            {
              inline_data: {
                mime_type: "image/jpeg",
                data: base64Image
              }
            }
          ]
        }]
      }

      // Conexión directa al nodo de imagen de Gemini
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent?key=${GEMINI_API_KEY}`,
        payload,
        { headers: { 'Content-Type': 'application/json' } }
      )

      const resultData = response.data?.candidates?.[0]?.content?.parts?.[0]

      if (resultData?.inline_data) {
        const bufferOut = Buffer.from(resultData.inline_data.data, 'base64')
        await client.sendMessage(m.chat, { image: bufferOut, caption: '> 📸 Selfie Generada: LuferOS Multiverse' }, { quoted: m })
      } else if (resultData?.text) {
        await m.reply(`╭⋯ 🤖 REPORTE DEL MOTOR ⋯》\n\n${resultData.text}\n\n╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》`)
      } else {
        throw new Error("No se obtuvo respuesta visual del nodo.")
      }

      await m.react('✔️')

    } catch (e) {
      console.error("[LUMIBOT DEBUG] Error en comando chica:", e?.response?.data || e.message)
      await m.react('✖️')
      const errorMsg = e?.response?.data?.error?.message || e.message
      await m.reply(`╭⋯ ❌ FALLO DE RENDERIZADO ⋯》\n┊ El sistema rechazó la transformación.\n┊ Detalle: ${errorMsg}\n╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》`)
    }
  }
}
