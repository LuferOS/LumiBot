import fetch from 'node-fetch'

const CAUSAS_KEY = 'causa-60ca3fea34a7af43';
const ALYA_KEY = 'DEPOOL-key60015';

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
    const cmd = command.toLowerCase()
    const targetUrl = args[0]
    
    try {
      // PROMESAS DE CARRERA (RACE)
      const fetchCausas = async () => {
          const res = await fetch(`https://rest.apicausas.xyz/api/v1/descargas/tiktok?apikey=${CAUSAS_KEY}&url=${encodeURIComponent(targetUrl)}`)
          const data = await res.json()
          if (!data.status) throw new Error('Causas fallo status')
          return { provider: 'causas', data }
      }

      const fetchAlya = async () => {
          const endpoint = cmd.includes('mp3') 
            ? `https://api.alyacore.xyz/dl/tiktokmp3?url=${encodeURIComponent(targetUrl)}&key=${ALYA_KEY}`
            : `https://api.alyacore.xyz/dl/tiktok?url=${encodeURIComponent(targetUrl)}&key=${ALYA_KEY}`
            
          const res = await fetch(endpoint)
          const data = await res.json()
          if (!data.status) throw new Error('Alya fallo status')
          return { provider: 'alya', data }
      }

      // La primera que responda exitosamente, gana.
      const winner = await Promise.any([fetchCausas(), fetchAlya()])
      const data = winner.data

      const title = data.data?.title || data.title || data.data?.music_info?.title || 'TikTok Video'
      const caption = `╭━━━━━━━━━━━━━━━╮
┃ 🎵 *TIKTOK DOWNLOAD*
┃━━━━━━━━━━━━━━━
┃ 📌 ${title}
┃ ⚡ *API:* ${winner.provider === 'causas' ? 'Causas (Fast)' : 'AlyaCore (Fast)'}
╰━━━━━━━━━━━━━━━╯`

      // Manejar Audios (MP3)
      if (cmd.includes('mp3')) {
          let audioUrl = data.data?.audio?.url || data.audio || data.data?.music || data.data?.dl || data.dl || data.data?.download?.audio
          if (!audioUrl) return m.reply(`🙄 *No encontré audio extraíble en este TikTok.* 💅`)
          await client.sendMessage(m.chat, { audio: { url: audioUrl }, mimetype: 'audio/mpeg' }, { quoted: m })
          await m.react('✅')
          return
      }

      // Manejar Imágenes
      let images = data.data?.images || data.images || []
      if (images.length > 0 || cmd.includes('img')) {
          if (images.length === 0) return m.reply(`🙄 *Este TikTok no tiene imágenes (Slide).* 💅`)
          for (let img of images) {
              await client.sendMessage(m.chat, { image: { url: img }, caption }, { quoted: m })
          }
          await m.react('✅')
          return
      }

      // Manejar Video (Por defecto)
      let videoUrl = data.url || data.download || data.video || data.dl || data.data?.dl
      if (data.data && data.data.url) videoUrl = data.data.url
      if (data.data && data.data.download && data.data.download.url) videoUrl = data.data.download.url
      if (!videoUrl && data.data?.play) videoUrl = data.data.play

      if (!videoUrl) {
         await m.react('❌')
         return m.reply(`🙄 *Las APIs no devolvieron un video válido* 💅`)
      }

      await client.sendMessage(m.chat, { video: { url: videoUrl }, caption, mimetype: 'video/mp4' }, { quoted: m })
      await m.react('✅')
    } catch (e) {
      console.error("[LUMIBOT DEBUG] Error en tiktok.js:", e)
      await m.react('❌')
      await m.reply(`🙄 *Murió el proceso de TikTok (Ambas APIs fallaron)* 💅\n> Error: ${e.message}`)
    }
  }
}