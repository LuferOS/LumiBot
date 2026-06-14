import fetch from 'node-fetch'

const ALYA_KEY = 'api-lYsN6';

export default {
  command: ['hug', 'kiss', 'pat', 'slap', 'punch', 'bite', 'lick', 'poke', 'cuddle', 'dance'],
  category: 'anime',
  run: async (client, m, args, usedPrefix, command) => {
    
    await m.react('⏳')
    
    try {
      // Usar el nombre del comando como endpoint en otakugifs
      const res = await fetch(`https://api.otakugifs.xyz/gif?reaction=${command}`)
      const data = await res.json()
      
      if (!data.url) {
         await m.react('❌')
         return m.reply(`🙄 *No pude realizar esta interacción ahora mismo.* 💅`)
      }

      const imageUrl = data.url
      
      let target = ''
      if (m.mentionedJid && m.mentionedJid.length > 0) {
          target = `@${m.mentionedJid[0].split('@')[0]}`
      } else if (args[0]) {
          target = args.join(' ')
      }

      let action = ''
      switch(command) {
          case 'hug': action = `abraza a ${target || 'alguien'}`; break;
          case 'kiss': action = `le da un beso a ${target || 'alguien'}`; break;
          case 'pat': action = `le da palmaditas a ${target || 'alguien'}`; break;
          case 'slap': action = `abofetea a ${target || 'alguien'}`; break;
          case 'punch': action = `golpea a ${target || 'alguien'}`; break;
          case 'bite': action = `muerde a ${target || 'alguien'}`; break;
          case 'lick': action = `lame a ${target || 'alguien'}`; break;
          case 'poke': action = `toca a ${target || 'alguien'}`; break;
          case 'cuddle': action = `se acurruca con ${target || 'alguien'}`; break;
          case 'dance': action = `baila ${target ? 'con ' + target : 'felizmente'}`; break;
          default: action = `hace algo con ${target || 'alguien'}`
      }

      const senderName = m.pushName || 'Alguien'
      const caption = `╭━━━━━━━━━━━━━━━╮\n┃ 🌸 *${senderName}* ${action}\n╰━━━━━━━━━━━━━━━╯`
      
      // waifu.pics devuelve GIFs usualmente, los enviaremos como gifPlayback
      await client.sendMessage(m.chat, { video: { url: imageUrl }, caption, gifPlayback: true, mentions: m.mentionedJid || [] }, { quoted: m })

      
      await m.react('✅')
    } catch (e) {
      console.error("[LUMIBOT DEBUG] Error en interaction.js:", e)
      await m.react('❌')
      await m.reply(`🙄 *Error en la API de interacción* 💅\n> Error: ${e.message}`)
    }
  }
}
