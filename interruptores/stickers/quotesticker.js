import fetch from 'node-fetch'
import { downloadContentFromMessage } from 'baileys-next'
import { generateQuoteSticker } from '../utils/quote_api.js'

const ALYA_KEY = 'LumiBot-alya';

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
      let targetSender = m.quoted ? (m.quoted.sender || m.quoted.participant) : m.sender;
      let targetName = m.pushName || 'Usuario';
      if (m.quoted) {
          const dbUser = global.db.data.users[targetSender];
          targetName = dbUser?.name || targetSender.split('@')[0];
      }
      
      let avatarUrl = 'https://telegra.ph/file/24fa902ead26340f3df2c.png'; // Fallback
      if (msg) {
         const stream = await downloadContentFromMessage(msg, 'image')
         let buffer = Buffer.from([])
         for await (const chunk of stream) {
             buffer = Buffer.concat([buffer, chunk])
         }
         // Subimos a uguu/catbox temporalmente
         const form = new FormData()
         form.append('file', new Blob([buffer]), 'avatar.jpg')
         try {
            const upRes = await fetch('https://api.alyacore.xyz/tools/upload', { method: 'POST', body: form })
            const upData = await upRes.json()
            if (upData.url) avatarUrl = upData.url
         } catch {}
      } else {
         try {
             avatarUrl = await client.profilePictureUrl(targetSender, 'image')
         } catch {}
      }
      
      const payload = {
        type: 'quote',
        format: 'webp',
        backgroundColor: '#1b1429',
        width: 512,
        height: 768,
        scale: 2,
        messages: [{
            entities: [],
            avatar: true,
            from: { id: 1, name: targetName, photo: { url: avatarUrl } },
            text: text,
            replyMessage: {}
        }]
      };

      const base64Image = await generateQuoteSticker(payload)
      const stickerBuffer = Buffer.from(base64Image, 'base64')
      await client.sendMessage(m.chat, { sticker: stickerBuffer }, { quoted: m })
      await m.react('✅')
    } catch (e) {
      console.error("[LUMIBOT DEBUG] Error en quotesticker.js:", e)
      await m.react('❌')
      await m.reply(`🙄 *Ups, algo explotó.* 💅\nLa API de QuoteSticker me ignoró por completo.\n> Error técnico: ${e.message}`)
    }
  }
}
