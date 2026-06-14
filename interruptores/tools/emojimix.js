import fetch from 'node-fetch'

const ALYA_KEY = 'api-lYsN6';

export default {
  command: ['emojimix', 'emix'],
  category: 'tools',
  run: async (client, m, args, usedPrefix, command) => {
    if (!args[0] || !args[1]) {
      return m.reply(`🙄 *Bruh, ingresa dos emojis para combinarlos.* 💅\n> Ejemplo: *${usedPrefix}${command} 🥺 🔫*`)
    }
    
    await m.react('⏳')
    const emoji1 = args[0]
    const emoji2 = args[1]
    
    try {
      const res = await fetch(`https://api.alyacore.xyz/tools/emojimix?emoji1=${encodeURIComponent(emoji1)}&emoji2=${encodeURIComponent(emoji2)}&key=${ALYA_KEY}`)
      const data = await res.json()
      
      if (!data.status || !data.data) {
         await m.react('❌')
         return m.reply(`🙄 *No se pudieron combinar esos emojis.* 💅`)
      }

      const imageUrl = data.data.url || data.data.image || data.data
      
      // Enviarlo como sticker
      await client.sendMessage(m.chat, { sticker: { url: imageUrl } }, { quoted: m })
      await m.react('✅')
    } catch (e) {
      console.error("[LUMIBOT DEBUG] Error en emojimix.js:", e)
      await m.react('❌')
      await m.reply(`🙄 *Error en la API de EmojiMix* 💅\n> Error: ${e.message}`)
    }
  }
}
