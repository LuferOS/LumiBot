export default {
  command: ['ruletarusa', 'rr'],
  category: 'games',
  run: async (client, m, args) => {
    try {
      const sender = m.sender;
      let users = global.db.data.users;
      if (!users[sender]) users[sender] = { coins: 0, exp: 0 };
      
      const userCoins = users[sender].coins || 0;
      const penalty = 200;
      const reward = 50;

      if (userCoins < penalty) {
        return m.reply(`🙄 *Bruh*, no tienes suficientes Coins para jugar.\n> Si mueres, debes pagar el funeral (*${penalty} Coins*).\n> Tienes: *${userCoins} Coins*`);
      }

      await m.react('🔫');

      // Animación de tensión
      await client.sendMessage(m.chat, { text: `🔫 *@${sender.split('@')[0]} toma el revólver...*`, mentions: [sender] });
      
      setTimeout(async () => {
          await client.sendMessage(m.chat, { text: `🎲 *Gira el tambor y apunta a su cabeza...*` });
          
          setTimeout(async () => {
              // 1 en 6 de morir
              const isDead = Math.floor(Math.random() * 6) === 0;

              if (isDead) {
                  users[sender].coins -= penalty;
                  await client.sendMessage(m.chat, { 
                      text: `💥 *¡BAM!* 💥\n\n@${sender.split('@')[0]} se voló la cabeza.\n> 💀 *Penalización:* -${penalty} Coins\n> 💰 *Saldo restante:* ${users[sender].coins} Coins`,
                      mentions: [sender]
                  });
              } else {
                  users[sender].coins += reward;
                  await client.sendMessage(m.chat, { 
                      text: `😌 *¡Click!* 😌\n\nLa recámara estaba vacía. @${sender.split('@')[0]} sobrevive para contarlo.\n> 🎁 *Recompensa:* +${reward} Coins\n> 💰 *Saldo actual:* ${users[sender].coins} Coins`,
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
