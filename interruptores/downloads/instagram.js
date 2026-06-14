import fetch from 'node-fetch'

export default {
  command: ['instagram', 'ig'],
  category: 'downloader',
  run: async (client, m, args, usedPrefix, command) => {
    if (!args[0]) {
      return m.reply(`🙄 *Bruh, ingresa un enlace de Instagram.* 💅\n> Ejemplo: *${usedPrefix}${command} https://www.instagram.com/p/xxx*`)
    }
    if (!args[0].match(/instagram\.com|instagr\.am/i)) {
      return m.reply(`🙄 *Enlace inválido. Asegúrate de que sea de Instagram.* 💅\n> Ejemplo: *${usedPrefix}${command} https://www.instagram.com/p/xxx*`)
    }
    
    await m.react('⏳')
    
    try {
      const url = `https://rest.apicausas.xyz/api/v1/descargas/instagram?apikey=causa-60ca3fea34a7af43&url=${encodeURIComponent(args[0])}`
      const res = await fetch(url)
      const data = await res.json()

      if (!data.status) {
        await m.react('❌')
        return m.reply(`🙄 *Falló la descarga de Instagram* 💅\n> El enlace puede ser privado o ya no existe.`)
      }

      let mediaUrls = []
      
      // La API a veces devuelve un array en data.data o un data.download.url
      if (data.data && Array.isArray(data.data)) {
         mediaUrls = data.data.map(v => v.url || v.download || v)
      } else if (data.data && data.data.download && data.data.download.url) {
         mediaUrls.push(data.data.download.url)
      } else if (data.url) {
         mediaUrls.push(data.url)
      }

      // Si la API devuelve un solo objeto con un array
      if (mediaUrls.length === 0 && data.data && data.data.url && Array.isArray(data.data.url)) {
          mediaUrls = data.data.url.map(v => v.url || v)
      } else if (mediaUrls.length === 0 && data.data && typeof data.data.url === 'string') {
          mediaUrls.push(data.data.url)
      }

      if (mediaUrls.length === 0) {
         await m.react('❌')
         return m.reply(`🙄 *La API no devolvió contenido multimedia válido de IG* 💅`)
      }

      const title = data.data?.title || data.title || 'Instagram Post'
      const caption = `╭━━━━━━━━━━━━━━━╮
┃ 📸 *INSTAGRAM DOWNLOAD*
┃━━━━━━━━━━━━━━━
┃ 📌 ${title}
╰━━━━━━━━━━━━━━━╯`
      
      for (let i = 0; i < mediaUrls.length; i++) {
         let urlToDownload = mediaUrls[i]
         let isImage = urlToDownload.match(/\.(jpg|jpeg|png|webp)(\?|$)/i) || (!urlToDownload.match(/\.mp4(\?|$)/i) && i === 0 && data.data?.type === 'image')

         if (isImage) {
           await client.sendMessage(m.chat, { image: { url: urlToDownload }, caption: i === 0 ? caption : '' }, { quoted: m })
         } else {
           await client.sendMessage(m.chat, { video: { url: urlToDownload }, caption: i === 0 ? caption : '', mimetype: 'video/mp4' }, { quoted: m })
         }
      }
      
      await m.react('✅')
    } catch (e) {
      console.error("[LUMIBOT DEBUG] Error en instagram.js:", e)
      await m.react('❌')
      await m.reply(`🙄 *Error descargando de Instagram* 💅\n> Error: ${e.message}`)
    }
  }
}
