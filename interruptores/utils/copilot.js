import fetch from 'node-fetch'

export default {
  command: ['copilot', 'c'],
  category: 'ai',
  run: async (client, m, args, usedPrefix, command) => {
    try {
      const text = args.join(' ').trim()
      if (!text) {
        return m.reply(`🙄 *Bruh, literal no pusiste nada* 💅\n> Ejemplo: *${usedPrefix}${command} hola we*`)
      }
      
      await m.react('🕒')
      const url = `https://api.alyacore.xyz/ai/copilot?text=${encodeURIComponent(text)}&key=api-lYsN6`
      const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } })
      const json = await res.json()
      
      if (!json.status || !json.response) {
        await m.react('✖️')
        return m.reply(`🙄 *Copilot no quiso contestar* 💅\n> Error en AlyaCore o respuesta vacía.`)
      }
      
      await client.sendMessage(m.chat, { text: json.response.trim() }, { quoted: m })
      await m.react('✔️')
      
    } catch (e) {
      console.error("[LUMIBOT DEBUG] Error en copilot.js:", e)
      await m.react('✖️')
      await m.reply(`🙄 *Todo explotó* 💅\n> Literal algo reventó: ${e.message}`)
    }
  }
}
