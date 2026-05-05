import { downloadContentFromMessage, extractMessageContent } from '@whiskeysockets/baileys'

export default {
  command: ['readviewonce', 'read', 'readvo', 'interceptar'],
  category: 'tools',
  run: async (client, m, args, usedPrefix, command, text) => {
    const quoted = m.quoted
    if (!quoted) return m.reply(`╭⋯ ❌ *LUMIBOT - SINTAXIS* ⋯》\n┊ Responda a un mensaje de 'Ver una vez' (ViewOnce) para interceptar su contenido.\n╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》`)
    
    try {
      await m.react('🕒')
      const content = extractMessageContent(quoted.message || quoted)
      
      if (!content) return m.reply(`╭⋯ ⚠️ *INTERCEPCIÓN FALLIDA* ⋯》\n┊ El paquete de datos está encriptado, corrupto o vacío.\n╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》`)
      
      const messageType = Object.keys(content)[0]
      const mediaMessage = content[messageType]
      const stream = await downloadContentFromMessage(
        mediaMessage,
        messageType.replace('Message', '').toLowerCase()
      )
      
      if (!stream) return m.reply(`╭⋯ ⚠️ *ERROR DE RED* ⋯》\n┊ No se pudo establecer el túnel para extraer el flujo multimedia.\n╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》`)
      
      let buffer = Buffer.from([])
      for await (const chunk of stream) {
        buffer = Buffer.concat([buffer, chunk])
      }
      
      // ⚡ LUMIBOT OVERRIDE: Presentación táctica del contenido interceptado
      const captionInyectado = mediaMessage.caption 
        ? `[🛡️ CONTENIDO INTERCEPTADO]\n\n${mediaMessage.caption}` 
        : `[🛡️ ARCHIVO INTERCEPTADO CON ÉXITO]`;

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
      await m.reply(`╭⋯ ❌ *ERROR CRÍTICO* ⋯》\n┊ Fallo en la matriz de desencriptación.\n┊ Detalles: ${e.message}\n╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》`)
    }
  }
}
