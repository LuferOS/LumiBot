import fetch from 'node-fetch'
import { downloadContentFromMessage } from '@whiskeysockets/baileys'

const ALYA_KEY = 'api-lYsN6';

export default {
  command: ['upscale', 'hd', 'mejorar'],
  category: 'tools',
  run: async (client, m, args, usedPrefix, command) => {
    let media = m.quoted ? m.quoted : m
    let msg = media.message?.imageMessage
    let url = args[0]
    
    if (!msg && !url) {
      return m.reply(`🙄 *Bruh, responde a una imagen o pasa un enlace.* 💅\n> Ejemplo: *${usedPrefix}${command} https://...*`)
    }
    
    await m.react('⏳')
    
    try {
      let data;
      
      if (url && url.startsWith('http')) {
         const res = await fetch(`https://api.alyacore.xyz/tools/upscale?url=${encodeURIComponent(url)}&key=${ALYA_KEY}`)
         data = await res.json()
      } else if (msg) {
         const stream = await downloadContentFromMessage(msg, 'image')
         let buffer = Buffer.from([])
         for await (const chunk of stream) {
             buffer = Buffer.concat([buffer, chunk])
         }
         
         const form = new FormData()
         form.append('file', new Blob([buffer]), 'image.jpg')
         
         const res = await fetch(`https://api.alyacore.xyz/tools/upscale?key=${ALYA_KEY}`, {
             method: 'POST',
             body: form
         })
         data = await res.json()
      }
      
      if (!data || !data.status || !data.data) {
         await m.react('❌')
         return m.reply(`🙄 *No pude mejorar esta imagen.* 💅`)
      }

      const imageUrl = data.data.url || data.data.image || data.data
      
      await client.sendMessage(m.chat, { image: { url: imageUrl }, caption: `✨ *Imagen Mejorada por LumiBot* 💅` }, { quoted: m })
      await m.react('✅')
    } catch (e) {
      console.error("[LUMIBOT DEBUG] Error en upscale.js:", e)
      await m.react('❌')
      await m.reply(`🙄 *La API de Upscale falló* 💅\n> Error: ${e.message}`)
    }
  }
}
