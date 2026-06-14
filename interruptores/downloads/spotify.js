import fetch from 'node-fetch'

export default {
  command: ['spotify', 'sp'],
  category: 'downloads',
  run: async (client, m, args, usedPrefix, command) => {
    try {
      const urlText = args[0]
      if (!urlText || !urlText.includes('spotify.com')) {
        return m.reply(`🙄 *Bruh, ingresa un enlace válido de Spotify.* 💅\n> Ejemplo: *${usedPrefix}${command} https://open.spotify.com/track/4PTG3Z6ehGkBF2zI7YgR7C*`)
      }

      await m.react('🕒')
      const url = `https://rest.apicausas.xyz/api/v1/descargas/spotify?apikey=causa-60ca3fea34a7af43&url=${encodeURIComponent(urlText)}`
      
      const res = await fetch(url)
      const data = await res.json()

      if (!data.status) {
        await m.react('✖️')
        return m.reply(`🙄 *Falló la descarga de Spotify* 💅\n> Quizás el enlace no es válido o la API está caída.`)
      }

      let audioUrl = data.url || data.download || data.audio
      if (data.data && data.data.url) audioUrl = data.data.url

      if (!audioUrl) {
         await m.react('✖️')
         return m.reply(`🙄 *La API no devolvió un enlace válido de audio* 💅`)
      }
      
      await client.sendMessage(m.chat, { audio: { url: audioUrl }, mimetype: 'audio/mpeg', fileName: `${data.title || 'Spotify_LumiBot'}.mp3` }, { quoted: m })
      await m.react('✔️')

    } catch (e) {
      console.error("[LUMIBOT DEBUG] Error en spotify.js:", e)
      await m.react('✖️')
      await m.reply(`🙄 *Todo explotó bajando de Spotify* 💅\n> Error: ${e.message}`)
    }
  }
}
