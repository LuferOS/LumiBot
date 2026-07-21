import { getCoins, addCoins, removeCoins } from '../../nucleo/coinsDB.js';

export default {
  command: ['ruletarusa', 'rr'],
  category: 'games',
  run: async (client, m, args) => {
    try {
      const sender = m.sender;
      const penalty = 200;
      const reward = 50;

      await m.react('🔫');

      await client.sendPresenceUpdate('composing', m.chat);
      await client.sendMessage(m.chat, { text: `🔫 *@${sender.split('@')[0]} toma el revólver...*`, mentions: [sender] });

      setTimeout(async () => {
          await client.sendPresenceUpdate('composing', m.chat);
          await client.sendMessage(m.chat, { text: `🎲 *Gira el tambor y apunta a su cabeza...*` });

          setTimeout(async () => {
              const isDead = Math.floor(Math.random() * 6) === 0;

              if (isDead) {
                  removeCoins(sender, penalty);
                  await client.sendPresenceUpdate('composing', m.chat);
                  await client.sendMessage(m.chat, {
                      text: `💥 *¡BAM!* 💥\n\n@${sender.split('@')[0]} se voló la cabeza.\n> 💀 *Penalización:* -${penalty} Coins\n> 💰 *Saldo restante:* ${getCoins(sender)} Coins`,
                      mentions: [sender]
                  });
              } else {
                  addCoins(sender, reward);
                  await client.sendPresenceUpdate('composing', m.chat);
                  await client.sendMessage(m.chat, {
                      text: `😌 *¡Click!* 😌\n\nLa recámara estaba vacía. @${sender.split('@')[0]} sobrevive para contarlo.\n> 🎁 *Recompensa:* +${reward} Coins\n> 💰 *Saldo actual:* ${getCoins(sender)} Coins`,
                      mentions: [sender]
                  });
              }
          }, 2000);
      }, 1500);

    } catch (e) {
      console.error('[LUMIBOT DEBUG] Error en ruletarusa.js:', e);
      m.reply('🙄 *El revólver se atascó.*');
    }
  }
};
