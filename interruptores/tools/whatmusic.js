import fetch from 'node-fetch'
import { downloadContentFromMessage } from '@whiskeysockets/baileys'

const ALYA_KEY = 'LumiBot-alya';

export default {
  command: ['whatmusic', 'shazam'],
  category: 'tools',
  run: async (client, m, args, usedPrefix, command) => {
    let media = m.quoted ? m.quoted : m
    let msg = media.message?.audioMessage || media.message?.videoMessage
    let url = args[0]
    
    if (!msg && !url) {
      return m.reply(`🙄 *Bruh, ¿qué se supone que escuche?*\nResponde a un audio/video o pásame un link. No tengo poderes psíquicos. 💅\n> Ejemplo: *${usedPrefix}${command} https://...*`)
    }
    
    await m.react('⏳')
    
    try {
      let data;
      
      if (url && url.startsWith('http')) {
         const res = await fetch(`https://api.alyacore.xyz/tools/whatmusic?url=${encodeURIComponent(url)}&key=${ALYA_KEY}`, { headers: { 'User-Agent': 'Mozilla/5.0' } })
         data = await res.json()
      } else if (msg) {
         const stream = await downloadContentFromMessage(msg, media.message?.audioMessage ? 'audio' : 'video')
         let buffer = Buffer.from([])
         for await (const chunk of stream) {
             buffer = Buffer.concat([buffer, chunk])
         }
         
         const form = new FormData()
         form.append('file', new Blob([buffer]), 'audio.mp3')
         const upRes = await fetch('https://api.alyacore.xyz/tools/upload', { method: 'POST', body: form })
         const upData = await upRes.json()
         
         if (!upData.status || !upData.url) throw new Error('Error al subir el audio a la nube')
         
         const res = await fetch(`https://api.alyacore.xyz/tools/whatmusic?url=${encodeURIComponent(upData.url)}&key=${ALYA_KEY}`, { headers: { 'User-Agent': 'Mozilla/5.0' } })
         data = await res.json()
      }
      
      if (!data || !data.status) {
         await m.react('❌')
         return m.reply(`🙄 *Mis oídos finos no reconocen este ruido.* 💅`)
      }

      const info = Array.isArray(data.data) ? data.data[0] : (data.data || data)
      const title = info.title || info.name || 'Desconocida'
      const artist = info.artists || info.artist || 'Desconocido'
      const album = info.album || 'Desconocido'
      const release = info.release_date || info.release || '-'
      
      const caption = `╭━━━━━━━━━━━━━━━╮\n┃ 🎵 *WHAT MUSIC* \n┃━━━━━━━━━━━━━━━\n┃ 📌 *Título:* ${title}\n┃ 🎤 *Artista:* ${artist}\n┃ 💿 *Álbum:* ${album}\n┃ 📅 *Lanzamiento:* ${release}\n╰━━━━━━━━━━━━━━━╯`
      
      await m.reply(caption)
      await m.react('✅')
    } catch (e) {
      console.error("[LUMIBOT DEBUG] Error en whatmusic.js:", e)
      await m.react('❌')
      await m.reply(`🙄 *Literalmente me quedé sorda.* 💅\nLa API colapsó escuchando tu audio.\n> Error técnico: ${e.message}`)
    }
  }
}
