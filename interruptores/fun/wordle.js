import { delay } from '@whiskeysockets/baileys'

export const activeWordle = new Map();
let isWordleListenerActive = false;

const dictionary = [
  "PERRO", "GATOS", "LUNES", "ARBOL", "SALUD", "FUEGO", "AGUAS", "MUNDO", "CIELO", "REYES", 
  "RELOJ", "RATON", "BARCO", "SABIO", "LIBRO", "LLAVE", "NIEVE", "PLAYA", "FRUTA", "COLOR", 
  "CALOR", "VIAJE", "NOCHE", "TARDE", "REGLA", "NORTE", "SURCO", "OESTE", "PODER", "VALOR", 
  "AMIGO", "BESOS", "FELIZ", "JUSTO", "LINDO", "NUEVO", "VIEJO", "SUAVE", "DULCE", "ACIDO", 
  "LARGO", "CORTO", "ANCHO", "PLANO", "LENTO", "VELOZ", "CLARO", "NEGRO", "VERDE", "ROJOS", 
  "PLATA", "COBRE", "BRISA", "ARENA", "SUELO", "PRADO", "MARES", "LETRA", "PAPEL", "LAPIZ", 
  "PLUMA", "GAFAS", "TECHO", "PARED", "PUERTA", "SILLA", "MESA", "VASO", "PLATO", "TENED",
  "LLAMA", "TIGRE", "LEON", "OSO", "ZORRO", "RANA", "CISNE", "MOSCA", "ABEJA", "PULGA"
].filter(w => w.length === 5); // Ensure all are exactly 5 letters

let handler = async (m, { conn, args, usedPrefix, command, client }) => {
  if (activeWordle.has(m.chat)) return m.reply(`🚩 Ya hay una partida de Wordle activa en este grupo. ¡Adivinen la palabra!`)
  
  const word = dictionary[Math.floor(Math.random() * dictionary.length)];
  
  activeWordle.set(m.chat, {
    word: word,
    attempts: 0,
    maxAttempts: 6,
    history: []
  })
  
  let txt = `🟩 *WORDLE GRUPAL* 🟩\n\n`
  txt += `He pensado en una palabra de *5 letras*.\n`
  txt += `Tienen *6 intentos* como grupo para adivinarla.\n\n`
  txt += `Simplemente envíen palabras de 5 letras en el chat.\n`
  txt += `> 🎁 Recompensa: *500 Coins* al que acierte.`
  
  await (conn || client).sendMessage(m.chat, { text: txt }, { quoted: m })
  
  if (!isWordleListenerActive) {
    isWordleListenerActive = true;
    (conn || client).ev.on('messages.upsert', async ({ messages, type }) => {
      if (type !== 'notify') return;
      for (const msg of messages) {
        if (!msg.message || msg.key.fromMe) continue;
        const text = msg.message.conversation || msg.message.extendedTextMessage?.text || "";
        const chatId = msg.key.remoteJid;
        const senderId = msg.key.participant || msg.key.remoteJid;
        
        if (!activeWordle.has(chatId)) continue;
        
        const guess = text.trim().toUpperCase();
        if (guess.length !== 5 || !/^[A-ZÑ]+$/.test(guess)) continue;
        
        const game = activeWordle.get(chatId);
        game.attempts++;
        
        const targetWord = game.word;
        let result = [];
        let targetArr = targetWord.split('');
        let guessArr = guess.split('');
        
        // Check exact matches (greens)
        for (let i = 0; i < 5; i++) {
          if (guessArr[i] === targetArr[i]) {
            result[i] = '🟩';
            targetArr[i] = null; // Mark as used
            guessArr[i] = null; // Mark as processed
          }
        }
        
        // Check partial matches (yellows) and misses (blacks)
        for (let i = 0; i < 5; i++) {
          if (guessArr[i] !== null) {
            let index = targetArr.indexOf(guessArr[i]);
            if (index !== -1) {
              result[i] = '🟨';
              targetArr[index] = null; // Mark as used
            } else {
              result[i] = '⬛';
            }
          }
        }
        
        game.history.push(`${guess} ${result.join('')}`);
        
        let isWin = result.every(r => r === '🟩');
        
        if (isWin) {
           let premio = 500;
           global.db.data.users[senderId].coins += premio;
           activeWordle.delete(chatId);
           let finalTxt = `🎉 *¡Felicidades!* 🎉\n\n`
           finalTxt += `@${senderId.split('@')[0]} ha adivinado la palabra correcta: *${targetWord}*\n`
           finalTxt += `Intentos usados: ${game.attempts}/${game.maxAttempts}\n\n`
           finalTxt += `Recompensa: *${premio} Coins*`
           await (conn || client).sendMessage(chatId, { text: finalTxt, mentions: [senderId] }, { quoted: msg })
        } else if (game.attempts >= game.maxAttempts) {
           activeWordle.delete(chatId);
           let finalTxt = `💥 *¡Game Over!* 💥\n\n`
           finalTxt += `Se quedaron sin intentos.\n`
           finalTxt += `La palabra correcta era: *${targetWord}*\n\n`
           finalTxt += `*Historial:* \n` + game.history.join('\n')
           await (conn || client).sendMessage(chatId, { text: finalTxt }, { quoted: msg })
        } else {
           let boardTxt = `*Intento ${game.attempts}/${game.maxAttempts}*\n`
           boardTxt += `${result.join('')}`
           await (conn || client).sendMessage(chatId, { text: boardTxt }, { quoted: msg })
        }
      }
    })
  }
}

handler.help = ['wordle']
handler.tags = ['games']
handler.command = ['wordle']

export default handler
