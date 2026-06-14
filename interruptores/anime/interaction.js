import fetch from 'node-fetch'
import { spawn } from 'child_process'
import fs from 'fs'
import path from 'path'

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
