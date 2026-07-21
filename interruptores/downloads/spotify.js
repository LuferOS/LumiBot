import fetch from 'node-fetch'
import { lumiAnim } from '../../nucleo/utils.js'

const CAUSAS_KEY = 'causa-60ca3fea34a7af43';
const ALYA_KEY = 'LumiBot-alya';

async function fetchJsonRobust(url, retries = 2) {
  for (let i = 0; i <= retries; i++) {
    try {
      const res = await fetch(url, { timeout: 15000 });
      const text = await res.text();
      try {
        const json = JSON.parse(text);
        if (json && typeof json === 'object') return json;
      } catch (e) {
        if (i === retries) throw new Error('La API devolvió un formato incorrecto (quizás está caída).');
      }
    } catch (err) {
      if (i === retries) throw err;
    }
    await new Promise(r => setTimeout(r, 1000));
  }
  return null;
}

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

      const downloadSpotify = async (targetUrl) => {
          const fetchCausas = async () => {
              const url = `https://rest.apicausas.xyz/api/v1/descargas/spotify?apikey=${CAUSAS_KEY}&url=${encodeURIComponent(targetUrl)}`
              const data = await fetchJsonRobust(url)
              if (!data || !data.status) throw new Error('Causas fallo status')
              return { provider: 'causas', data }
          }
          const fetchAlya = async () => {
              const url = `https://api.alyacore.xyz/dl/spotify?url=${encodeURIComponent(targetUrl)}&key=${ALYA_KEY}`
              const data = await fetchJsonRobust(url)
              if (!data || !data.status) throw new Error('Alya fallo status')
              return { provider: 'alya', data }
          }
          
          const winner = await Promise.any([fetchCausas(), fetchAlya()])
          const data = winner.data

          let audioUrl = data.url || data.download || data.audio || data.dl
          if (data.data && data.data.url) audioUrl = data.data.url
          if (data.data && data.data.download && data.data.download.url) audioUrl = data.data.download.url
          if (data.data && data.data.dl) audioUrl = data.data.dl

          if (!audioUrl) throw new Error('No audio URL found')
          
          return {
              audioUrl,
              title: data.data?.title || data.title || 'Spotify_LumiBot'
          }
      }

      // MODO BÚSQUEDA (Descarga automáticamente el top 3)
      if (!text.includes('spotify.com')) {
          const searchData = await fetchJsonRobust(`https://api.alyacore.xyz/search/spotify?query=${encodeURIComponent(text)}&key=${ALYA_KEY}`);

          if (!searchData.status || !searchData.data || searchData.data.length === 0) {
              await m.react('✖️')
              return m.reply(`🙄 *No encontré nada en Spotify con ese nombre* 💅`)
          }

          const topResults = searchData.data.slice(0, 3);
          
          let animMsg = await lumiAnim(client, m, [`⏳ *Encontradas ${topResults.length} canciones...* 💅`, '📥 *Descargando y enviando el Top 3...* 💅'], 1500);

          let sentCount = 0;
          for (let track of topResults) {
              try {
                  const { audioUrl, title } = await downloadSpotify(track.url);
                  const trackTitle = title !== 'Spotify_LumiBot' ? title : track.title;
                  await client.sendMessage(m.chat, { audio: { url: audioUrl }, mimetype: 'audio/mpeg', fileName: `${trackTitle}.mp3` }, { quoted: m })
                  sentCount++;
              } catch (e) {
                  console.log(`[LUMIBOT] Error descargando track de Spotify: ${track.title} - ${e.message}`);
              }
          }
          
          if (animMsg) await client.sendMessage(m.chat, { delete: animMsg.key }).catch(()=>{});
          
          if (sentCount === 0) {
              await m.react('✖️')
              return m.reply(`🙄 *Hubo un error y no se pudo descargar ninguna de las canciones encontradas.* 💅`)
          }

          await m.react('✔️')
          return
      }

      // MODO DESCARGA DIRECTA (Si es un enlace)
      const targetUrl = args[0]
      let animMsg = await lumiAnim(client, m, ['⏳ *Conectando a los servidores...* 💅', '📥 *Descargando canción de Spotify...* 💅'], 1000);

      try {
          const { audioUrl, title } = await downloadSpotify(targetUrl);
          if (animMsg) await client.sendMessage(m.chat, { delete: animMsg.key }).catch(()=>{});
          await client.sendMessage(m.chat, { audio: { url: audioUrl }, mimetype: 'audio/mpeg', fileName: `${title}.mp3` }, { quoted: m })
          await m.react('✔️')
      } catch (e) {
          if (animMsg) await client.sendMessage(m.chat, { delete: animMsg.key }).catch(()=>{});
          await m.react('✖️')
          return m.reply(`🙄 *Las APIs fallaron o no devolvieron un enlace válido de audio* 💅`)
      }

    } catch (e) {
      console.error("[LUMIBOT DEBUG] Error en spotify.js:", e)
      await m.react('✖️')
      await m.reply(`🙄 *Todo explotó* 💅\n> Error: ${e.message}`)
    }
  }
}
