import fetch from 'node-fetch'

export default {
  command: ['soundcloud', 'sc'],
  category: 'downloads',
  run: async (client, m, args, usedPrefix, command) => {
    try {
      const text = args.join(' ')
      if (!text) {
        return m.reply(`🙄 *Bruh, ingresa un enlace o nombre de canción de SoundCloud.* 💅\n> Ejemplo: *${usedPrefix}${command} https://soundcloud.com/artista/cancion*\n> Ejemplo: *${usedPrefix}${command} bad bunny*`)
      }

      await m.react('🕒')
      let url = ''
      
      // Si es un enlace de soundcloud
      if (text.includes('soundcloud.com')) {
        url = `https://rest.apicausas.xyz/api/v1/descargas/soundcloud?apikey=causa-60ca3fea34a7af43&url=${encodeURIComponent(text)}`
      } else {
        // Primero buscamos la canción
        const searchUrl = `https://rest.apicausas.xyz/api/v1/buscadores/soundcloud?apikey=causa-60ca3fea34a7af43&q=${encodeURIComponent(text)}&limit=1`
        const searchRes = await fetch(searchUrl)
        const searchData = await searchRes.json()
        
        if (!searchData.status || !searchData.data || searchData.data.results.length === 0) {
          await m.react('✖️')
          return m.reply(`🙄 *No encontré nada en SoundCloud con ese nombre* 💅`)
        }
        
        const trackUrl = searchData.data.results[0].url
        url = `https://rest.apicausas.xyz/api/v1/descargas/soundcloud?apikey=causa-60ca3fea34a7af43&url=${encodeURIComponent(trackUrl)}`
      }
      
      const res = await fetch(url)
      const data = await res.json()

      // Suponiendo que devuelve { status, title, thumbnail, dl_url } o similar (formato estándar de descargas)
      // Ajustaremos según la típica respuesta de apicausas: devuelve el audio url.
      if (!data.status) {
        await m.react('✖️')
        return m.reply(`🙄 *Falló la descarga de SoundCloud* 💅\n> Literal no pude sacar el audio.`)
      }

      let audioUrl = data.url || data.download || data.dl_url || data.audio // Fallback de los nombres más comunes
      if (data.data && data.data.url) audioUrl = data.data.url
      if (data.data && data.data.download && data.data.download.url) audioUrl = data.data.download.url

      if (!audioUrl) {
         await m.react('✖️')
         return m.reply(`🙄 *La API no devolvió un enlace válido de audio* 💅`)
      }

      const caption = `🎧 *SoundCloud* 🎧\n> Descargado para ti, mi rey 💅`
      
      const title = data.data?.title || data.title || 'Soundcloud_LumiBot'
      await client.sendMessage(m.chat, { audio: { url: audioUrl }, mimetype: 'audio/mpeg', fileName: `${title}.mp3` }, { quoted: m })
      await m.react('✔️')

    } catch (e) {
      console.error("[LUMIBOT DEBUG] Error en soundcloud.js:", e)
      await m.react('✖️')
      await m.reply(`🙄 *Todo explotó bajando de SoundCloud* 💅\n> Error: ${e.message}`)
    }
  }
}
