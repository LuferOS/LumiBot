import { getCoins, addCoins, removeCoins, hasCoins } from '../../nucleo/coinsDB.js';
import { fixLid } from '../../nucleo/message.js';

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

const activeMinas = new Map();
let isMinasListenerActive = false;

const multiplierTable = [1.0, 1.2, 1.5, 2.0, 2.5, 3.2, 4.0, 5.0, 7.0, 10.0, 15.0, 25.0];

export default {
  command: ['minas', 'buscaminas'],
  category: 'games',
  run: async (client, m, args, usedPrefix, command) => {
    try {
      const sender = m.sender;

      let apuesta = parseInt(args[0]);
      if (isNaN(apuesta) || apuesta < 10) return m.reply(`💣 *BUSCAMINAS* 💣\n\n> 💡 *Uso:* ${usedPrefix}${command} [apuesta]\n> *Ejemplo:* ${usedPrefix}${command} 50\n\n💰 *Tus Coins:* ${getCoins(sender)}`);

      if (!hasCoins(sender, apuesta)) return m.reply(`💸 No tienes suficientes Coins.\n> Tienes: *${getCoins(sender)} Coins*`);

      const gameId = m.chat + sender;
      if (activeMinas.has(gameId)) return m.reply(`🚩 Ya tienes un juego de minas activo. Escribe *retirar* para cobrar.`);

      await client.sendPresenceUpdate('composing', m.chat);
      await delay(1500);

      removeCoins(sender, apuesta);

      activeMinas.set(gameId, {
        apuesta,
        step: 0,
        multiplier: 1.0,
        timeout: setTimeout(() => {
          if (activeMinas.has(gameId)) {
            const game = activeMinas.get(gameId);
            let premio = Math.floor(game.apuesta * game.multiplier);
            addCoins(sender, premio);
            activeMinas.delete(gameId);
            client.sendMessage(m.chat, { text: `⏰ *Tiempo agotado.* Te retiraste automáticamente.\n> Te llevas *${premio} Coins* (x${game.multiplier}).\n> 💰 *Saldo:* ${getCoins(sender)} Coins` }).catch(() => {});
          }
        }, 120000)
      });

      let txt = `💣 *BUSCAMINAS* 💣\n\n`;
      txt += `Apostaste: *${apuesta} Coins*\n`;
      txt += `Elige un camino seguro enviando un número:\n`;
      txt += `[ 1 ] - [ 2 ] - [ 3 ]\n\n`;
      txt += `> ⚠️ 1 de los 3 caminos tiene una mina oculta.\n`;
      txt += `> Escribe *retirar* en cualquier momento para cobrar.`;

      await client.sendMessage(m.chat, { text: txt }, { quoted: m });

      if (!isMinasListenerActive) {
        isMinasListenerActive = true;
        client.ev.on('messages.upsert', async ({ messages, type }) => {
          if (type !== 'notify') return;
          for (const msg of messages) {
            if (!msg.message || msg.key.fromMe) continue;
            const text = msg.message.conversation || msg.message.extendedTextMessage?.text || "";
            const chatId = msg.key.remoteJid;
            const rawSenderId = msg.key.participant || msg.key.remoteJid;
            const senderId = await fixLid(client, { key: msg.key, chat: chatId, fromMe: msg.key.fromMe });
            const gId = chatId + senderId;

            if (!activeMinas.has(gId)) continue;
            const game = activeMinas.get(gId);
            const choice = text.trim().toLowerCase();

            if (choice === 'retirar') {
              clearTimeout(game.timeout);
              let premio = Math.floor(game.apuesta * game.multiplier);
              addCoins(senderId, premio);
              activeMinas.delete(gId);
              await client.sendPresenceUpdate('composing', chatId);
              await delay(1000);
              await client.sendMessage(chatId, { text: `✅ *Te has retirado a tiempo.*\n> Te llevas *${premio} Coins* (x${game.multiplier}).\n> 💰 *Saldo:* ${getCoins(senderId)} Coins` }, { quoted: msg });
              continue;
            }

            if (['1', '2', '3'].includes(choice)) {
              let isMine = Math.random() < 0.33;
              await client.sendPresenceUpdate('composing', chatId);
              await delay(1000);
              if (isMine) {
                clearTimeout(game.timeout);
                activeMinas.delete(gId);
                await client.sendMessage(chatId, { text: `💥 *¡BOOOOM!* 💥\n\nPisaste una mina en el paso *${game.step + 1}*.\n> Perdiste *${game.apuesta} Coins*.\n> 💰 *Saldo:* ${getCoins(senderId)} Coins` }, { quoted: msg });
              } else {
                game.step++;
                game.multiplier = multiplierTable[game.step] || (game.multiplier + 2.0);
                let premioActual = Math.floor(game.apuesta * game.multiplier);
                let txt = `✅ *¡PASO SEGURO!* ✅\n\n`;
                txt += `Paso: *${game.step}*\n`;
                txt += `Multiplicador: *x${game.multiplier}*\n`;
                txt += `Ganancia acumulada: *${premioActual} Coins*\n\n`;
                txt += `Elige tu siguiente paso: [ 1 ] - [ 2 ] - [ 3 ]\n`;
                txt += `O escribe *retirar* para llevarte las ganancias.`;
                await client.sendMessage(chatId, { text: txt }, { quoted: msg });
              }
            }
          }
        });
      }

    } catch (e) {
      console.error('[LUMIBOT DEBUG] Error en minas.js:', e);
      m.reply('🙄 *El campo minado explotó solo.* (Error del sistema)');
    }
  }
};
