import fetch from 'node-fetch'

const CAUSAS_KEY = 'causa-60ca3fea34a7af43';
const ALYA_KEY = 'api-lYsN6';

export default {
  command: ['threads', 'tds'],
  category: 'downloader',
  run: async (client, m, args, usedPrefix, command) => {
    if (!args[0]) {
      return m.reply(`🙄 *Bruh, ingresa un enlace de Threads.* 💅\n> Ejemplo: *${usedPrefix}${command} https://www.threads.net/xxx*`)
    }
    if (!args[0].match(/threads\.net/i)) {
      return m.reply(`🙄 *Enlace inválido. Asegúrate de que sea de Threads.* 💅`)
    }
    
    await m.react('⏳')
    const targetUrl = args[0]
    
    try {
      const fetchAlya = async () => {
          const res = await fetch(`https://api.alyacore.xyz/dl/threads?url=${encodeURIComponent(targetUrl)}&key=${ALYA_KEY}`)
          const data = await res.json()
          if (!data.status) throw new Error('Alya fallo status')
          return { provider: 'alya', data }
      }

      const winner = await fetchAlya()
      const data = winner.data

      let mediaUrls = []
      
      if (data.data && Array.isArray(data.data)) {
         mediaUrls = data.data.map(v => v.url || v.download || v)
      } else if (data.data && data.data.download && data.data.download.url) {
         mediaUrls.push(data.data.download.url)
      } else if (data.data && data.data.dl) {
         mediaUrls.push(data.data.dl)
      } else if (data.url) {
         mediaUrls.push(data.url)
      }

      if (mediaUrls.length === 0 && data.data && data.data.url && Array.isArray(data.data.url)) {
          mediaUrls = data.data.url.map(v => v.url || v)
      } else if (mediaUrls.length === 0 && data.data && typeof data.data.url === 'string') {
          mediaUrls.push(data.data.url)
      }

      if (mediaUrls.length === 0) {
         await m.react('❌')
         return m.reply(`🙄 *AlyaCore no devolvió contenido multimedia válido de Threads* 💅`)
      }

      const title = data.data?.title || data.title || data.data?.username || 'Threads Post'
      const caption = `╭━━━━━━━━━━━━━━━╮\n┃ 🧵 *THREADS DOWNLOAD*\n┃━━━━━━━━━━━━━━━\n┃ 📌 ${title}\n┃ ⚡ *API:* AlyaCore\n╰━━━━━━━━━━━━━━━╯`
      
      for (let i = 0; i < mediaUrls.length; i++) {
         let urlToDownload = mediaUrls[i]
         let isImage = urlToDownload.match(/\.(jpg|jpeg|png|webp)(\?|$)/i) || (!urlToDownload.match(/\.mp4(\?|$)/i) && i === 0 && (data.data?.type === 'image' || data.type === 'image'))

         if (isImage) {
           await client.sendMessage(m.chat, { image: { url: urlToDownload }, caption: i === 0 ? caption : '' }, { quoted: m })
         } else {
           await client.sendMessage(m.chat, { video: { url: urlToDownload }, caption: i === 0 ? caption : '', mimetype: 'video/mp4' }, { quoted: m })
         }
      }
      
      await m.react('✅')
    } catch (e) {
      console.error("[LUMIBOT DEBUG] Error en threads.js:", e)
      await m.react('❌')
      await m.reply(`🙄 *Error descargando de Threads* 💅\n> Error: ${e.message}`)
    }
  }
}
