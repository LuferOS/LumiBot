import fetch from 'node-fetch'

const CAUSAS_KEY = 'causa-60ca3fea34a7af43';
const ALYA_KEY = 'DEPOOL-key60015';

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
    const targetUrl = args[0]
    
    try {
      const fetchCausas = async () => {
          const res = await fetch(`https://rest.apicausas.xyz/api/v1/descargas/twitter?apikey=${CAUSAS_KEY}&url=${encodeURIComponent(targetUrl)}`)
          const data = await res.json()
          if (!data.status) throw new Error('Causas fallo status')
          return { provider: 'causas', data }
      }

      const fetchAlya = async () => {
          const res = await fetch(`https://api.alyacore.xyz/dl/twitter?url=${encodeURIComponent(targetUrl)}&key=${ALYA_KEY}`)
          const data = await res.json()
          if (!data.status) throw new Error('Alya fallo status')
          return { provider: 'alya', data }
      }

      const winner = await Promise.any([fetchCausas(), fetchAlya()])
      const data = winner.data

      let mediaUrl = data.url || data.download || data.video || data.dl || data.data?.dl
      if (data.data && data.data.url) mediaUrl = data.data.url
      if (data.data && data.data.download && data.data.download.url) mediaUrl = data.data.download.url
      if (!mediaUrl && data.data && Array.isArray(data.data) && data.data[0]) {
          mediaUrl = data.data[0].url
      }

      if (!mediaUrl) {
         await m.react('❌')
         return m.reply(`🙄 *Las APIs no devolvieron contenido multimedia válido* 💅`)
      }

      const title = data.data?.title || data.title || data.data?.description || data.data?.desc || 'Twitter_X'
      const caption = `╭━━━━━━━━━━━━━━━╮
┃ 🐦 *X / TWITTER DOWNLOAD*
┃━━━━━━━━━━━━━━━
┃ 📌 ${title}
┃ ⚡ *API:* ${winner.provider === 'causas' ? 'Causas (Fast)' : 'AlyaCore (Fast)'}
╰━━━━━━━━━━━━━━━╯`
      
      const isImage = mediaUrl.match(/\.(jpg|jpeg|png)$/i) || (data.data && data.data.type === 'image') || (data.type === 'image')

      if (isImage) {
        await client.sendMessage(m.chat, { image: { url: mediaUrl }, caption }, { quoted: m })
      } else {
        await client.sendMessage(m.chat, { video: { url: mediaUrl }, caption, mimetype: 'video/mp4' }, { quoted: m })
      }
      
      await m.react('✅')
    } catch (e) {
      console.error("[LUMIBOT DEBUG] Error en twitter.js:", e)
      await m.react('❌')
      await m.reply(`🙄 *Explotó el pájaro azul (Ambas APIs fallaron)* 💅\n> Error: ${e.message}`)
    }
  }
}
