let handler = async (m, { conn, args, usedPrefix, command }) => {
  if (args.length < 2) return m.reply(`🚩 *Uso:* ${usedPrefix}${command} [cara/cruz] [apuesta]\n> Ejemplo: ${usedPrefix}${command} cara 50`)
  
  let eleccion = args[0].toLowerCase()
  let apuesta = parseInt(args[1])
  
  if (!['cara', 'cruz'].includes(eleccion)) return m.reply(`🚩 Debes elegir *cara* o *cruz*.`)
  if (isNaN(apuesta) || apuesta < 10) return m.reply(`🚩 Apuesta mínima de 10 Coins.`)
  
  let users = global.db.data.users
  if (users[m.sender].coins < apuesta) return m.reply(`🚩 No tienes suficientes Coins. Tienes ${users[m.sender].coins} Coins.`)
  
  users[m.sender].coins -= apuesta
  
  let resultado = Math.random() < 0.5 ? 'cara' : 'cruz'
  let isWin = eleccion === resultado
  
  let txt = `🪙 *CARA O CRUZ* 🪙\n\n`
  txt += `Elegiste: *${eleccion.toUpperCase()}*\n`
  txt += `La moneda cayó en: *${resultado.toUpperCase()}*\n\n`
  
  if (isWin) {
    let premio = apuesta * 2
    users[m.sender].coins += premio
    txt += `🎉 ¡Ganaste! Te llevas *${premio} Coins*.`
  } else {
    txt += `💥 Perdiste tus *${apuesta} Coins*. Suerte para la próxima.`
  }
  
  await conn.sendMessage(m.chat, { text: txt }, { quoted: m })
}

handler.help = ['moneda [cara/cruz] [apuesta]']
handler.tags = ['games']
handler.command = ['moneda', 'coinflip']

export default handler
