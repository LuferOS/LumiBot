import { getCoins, addCoins } from '../../nucleo/coinsDB.js';

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

const activeWordle = new Map();
let isWordleListenerActive = false;

const dictionary = [
  "PERRO", "GATOS", "LUNES", "ARBOL", "SALUD", "FUEGO", "AGUAS", "MUNDO", "CIELO", "REYES",
  "RELOJ", "RATON", "BARCO", "SABIO", "LIBRO", "LLAVE", "NIEVE", "PLAYA", "FRUTA", "COLOR",
  "CALOR", "VIAJE", "NOCHE", "TARDE", "REGLA", "NORTE", "SURCO", "OESTE", "PODER", "VALOR",
  "AMIGO", "BESOS", "FELIZ", "JUSTO", "LINDO", "NUEVO", "VIEJO", "SUAVE", "DULCE", "ACIDO",
  "LARGO", "CORTO", "ANCHO", "PLANO", "LENTO", "VELOZ", "CLARO", "NEGRO", "VERDE", "ROJOS",
  "PLATA", "COBRE", "BRISA", "ARENA", "SUELO", "PRADO", "MARES", "LETRA", "LAPIZ", "PLUMA",
  "GAFAS", "TECHO", "PARED", "LLAMA", "TIGRE", "ZORRO", "CISNE", "MOSCA", "ABEJA",
  "BANCO", "CERRO", "DANZA", "ENERO", "FERIA", "GRANO", "HIELO", "JUEGO", "KARMA", "LECHE",
  "METRO", "NUBES", "ORDEN", "PASTO", "QUESO", "RUMBO", "SORDO", "TABLA", "UNION", "VOLAR",
  "YERBA", "ZARPA", "CAMPO", "DISCO", "ESPIA", "FUROR", "GUION", "HUMOR", "JABON", "MARCA",
  "NOVIO", "OASIS", "PIANO", "RACHA", "SOCIO", "TRAGO", "HUEVO", "LABIA", "DROGA", "BROTE",
  "FONDO", "GRITO", "JAMON", "LINEA", "MORIR", "NEGAR", "SIGLO", "TEMER", "UNICO", "BRAZO",
  "CLAVE", "DUCHA", "FALSO", "GENIO", "HEROE", "JURAR", "LIMON", "MEDIA", "NOBLE", "OPERA",
  "ABRIL", "BUENO", "COSTA", "DEBER", "ENVIO", "FRASE", "GOLPE", "HORNO", "IDEAS", "JUGAR",
  "LABIO", "MADRE", "NIVEL", "PADRE", "RADIO", "SERIA", "TORRE", "VIRUS", "AVION", "BOLSA",
  "CAUSA", "DATOS", "ERROR", "FICHA", "GESTO", "HONGO", "JULIO", "LABOR", "MUJER", "NUNCA",
  "OCASO", "PIEDRA", "RAZAS", "SELLO", "TRAZO", "VOCAL", "BROMA", "CIFRA", "DEDOS", "ETAPA",
  "FLORA", "GRUPO", "HOGAR", "JOVEN", "LABOR", "MANGO", "NARIZ", "OLEAJ", "PULSO", "RANGO",
  "SUSTO", "TURNO", "VAPOR", "BRUJA", "CARGA", "DIETA", "FIBRA", "GLOBO", "HECHO", "JUNIO",
  "LUNAR", "MARCA", "NORIA", "PICOS", "RIEGO", "SAUNA", "TUMBA", "VUELO", "BOMBA", "CUERO",
  "DOSIS", "EXITO", "FILOS", "GORRA", "HUESO", "ISLAS", "JUSTO", "LIGAS", "MICRO", "NAIPE",
  "OLIVO", "POLEN", "REINA", "SURCO", "TENIS", "VICIO", "BALDE", "CASCO", "DUELO", "ESCAY",
  "FRENO", "GANAR", "HONDA", "IDOLO", "JAULA", "LANZA", "MALLA", "NIDOS", "OPTAR", "PERNO",
  "RUEDA", "SABOR", "TALLA", "VELAS", "BODAS", "CINTA", "DIGNO", "FINAL", "GUISO", "HELAR"
];

export default {
  command: ['wordle'],
  category: 'games',
  run: async (client, m, args, usedPrefix, command) => {
    try {
      const sender = m.sender;
      let users = global.db.data.users;
      if (!users[sender]) users[sender] = { coins: 0, exp: 0 };

      if (activeWordle.has(m.chat)) return m.reply(`🚩 Ya hay una partida de Wordle activa en este grupo. ¡Adivinen la palabra!`);

      // Anti-Spam
      await client.sendPresenceUpdate('composing', m.chat);
      await delay(1500);

      const word = dictionary[Math.floor(Math.random() * dictionary.length)];

      const timeout = setTimeout(() => {
        if (activeWordle.has(m.chat)) {
          const game = activeWordle.get(m.chat);
          activeWordle.delete(m.chat);
          client.sendMessage(m.chat, { text: `⏰ *Tiempo agotado.* La partida de Wordle terminó.\n> La palabra era: *${game.word}*` }).catch(() => {});
        }
      }, 180000); // 3 minutos

      activeWordle.set(m.chat, {
        word: word,
        attempts: 0,
        maxAttempts: 6,
        history: [],
        timeout: timeout
      });

      let txt = `🟩 *WORDLE GRUPAL* 🟩\n\n`;
      txt += `He pensado en una palabra de *5 letras*.\n`;
      txt += `Tienen *6 intentos* como grupo para adivinarla.\n\n`;
      txt += `Simplemente envíen palabras de 5 letras en el chat.\n`;
      txt += `> 🎁 Recompensa: *500 Coins* al que acierte.\n`;
      txt += `> ⏰ Tienen *3 minutos* antes de que expire.`;

      await client.sendMessage(m.chat, { text: txt }, { quoted: m });

      if (!isWordleListenerActive) {
        isWordleListenerActive = true;
        client.ev.on('messages.upsert', async ({ messages, type }) => {
          if (type !== 'notify') return;
          for (const msg of messages) {
            if (!msg.message || msg.key.fromMe) continue;
            const text = msg.message.conversation || msg.message.extendedTextMessage?.text || "";
            const chatId = msg.key.remoteJid;
            const senderId = msg.key.participant || msg.key.remoteJid;

            if (!activeWordle.has(chatId)) continue;

            const guess = text.trim().toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
            if (guess.length !== 5 || !/^[A-ZÑ]+$/.test(guess)) continue;

            const game = activeWordle.get(chatId);
            game.attempts++;

            const targetWord = game.word.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
            let result = [];
            let targetArr = targetWord.split('');
            let guessArr = guess.split('');

            // Pass 1: Exact matches (greens)
            for (let i = 0; i < 5; i++) {
              if (guessArr[i] === targetArr[i]) {
                result[i] = '🟩';
                targetArr[i] = null;
                guessArr[i] = null;
              }
            }

            // Pass 2: Partial matches (yellows) and misses (blacks)
            for (let i = 0; i < 5; i++) {
              if (guessArr[i] !== null) {
                let index = targetArr.indexOf(guessArr[i]);
                if (index !== -1) {
                  result[i] = '🟨';
                  targetArr[index] = null;
                } else {
                  result[i] = '⬛';
                }
              }
            }

            game.history.push(`${guess} ${result.join('')}`);

            let isWin = result.every(r => r === '🟩');

            await client.sendPresenceUpdate('composing', chatId);
            await delay(1000);

            if (isWin) {
              clearTimeout(game.timeout);
              let premio = 500;
              addCoins(senderId, premio);
              activeWordle.delete(chatId);
              let finalTxt = `🎉 *¡WORDLE RESUELTO!* 🎉\n\n`;
              finalTxt += `@${senderId.split('@')[0]} adivinó la palabra: *${game.word}*\n`;
              finalTxt += `Intentos usados: *${game.attempts}/${game.maxAttempts}*\n\n`;
              finalTxt += `*Historial:*\n${game.history.join('\n')}\n\n`;
              finalTxt += `> 🎁 Recompensa: *${premio} Coins*\n`;
              finalTxt += `> 💰 *Saldo:* ${getCoins(senderId)} Coins`;
              await client.sendMessage(chatId, { text: finalTxt, mentions: [senderId] }, { quoted: msg });
            } else if (game.attempts >= game.maxAttempts) {
              clearTimeout(game.timeout);
              activeWordle.delete(chatId);
              let finalTxt = `💥 *¡GAME OVER!* 💥\n\n`;
              finalTxt += `Se quedaron sin intentos.\n`;
              finalTxt += `La palabra correcta era: *${game.word}*\n\n`;
              finalTxt += `*Historial:*\n${game.history.join('\n')}`;
              await client.sendMessage(chatId, { text: finalTxt }, { quoted: msg });
            } else {
              let boardTxt = `*Intento ${game.attempts}/${game.maxAttempts}*\n`;
              boardTxt += `${guess} → ${result.join('')}\n\n`;
              boardTxt += `*Historial:*\n${game.history.join('\n')}`;
              await client.sendMessage(chatId, { text: boardTxt }, { quoted: msg });
            }
          }
        });
      }

    } catch (e) {
      console.error('[LUMIBOT DEBUG] Error en wordle.js:', e);
      m.reply('🙄 *Las letras se desordenaron.* (Error del sistema)');
    }
  }
};
