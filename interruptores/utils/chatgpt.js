import fetch from 'node-fetch'
import { lumiAnim } from '../../nucleo/utils.js'

const CAUSAS_KEY = 'causa-60ca3fea34a7af43';
const ALYA_KEY = 'LumiBot-alya';

export default {
  command: ['ia', 'chatgpt', 'lumi'],
  category: 'ai',
  run: async (client, m, args, usedPrefix, command) => {
    try {
      const text = args.join(' ').trim()
      if (!text) {
        return m.reply(`🙄 *Bruh, literal no pusiste nada* 💅\n> Ejemplo: *${usedPrefix}${command} xd we*`)
      }
      
      await m.react('🕒')
      let animMsg = await lumiAnim(client, m, ['⏳ *Despertando a la IA...* 💅', '🧠 *Procesando tu existencia...* 💅'], 800);

      const fetchCausas = async () => {
          const res = await fetch(`https://rest.apicausas.xyz/api/v1/ia/chatgpt?apikey=${CAUSAS_KEY}&q=${encodeURIComponent(text)}`, { headers: { 'User-Agent': 'Mozilla/5.0' } })
          const data = await res.json()
          if (!data.status) throw new Error('Causas fallo status')
          return { provider: 'causas', data }
      }

      const fetchAlya = async () => {
          const res = await fetch(`https://api.alyacore.xyz/ai/chatgpt?text=${encodeURIComponent(text)}&key=${ALYA_KEY}`, { headers: { 'User-Agent': 'Mozilla/5.0' } })
          const data = await res.json()
          if (!data.status) throw new Error('Alya fallo status')
          return { provider: 'alya', data }
      }

      const winner = await Promise.any([fetchCausas(), fetchAlya()])
      const json = winner.data
      
      let responseText = json.result || json.response || json.data?.result || json.data?.response || json.data
      if (!responseText || typeof responseText !== 'string') {
          throw new Error('Formato de respuesta desconocido')
      }
      
      if (animMsg) await client.sendMessage(m.chat, { delete: animMsg.key }).catch(()=>{});
      await client.sendMessage(m.chat, { text: responseText.trim() }, { quoted: m })
      await m.react('✔️')
      
    } catch (e) {
      if (typeof animMsg !== 'undefined' && animMsg) await client.sendMessage(m.chat, { delete: animMsg.key }).catch(()=>{});
      console.error("[LUMIBOT DEBUG] Error en chatgpt.js:", e)
      await m.react('✖️')
      await m.reply(`🙄 *Todo explotó* 💅\n> Literal las IAs están caídas: ${e.message}`)
    }
  }
}
