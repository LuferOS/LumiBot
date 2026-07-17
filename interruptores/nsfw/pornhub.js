import fetch from 'node-fetch'

export default {
  command: ['pornhub', 'ph'],
  category: 'nsfw',
  run: async (client, m, args, usedPrefix, command) => {
    try {
      const urlText = args[0]
      if (!urlText || !urlText.includes('pornhub.com')) {
        return m.reply(`🙄 *Bruh, ingresa un enlace válido de Pornhub.* 💅\n> Ejemplo: *${usedPrefix}${command} https://es.pornhub.com/view_video...*`)
      }

      await m.react('🕒')
      const apicausasUrl = `https://rest.apicausas.xyz/api/v1/nsfw/descargas/pornhub?apikey=causa-60ca3fea34a7af43&url=${encodeURIComponent(urlText)}`
      const alyacoreUrl = `https://api.alyacore.xyz/nsfw/dl/pornhub?url=${encodeURIComponent(urlText)}&key=LumiBot-alya`
      
      const fetchApi = async (url) => {
        const res = await fetch(url)
        const data = await res.json()
        if (!data.status) throw new Error(data.message || data.msg || 'Status false')
        let videoUrl = data.url || data.download || data.video
        if (data.data && data.data.url) videoUrl = data.data.url
        if (!videoUrl) throw new Error('Sin URL de video en respuesta')
        return videoUrl
      }

      let videoUrl;
      try {
        videoUrl = await Promise.any([
          fetchApi(apicausasUrl),
          fetchApi(alyacoreUrl)
        ])
      } catch (aggregateError) {
        await m.react('✖️')
        return m.reply(`🙄 *Falló la descarga de Pornhub* 💅\n> Las APIs de extracción (Causas / Alyacore) están caídas o Pornhub actualizó su seguridad.\n> Inténtalo de nuevo más tarde.`)
      }

      await client.sendMessage(m.chat, { video: { url: videoUrl }, caption: `🔥 *Aquí tienes tu video de Pornhub, puerco* 🔥\n> Disfruta 💅` }, { quoted: m })
      await m.react('✔️')

    } catch (e) {
      console.error("[LUMIBOT DEBUG] Error en pornhub.js:", e)
      await m.react('✖️')
      await m.reply(`🙄 *Todo explotó bajando de Pornhub* 💅\n> Error: ${e.message}`)
    }
  }
}
