import fetch from 'node-fetch'
import { lumiAnim } from '../../nucleo/utils.js'

export default {
  command: ['pinterest', 'pin'],
  category: 'downloader',
  run: async (client, m, args, usedPrefix, command) => {
    if (!args[0]) {
      return m.reply(`🙄 *Bruh, ingresa qué quieres buscar en Pinterest.* 💅\n> Ejemplo: *${usedPrefix}${command} aesthetic wallpapers*`)
    }
    
    await m.react('⏳')
    let animMsg = await lumiAnim(client, m, ['⏳ *Conectando a los servidores...* 💅', '🔍 *Buscando en Pinterest...* 💅'], 800);
    
    try {
      const q = args.join(' ')
      
      const fetchCausas = async () => {
          const url = `https://rest.apicausas.xyz/api/v1/buscadores/pinterest?apikey=causa-60ca3fea34a7af43&q=${encodeURIComponent(q)}`
          const res = await fetch(url)
          const data = await res.json()
          if (!data.status) throw new Error('Causas fallo status')
          return data
      }

      const fetchAlya = async () => {
          const url = `https://api.alyacore.xyz/api/pinterest?q=${encodeURIComponent(q)}&key=LumiBot-alya`
          const res = await fetch(url)
          const data = await res.json()
          if (!data.status) throw new Error('Alya fallo status')
          return data
      }

      let data;
      try {
          data = await Promise.any([fetchCausas(), fetchAlya()]);
      } catch (e) {
          if (animMsg) await client.sendMessage(m.chat, { delete: animMsg.key }).catch(()=>{});
          await m.react('❌')
          return m.reply(`🙄 *Falló la búsqueda en Pinterest* 💅\n> Literal no encontré nada con eso.`)
      }

      let images = data.data || data.results || []
      
      if (!Array.isArray(images) || images.length === 0) {
         if (animMsg) await client.sendMessage(m.chat, { delete: animMsg.key }).catch(()=>{});
         await m.react('❌')
         return m.reply(`🙄 *No hay imágenes de Pinterest para eso.* 💅`)
      }

      if (animMsg) await client.sendMessage(m.chat, { text: '📥 *Descargando imágenes de Pinterest...* 💅', edit: animMsg.key });

      // Tomamos hasta 5 imágenes aleatorias o las primeras 5
      images = images.sort(() => 0.5 - Math.random()).slice(0, 5)

      const caption = `╭━━━━━━━━━━━━━━━╮
┃ 📌 *PINTEREST SEARCH*
┃━━━━━━━━━━━━━━━
┃ 🔍 Búsqueda: ${q}
╰━━━━━━━━━━━━━━━╯`
      
      if (animMsg) await client.sendMessage(m.chat, { delete: animMsg.key }).catch(()=>{});
      
      for (let i = 0; i < images.length; i++) {
          let imgUrl = typeof images[i] === 'string' ? images[i] : images[i].url || images[i].image
          if (!imgUrl) continue
          
          await client.sendMessage(m.chat, { image: { url: imgUrl }, caption: i === 0 ? caption : '' }, { quoted: m })
      }
      
      await m.react('✅')
    } catch (e) {
      if (typeof animMsg !== 'undefined' && animMsg) await client.sendMessage(m.chat, { delete: animMsg.key }).catch(()=>{});
      await m.react('❌')
      await m.reply(`🙄 *Hubo un error.* Intenta con otra cosa. 💅\n> ${e.message}`)
    }
  }
}
