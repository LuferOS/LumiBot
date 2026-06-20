import fetch from 'node-fetch'
import { downloadContentFromMessage } from '@whiskeysockets/baileys'

const ALYA_KEY = 'LumiBot-alya';

export default {
  command: ['vocalremover', 'acapella'],
  category: 'tools',
  run: async (client, m, args, usedPrefix, command) => {
    let media = m.quoted ? m.quoted : m
    let msg = media.message?.audioMessage || media.message?.videoMessage
    let url = args[0]
    
    if (!msg && !url) {
      return m.reply(`🙄 *Bruh, ¿qué quieres que separe?*\nResponde a un audio/video o pásame un link. No hago magia con el aire. 💅\n> Ejemplo: *${usedPrefix}${command} https://...*`)
    }
    
    await m.react('⏳')
    
    try {
      let data;
      
      if (url && url.startsWith('http')) {
         const res = await fetch(`https://api.alyacore.xyz/tools/vocalremover?url=${encodeURIComponent(url)}&key=${ALYA_KEY}`, { headers: { 'User-Agent': 'Mozilla/5.0' } })
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
         
         const res = await fetch(`https://api.alyacore.xyz/tools/vocalremover?url=${encodeURIComponent(upData.url)}&key=${ALYA_KEY}`, { headers: { 'User-Agent': 'Mozilla/5.0' } })
         data = await res.json()
      }
      
      if (!data || !data.status) {
         await m.react('❌')
         return m.reply(`🙄 *Ay por favor...*\nEl servidor no pudo separar las voces. Seguro el audio está malísimo. 💅`)
      }

      const vocalUrl = data.vocal || data.vocals || data.url
      const instrumentalUrl = data.instrumental || data.music
      
      if (vocalUrl) {
         await client.sendMessage(m.chat, { audio: { url: vocalUrl }, mimetype: 'audio/mpeg', fileName: 'vocal.mp3' }, { quoted: m })
      }
      if (instrumentalUrl) {
         await client.sendMessage(m.chat, { audio: { url: instrumentalUrl }, mimetype: 'audio/mpeg', fileName: 'instrumental.mp3' }, { quoted: m })
      }
      
      await m.react('✅')
    } catch (e) {
      console.error("[LUMIBOT DEBUG] Error en vocalremover.js:", e)
      await m.react('❌')
      await m.reply(`🙄 *Literalmente la IA se atragantó.* 💅\n> Error técnico: ${e.message}`)
    }
  }
}
