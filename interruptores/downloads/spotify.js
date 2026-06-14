import fetch from 'node-fetch'

const CAUSAS_KEY = 'causa-60ca3fea34a7af43';
const ALYA_KEY = 'DEPOOL-key60015';

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
      const targetUrl = urlText
      
      const fetchCausas = async () => {
          const url = `https://rest.apicausas.xyz/api/v1/descargas/spotify?apikey=${CAUSAS_KEY}&url=${encodeURIComponent(targetUrl)}`
          const res = await fetch(url)
          const data = await res.json()
          if (!data.status) throw new Error('Causas fallo status')
          return { provider: 'causas', data }
      }

      const fetchAlya = async () => {
          const url = `https://api.alyacore.xyz/dl/spotify?url=${encodeURIComponent(targetUrl)}&key=${ALYA_KEY}`
          const res = await fetch(url)
          const data = await res.json()
          if (!data.status) throw new Error('Alya fallo status')
          return { provider: 'alya', data }
      }

      const winner = await Promise.any([fetchCausas(), fetchAlya()])
      const data = winner.data

      let audioUrl = data.url || data.download || data.audio || data.dl
      if (data.data && data.data.url) audioUrl = data.data.url
      if (data.data && data.data.download && data.data.download.url) audioUrl = data.data.download.url
      if (data.data && data.data.dl) audioUrl = data.data.dl

      if (!audioUrl) {
         await m.react('✖️')
         return m.reply(`🙄 *Las APIs no devolvieron un enlace válido de audio* 💅`)
      }
      
      const title = data.data?.title || data.title || 'Spotify_LumiBot'
      await client.sendMessage(m.chat, { audio: { url: audioUrl }, mimetype: 'audio/mpeg', fileName: `${title}.mp3` }, { quoted: m })
      await m.react('✔️')

    } catch (e) {
      console.error("[LUMIBOT DEBUG] Error en spotify.js:", e)
      await m.react('✖️')
      await m.reply(`🙄 *Todo explotó bajando de Spotify (Ambas APIs fallaron)* 💅\n> Error: ${e.message}`)
    }
  }
}
