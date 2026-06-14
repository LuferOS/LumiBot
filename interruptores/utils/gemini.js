import fetch from 'node-fetch'

const CAUSAS_KEY = 'causa-60ca3fea34a7af43';
const ALYA_KEY = 'api-lYsN6';

export default {
  command: ['gemini', 'g'],
  category: 'ai',
  run: async (client, m, args, usedPrefix, command) => {
    try {
      const text = args.join(' ').trim()
      if (!text) {
        return m.reply(`🙄 *Bruh, literal no pusiste nada* 💅\n> Ejemplo: *${usedPrefix}${command} quien es ruben maldonado?*`)
      }
      
      await m.react('🕒')

      const fetchCausas = async () => {
          const res = await fetch(`https://rest.apicausas.xyz/api/v1/ia/gemini?apikey=${CAUSAS_KEY}&q=${encodeURIComponent(text)}`, { headers: { 'User-Agent': 'Mozilla/5.0' } })
          const data = await res.json()
          if (!data.status) throw new Error('Causas fallo status')
          return { provider: 'causas', data }
      }

      const fetchAlya = async () => {
          const res = await fetch(`https://api.alyacore.xyz/ai/gemini?text=${encodeURIComponent(text)}&key=${ALYA_KEY}`, { headers: { 'User-Agent': 'Mozilla/5.0' } })
          const data = await res.json()
          if (!data.status) throw new Error('Alya fallo status')
          return { provider: 'alya', data }
      }

      const winner = await Promise.any([fetchCausas(), fetchAlya()])
      const json = winner.data
      
      let responseText = json.response || json.result || json.data?.response || json.data?.result || json.data
      if (!responseText || typeof responseText !== 'string') {
          throw new Error('Formato de respuesta desconocido')
      }
      
      await client.sendMessage(m.chat, { text: responseText.trim() }, { quoted: m })
      await m.react('✔️')
      
    } catch (e) {
      console.error("[LUMIBOT DEBUG] Error en gemini.js:", e)
      await m.react('✖️')
      await m.reply(`🙄 *Todo explotó* 💅\n> Literal las IAs están caídas: ${e.message}`)
    }
  }
}
