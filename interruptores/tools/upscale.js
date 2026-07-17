import fetch from 'node-fetch'
import { downloadContentFromMessage } from 'baileys-next'

const ALYA_KEY = 'LumiBot-alya';

export default {
  command: ['upscale', 'hd', 'mejorar'],
  category: 'tools',
  run: async (client, m, args, usedPrefix, command) => {
    let media = m.quoted ? m.quoted : m
    let msg = media.message?.imageMessage
    let url = args[0]
    
    if (!msg && !url) {
      return m.reply(`🙄 *Bruh, ¿qué quieres que mejore?*\nResponde a una imagen borrosa o pásame un link. No puedo mejorar la nada misma. 💅\n> Ejemplo: *${usedPrefix}${command} https://...*`)
    }
    
    await m.react('⏳')
    
    try {
      let data;
      
      if (url && url.startsWith('http')) {
         const res = await fetch(`https://api.alyacore.xyz/tools/upscale?url=${encodeURIComponent(url)}&key=${ALYA_KEY}`, { headers: { 'User-Agent': 'Mozilla/5.0' } })
         data = await res.json()
      } else if (msg) {
         const stream = await downloadContentFromMessage(msg, 'image')
         let buffer = Buffer.from([])
         for await (const chunk of stream) {
             buffer = Buffer.concat([buffer, chunk])
         }
         
         const form = new FormData()
         form.append('file', new Blob([buffer]), 'image.jpg')
         const upRes = await fetch('https://api.alyacore.xyz/tools/upload', { method: 'POST', body: form })
         const upData = await upRes.json()
         
         if (!upData.status || !upData.url) throw new Error('Error al subir la imagen a la nube')
         
         const res = await fetch(`https://api.alyacore.xyz/tools/upscale?url=${encodeURIComponent(upData.url)}&key=${ALYA_KEY}`, { headers: { 'User-Agent': 'Mozilla/5.0' } })
         data = await res.json()
      }
      
      if (!data || !data.status) {
         await m.react('❌')
         return m.reply(`🙄 *Ay por favor...*\nEsa imagen está tan borrosa que ni la IA pudo salvarla. Intenta con otra. 💅`)
      }

      const imageUrl = data.url || data.image || data.data?.url || data.data?.image || data.data
      
      await client.sendMessage(m.chat, { image: { url: imageUrl }, caption: `✨ *Imagen Mejorada por LumiBot* 💅` }, { quoted: m })
      await m.react('✅')
    } catch (e) {
      console.error("[LUMIBOT DEBUG] Error en upscale.js:", e)
      await m.react('❌')
      await m.reply(`🙄 *Literalmente la IA se rindió.* 💅\n> Error técnico: ${e.message}`)
    }
  }
}
