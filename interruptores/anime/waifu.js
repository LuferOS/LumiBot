import fetch from 'node-fetch'

export default {
  command: ['waifu', 'neko'],
  category: 'anime',
  run: async (client, m, args, usedPrefix, command, text) => {
    try {
      await m.react('🕒')
      let mode = global.db.data.chats[m.chat]?.nsfw ? 'nsfw' : 'sfw'
      let json, imgUrl;
      
      try {
        let res = await fetch(`https://api.waifu.pics/${mode}/${command}`, { timeout: 4000 })
        if (!res.ok) throw new Error('API 1 falló');
        json = await res.json()
        imgUrl = json.url;
      } catch (err1) {
        if (command === 'waifu') {
          // Fallback a waifu.im
          let res2 = await fetch(`https://api.waifu.im/search/?included_tags=waifu${mode === 'nsfw' ? '&is_nsfw=true' : '&is_nsfw=false'}`);
          if (!res2.ok) throw new Error('API 2 también falló');
          let json2 = await res2.json();
          imgUrl = json2.images?.[0]?.url;
        } else {
          throw err1; // Si no es waifu, no hay fallback acá, tira error normal
        }
      }

      if (!imgUrl) throw new Error('Ninguna API devolvió imagen 🤡');
      
      let img = Buffer.from(await (await fetch(imgUrl)).arrayBuffer())
      await client.sendFile(m.chat, img, 'thumbnail.jpg', `✨ Aquí tienes tu *${command.toUpperCase()}* literal arte puro 💅`, m, global.miku)
      await m.react('✔️')
    } catch (e) {
      await m.react('✖️')
      await m.reply(`🙄 *Bruh, literal las APIs se murieron* 💅\n\nNo pude sacar tu *${command}* porque el servidor está re caído.\n\n> 🚩 Excusas técnicas: *${e.message}*`)
    }
  },
}