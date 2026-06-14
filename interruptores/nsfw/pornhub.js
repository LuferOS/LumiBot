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
      const url = `https://rest.apicausas.xyz/api/v1/nsfw/descargas/pornhub?apikey=causa-60ca3fea34a7af43&url=${encodeURIComponent(urlText)}`
      
      const res = await fetch(url)
      const data = await res.json()

      if (!data.status) {
        await m.react('✖️')
        return m.reply(`🙄 *Falló la descarga de Pornhub* 💅\n> Quizás el enlace no es válido o está privado.`)
      }

      let videoUrl = data.url || data.download || data.video
      if (data.data && data.data.url) videoUrl = data.data.url

      if (!videoUrl) {
         await m.react('✖️')
         return m.reply(`🙄 *La API no devolvió un enlace válido de video* 💅`)
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
