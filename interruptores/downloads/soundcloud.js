import fetch from 'node-fetch'
import { lumiAnim } from '../../nucleo/utils.js'
const CAUSAS_KEY = 'causa-60ca3fea34a7af43';
const ALYA_KEY = 'LumiBot-alya';

export default {
  command: ['soundcloud', 'sc'],
  category: 'downloads',
  run: async (client, m, args, usedPrefix, command) => {
    try {
      const text = args.join(' ')
      if (!text) {
        return m.reply(`🙄 *Bruh, ingresa un enlace o nombre de canción de SoundCloud.* 💅\n> Ejemplo: *${usedPrefix}${command} https://soundcloud.com/artista/cancion*\n> Ejemplo: *${usedPrefix}${command} bad bunny*`)
      }

      await m.react('🕒')
      let animMsg = await lumiAnim(client, m, ['⏳ *Conectando a los servidores...* 💅', '🔍 *Buscando pistas musicales...* 💅'], 800);
      let targetUrl = ''
      
      // Si es un enlace de soundcloud
      if (text.includes('soundcloud.com')) {
        targetUrl = text
      } else {
        // Primero buscamos la canción en Causas (búsqueda rápida)
        const searchUrl = `https://rest.apicausas.xyz/api/v1/buscadores/soundcloud?apikey=${CAUSAS_KEY}&q=${encodeURIComponent(text)}&limit=1`
        const searchRes = await fetch(searchUrl)
        const searchData = await searchRes.json()
        
        if (!searchData.status || !searchData.data || searchData.data.results.length === 0) {
          if (animMsg) await client.sendMessage(m.chat, { delete: animMsg.key }).catch(()=>{});
          await m.react('✖️')
          return m.reply(`🙄 *No encontré nada en SoundCloud con ese nombre* 💅`)
        }
        
        targetUrl = searchData.data.results[0].url
      }
      
      if (animMsg) await client.sendMessage(m.chat, { text: '📥 *Descargando audio de SoundCloud...* 💅', edit: animMsg.key });
      
      const fetchCausas = async () => {
          const url = `https://rest.apicausas.xyz/api/v1/descargas/soundcloud?apikey=${CAUSAS_KEY}&url=${encodeURIComponent(targetUrl)}`
          const res = await fetch(url)
          const data = await res.json()
          if (!data.status) throw new Error('Causas fallo status')
          return { provider: 'causas', data }
      }

      const fetchAlya = async () => {
          const url = `https://api.alyacore.xyz/dl/soundcloud?url=${encodeURIComponent(targetUrl)}&key=${ALYA_KEY}`
          const res = await fetch(url)
          const data = await res.json()
          if (!data.status) throw new Error('Alya fallo status')
          return { provider: 'alya', data }
      }

      const winner = await Promise.any([fetchCausas(), fetchAlya()])
      const data = winner.data

      let audioUrl = data.url || data.download || data.dl_url || data.audio || data.dl
      if (data.data && data.data.url) audioUrl = data.data.url
      if (data.data && data.data.download && data.data.download.url) audioUrl = data.data.download.url
      if (data.data && data.data.dl) audioUrl = data.data.dl

      if (!audioUrl) {
         if (animMsg) await client.sendMessage(m.chat, { delete: animMsg.key }).catch(()=>{});
         await m.react('✖️')
         return m.reply(`🙄 *Las APIs no devolvieron un enlace válido de audio* 💅`)
      }

      const title = data.data?.title || data.title || 'Soundcloud_LumiBot'
      if (animMsg) await client.sendMessage(m.chat, { delete: animMsg.key }).catch(()=>{});
      await client.sendMessage(m.chat, { audio: { url: audioUrl }, mimetype: 'audio/mpeg', fileName: `${title}.mp3` }, { quoted: m })
      await m.react('✔️')

    } catch (e) {
      console.error("[LUMIBOT DEBUG] Error en soundcloud.js:", e)
      if (typeof animMsg !== 'undefined' && animMsg) await client.sendMessage(m.chat, { delete: animMsg.key }).catch(()=>{});
      await m.react('✖️')
      await m.reply(`🙄 *Falló la descarga de SoundCloud (Ambas APIs)* 💅\n> Literal no pude sacar el audio: ${e.message}`)
    }
  }
}
