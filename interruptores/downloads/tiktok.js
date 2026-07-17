import fetch from 'node-fetch'
import { proto, generateWAMessageFromContent, generateWAMessageContent } from 'baileys-next'
import { lumiAnim } from '../../nucleo/utils.js'

const CAUSAS_KEY = 'causa-60ca3fea34a7af43';
const ALYA_KEY = 'DEPOOL-key60015';

export default {
  command: ['tiktok', 'tt', 'tiktokimg', 'ttimg', 'tiktokmp3', 'ttmp3', 'tiktoksearch', 'ttsearch', 'tts'],
  category: 'downloader',
  run: async (client, m, args, usedPrefix, command) => {
    if (!args[0]) {
      return m.reply(`🙄 *Bruh, ingresa un enlace de TikTok o busca algo.* 💅\n> Ejemplo: *${usedPrefix}${command} https://vm.tiktok.com/xxx*\n> Ejemplo: *${usedPrefix}ttsearch gatos graciosos*`)
    }
    
    await m.react('⏳')
    const cmd = command.toLowerCase()
    const isSearchCommand = cmd.includes('search') || cmd === 'tts'
    const text = args.join(' ').trim()
    
    try {
      // MODO BÚSQUEDA TIKTOK (VERSIÓN ORIGINAL CON CARRUSEL)
      if (isSearchCommand || (!text.match(/tiktok\.com/i) && !cmd.includes('tt'))) {
          const statusMsg = await client.sendMessage(m.chat, { text: '⏳ *Buscando videos en TikTok...* 💅' }, { quoted: m });
          
          const searchRes = await fetch('https://tikwm.com/api/feed/search', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                  'User-Agent': 'Mozilla/5.0'
              },
              body: new URLSearchParams({ keywords: text, count: '3', cursor: '0', HD: '1' }),
          })
          const searchData = await searchRes.json()

          if (!searchData.data || !searchData.data.videos || searchData.data.videos.length === 0) {
              await m.react('✖️')
              await client.sendMessage(m.chat, { text: `🙄 *No encontré videos en TikTok con ese nombre* 💅`, edit: statusMsg.key })
              return;
          }

          await client.sendMessage(m.chat, { text: '📥 *Descargando videos y armando el carrusel...* 💅', edit: statusMsg.key });

          const topResults = searchData.data.videos.slice(0, 3)
          const cards = []

          let uploadedCount = 0;
          for (const video of topResults) {
              const url = video.play || video.hdplay || video.wmplay
              if (!url) continue
              try {
                  uploadedCount++;
                  await client.sendMessage(m.chat, { text: `🚀 *Subiendo video ${uploadedCount}/${topResults.length} a los servidores...* 💅`, edit: statusMsg.key });
                  
                  const { videoMessage } = await generateWAMessageContent(
                      { video: { url: url } },
                      { upload: client.waUploadToServer }
                  )

                  const title = String(video.title || 'Sin titulo').replace(/\s+/g, ' ').slice(0, 64)
                  cards.push({
                      body: proto.Message.InteractiveMessage.Body.fromObject({
                          text: `🎵 ${title}\n👤 @${video.author?.unique_id}`,
                      }),
                      footer: proto.Message.InteractiveMessage.Footer.fromObject({ text: 'LumiBot 💅✨' }),
                      header: proto.Message.InteractiveMessage.Header.fromObject({
                          title: '',
                          hasMediaAttachment: true,
                          videoMessage,
                      }),
                      nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({ buttons: [] }),
                  })
              } catch (e) {
                  console.log("Error generando tarjeta de carrusel:", e)
              }
          }

          if (cards.length === 0) {
              await m.react('✖️')
              await client.sendMessage(m.chat, { text: `🙄 *No pude procesar los videos de la búsqueda.* 💅`, edit: statusMsg.key })
              return;
          }

          await client.sendMessage(m.chat, { text: '✅ *¡Carrusel listo!* 💅\n> Enviando panel interactivo...', edit: statusMsg.key });

          const msg = generateWAMessageFromContent(
              m.chat,
              {
                  viewOnceMessage: {
                      message: {
                          interactiveMessage: proto.Message.InteractiveMessage.fromObject({
                              body: proto.Message.InteractiveMessage.Body.create({ text: `🎧 *TIKTOK SEARCH*\n> 🔍 Resultados para: *${text}*` }),
                              footer: proto.Message.InteractiveMessage.Footer.create({ text: '' }),
                              header: proto.Message.InteractiveMessage.Header.create({ hasMediaAttachment: false }),
                              carouselMessage: proto.Message.InteractiveMessage.CarouselMessage.fromObject({ cards }),
                          }),
                      },
                  },
              },
              { quoted: m }
          )

          await client.relayMessage(m.chat, msg.message, { messageId: msg.key.id })
          await m.react('✔️')
          return
      }

      // MODO DESCARGA (Si es un enlace)
      const targetUrl = args[0]
      let animMsg = await lumiAnim(client, m, ['⏳ *Conectando a los servidores...* 💅', '📥 *Descargando TikTok...* 💅'], 1000);
      
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

      let winner;
      try {
          winner = await Promise.any([fetchCausas(), fetchAlya()]);
      } catch (error) {
          if (animMsg) await client.sendMessage(m.chat, { delete: animMsg.key }).catch(()=>{});
          return client.reply(m.chat, `╭⋯ ❌ *ERROR DE DESCARGA* ⋯》\n┊ No pude descargar este TikTok.\n┊ Asegúrate de que el enlace sea correcto y el perfil público.\n╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》`, m);
      }
      
      const data = winner.data

      const title = data.data?.title || data.title || data.data?.music_info?.title || 'TikTok Video'
      const caption = `╭━━━━━━━━━━━━━━━╮\n┃ 🎵 *TIKTOK DOWNLOAD*\n┃━━━━━━━━━━━━━━━\n┃ 📌 ${title}\n┃ ⚡ *API:* ${winner.provider === 'causas' ? 'Causas (Fast)' : 'AlyaCore (Fast)'}\n╰━━━━━━━━━━━━━━━╯`

      if (cmd.includes('mp3')) {
          let audioUrl = data.data?.audio?.url || data.audio || data.data?.music || data.data?.dl || data.dl || data.data?.download?.audio
          if (!audioUrl) return m.reply(`🙄 *No encontré audio extraíble en este TikTok.* 💅`)
          if (animMsg) await client.sendMessage(m.chat, { delete: animMsg.key }).catch(()=>{});
          await client.sendMessage(m.chat, { audio: { url: audioUrl }, mimetype: 'audio/mpeg' }, { quoted: m })
          await m.react('✅')
          return
      }

      let images = data.data?.images || data.images || []
      if (images.length > 0 || cmd.includes('img')) {
          if (images.length === 0) return m.reply(`🙄 *Este TikTok no tiene imágenes (Slide).* 💅`)
          if (animMsg) await client.sendMessage(m.chat, { delete: animMsg.key }).catch(()=>{});
          for (let img of images) {
              await client.sendMessage(m.chat, { image: { url: img }, caption: `╭⋯ 🎵 *TIKTOK DOWNLOAD* ⋯》\n┊ ⊳ *Toma tu imagen.* 💅\n╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》` }, { quoted: m })
          }
          await m.react('✅')
          return
      }

      let videoUrl = data.url || data.download || data.video || data.dl || data.data?.dl
      if (data.data && data.data.url) videoUrl = data.data.url
      if (data.data && data.data.download && data.data.download.url) videoUrl = data.data.download.url
      if (!videoUrl && data.data?.play) videoUrl = data.data.play

      if (!videoUrl) {
         await m.react('❌')
         return m.reply(`🙄 *Las APIs no devolvieron un video válido* 💅`)
      }

      if (animMsg) await client.sendMessage(m.chat, { delete: animMsg.key }).catch(()=>{});
      await client.sendMessage(m.chat, { video: { url: videoUrl }, caption: `╭⋯ 🎵 *TIKTOK DOWNLOAD* ⋯》\n┊ ⊳ *Toma tu video.* 💅\n╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》`, mimetype: 'video/mp4' }, { quoted: m })
      await m.react('✅')
    } catch (e) {
      if (typeof animMsg !== 'undefined' && animMsg) await client.sendMessage(m.chat, { delete: animMsg.key }).catch(()=>{});
      console.error("[LUMIBOT DEBUG] Error en tiktok.js:", e)
      await m.react('❌')
      await m.reply(`🙄 *Hubo un error.* Intenta con otro enlace. 💅\n> ${e.message}`)
    }
  }
}