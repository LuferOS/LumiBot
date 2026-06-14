import fetch from 'node-fetch'

export default {
  command: ['twitter', 'x', 'xdl'],
  category: 'downloader',
  run: async (client, m, args, usedPrefix, command) => {
    if (!args[0]) {
      return m.reply(`🙄 *Bruh, ingresa un enlace de Twitter/X.* 💅\n> Ejemplo: *${usedPrefix}${command} https://x.com/user/status/xxx*`)
    }
    if (!args[0].match(/(twitter|x)\.com\/\w+\/status\//i)) {
      return m.reply(`🙄 *Enlace inválido. Asegúrate de que sea de Twitter/X.* 💅\n> Ejemplo: *${usedPrefix}${command} https://x.com/user/status/xxx*`)
    }
    
    await m.react('⏳')
    
    try {
      const url = `https://rest.apicausas.xyz/api/v1/descargas/twitter?apikey=causa-60ca3fea34a7af43&url=${encodeURIComponent(args[0])}`
      const res = await fetch(url)
      const data = await res.json()

      if (!data.status) {
        await m.react('❌')
        return m.reply(`🙄 *Falló la descarga de Twitter* 💅\n> Quizás el tuit es privado o lo borraron.`)
      }

      let mediaUrl = data.url || data.download || data.video
      if (data.data && data.data.url) mediaUrl = data.data.url
      if (data.data && data.data.download && data.data.download.url) mediaUrl = data.data.download.url
      if (!mediaUrl && data.data && Array.isArray(data.data) && data.data[0]) {
          mediaUrl = data.data[0].url
      }

      if (!mediaUrl) {
         await m.react('❌')
         return m.reply(`🙄 *La API no devolvió contenido multimedia válido* 💅`)
      }

      const title = data.data?.title || data.title || data.data?.description || 'Twitter_X'
      const caption = `╭━━━━━━━━━━━━━━━╮
┃ 🐦 *X / TWITTER DOWNLOAD*
┃━━━━━━━━━━━━━━━
┃ 📌 ${title}
╰━━━━━━━━━━━━━━━╯`
      
      const isImage = mediaUrl.match(/\.(jpg|jpeg|png)$/i) || (data.data && data.data.type === 'image')

      if (isImage) {
        await client.sendMessage(m.chat, { image: { url: mediaUrl }, caption }, { quoted: m })
      } else {
        await client.sendMessage(m.chat, { video: { url: mediaUrl }, caption, mimetype: 'video/mp4' }, { quoted: m })
      }
      
      await m.react('✅')
    } catch (e) {
      console.error("[LUMIBOT DEBUG] Error en twitter.js:", e)
      await m.react('❌')
      await m.reply(`🙄 *Explotó el pájaro azul* 💅\n> Error: ${e.message}`)
    }
  }
}
