import axios from 'axios'

const MIN_VIDEO_SIZE = 51200
const PROBE_TIMEOUT = 12000

const queries = [
  'left4f1',
  'l4d2humor',
  'l4d2versus',
]

export default {
  command: ['l4d2', 'l4drandom', 'l4d2random','left4'],
  category: 'downloader',
  run: async (client, m) => {
    await m.react('⏳')
    
    try {
      const randomQuery = queries[Math.floor(Math.random() * queries.length)]
      const video = await getRandomVideo(randomQuery)
      
      const caption = `╭───────────╮
│ 💙 *TIKTOK RANDOM*
│───────────
│ 📌 ${video.title}
╰───────────╯`
      
      await client.sendMessage(m.chat, { 
        video: { url: video.video_url }, 
        caption,
        ...global.miku
      }, { quoted: m })
      
      await m.react('✅')
    } catch (e) {
      await m.react('❌')
      await m.reply(`💙 *ERROR*\n\nNo se encontraron videos: ${e.message}`, global.miku)
    }
  }
}

function isValidUrl(url) {
  return typeof url === 'string' && /^https?:\/\//i.test(url)
}

async function probeVideoUrl(url) {
  if (!isValidUrl(url)) return false

  for (const method of ['HEAD', 'GET']) {
    try {
      const response = await axios({
        method,
        url,
        timeout: PROBE_TIMEOUT,
        maxRedirects: 5,
        validateStatus: (status) => status >= 200 && status < 400,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
          'Accept': '*/*',
        },
      })

      const contentType = String(response?.headers?.['content-type'] || '').toLowerCase()
      const contentLength = Number(response?.headers?.['content-length'] || 0)

      if (contentType && !contentType.includes('video')) continue
      if (contentLength > 0 && contentLength < MIN_VIDEO_SIZE) continue

      return true
    } catch {
      continue
    }
  }

  return false
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
  const candidates = [randomVideo?.play, randomVideo?.wmplay, randomVideo?.hdplay]
  let selectedVideoUrl = null

  for (const url of candidates) {
    if (!isValidUrl(url)) continue
    const isPlayable = await probeVideoUrl(url)
    if (!isPlayable) continue
    selectedVideoUrl = url
    break
  }

  if (!selectedVideoUrl) throw new Error('No se encontro un video compatible')
  
  return {
    title: randomVideo?.title || 'Sin titulo',
    cover: randomVideo?.cover,
    origin_cover: randomVideo?.origin_cover,
    video_url: selectedVideoUrl,
    watermark: randomVideo?.wmplay,
    music: randomVideo?.music,
  }
}
