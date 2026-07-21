import { delay } from '@whiskeysockets/baileys'

let handler = async (m, { conn, args, usedPrefix, command }) => {
  if (args.length < 2) return m.reply(`🚩 *Uso:* ${usedPrefix}${command} [1-4] [apuesta]\n> Ejemplo: ${usedPrefix}${command} 3 50`)
  
  let caballo = parseInt(args[0])
  let apuesta = parseInt(args[1])
  
  if (isNaN(caballo) || caballo < 1 || caballo > 4) return m.reply(`🚩 Elige un caballo válido del 1 al 4.`)
  if (isNaN(apuesta) || apuesta < 10) return m.reply(`🚩 Apuesta mínima de 10 Coins.`)
  
  let users = global.db.data.users
  if (users[m.sender].coins < apuesta) return m.reply(`🚩 No tienes suficientes Coins. Tienes ${users[m.sender].coins} Coins.`)
  
  // Anti-Spam de tipeo
  await conn.sendPresenceUpdate('composing', m.chat)
  await delay(1000)
  
  users[m.sender].coins -= apuesta
  
  let caballos = [
    { id: 1, pos: 0, emoji: '🐎' },
    { id: 2, pos: 0, emoji: '🐎' },
    { id: 3, pos: 0, emoji: '🐎' },
    { id: 4, pos: 0, emoji: '🐎' }
  ]
  
  const meta = 15
  
  const renderTrack = () => {
    let str = `🏁 *CARRERA DE CABALLOS* 🏁\n\n`
    for (let c of caballos) {
      let track = Array(meta).fill('・')
      let pos = c.pos >= meta ? meta - 1 : c.pos
      track[pos] = c.emoji
      str += `[${c.id}] ${track.join('')} 🏁\n`
    }
    return str + `\n> 💰 Apostaste *${apuesta} Coins* al caballo *${caballo}*.`
  }
  
  let msg = await conn.sendMessage(m.chat, { text: renderTrack() }, { quoted: m })
  
  let winner = null
  let maxIter = 20
  let iter = 0
  
  while (!winner && iter < maxIter) {
    iter++
    await delay(1500)
    for (let c of caballos) {
      c.pos += Math.floor(Math.random() * 3) + 1 // Avanza 1, 2 o 3 pasos
      if (c.pos >= meta && !winner) {
        winner = c.id
      }
    }
    await conn.sendMessage(m.chat, { text: renderTrack(), edit: msg.key })
  }
  
  if (!winner) winner = caballos.sort((a, b) => b.pos - a.pos)[0].id
  
  if (winner === caballo) {
    let premio = apuesta * 4
    users[m.sender].coins += premio
    await delay(1000)
    await conn.sendMessage(m.chat, { text: renderTrack() + `\n\n🎉 ¡Felicidades! Tu caballo ganó. Te llevas *${premio} Coins*.`, edit: msg.key })
  } else {
    await delay(1000)
    await conn.sendMessage(m.chat, { text: renderTrack() + `\n\n💥 Perdiste. El caballo ${winner} te hizo polvo.`, edit: msg.key })
  }
}

handler.help = ['carrera [1-4] [apuesta]']
handler.tags = ['games']
handler.command = ['carrera', 'caballos']

export default handler
