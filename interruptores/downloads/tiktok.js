import fetch from 'node-fetch'

export default {
  command: ['tiktok', 'tt', 'tiktokimg', 'ttimg', 'tiktokmp3', 'ttmp3'],
  category: 'downloader',
  run: async (client, m, args, usedPrefix, command) => {
    if (!args[0]) {
      return m.reply(`🙄 *Bruh, ingresa un enlace de TikTok.* 💅\n> Ejemplo: *${usedPrefix}${command} https://vm.tiktok.com/xxx*`)
    }
    if (!args[0].match(/tiktok\.com/i)) {
      return m.reply(`🙄 *Enlace inválido. Asegúrate de que sea de TikTok.* 💅\n> Ejemplo: *${usedPrefix}${command} https://vm.tiktok.com/xxx*`)
    }
    
    await m.react('⏳')
    
    try {
      const url = `https://rest.apicausas.xyz/api/v1/descargas/tiktok?apikey=causa-60ca3fea34a7af43&url=${encodeURIComponent(args[0])}`
      const res = await fetch(url)
      const data = await res.json()

      if (!data.status) {
        await m.react('❌')
        return m.reply(`🙄 *Falló la descarga de TikTok* 💅\n> Quizás es privado o lo borraron.`)
      }

      const title = data.data?.title || data.title || 'TikTok Video'
      const caption = `╭━━━━━━━━━━━━━━━╮
┃ 🎵 *TIKTOK DOWNLOAD*
┃━━━━━━━━━━━━━━━
┃ 📌 ${title}
╰━━━━━━━━━━━━━━━╯`

      const cmd = command.toLowerCase()
      
      // Manejar Audios (MP3)
      if (cmd.includes('mp3')) {
          let audioUrl = data.data?.audio?.url || data.audio || data.data?.music
          if (!audioUrl && data.data?.download?.audio) audioUrl = data.data.download.audio
          
          if (!audioUrl) return m.reply(`🙄 *No encontré audio extraíble en este TikTok.* 💅`)
          
          await client.sendMessage(m.chat, { audio: { url: audioUrl }, mimetype: 'audio/mpeg' }, { quoted: m })
          await m.react('✅')
          return
      }

      // Manejar Imágenes
      let images = data.data?.images || data.images || []
      if (images.length > 0 || cmd.includes('img')) {
          if (images.length === 0) return m.reply(`🙄 *Este TikTok no tiene imágenes (Slide).* 💅`)
          
          // Enviar como álbum si hay varias imágenes
          for (let img of images) {
              await client.sendMessage(m.chat, { image: { url: img }, caption }, { quoted: m })
          }
          await m.react('✅')
          return
      }

      // Manejar Video (Por defecto)
      let videoUrl = data.url || data.download || data.video
      if (data.data && data.data.url) videoUrl = data.data.url
      if (data.data && data.data.download && data.data.download.url) videoUrl = data.data.download.url
      if (!videoUrl && data.data?.play) videoUrl = data.data.play

      if (!videoUrl) {
         await m.react('❌')
         return m.reply(`🙄 *La API no devolvió un video válido* 💅`)
      }

      await client.sendMessage(m.chat, { video: { url: videoUrl }, caption, mimetype: 'video/mp4' }, { quoted: m })
      await m.react('✅')
    } catch (e) {
      console.error("[LUMIBOT DEBUG] Error en tiktok.js:", e)
      await m.react('❌')
      await m.reply(`🙄 *Murió el proceso de TikTok* 💅\n> Error: ${e.message}`)
    }
  }
}