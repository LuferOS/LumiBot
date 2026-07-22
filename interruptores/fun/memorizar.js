import { addCoins } from '../../nucleo/coinsDB.js';
import { fixLid } from '../../nucleo/message.js';

export const activeMemory = new Map();
let isMemoryListenerActive = false;

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

const emojisPool = ['🍎','🍌','🍇','🍉','🍓','🍒','🍍','🥥','🥑','🥕','🌽','🥦','🍔','🍕','🌭','🍩','🍦','🍭','🍫','🍬'];

function getRandomEmojis(count) {
    const shuffled = [...emojisPool].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count).join('');
}

export default {
    command: ['memorizar', 'memoria'],
    category: 'fun',
    run: async (client, m, args, usedPrefix) => {
        const chat = m.chat;

        if (activeMemory.has(chat)) {
            return client.reply(chat, '🙄 *Ya hay un juego de memoria activo en este grupo.*', m);
        }

        const mode = (args[0] || 'facil').toLowerCase();
        let emojiCount = 5;
        let showTime = 10000;
        let answerTime = 18000;
        let reward = 200;

        if (mode === 'medio' || mode === 'intermedio') {
            emojiCount = 10;
            answerTime = 15000;
            reward = 500;
        } else if (mode === 'dificil' || mode === 'difícil') {
            emojiCount = 12;
            answerTime = 10000;
            reward = 1000;
        } else if (mode !== 'facil' && mode !== 'fácil') {
            return client.reply(chat, `╭⋯ 🧠 *JUEGO DE MEMORIA* ⋯》\n┊ Memoriza la secuencia de emojis.\n┊\n┊ Uso: *${usedPrefix}memorizar [facil/medio/dificil]*\n╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》`, m);
        }

        const sequence = getRandomEmojis(emojiCount);
        
        const initMsg = await client.sendMessage(chat, { 
            text: `╭⋯ 🧠 *JUEGO DE MEMORIA* (${mode.toUpperCase()}) ⋯》\n┊ Memoriza estos emojis rápido:\n┊\n┊ ➡️ ${sequence} ⬅️\n┊\n┊ Tienes *${showTime/1000} segundos*...\n╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》` 
        }, { quoted: m });

        await delay(showTime);

        // Ocultamos la secuencia
        await client.sendMessage(chat, { 
            edit: initMsg.key, 
            text: `╭⋯ 🧠 *JUEGO DE MEMORIA* (${mode.toUpperCase()}) ⋯》\n┊ ¡TIEMPO AGOTADO!\n┊\n┊ Introduce los emojis en el orden correcto.\n┊ Tienes *${answerTime/1000} segundos* para responder.\n┊ Recompensa: 🪙 *${reward} Coins*\n╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》` 
        });

        // Activamos el juego
        const timeout = setTimeout(() => {
            if (activeMemory.has(chat)) {
                activeMemory.delete(chat);
                client.sendMessage(chat, { text: `⏰ *¡Tiempo!* Nadie pudo recordar la secuencia a tiempo.\n> La secuencia era: ${sequence}` });
            }
        }, answerTime); // Tienen tiempo limite para responder

        activeMemory.set(chat, {
            sequence,
            reward,
            timeout
        });

        // Activar el listener global solo una vez
        if (!isMemoryListenerActive) {
            isMemoryListenerActive = true;
            client.ev.on('messages.upsert', async (chatUpdate) => {
                if (!chatUpdate.messages) return;
                const messages = chatUpdate.messages;
                
                for (const msg of messages) {
                    if (!msg || msg.key.fromMe) return;

                    const chatId = msg.key.remoteJid;
                    const rawSender = msg.key.participant || msg.key.remoteJid;
                    const sender = await fixLid(client, { key: msg.key, chat: chatId, fromMe: msg.key.fromMe });
                    
                    const userText = msg.message?.conversation || msg.message?.extendedTextMessage?.text || "";
                    const guess = userText.trim();

                    if (!activeMemory.has(chatId) || !guess) continue;

                    const memoryGame = activeMemory.get(chatId);

                    // Verifica si el texto coincide quitando espacios y el caracter invisible de emojis (\uFE0F)
                    const normalizeEmojis = (str) => str.replace(/[\s\uFE0F]/g, '');
                    if (normalizeEmojis(guess) === normalizeEmojis(memoryGame.sequence)) {
                        clearTimeout(memoryGame.timeout);
                        activeMemory.delete(chatId);

                        addCoins(sender, memoryGame.reward);
                        
                        await client.sendMessage(chatId, { 
                            text: `🎉 *¡MEMORIA PERFECTA!* 🎉\n> 👤 @${sender.split('@')[0]} tiene memoria fotográfica.\n> 🎁 Ganaste: *${memoryGame.reward} Coins*`, 
                            mentions: [sender] 
                        }, { quoted: msg });
                    }
                }
            });
        }
    }
};
