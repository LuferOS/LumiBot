const ahorcadoDrawings = [
  `  +---+
  |   |
      |
      |
      |
      |
=========`,
  `  +---+
  |   |
  O   |
      |
      |
      |
=========`,
  `  +---+
  |   |
  O   |
  |   |
      |
      |
=========`,
  `  +---+
  |   |
  O   |
 /|   |
      |
      |
=========`,
  `  +---+
  |   |
  O   |
 /|\\  |
      |
      |
=========`,
  `  +---+
  |   |
  O   |
 /|\\  |
 /    |
      |
=========`,
  `  +---+
  |   |
  O   |
 /|\\  |
 / \\  |
      |
=========`
];

const words = [
  "PERRO", "GATO", "COMPUTADORA", "WHATSAPP", "JAVASCRIPT", 
  "PROGRAMACION", "CELULAR", "BOTELLA", "TECLADO", "PANTALLA", 
  "INTERNET", "ELEFANTE", "UNIVERSO", "GALAXIA", "ASTRONAUTA", 
  "TELEVISOR", "VEHICULO", "GUITARRA", "MURCIELAGO", "VIDEOJUEGO",
  "ABRAZADERA", "BIBLIOTECA", "AEROPUERTO", "RESTAURANTE", "HELICOPTERO",
  "CHOCOLATE", "ESTUDIANTE", "DESAYUNO", "FOTOGRAFIA", "ZAPATILLA",
  "ENCICLOPEDIA", "AERODINAMICA", "FOTOSINTESIS", "HIPOPOTAMO", "CALEFACCION",
  "REFRIGERADOR", "MICROONDAS", "LABORATORIO", "ASTRONOMIA", "MATEMATICAS",
  "LITERATURA", "ARQUITECTURA", "KINESIOLOGIA", "CONSTELACION", "ELECTROMAGNETISMO",
  "REVOLUCION", "INDEPENDENCIA", "PALEONTOLOGIA", "CONSTITUCION", "DEMOCRACIA",
  "CIBERSEGURIDAD", "INTELIGENCIA", "METABOLISMO", "BIODIVERSIDAD", "ECOSISTEMA",
  "ATMOSFERA", "TEMPERATURA", "SUPERNOVA", "TERREMOTO", "TSUNAMI",
  "AERODESLIZADOR", "PARACAIDISMO",
  "MARIPOSA", "DINOSAURIO", "CARAMELO", "COCODRILO", "LAMPARA",
  "PARAGUAS", "SEMAFORO", "VOLEIBOL", "ATLETISMO", "CAMPAMENTO",
  "BRUJULA", "CALENDARIO", "MANDARINA", "SOMBRERO", "DINOSAURIO",
  "PINGÜINO", "RELAMPAGO", "CAMISETA", "BICICLETA", "ALMOHADA",
  "CANGREJO", "DELFINES", "ESMERALDA", "SERPIENTE", "LABERINTO",
  "MANZANA", "NARANJAS", "DURAZNO", "SANDWICH", "ROMPECABEZAS",
  "TIBURON", "TORTUGA", "UNICORNIO", "ESPERANZA", "AVENTURA",
  "CABALLERO", "CASCABEL", "ESCOPETA", "HORMIGUERO", "LEOPARDO"
];

export const activeAhorcados = new Map();
let isAhorcadoListenerActive = false;

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

// Función para obtener la palabra censurada (ej: P _ R R _)
function getDisplayWord(word, guessed) {
    return word.split('').map(letter => guessed.has(letter) ? letter : '_').join(' ');
}

export default {
  command: ['ahorcado', 'hangman'],
  category: 'games',
  run: async (client, m, args, usedPrefix, command) => {

    // Inyectar el listener global si no está activo
    if (!isAhorcadoListenerActive && client.ev) {
        client.ev.on('messages.upsert', async ({ messages, type }) => {
            if (type !== 'notify') return;
            const msg = messages[0];
            if (!msg || msg.key.fromMe) return;

            const chat = msg.key.remoteJid;
            const sender = msg.key.participant || msg.key.remoteJid;
            
            const userText = msg.message?.conversation || msg.message?.extendedTextMessage?.text || "";
            const guess = userText.trim().toUpperCase();
            
            if (!activeAhorcados.has(chat) || guess.length !== 1 || !/^[A-ZÑ]$/.test(guess)) return;

            const game = activeAhorcados.get(chat);

            // Si la letra ya fue intentada
            if (game.guessed.has(guess)) {
                return client.sendMessage(chat, { text: `🙄 Ya intentaste la letra *${guess}*. Intenta con otra.` }, { quoted: msg });
            }

            game.guessed.add(guess);

            // Reiniciar el timeout de inactividad
            clearTimeout(game.timeout);
            game.timeout = setTimeout(() => {
                if (activeAhorcados.has(chat)) {
                    activeAhorcados.delete(chat);
                    client.sendMessage(chat, { text: `⏳ *Juego de Ahorcado cancelado por inactividad.*\nLa palabra era: *${game.word}*` });
                }
            }, 60000);

            // Verificar si acertó
            if (game.word.includes(guess)) {
                const currentDisplay = getDisplayWord(game.word, game.guessed);
                
                // Si ya no hay guiones, ganó
                if (!currentDisplay.includes('_')) {
                    clearTimeout(game.timeout);
                    activeAhorcados.delete(chat);
                    
                    let users = global.db.data.users;
                    if (!users[sender]) users[sender] = { coins: 0, exp: 0 };
                    users[sender].coins = (users[sender].coins || 0) + 100;

                    await client.sendPresenceUpdate('composing', chat);
                    await delay(1500);

                    return client.sendMessage(chat, { 
                        text: `🎉 *¡Felicidades @${sender.split('@')[0]}!* 🎉\n\nAcertaste la palabra: *${game.word}*\n🎁 *Has ganado 100 Coins.*`,
                        mentions: [sender]
                    }, { quoted: msg });
                } else {
                    // Sigue jugando
                    return client.sendMessage(chat, { 
                        text: `✅ *¡Letra correcta!*\n\n${currentDisplay}\n\n*Errores:* ${game.errors}/6\n\`\`\`${ahorcadoDrawings[game.errors]}\`\`\`` 
                    }, { quoted: msg });
                }
            } else {
                // Se equivocó
                game.errors++;
                const currentDisplay = getDisplayWord(game.word, game.guessed);

                // Si alcanzó el máximo de errores
                if (game.errors >= 6) {
                    let users = global.db.data.users;
                    if (!users[sender]) users[sender] = { coins: 0, exp: 0 };
                    
                    const extraLifeCost = 50;
                    
                    // Si el usuario tiene suficientes Coins, autocomprar vida extra
                    if ((users[sender].coins || 0) >= extraLifeCost) {
                        users[sender].coins -= extraLifeCost;
                        game.errors = 5; // Lo salva al límite
                        
                        await client.sendPresenceUpdate('composing', chat);
                        await delay(1000);

                        return client.sendMessage(chat, { 
                            text: `❤️ *¡VIDA EXTRA AUTOCONSUMIDA!*\n\n@${sender.split('@')[0]} se equivocó, pero gastó *${extraLifeCost} Coins* para evitar el Game Over del grupo.\n\n${currentDisplay}\n\n*Errores:* 5/6 (Al límite)\n\`\`\`${ahorcadoDrawings[5]}\`\`\``,
                            mentions: [sender]
                        }, { quoted: msg });
                    }

                    clearTimeout(game.timeout);
                    activeAhorcados.delete(chat);
                    
                    await client.sendPresenceUpdate('composing', chat);
                    await delay(1000);

                    return client.sendMessage(chat, { 
                        text: `💀 *¡GAME OVER!* 💀\n\nEl ahorcado se completó y nadie tenía Coins suficientes para una vida extra.\nLa palabra era: *${game.word}*\n\n\`\`\`${ahorcadoDrawings[6]}\`\`\`` 
                    }, { quoted: msg });
                } else {
                    return client.sendMessage(chat, { 
                        text: `❌ *¡Letra incorrecta!*\n\n${currentDisplay}\n\n*Errores:* ${game.errors}/6\n\`\`\`${ahorcadoDrawings[game.errors]}\`\`\`` 
                    }, { quoted: msg });
                }
            }
        });
        
        isAhorcadoListenerActive = true;
        console.log('[LUMIBOT NÚCLEO] 🎧 Interceptor de Ahorcado activado.');
    }

    try {
        if (activeAhorcados.has(m.chat)) {
            const game = activeAhorcados.get(m.chat);
            return m.reply(`🙄 *Ya hay una partida de Ahorcado en curso.*\n\nPalabra: ${getDisplayWord(game.word, game.guessed)}\nErrores: ${game.errors}/6\n\n¡Simplemente envía una letra para adivinar!`);
        }

        const randomWord = words[Math.floor(Math.random() * words.length)];
        
        activeAhorcados.set(m.chat, {
            word: randomWord,
            guessed: new Set(),
            errors: 0,
            timeout: setTimeout(() => {
                if (activeAhorcados.has(m.chat)) {
                    activeAhorcados.delete(m.chat);
                    client.sendMessage(m.chat, { text: `⏳ *Juego de Ahorcado cancelado por inactividad.*\nLa palabra era: *${randomWord}*` });
                }
            }, 60000)
        });

        const initialDisplay = getDisplayWord(randomWord, new Set());

        let text = `🎮 *EL AHORCADO LUMIBOT* 🎮\n\n`;
        text += `Adivina la palabra oculta enviando una sola letra.\n\n`;
        text += `*Palabra:* ${initialDisplay}\n`;
        text += `*Errores permitidos:* 6\n\n`;
        text += `\`\`\`${ahorcadoDrawings[0]}\`\`\`\n\n`;
        text += `_El juego se cancelará en 60 segundos si nadie juega._`;

        await m.reply(text);

    } catch (e) {
        console.error('[LUMIBOT DEBUG] Error en ahorcados.js:', e);
        m.reply('🙄 *Todo explotó intentando crear el Ahorcado.*');
    }
  }
};
