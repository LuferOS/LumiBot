export default {
  command: ['slots', 'tragamonedas', 'casino'],
  category: 'games',
  run: async (client, m, args, usedPrefix, command) => {
    try {
      const sender = m.sender;
      let users = global.db.data.users;
      if (!users[sender]) users[sender] = { coins: 0, exp: 0 };
      
      const userCoins = users[sender].coins || 0;
      
      if (!args[0]) {
        return m.reply(`🎰 *TRAGAMONEDAS LUMIBOT* 🎰\n\n> 💡 *Uso:* ${usedPrefix}${command} [cantidad]\n> *Ejemplo:* ${usedPrefix}${command} 50\n> *Ejemplo:* ${usedPrefix}${command} all\n\n💰 *Tus Coins:* ${userCoins}`);
      }

      let bet = 0;
      if (args[0].toLowerCase() === 'all' || args[0].toLowerCase() === 'todo') {
        bet = userCoins;
      } else {
        bet = parseInt(args[0]);
      }

      if (isNaN(bet) || bet < 10) {
        return m.reply('🙄 *No seas tacaño.* La apuesta mínima es de 10 Coins.');
      }

      if (userCoins < bet) {
        return m.reply(`💸 *¡Estás en la quiebra!*\n> No tienes suficientes Coins para esta apuesta.\n> Tienes: *${userCoins} Coins*`);
      }

      // Restamos la apuesta inmediatamente
      users[sender].coins -= bet;

      const emojis = ['🍒', '🍋', '🍉', '🔔', '💎'];
      
      const slot1 = emojis[Math.floor(Math.random() * emojis.length)];
      const slot2 = emojis[Math.floor(Math.random() * emojis.length)];
      const slot3 = emojis[Math.floor(Math.random() * emojis.length)];

      await m.react('🎰');

      // Animación falsa simple (opcional, pero lo haremos directo por simplicidad)
      let resultText = `🎰 *TRAGAMONEDAS LUMIBOT* 🎰\n\n`;
      resultText += `╭─────────────╮\n`;
      resultText += `│  ${slot1} │ ${slot2} │ ${slot3}  │\n`;
      resultText += `╰─────────────╯\n\n`;

      let winAmount = 0;
      if (slot1 === slot2 && slot2 === slot3) {
        // 3 iguales = x3
        winAmount = bet * 3;
        users[sender].coins += winAmount;
        resultText += `🎉 *¡JACKPOT!* 🎉\n> Multiplicaste x3 tu apuesta.\n> Ganaste: *${winAmount} Coins*`;
        setTimeout(() => m.react('🤑'), 500);
      } else if (slot1 === slot2 || slot2 === slot3 || slot1 === slot3) {
        // 2 iguales = x1.5 o recupera
        winAmount = Math.floor(bet * 1.5);
        users[sender].coins += winAmount;
        resultText += `⚠️ *¡Casi!* ⚠️\n> Sacaste 2 iguales.\n> Recuperaste y ganaste un poco: *${winAmount} Coins*`;
        setTimeout(() => m.react('😌'), 500);
      } else {
        // Nada
        resultText += `💀 *¡PERDISTE!* 💀\n> No coincidió nada.\n> Perdiste: *${bet} Coins*`;
        setTimeout(() => m.react('📉'), 500);
      }

      resultText += `\n\n💰 *Saldo actual:* ${users[sender].coins} Coins`;

      await m.reply(resultText);

    } catch (e) {
      console.error('[LUMIBOT DEBUG] Error en slots.js:', e);
      m.reply('🙄 *El casino está cerrado por fallas técnicas.*');
    }
  }
};
