import fetch from 'node-fetch'

const CAUSAS_KEY = 'causa-60ca3fea34a7af43';
const ALYA_KEY = 'api-lYsN6';

export default {
  command: ['deezer', 'dz'],
  category: 'downloader',
  run: async (client, m, args, usedPrefix, command) => {
    if (!args[0]) {
      return m.reply(`🙄 *Bruh, ingresa un enlace o nombre para Deezer.* 💅\n> Ejemplo: *${usedPrefix}${command} https://deezer.page.link/xxx*\n> Ejemplo: *${usedPrefix}${command} bad bunny*`)
    }
    
    await m.react('⏳')
    const targetUrl = args.join(' ')
    
    try {
      const fetchAlya = async () => {
          const res = await fetch(`https://api.alyacore.xyz/dl/deezer?url=${encodeURIComponent(targetUrl)}&key=${ALYA_KEY}`)
          const data = await res.json()
          if (!data.status) throw new Error('Alya fallo status')
          return { provider: 'alya', data }
      }

      // De momento AlyaCore es el único proveedor de Deezer
      const winner = await fetchAlya()
      const data = winner.data

      let audioUrl = data.url || data.download || data.audio || data.dl
      if (data.data && data.data.url) audioUrl = data.data.url
      if (data.data && data.data.download && data.data.download.url) audioUrl = data.data.download.url
      if (data.data && data.data.dl) audioUrl = data.data.dl

      if (!audioUrl) {
         await m.react('❌')
         return m.reply(`🙄 *AlyaCore no devolvió un enlace válido de Deezer* 💅`)
      }

      const title = data.data?.title || data.title || 'Deezer Audio'
      const caption = `╭━━━━━━━━━━━━━━━╮\n┃ 🎧 *DEEZER DOWNLOAD*\n┃━━━━━━━━━━━━━━━\n┃ 📌 ${title}\n┃ ⚡ *API:* AlyaCore\n╰━━━━━━━━━━━━━━━╯`
      
      await client.sendMessage(m.chat, { audio: { url: audioUrl }, mimetype: 'audio/mpeg', fileName: `${title}.mp3` }, { quoted: m })
      await m.react('✅')
    } catch (e) {
      console.error("[LUMIBOT DEBUG] Error en deezer.js:", e)
      await m.react('❌')
      await m.reply(`🙄 *Error descargando de Deezer* 💅\n> Error: ${e.message}`)
    }
  }
}
