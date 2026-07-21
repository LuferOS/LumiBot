export const activeAnagrams = new Map();
let isAnagramaListenerActive = false;

const anagramWords = [
  "MURCIELAGO", "COMPUTADORA", "WHATSAPP", "JAVASCRIPT", "PROGRAMACION",
  "ASTRONAUTA", "MOTOCICLETA", "UNIVERSIDAD", "TELEVISION", "ELEFANTE",
  "BIBLIOTECA", "AEROPUERTO", "RESTAURANTE", "HELICOPTERO", "CHOCOLATE",
  "ESTUDIANTE", "DESAYUNO", "GUITARRA", "FOTOGRAFIA", "ZAPATILLA"
];

function shuffleWord(word) {
  let arr = word.split('');
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.join(' ');
}

export default {
  command: ['anagrama', 'palabra'],
  category: 'games',
  run: async (client, m, args) => {

    if (!isAnagramaListenerActive && client.ev) {
        client.ev.on('messages.upsert', async ({ messages, type }) => {
            if (type !== 'notify') return;
            const msg = messages[0];
            if (!msg || msg.key.fromMe) return;

            const chat = msg.key.remoteJid;
            const sender = msg.key.participant || msg.key.remoteJid;
            
            const userText = msg.message?.conversation || msg.message?.extendedTextMessage?.text || "";
            const guess = userText.trim().toUpperCase();
            
            if (!activeAnagrams.has(chat) || !guess) return;

            const game = activeAnagrams.get(chat);

            if (guess === game.word) {
                clearTimeout(game.timeout);
                activeAnagrams.delete(chat);
                
                let users = global.db.data.users;
                if (!users[sender]) users[sender] = { limit: 0, exp: 0 };
                users[sender].limit = (users[sender].limit || 0) + 100;

                return client.sendMessage(chat, { 
                    text: `🎉 *¡TENEMOS UN GANADOR!* 🎉\n\n@${sender.split('@')[0]} logró descifrar la palabra.\n\n> ✅ *Palabra:* ${game.word}\n🎁 *Recompensa:* 100 Coins`,
                    mentions: [sender] 
                }, { quoted: msg });
            }
        });
        
        isAnagramaListenerActive = true;
        console.log('[LUMIBOT NÚCLEO] 🎧 Interceptor de Anagrama activado.');
    }

    try {
        if (activeAnagrams.has(m.chat)) {
            const game = activeAnagrams.get(m.chat);
            return m.reply(`🙄 *Ya hay un Anagrama activo en este grupo.*\n\nDescifra esto: *${game.scrambled}*`);
        }

        const word = anagramWords[Math.floor(Math.random() * anagramWords.length)];
        // Ensure it's actually scrambled
        let scrambled = shuffleWord(word);
        while (scrambled.replace(/ /g, '') === word) {
            scrambled = shuffleWord(word);
        }

        activeAnagrams.set(m.chat, {
            word: word,
            scrambled: scrambled,
            timeout: setTimeout(() => {
                if (activeAnagrams.has(m.chat)) {
                    activeAnagrams.delete(m.chat);
                    client.sendMessage(m.chat, { text: `⏳ *Se acabó el tiempo del Anagrama.*\nNadie logró descifrar la palabra.\n\nLa palabra era: *${word}*` });
                }
            }, 60000)
        });

        let text = `🔀 *ANAGRAMA LUMIBOT* 🔀\n\n`;
        text += `Descifra la siguiente palabra y escríbela en el chat:\n\n`;
        text += `> 🧩 *${scrambled}*\n\n`;
        text += `🎁 *Recompensa:* 100 Coins\n`;
        text += `⏳ *Tiempo:* 60 Segundos`;

        await m.reply(text);

    } catch (e) {
        console.error('[LUMIBOT DEBUG] Error en anagrama.js:', e);
        m.reply('🙄 *Todo explotó intentando crear el Anagrama.*');
    }
  }
};
