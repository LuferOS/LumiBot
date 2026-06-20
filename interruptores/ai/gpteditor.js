import fetch from 'node-fetch'
import { downloadContentFromMessage } from '@whiskeysockets/baileys'

const ALYA_KEY = 'LumiBot-alya';

export default {
  command: ['gpteditor', 'editar'],
  category: 'ai',
  run: async (client, m, args, usedPrefix, command) => {
    let media = m.quoted ? m.quoted : m
    let msg = media.message?.imageMessage
    let prompt = args.join(' ')
    
    if (!msg || !prompt) {
      return m.reply(`🙄 *Bruh, responde a una imagen y dime qué quieres que le edite la IA.* 💅\n> Ejemplo: *${usedPrefix}${command} ponle gafas de sol*`)
    }
    
    await m.react('⏳')
    
    try {
      const stream = await downloadContentFromMessage(msg, 'image')
      let buffer = Buffer.from([])
      for await (const chunk of stream) {
          buffer = Buffer.concat([buffer, chunk])
      }
      
      const form = new FormData()
      form.append('file', new Blob([buffer]), 'image.jpg')
      form.append('prompt', prompt)
      form.append('model', 'dall-e-3') // Modelo por defecto o el que use AlyaCore
      
      const res = await fetch(`https://api.alyacore.xyz/ai/gpt-editor?key=${ALYA_KEY}`, {
          method: 'POST',
          body: form
      })
      const data = await res.json()
      
      if (!data || !data.status || !data.data) {
         await m.react('❌')
         return m.reply(`🙄 *No pude editar esta imagen con IA.* 💅`)
      }

      const imageUrl = data.data.url || data.data.image || data.data
      
      await client.sendMessage(m.chat, { image: { url: imageUrl }, caption: `✨ *Editado por GPT Editor* 💅\n> "${prompt}"` }, { quoted: m })
      await m.react('✅')
    } catch (e) {
      console.error("[LUMIBOT DEBUG] Error en gpteditor.js:", e)
      await m.react('❌')
      await m.reply(`🙄 *La API de GPT Editor falló* 💅\n> Error: ${e.message}`)
    }
  }
}
