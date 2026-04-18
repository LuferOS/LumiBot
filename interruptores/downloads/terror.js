import axios from 'axios'

const queries = [
  'michiparanormal',
  'elmichimarcianotecuenta',
  'lugaresmalditosdemexico',
  'horrorjapones'
]

export default {
  command: ['terror', 'scary', 'horror', 'terrorvideo'],
  category: 'downloader',
  run: async (client, m) => {
    await m.react('👻')
    
    try {
      const randomQuery = queries[Math.floor(Math.random() * queries.length)]
      const video = await getRandomVideo(randomQuery)
      
      const caption = `╭───────────╮
│ 💀 *VIDEO DE TERROR*
│───────────
│ 🎬 ${video.title}
│ 👻 ¿Te atreves?
╰───────────╯`
      
      await client.sendMessage(m.chat, { 
        video: { url: video.no_watermark }, 
        caption,
        ...global.miku
      }, { quoted: m })
      
      await m.react('✅')
    } catch (e) {
      await m.react('❌')
      await m.reply(`💀 *ERROR*\n\nNo se encontraron videos de terror: ${e.message}`, global.miku)
    }
  }
}

async function getRandomVideo(query) {
  const response = await axios({
    method: 'POST',
    url: 'https://tikwm.com/api/feed/search',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      'Cookie': 'current_language=en',
      'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36'
    },
    data: {
      keywords: query,
      count: 10,
      cursor: 0,
      HD: 1
    }
  })
  
  const videos = response.data.data.videos
  if (!videos || videos.length === 0) throw new Error('No se encontraron videos')
  
  const randomVideo = videos[Math.floor(Math.random() * videos.length)]
  
  return {
    title: randomVideo.title,
    cover: randomVideo.cover,
    origin_cover: randomVideo.origin_cover,
    no_watermark: randomVideo.play,
    watermark: randomVideo.wmplay,
    music: randomVideo.music
  }
}
