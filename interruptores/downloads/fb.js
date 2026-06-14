import fetch from 'node-fetch'

const CAUSAS_KEY = 'causa-60ca3fea34a7af43';
const ALYA_KEY = 'api-lYsN6';

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
    
    try {
      const fetchCausas = async () => {
          const res = await fetch(`https://rest.apicausas.xyz/api/v1/descargas/facebook?apikey=${CAUSAS_KEY}&url=${encodeURIComponent(targetUrl)}`)
          const data = await res.json()
          if (!data.status) throw new Error('Causas fallo status')
          return { provider: 'causas', data }
      }

      const fetchAlyaV1 = async () => {
          const res = await fetch(`https://api.alyacore.xyz/dl/facebook?url=${encodeURIComponent(targetUrl)}&key=${ALYA_KEY}`)
          const data = await res.json()
          if (!data.status) throw new Error('Alya v1 fallo status')
          return { provider: 'alya-v1', data }
      }

      const fetchAlyaV2 = async () => {
          const res = await fetch(`https://api.alyacore.xyz/dl/facebookv2?url=${encodeURIComponent(targetUrl)}&key=${ALYA_KEY}`)
          const data = await res.json()
          if (!data.status) throw new Error('Alya v2 fallo status')
          return { provider: 'alya-v2', data }
      }

      const winner = await Promise.any([fetchCausas(), fetchAlyaV1(), fetchAlyaV2()])
      const data = winner.data

      let videoUrl = data.url || data.download || data.video || data.dl || data.data?.dl
      if (data.data && data.data.url) videoUrl = data.data.url
      if (data.data && data.data.download && data.data.download.url) videoUrl = data.data.download.url
      if (!videoUrl && data.data && Array.isArray(data.data) && data.data[0]) {
          videoUrl = data.data.find(v => v.quality?.includes('hd'))?.url || data.data[0].url
      }

      if (!videoUrl) {
         await m.react('❌')
         return m.reply(`🙄 *La API no devolvió un enlace válido de video* 💅`)
      }

      const title = data.data?.title || data.title || data.data?.title || 'Facebook Video'
      const caption = `╭━━━━━━━━━━━━━━━╮
┃ 💙 *FACEBOOK DOWNLOAD*
┃━━━━━━━━━━━━━━━
┃ 📌 ${title}
┃ ⚡ *API:* ${winner.provider === 'causas' ? 'Causas (Fast)' : 'AlyaCore (Fast)'}
╰━━━━━━━━━━━━━━━╯`
      
      await client.sendMessage(m.chat, { 
        video: { url: videoUrl }, 
        caption,
        mimetype: 'video/mp4'
      }, { quoted: m })
      
      await m.react('✅')
    } catch (e) {
      console.error("[LUMIBOT DEBUG] Error en fb.js:", e)
      await m.react('❌')
      await m.reply(`🙄 *Todo explotó bajando de Facebook (Ambas APIs fallaron)* 💅\n> Error: ${e.message}`)
    }
  }
}
