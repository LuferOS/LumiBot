import fetch from 'node-fetch'
import { lumiAnim } from '../../nucleo/utils.js'

const CAUSAS_KEY = 'causa-60ca3fea34a7af43';
const ALYA_KEY = 'LumiBot-alya';

export default {
  command: ['fb', 'facebook'],
  category: 'downloader',
  run: async (client, m, args, usedPrefix, command) => {
    if (!args[0]) {
      return m.reply(`🙄 *Bruh, ingresa un enlace de Facebook.* 💅\n> Ejemplo: *${usedPrefix}${command} https://fb.watch/xxx*`)
    }
    if (!args[0].match(/facebook\.com|fb\.watch|video\.fb\.com/i)) {
      return m.reply(`🙄 *Enlace inválido. Envía un link de Facebook de verdad.* 💅\n> Ejemplo: *${usedPrefix}${command} https://fb.watch/xxx*`)
    }
    
    await m.react('⏳')
    const targetUrl = args[0]
    let animMsg = await lumiAnim(client, m, ['⏳ *Conectando a los servidores...* 💅', '📥 *Descargando video de Facebook...* 💅'], 1000);
    
    try {
      const fetchCausas = async () => {
          const res = await fetch(`https://rest.apicausas.xyz/api/v1/descargas/facebook?apikey=${CAUSAS_KEY}&url=${encodeURIComponent(targetUrl)}`, { signal: AbortSignal.timeout(15000) })
          const data = await res.json()
          if (!data.status) throw new Error('Causas fallo status')
          return { provider: 'causas', data }
      }

      const fetchAlyaV1 = async () => {
          const res = await fetch(`https://api.alyacore.xyz/dl/facebook?url=${encodeURIComponent(targetUrl)}&key=${ALYA_KEY}`, { signal: AbortSignal.timeout(15000) })
          const data = await res.json()
          if (!data.status) throw new Error('Alya v1 fallo status')
          return { provider: 'alya-v1', data }
      }

      const fetchAlyaV2 = async () => {
          const apiURL = `https://api.alyacore.xyz/dl/facebookv2?url=${encodeURIComponent(targetUrl)}&key=${ALYA_KEY}`
          const res = await fetch(apiURL, { signal: AbortSignal.timeout(15000) })
          const contentType = res.headers.get('content-type') || ''
          
          if (contentType.includes('video')) {
              // La API devuelve el video directamente en lugar de JSON
              return { provider: 'alya-v2', data: { url: apiURL, title: 'Facebook Reel/Video' } }
          }
          
          const data = await res.json()
          if (!data.status) throw new Error('Alya v2 fallo status')
          return { provider: 'alya-v2', data }
      }

      const winner = await Promise.any([fetchCausas(), fetchAlyaV1(), fetchAlyaV2()])
      const data = winner.data
      console.log('WINNER DATA:', JSON.stringify(data, null, 2))

      let videoUrl = data.url || data.download || data.video || data.dl || data.data?.dl
      
      const payloadArray = data.resultados || data.data
      
      if (data.data && data.data.url) videoUrl = data.data.url
      if (data.data && data.data.download && data.data.download.url) videoUrl = data.data.download.url
      if (!videoUrl && payloadArray && Array.isArray(payloadArray) && payloadArray[0]) {
          videoUrl = payloadArray.find(v => v.quality?.includes('hd') || v.quality?.includes('HD'))?.url || payloadArray[0].url
      }

      if (!videoUrl) {
         throw new Error('Las APIs no pudieron extraer el enlace de video. (FB Security Block)');
      }

      const title = data.data?.title || data.title || data.data?.title || 'Facebook Video'
      if (animMsg) await client.sendMessage(m.chat, { delete: animMsg.key }).catch(()=>{});
      await client.sendMessage(m.chat, {
        video: { url: videoUrl },
        caption: `╭⋯ 🎥 *FACEBOOK DOWNLOAD* ⋯》\n┊ ⊳ *Toma tu video.* 💅\n╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》`
      }, { quoted: m })
      await m.react('✅')
    } catch (e) {
      if (animMsg) await client.sendMessage(m.chat, { delete: animMsg.key }).catch(()=>{});
      await m.react('✖️')
      await m.reply(`🙄 *Hubo un error.* Intenta con otro enlace. 💅\n> ${e.message}`)
    }
  }
}
