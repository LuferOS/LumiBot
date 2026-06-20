import fetch from 'node-fetch'

export default {
  command: ['github', 'igstalk', 'tiktokstalk'],
  category: 'utils',
  run: async (client, m, args, usedPrefix, command) => {
    try {
      if (!args[0]) return m.reply(`🙄 *Bruh, me pasas el nombre de usuario?* 💅\n> Ejemplo: ${usedPrefix}${command} LuferOS`)
      await m.react('🕒')
      const user = encodeURIComponent(args[0])
      
      let apiUrl = ''
      let platform = ''
      
      if (command === 'github') {
          apiUrl = `https://api.alyacore.xyz/stalking/github?username=${user}&key=LumiBot-alya`
          platform = 'GitHub'
      } else if (command === 'igstalk') {
          apiUrl = `https://api.alyacore.xyz/stalking/instagram?username=${user}&key=LumiBot-alya`
          platform = 'Instagram'
      } else if (command === 'tiktokstalk') {
          apiUrl = `https://api.alyacore.xyz/stalking/tiktok?username=${user}&key=LumiBot-alya`
          platform = 'TikTok'
      }
      
      const response = await fetch(apiUrl)
      const data = await response.json()
      
      if (!data.status || !data.result) {
          await m.react('✖️')
          return m.reply(`🙄 *No encontré a ese wey en ${platform}* 💅\n> Excusas: ${data.error || 'Privado o no existe'}`)
      }
      
      const r = data.result
      let caption = `╭⋯ 💅 *STALKING: ${platform.toUpperCase()}* ⋯》\n`
      
      if (command === 'github') {
          caption += `┊ 👤 *Usuario:* ${r.username}\n`
          caption += `┊ 📝 *Nombre:* ${r.name || 'Desconocido'}\n`
          caption += `┊ 💬 *Bio:* ${r.bio || 'Sin biografía'}\n`
          caption += `┊ 👥 *Seguidores:* ${r.stats.followers} | *Siguiendo:* ${r.stats.following}\n`
          caption += `┊ 📂 *Repositorios:* ${r.stats.public_repos}\n`
          caption += `┊ ⭐ *Estrellas:* ${r.stats.total_stars}\n`
          caption += `┊ 🔗 *Enlace:* ${r.profile_url}\n`
      } else if (command === 'igstalk') {
          caption += `┊ 👤 *Usuario:* ${r.username}\n`
          caption += `┊ 📝 *Nombre:* ${r.full_name || 'Desconocido'}\n`
          caption += `┊ 💬 *Bio:* ${r.biography || 'Sin biografía'}\n`
          caption += `┊ 👥 *Seguidores:* ${r.edge_followed_by?.count || 0} | *Siguiendo:* ${r.edge_follow?.count || 0}\n`
          caption += `┊ 📸 *Posts:* ${r.edge_owner_to_timeline_media?.count || 0}\n`
          caption += `┊ 🔒 *Privado:* ${r.is_private ? 'Sí' : 'No'}\n`
          caption += `┊ 🔗 *Enlace:* https://instagram.com/${r.username}\n`
      } else if (command === 'tiktokstalk') {
          caption += `┊ 👤 *Usuario:* ${r.username}\n`
          caption += `┊ 📝 *Nombre:* ${r.nickname || 'Desconocido'}\n`
          caption += `┊ 💬 *Bio:* ${r.signature || 'Sin biografía'}\n`
          caption += `┊ 👥 *Seguidores:* ${r.stats.followers} | *Siguiendo:* ${r.stats.following}\n`
          caption += `┊ ❤️ *Likes:* ${r.stats.likes}\n`
          caption += `┊ 🔒 *Privado:* ${r.private_account ? 'Sí' : 'No'}\n`
          caption += `┊ 🔗 *Enlace:* ${r.profile_url}\n`
      }
      
      caption += `╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》`
      
      try {
          let pp = r.avatar || r.profile_pic_url_hd || r.profile_pic_url || null
          if (pp) {
              await client.sendMessage(m.chat, { image: { url: pp }, caption }, { quoted: m })
          } else {
              await client.sendMessage(m.chat, { text: caption }, { quoted: m })
          }
      } catch (err) {
          await client.sendMessage(m.chat, { text: caption }, { quoted: m })
      }
      await m.react('✔️')
      
    } catch (error) {
      await m.react('✖️')
      return m.reply(`🙄 *La API explotó* 💅\n> Literal algo salió mal stalkeando.\n> 🚩 Excusas técnicas: *${error.message}*`)
    }
  }
}
