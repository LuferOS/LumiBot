import fetch from 'node-fetch'

export default {
  command: ['pinterest', 'pin'],
  category: 'downloader',
  run: async (client, m, args, usedPrefix, command) => {
    if (!args[0]) {
      return m.reply(`🙄 *Bruh, ingresa qué quieres buscar en Pinterest.* 💅\n> Ejemplo: *${usedPrefix}${command} aesthetic wallpapers*`)
    }
    
    await m.react('⏳')
    
    try {
      const q = args.join(' ')
      const url = `https://rest.apicausas.xyz/api/v1/buscadores/pinterest?apikey=causa-60ca3fea34a7af43&q=${encodeURIComponent(q)}`
      const res = await fetch(url)
      const data = await res.json()

      if (!data.status) {
        await m.react('❌')
        return m.reply(`🙄 *Falló la búsqueda en Pinterest* 💅\n> Literal no encontré nada con eso.`)
      }

      let images = data.data || data.results || []
      
      if (!Array.isArray(images) || images.length === 0) {
         await m.react('❌')
         return m.reply(`🙄 *No hay imágenes de Pinterest para eso.* 💅`)
      }

      // Tomamos hasta 5 imágenes aleatorias o las primeras 5
      images = images.sort(() => 0.5 - Math.random()).slice(0, 5)

      const caption = `╭━━━━━━━━━━━━━━━╮
┃ 📌 *PINTEREST SEARCH*
┃━━━━━━━━━━━━━━━
┃ 🔍 Búsqueda: ${q}
╰━━━━━━━━━━━━━━━╯`
      
      for (let i = 0; i < images.length; i++) {
          let imgUrl = typeof images[i] === 'string' ? images[i] : images[i].url || images[i].image
          if (!imgUrl) continue
          
          await client.sendMessage(m.chat, { image: { url: imgUrl }, caption: i === 0 ? caption : '' }, { quoted: m })
      }
      
      await m.react('✅')
    } catch (e) {
      console.error("[LUMIBOT DEBUG] Error en pinterest.js:", e)
      await m.react('❌')
      await m.reply(`🙄 *Error en Pinterest* 💅\n> Error: ${e.message}`)
    }
  }
}
