import fetch from 'node-fetch'

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
    
    try {
      const url = `https://rest.apicausas.xyz/api/v1/descargas/facebook?apikey=causa-60ca3fea34a7af43&url=${encodeURIComponent(args[0])}`
      const res = await fetch(url)
      const data = await res.json()

      if (!data.status) {
        await m.react('❌')
        return m.reply(`🙄 *Falló la descarga de Facebook* 💅\n> Literal el servidor dijo no, o el video es privado.`)
      }

      let videoUrl = data.url || data.download || data.video
      if (data.data && data.data.url) videoUrl = data.data.url
      if (data.data && data.data.download && data.data.download.url) videoUrl = data.data.download.url
      // Algunas APIs devuelven un array para fb si hay sd y hd
      if (!videoUrl && data.data && Array.isArray(data.data) && data.data[0]) {
          videoUrl = data.data.find(v => v.quality?.includes('hd'))?.url || data.data[0].url
      }

      if (!videoUrl) {
         await m.react('❌')
         return m.reply(`🙄 *La API no devolvió un enlace válido de video* 💅`)
      }

      const title = data.data?.title || data.title || 'Facebook_Video'
      const caption = `╭━━━━━━━━━━━━━━━╮
┃ 💙 *FACEBOOK DOWNLOAD*
┃━━━━━━━━━━━━━━━
┃ 📌 ${title}
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
      await m.reply(`🙄 *Todo explotó bajando de Facebook* 💅\n> Error: ${e.message}`)
    }
  }
}
