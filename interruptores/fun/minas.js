import { delay } from '@whiskeysockets/baileys'

export const activeMinas = new Map();
let isMinasListenerActive = false;

const multiplierTable = [1.0, 1.2, 1.5, 2.0, 2.5, 3.2, 4.0, 5.0, 7.0, 10.0, 15.0, 25.0]

let handler = async (m, { conn, args, usedPrefix, command, client }) => {
  let apuesta = parseInt(args[0])
  if (isNaN(apuesta) || apuesta < 10) return m.reply(`🚩 *Uso:* ${usedPrefix}${command} [apuesta]\n> Apuesta mínima: 10 Coins.`)
  
  let users = global.db.data.users
  if (users[m.sender].coins < apuesta) return m.reply(`🚩 No tienes suficientes Coins. Tienes ${users[m.sender].coins} Coins.`)
  
  if (activeMinas.has(m.chat + m.sender)) return m.reply(`🚩 Ya tienes un juego de minas activo. Termínalo o escribe *retirar* en el chat.`)
  
  // Anti-Spam
  await (conn || client).sendPresenceUpdate('composing', m.chat)
  await delay(1000)

  users[m.sender].coins -= apuesta

  activeMinas.set(m.chat + m.sender, {
    apuesta,
    step: 1,
    multiplier: 1.2
  })
  
  let txt = `💣 *BUSCAMINAS* 💣\n\n`
  txt += `Apostaste: *${apuesta} Coins*\n`
  txt += `Elige un camino seguro enviando un número:\n`
  txt += `[ 1 ] - [ 2 ] - [ 3 ]\n\n`
  txt += `> ⚠️ Tienes 1/3 de probabilidad de pisar una mina.`
  
  await (conn || client).sendMessage(m.chat, { text: txt }, { quoted: m })
  
  if (!isMinasListenerActive) {
    isMinasListenerActive = true;
    (conn || client).ev.on('messages.upsert', async ({ messages, type }) => {
      if (type !== 'notify') return;
      for (const msg of messages) {
        if (!msg.message || msg.key.fromMe) continue;
        const text = msg.message.conversation || msg.message.extendedTextMessage?.text || "";
        const chatId = msg.key.remoteJid;
        const senderId = msg.key.participant || msg.key.remoteJid;
        const gameId = chatId + senderId;
        
        if (!activeMinas.has(gameId)) continue;
        
        const game = activeMinas.get(gameId);
        const choice = text.trim().toLowerCase();
        
        if (choice === 'retirar') {
           let premio = Math.floor(game.apuesta * game.multiplier)
           global.db.data.users[senderId].coins += premio
           activeMinas.delete(gameId)
           await (conn || client).sendMessage(chatId, { text: `✅ Te has retirado a tiempo.\n> Te llevas *${premio} Coins* (Multiplicador x${game.multiplier}).` }, { quoted: msg })
           continue;
        }
        
        if (['1', '2', '3'].includes(choice)) {
           let isMine = Math.random() < 0.33
           if (isMine) {
             activeMinas.delete(gameId)
             await (conn || client).sendMessage(chatId, { text: `💥 *¡BOOOOM!* 💥\n\nPisaste una mina oculta en el paso ${game.step}. Lo perdiste todo.` }, { quoted: msg })
           } else {
             game.step++
             game.multiplier = multiplierTable[game.step] || (game.multiplier + 2.0)
             let premioActual = Math.floor(game.apuesta * game.multiplier)
             
             let txt = `✅ *¡PASO SEGURO!* ✅\n\n`
             txt += `Multiplicador actual: *x${game.multiplier}*\n`
             txt += `Ganancia acumulada: *${premioActual} Coins*\n\n`
             txt += `Elige tu siguiente paso: [ 1 ] - [ 2 ] - [ 3 ]\n`
             txt += `O escribe *retirar* para llevarte las ganancias.`
             await (conn || client).sendMessage(chatId, { text: txt }, { quoted: msg })
           }
        }
      }
    })
  }
}

handler.help = ['minas [apuesta]']
handler.tags = ['games']
handler.command = ['minas', 'buscaminas']

export default handler
