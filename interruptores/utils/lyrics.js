import fetch from 'node-fetch'

export default {
  command: ['lyrics', 'lyric'],
  category: 'utils',
  run: async (client, m, args, usedPrefix, command) => {
    try {
      const text = args.join(' ')
      if (!text) {
        return m.reply(`🙄 *Bruh, dime qué canción busco.* 💅\n> Ejemplo: *${usedPrefix}${command} bad bunny titi me pregunto*`)
      }

      await m.react('🕒')
      const url = `https://rest.apicausas.xyz/api/v1/buscadores/lirycs?apikey=causa-60ca3fea34a7af43&q=${encodeURIComponent(text)}`
      
      const res = await fetch(url)
      const data = await res.json()

      if (!data.status || !data.lyrics) {
        await m.react('✖️')
        return m.reply(`🙄 *No encontré la letra de eso* 💅\n> Quizás no existe o la API de Causas falló.`)
      }

      let caption = `✨ *${data.title || 'Letra encontrada'}* ✨\n`
      caption += `👤 Artista: ${data.artist || 'Desconocido'}\n\n`
      caption += `${data.lyrics.trim()}\n\n> 💅 Factos musicales`

      // Si la letra es muy larga, enviar como texto normal sin imagen si pasa el límite, pero WhatsApp aguanta bastantes caracteres.
      if (data.thumbnail) {
        await client.sendMessage(m.chat, { image: { url: data.thumbnail }, caption: caption }, { quoted: m })
      } else {
        await client.sendMessage(m.chat, { text: caption }, { quoted: m })
      }
      await m.react('✔️')

    } catch (e) {
      console.error("[LUMIBOT DEBUG] Error en lyrics.js:", e)
      await m.react('✖️')
      await m.reply(`🙄 *Todo explotó buscando la letra* 💅\n> Error: ${e.message}`)
    }
  }
}
