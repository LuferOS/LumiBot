import fetch from 'node-fetch'
import { downloadContentFromMessage } from '@whiskeysockets/baileys'

const ALYA_KEY = 'LumiBot-alya';

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
         const res = await fetch(url)
         const buffer = await res.arrayBuffer()
         const form = new FormData()
         form.append('base64Image', 'data:image/jpeg;base64,' + Buffer.from(buffer).toString('base64'))
         const ocrRes = await fetch('https://api.ocr.space/parse/image', { method: 'POST', body: form, headers: { apikey: 'helloworld' } })
         data = await ocrRes.json()
      } else if (msg) {
         const stream = await downloadContentFromMessage(msg, 'image')
         let buffer = Buffer.from([])
         for await (const chunk of stream) {
             buffer = Buffer.concat([buffer, chunk])
         }
         
         const form = new FormData()
         form.append('base64Image', 'data:image/jpeg;base64,' + buffer.toString('base64'))
         const ocrRes = await fetch('https://api.ocr.space/parse/image', { method: 'POST', body: form, headers: { apikey: 'helloworld' } })
         data = await ocrRes.json()
      }
      
      if (!data || data.IsErroredOnProcessing || !data.ParsedResults || data.ParsedResults.length === 0) {
         await m.react('❌')
         return m.reply(`🙄 *No encontré ni una sola letra válida en esa imagen.* 💅`)
      }

      const texto = data.ParsedResults[0].ParsedText || 'Ningún texto reconocido.'
      
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
