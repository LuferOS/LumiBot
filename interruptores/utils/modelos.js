import axios from 'axios'

// La llave problemática xd
const GEMINI_API_KEY = 'KEY_GEMINI_AQUI'

export default {
  command: ['modelos', 'listgemini', 'escanearapi'],
  category: 'utils',
  run: async (client, m, args, usedPrefix, command) => {
    try {
      await m.react('🕒')

      // Hacemos una petición GET al endpoint de listado de Google
      const response = await axios.get(
        `https://generativelanguage.googleapis.com/v1beta/models?key=${GEMINI_API_KEY}`
      )

      const data = response.data

      if (!data || !data.models) {
        throw new Error("No se pudo extraer la lista de modelos.")
      }

      // Filtramos solo los que sirven para generar contenido y extraemos el nombre limpio
      const modelosUtiles = data.models
        .filter(mod => mod.supportedGenerationMethods && mod.supportedGenerationMethods.includes('generateContent'))
        .map(mod => `⊳ *${mod.name.replace('models/', '')}*`)
        .join('\n┊ ')

      const caption = `╭⋯ 📡 *ESCÁNER DE NODOS GEMINI* ⋯》
┊ ⊳ *Estado de API:* Conectada
┊┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
┊ 📝 *Modelos compatibles activos:*\n┊ ${modelosUtiles}
╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》\n> ⚡ *Powered by LuferOS*`

      await client.sendMessage(m.chat, { text: caption }, { quoted: m })
      await m.react('✔️')

    } catch (e) {
      console.error("[LUMIBOT DEBUG] Error listando modelos:", e?.response?.data || e.message)
      await m.react('✖️')
      await m.reply(`╭⋯ ❌ *Error de Infiltración* ⋯》\n┊ Google bloqueó el escáner o la llave falló.\n┊ Detalles: ${e?.response?.data?.error?.message || e.message}\n╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》`)
    }
  }
}
