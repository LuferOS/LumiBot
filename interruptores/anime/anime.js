import fetch from 'node-fetch'

const ALYA_KEY = 'api-lYsN6';

export default {
  command: ['animedl', 'anime', 'episodio'],
  category: 'anime',
  run: async (client, m, args, usedPrefix, command) => {
    if (!args[0]) {
      return m.reply(`🙄 *Bruh, ingresa el enlace del anime o episodio.* 💅\n> Ejemplo: *${usedPrefix}${command} https://...*`)
    }
    
    await m.react('⏳')
    const targetUrl = args[0]
    
    try {
      const res = await fetch(`https://api.alyacore.xyz/anime/dl/anime?url=${encodeURIComponent(targetUrl)}&key=${ALYA_KEY}`)
      const data = await res.json()
      
      if (!data.status) {
         await m.react('❌')
         return m.reply(`🙄 *No encontré ningún episodio válido en ese enlace.* 💅`)
      }

      // Manejar estructura de AlyaCore
      let videoUrl = data.url || data.download || data.video || data.dl
      if (data.data && data.data.url) videoUrl = data.data.url
      if (data.data && data.data.download && data.data.download.url) videoUrl = data.data.download.url
      if (data.data && data.data.dl) videoUrl = data.data.dl

      if (!videoUrl && data.data && Array.isArray(data.data) && data.data[0]) {
          videoUrl = data.data.find(v => v.quality?.includes('720') || v.quality?.includes('1080'))?.url || data.data[0].url
      }

      if (!videoUrl) {
         await m.react('❌')
         return m.reply(`🙄 *La API no devolvió un enlace de video válido para el anime.* 💅`)
      }

      const title = data.data?.title || data.title || 'Anime Episode'
      const caption = `╭━━━━━━━━━━━━━━━╮\n┃ 🎬 *ANIME DOWNLOAD* \n┃━━━━━━━━━━━━━━━\n┃ 📌 ${title}\n┃ ⚡ *API:* AlyaCore\n╰━━━━━━━━━━━━━━━╯`
      
      await client.sendMessage(m.chat, { video: { url: videoUrl }, caption, mimetype: 'video/mp4' }, { quoted: m })
      
      await m.react('✅')
    } catch (e) {
      console.error("[LUMIBOT DEBUG] Error en anime.js:", e)
      await m.react('❌')
      await m.reply(`🙄 *Error descargando el anime* 💅\n> Error: ${e.message}`)
    }
  }
}
