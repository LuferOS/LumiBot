import fetch from 'node-fetch'

export default {
  command: ['wikipedia', 'wiki'],
  category: 'utils',
  run: async (client, m, args, usedPrefix, command) => {
    try {
      const text = args.join(' ')
      if (!text) {
        return m.reply(`🙄 *Bruh, dime qué busco en Wikipedia.* 💅\n> Ejemplo: *${usedPrefix}${command} Albert Einstein*`)
      }

      await m.react('🕒')
      const url = `https://rest.apicausas.xyz/api/v1/buscadores/wikipedia?apikey=causa-60ca3fea34a7af43&q=${encodeURIComponent(text)}&lang=es`
      
      const res = await fetch(url)
      const data = await res.json()

      if (!data.status || !data.summary) {
        await m.react('✖️')
        return m.reply(`🙄 *Wikipedia no sabe qué es eso* 💅\n> Literal no encontré nada.`)
      }

      let caption = `📚 *${data.title}* 📚\n`
      if (data.description) caption += `> *${data.description}*\n\n`
      caption += `${data.summary}\n\n`
      caption += `🔗 Leer más: ${data.url}\n> 💅 Nerdge mode`

      if (data.image) {
        await client.sendMessage(m.chat, { image: { url: data.image }, caption: caption }, { quoted: m })
      } else {
        await client.sendMessage(m.chat, { text: caption }, { quoted: m })
      }
      await m.react('✔️')

    } catch (e) {
      console.error("[LUMIBOT DEBUG] Error en wikipedia.js:", e)
      await m.react('✖️')
      await m.reply(`🙄 *Todo explotó buscando en Wikipedia* 💅\n> Error: ${e.message}`)
    }
  }
}
