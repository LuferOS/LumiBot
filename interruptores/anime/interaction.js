import fetch from 'node-fetch'
import { spawn } from 'child_process'
import fs from 'fs'
import path from 'path'

const ALYA_KEY = 'LumiBot-alya';

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
      
      let who = m.mentionedJid && m.mentionedJid.length > 0 ? m.mentionedJid[0] : (m.quoted ? m.quoted.sender : null)
      let target = ''
      if (who) {
          target = global.db.data.users[who]?.name || `@${who.split('@')[0]}`
      } else if (args.length > 0) {
          target = args.join(' ')
      }

      let action = ''
      switch(command) {
          case 'hug': action = target ? `abraza a ${target}` : `se abraza a sí mism@`; break;
          case 'kiss': action = target ? `le da un beso a ${target}` : `se manda un beso al aire`; break;
          case 'pat': action = target ? `le da palmaditas a ${target}` : `se acaricia la cabeza`; break;
          case 'slap': action = target ? `abofetea a ${target}` : `se da una bofetada a sí mism@`; break;
          case 'punch': action = target ? `golpea a ${target}` : `lanza un puñetazo al aire`; break;
          case 'bite': action = target ? `muerde a ${target}` : `se muerde a sí mism@`; break;
          case 'lick': action = target ? `lame a ${target}` : `se lame de curiosidad`; break;
          case 'poke': action = target ? `toca a ${target}` : `se pokea a sí mism@`; break;
          case 'cuddle': action = target ? `se acurruca con ${target}` : `se acurruca solit@`; break;
          case 'dance': action = target ? `baila con ${target}` : `baila felizmente`; break;
          default: action = target ? `hace algo con ${target}` : `hace algo sol@`
      }

      const senderName = m.pushName || global.db.data.users[m.sender]?.name || 'Alguien'
      const caption = `╭━━━━━━━━━━━━━━━╮\n┃ 🌸 *${senderName}* ${action}\n╰━━━━━━━━━━━━━━━╯`
      
      // Descargar el GIF y convertir a MP4 para que WhatsApp lo anime correctamente
      const gifRes = await fetch(imageUrl)
      const gifBuffer = Buffer.from(await gifRes.arrayBuffer())
      
      const tempId = Date.now() + '-' + Math.floor(Math.random() * 10000)
      const tempGif = path.join(process.cwd(), `tmp_${tempId}.gif`)
      const tempMp4 = path.join(process.cwd(), `tmp_${tempId}.mp4`)
      
      fs.writeFileSync(tempGif, gifBuffer)
      
      await new Promise((resolve, reject) => {
          const p = spawn('ffmpeg', ['-y', '-i', tempGif, '-movflags', 'faststart', '-pix_fmt', 'yuv420p', '-vf', 'scale=trunc(iw/2)*2:trunc(ih/2)*2', tempMp4])
          p.on('close', (code) => {
              if (code === 0) resolve()
              else reject(new Error('ffmpeg failed'))
          })
      })
      
      const mp4Buffer = fs.readFileSync(tempMp4)
      fs.unlinkSync(tempGif)
      fs.unlinkSync(tempMp4)
      
      await client.sendMessage(m.chat, { video: mp4Buffer, caption, gifPlayback: true, mentions: m.mentionedJid || [] }, { quoted: m })
      await m.react('✅')
    } catch (e) {
      console.error("[LUMIBOT DEBUG] Error en interaction.js:", e)
      await m.react('❌')
      await m.reply(`🙄 *Error en la API de interacción* 💅\n> Error: ${e.message}`)
    }
  }
}
