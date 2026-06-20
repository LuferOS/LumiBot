import fetch from 'node-fetch'

const ALYA_KEY = 'LumiBot-alya';

export default {
  command: ['lyrics', 'letra'],
  category: 'tools',
  run: async (client, m, args, usedPrefix, command) => {
    if (!args[0]) {
      return m.reply(`🙄 *Bruh, dime qué canción estás buscando.* 💅\n> Ejemplo: *${usedPrefix}${command} bad bunny titi me pregunto*`)
    }
    
    await m.react('⏳')
    const query = args.join(' ')
    
    try {
      const res = await fetch(`https://api.alyacore.xyz/tools/lyricsv2?query=${encodeURIComponent(query)}&key=${ALYA_KEY}`)
      const data = await res.json()
      
      if (!data.status || !data.data) {
         await m.react('❌')
         return m.reply(`🙄 *No encontré la letra de esa canción. Intenta ser más específico.* 💅`)
      }

      const lyrics = data.data.lyrics || data.data.letra || data.data.text || data.data
      const title = data.data.title || data.data.name || query
      
      const caption = `╭━━━━━━━━━━━━━━━╮\n┃ 🎤 *LYRICS* \n┃━━━━━━━━━━━━━━━\n┃ 📌 *${title}*\n╰━━━━━━━━━━━━━━━╯\n\n${lyrics}`
      
      await m.reply(caption)
      await m.react('✅')
    } catch (e) {
      console.error("[LUMIBOT DEBUG] Error en lyrics.js:", e)
      await m.react('❌')
      await m.reply(`🙄 *La API de letras falló* 💅\n> Error: ${e.message}`)
    }
  }
}
