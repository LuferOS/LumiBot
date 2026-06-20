import fetch from 'node-fetch'

const ALYA_KEY = 'LumiBot-alya';

export default {
  command: ['hostinfo', 'ipinfo'],
  category: 'tools',
  run: async (client, m, args, usedPrefix, command) => {
    if (!args[0]) {
      return m.reply(`🙄 *Bruh, ingresa un dominio o IP.* 💅\n> Ejemplo: *${usedPrefix}${command} google.com*`)
    }
    
    await m.react('⏳')
    const domain = args[0]
    
    try {
      const res = await fetch(`https://api.alyacore.xyz/tools/hostinfo?domain=${encodeURIComponent(domain)}&key=${ALYA_KEY}`)
      const data = await res.json()
      
      if (!data.status || !data.data) {
         await m.react('❌')
         return m.reply(`🙄 *No pude obtener información de ese host.* 💅`)
      }

      const info = data.data
      
      let caption = `╭━━━━━━━━━━━━━━━╮\n┃ 🌐 *HOST INFO* \n┃━━━━━━━━━━━━━━━\n`
      for (const [key, value] of Object.entries(info)) {
         if (typeof value !== 'object') {
            caption += `┃ 🔹 *${key.toUpperCase()}:* ${value}\n`
         }
      }
      caption += `╰━━━━━━━━━━━━━━━╯`
      
      await m.reply(caption)
      await m.react('✅')
    } catch (e) {
      console.error("[LUMIBOT DEBUG] Error en hostinfo.js:", e)
      await m.react('❌')
      await m.reply(`🙄 *Error en la API de HostInfo* 💅\n> Error: ${e.message}`)
    }
  }
}
