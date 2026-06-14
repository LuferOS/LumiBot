import fetch from 'node-fetch'
import { proto, generateWAMessageFromContent } from '@whiskeysockets/baileys'

const CAUSAS_KEY = 'causa-60ca3fea34a7af43';
const ALYA_KEY = 'api-lYsN6'; // Usamos la key principal de Alya

export default {
  command: ['spotify', 'sp'],
  category: 'downloads',
  run: async (client, m, args, usedPrefix, command) => {
    try {
      const text = args.join(' ').trim()
      if (!text) {
        return m.reply(`🙄 *Bruh, ingresa un enlace de Spotify o el nombre de una canción.* 💅\n> Ejemplo: *${usedPrefix}${command} bad bunny*`)
      }

      await m.react('🕒')

      // MODO BÚSQUEDA (Si no es un enlace, usa AlyaCore Search)
      if (!text.includes('spotify.com')) {
          const searchRes = await fetch(`https://api.alyacore.xyz/search/spotify?query=${encodeURIComponent(text)}&key=${ALYA_KEY}`);
          const searchData = await searchRes.json();

          if (!searchData.status || !searchData.data || searchData.data.length === 0) {
              await m.react('✖️')
              return m.reply(`🙄 *No encontré nada en Spotify con ese nombre* 💅`)
          }

          const topResults = searchData.data.slice(0, 3);
          const buttons = topResults.map((track, i) => {
              return {
                  name: "quick_reply",
                  buttonParamsJson: JSON.stringify({
                      display_text: `🎵 ${i + 1}: ${track.title.substring(0, 15)} - ${track.artist.substring(0, 10)}`,
                      id: `${usedPrefix}${command} ${track.url}`
                  })
              }
          });

          let fallbackText = `╭━━━━━━━━━━━━━━━╮\n┃ 🎧 *SPOTIFY SEARCH* \n┃━━━━━━━━━━━━━━━\n┃ 🔍 Resultados para: *${text}*\n`
          topResults.forEach((track, i) => {
              fallbackText += `┃ ${i + 1}. ${track.title} - ${track.artist}\n`
          });
          fallbackText += `╰━━━━━━━━━━━━━━━╯\n> 💡 *Usa los botones abajo para descargar, o envía:* ${usedPrefix}${command} [url]`

          const msg = generateWAMessageFromContent(m.chat, {
              viewOnceMessage: {
                  message: {
                      interactiveMessage: proto.Message.InteractiveMessage.fromObject({
                          body: proto.Message.InteractiveMessage.Body.create({ text: fallbackText }),
                          footer: proto.Message.InteractiveMessage.Footer.create({ text: 'LumiBot 💅✨' }),
                          header: proto.Message.InteractiveMessage.Header.create({ title: '', hasMediaAttachment: false }),
                          nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
                              buttons: buttons
                          })
                      })
                  }
              }
          }, { quoted: m })

          await client.relayMessage(m.chat, msg.message, { messageId: msg.key.id })
          await m.react('✔️')
          return
      }

      // MODO DESCARGA (Si es un enlace, sigue usando la carrera Alya vs Causas)
      const targetUrl = args[0]
      const fetchCausas = async () => {
          const url = `https://rest.apicausas.xyz/api/v1/descargas/spotify?apikey=${CAUSAS_KEY}&url=${encodeURIComponent(targetUrl)}`
          const res = await fetch(url)
          const data = await res.json()
          if (!data.status) throw new Error('Causas fallo status')
          return { provider: 'causas', data }
      }

      const fetchAlya = async () => {
          // Para descargas podemos usar la key antigua o la nueva, usaré la principal por si acaso
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
      await m.reply(`🙄 *Todo explotó* 💅\n> Error: ${e.message}`)
    }
  }
}
