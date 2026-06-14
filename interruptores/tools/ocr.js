import fetch from 'node-fetch'
import { downloadContentFromMessage } from '@whiskeysockets/baileys'

const ALYA_KEY = 'api-lYsN6';

export default {
  command: ['ocr', 'texto', 'extraer'],
  category: 'tools',
  run: async (client, m, args, usedPrefix, command) => {
    let media = m.quoted ? m.quoted : m
    let msg = media.message?.imageMessage
    let url = args[0]
    
    if (!msg && !url) {
      return m.reply(`🙄 *Bruh, ¿qué se supone que lea?*\nResponde a una imagen que contenga texto o pásame un link. No tengo visión de rayos X. 💅\n> Ejemplo: *${usedPrefix}${command} https://...*`)
    }
    
    await m.react('⏳')
    
    try {
      let data;
      
      if (url && url.startsWith('http')) {
         const res = await fetch(`https://api.alyacore.xyz/tools/ocr?url=${encodeURIComponent(url)}&key=${ALYA_KEY}`, { headers: { 'User-Agent': 'Mozilla/5.0' } })
         data = await res.json()
      } else if (msg) {
         // Descargar buffer del mensaje
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
         
         const res = await fetch(`https://api.alyacore.xyz/tools/ocr?url=${encodeURIComponent(upData.url)}&key=${ALYA_KEY}`, { headers: { 'User-Agent': 'Mozilla/5.0' } })
         data = await res.json()
      }
      
      if (!data || !data.status) {
         await m.react('❌')
         return m.reply(`🙄 *No encontré ni una sola letra válida en esa imagen.* 💅`)
      }

      const texto = data.text || data.data?.text || data.data
      
      const caption = `╭━━━━━━━━━━━━━━━╮\n┃ 📝 *OCR (Texto Extraído)* \n┃━━━━━━━━━━━━━━━\n\n${texto}`
      
      await m.reply(caption)
      await m.react('✅')
    } catch (e) {
      console.error("[LUMIBOT DEBUG] Error en ocr.js:", e)
      await m.react('❌')
      await m.reply(`🙄 *La API se quedó ciega.* 💅\n> Error técnico: ${e.message}`)
    }
  }
}
