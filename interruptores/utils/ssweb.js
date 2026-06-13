import fetch from 'node-fetch'

export default {
  command: ['ssweb', 'ss'],
  category: 'tools',
  run: async (client, m, args, usedPrefix, command) => {
    try {
      if (!args[0]) return m.reply('🙄 *Bruh, me pasas el link o te lo adivino?* 💅\n> Literal necesito una URL para tomarle captura.')
      await m.react('🕒')
      let ss = await (await fetch(`https://image.thum.io/get/fullpage/${args[0]}`)).buffer()
      await client.sendMessage(m.chat, { image: ss, caption: `✨ *Tu captura, bb* ✨\n> Sapeando la página: ${args[0]} 💅` }, { quoted: m })
      await m.react('✔️')
    } catch (error) {
      await m.react('✖️')
      return m.reply(`🙄 *La página no quiso colaborar* 💅\n> Literal el link está roto o la web es muy pesada.\n> 🚩 Excusas técnicas: *${error.message}*`)
    }
  }
}