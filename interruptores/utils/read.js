import { downloadContentFromMessage, extractMessageContent } from 'baileys-next'

export default {
  command: ['readviewonce', 'read', 'readvo', 'interceptar'],
  category: 'tools',
  run: async (client, m, args, usedPrefix, command, text) => {
    const quoted = m.quoted
    if (!quoted) return m.reply(`🙄 *Bruh, no estás respondiendo a nada* 💅\n> Tienes que responder a un mensaje de 'Ver una vez' para que te lo robe, no soy adivina.`)
    
    try {
      await m.react('🕒')
      const content = extractMessageContent(quoted.message || quoted)
      
      if (!content) return m.reply(`🙄 *Oso mil, no pude robar nada* 💅\n> Ese mensaje ya no sirve, está roto o la persona borró el chisme.`)
      
      const messageType = Object.keys(content)[0]
      const mediaMessage = content[messageType]
      const stream = await downloadContentFromMessage(
        mediaMessage,
        messageType.replace('Message', '').toLowerCase()
      )
      
      if (!stream) return m.reply(`🙄 *Mark Zuckerberg no me deja* 💅\n> No pude bajar el archivo. Literal WhatsApp no quiso.`)
      
      let buffer = Buffer.from([])
      for await (const chunk of stream) {
        buffer = Buffer.concat([buffer, chunk])
      }
      
      const captionInyectado = mediaMessage.caption 
        ? `✨ *CHISME ROBADO* ✨\n> Mira nomás lo que andan mandando 👀💅\n\nTexto original: ${mediaMessage.caption}` 
        : `✨ *CHISME ROBADO* ✨\n> Atrapadaaa 📸💅`;

      if (/video/i.test(messageType)) {
        await client.sendMessage(m.chat, { video: buffer, caption: captionInyectado, mimetype: 'video/mp4' }, { quoted: m })
      } else if (/image/i.test(messageType)) {
        await client.sendMessage(m.chat, { image: buffer, caption: captionInyectado }, { quoted: m })
      } else if (/audio/i.test(messageType)) {
        await client.sendMessage(m.chat, { audio: buffer, mimetype: 'audio/ogg; codecs=opus', ptt: mediaMessage.ptt || false }, { quoted: m })
      }
      
      await m.react('✔️')
    } catch (e) {
      console.error("[LUMIBOT DEBUG] Error en readviewonce.js:", e);
      await m.react('✖️')
      await m.reply(`🙄 *Todo explotó intentando robar el chisme* 💅\n> Literal algo falló súper feo.\n> 🚩 Excusas técnicas: ${e.message}`)
    }
  }
}
