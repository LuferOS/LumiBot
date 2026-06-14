import fetch from 'node-fetch'
import { downloadContentFromMessage } from '@whiskeysockets/baileys'

const ALYA_KEY = 'api-lYsN6';

export default {
  command: ['quotesticker', 'quote'],
  category: 'stickers',
  run: async (client, m, args, usedPrefix, command) => {
    let media = m.quoted ? m.quoted : null
    let msg = media?.message?.imageMessage
    let text = args.join(' ')
    
    if (!text && (!media || !media.text)) {
      return m.reply(`🙄 *Bruh, ¿es en serio?*\nResponde a una imagen con texto o mínimo escribe algo para crear tu sticker de cita. No leo mentes. 💅\n> Ejemplo: *${usedPrefix}${command} Hola mundo*`)
    }
    
    if (!text && media && media.text) {
        text = media.text
    }
    
    await m.react('⏳')
    
    try {
      const form = new FormData()
      form.append('username', m.pushName || 'Usuario')
      form.append('text', text)
      form.append('color', '#000000') // Por defecto oscuro
      
      if (msg) {
         const stream = await downloadContentFromMessage(msg, 'image')
         let buffer = Buffer.from([])
         for await (const chunk of stream) {
             buffer = Buffer.concat([buffer, chunk])
         }
         form.append('file', new Blob([buffer]), 'avatar.jpg')
      } else {
         // Si no mandan imagen, intentamos conseguir la de su perfil
         try {
             let ppUrl = await client.profilePictureUrl(m.sender, 'image')
             const ppRes = await fetch(ppUrl)
             const ppBuffer = await ppRes.arrayBuffer()
             form.append('file', new Blob([ppBuffer]), 'avatar.jpg')
         } catch {
             // Si no tiene foto, no mandamos archivo (AlyaCore debería manejar el fallback)
         }
      }
      
      const res = await fetch(`https://api.alyacore.xyz/tools/quotesticker?key=${ALYA_KEY}`, {
          method: 'POST',
          body: form,
          headers: { 'User-Agent': 'Mozilla/5.0' }
      })
      const data = await res.json()
      
      if (!data || !data.status || !data.data) {
         await m.react('❌')
         return m.reply(`🙄 *Ay por favor...*\nEl servidor se ahogó procesando tu sticker. Intenta luego si no es mucha molestia. 💅`)
      }

      const stickerUrl = data.data.url || data.data.sticker || data.data
      
      await client.sendMessage(m.chat, { sticker: { url: stickerUrl } }, { quoted: m })
      await m.react('✅')
    } catch (e) {
      console.error("[LUMIBOT DEBUG] Error en quotesticker.js:", e)
      await m.react('❌')
      await m.reply(`🙄 *Ups, algo explotó.* 💅\nLa API de QuoteSticker me ignoró por completo.\n> Error técnico: ${e.message}`)
    }
  }
}
