import { getCoins, addCoins, removeCoins, hasCoins } from '../../nucleo/coinsDB.js';

export default {
  command: ['slots', 'tragamonedas', 'casino'],
  category: 'games',
  run: async (client, m, args, usedPrefix, command) => {
    try {
      const sender = m.sender;
      const userCoins = getCoins(sender);

      if (!args[0]) {
        return m.reply(`🎰 *TRAGAMONEDAS LUMIBOT* 🎰\n\n> 💡 *Uso:* ${usedPrefix}${command} [cantidad]\n> *Ejemplo:* ${usedPrefix}${command} 50\n> *Ejemplo:* ${usedPrefix}${command} all\n\n💰 *Tus Coins:* ${userCoins}`);
      }

      let bet = 0;
      if (args[0].toLowerCase() === 'all' || args[0].toLowerCase() === 'todo') {
        bet = userCoins;
      } else {
        bet = parseInt(args[0]);
      }

      if (isNaN(bet) || bet < 10) return m.reply('🙄 *No seas tacaño.* La apuesta mínima es de 10 Coins.');
      if (!hasCoins(sender, bet)) return m.reply(`💸 *¡Estás en la quiebra!*\n> No tienes suficientes Coins.\n> Tienes: *${userCoins} Coins*`);

      removeCoins(sender, bet);

      const emojis = ['🍒', '🍋', '🍉', '🔔', '💎'];
      const slot1 = emojis[Math.floor(Math.random() * emojis.length)];
      const slot2 = emojis[Math.floor(Math.random() * emojis.length)];
      const slot3 = emojis[Math.floor(Math.random() * emojis.length)];

      await m.react('🎰');

      let resultText = `🎰 *TRAGAMONEDAS LUMIBOT* 🎰\n\n`;
      resultText += `╭─────────────╮\n`;
      resultText += `│  ${slot1} │ ${slot2} │ ${slot3}  │\n`;
      resultText += `╰─────────────╯\n\n`;

      let winAmount = 0;
      if (slot1 === slot2 && slot2 === slot3) {
        winAmount = bet * 3;
        addCoins(sender, winAmount);
        resultText += `🎉 *¡JACKPOT!* 🎉\n> Multiplicaste x3 tu apuesta.\n> Ganaste: *${winAmount} Coins*`;
        setTimeout(() => m.react('🤑'), 500);
      } else if (slot1 === slot2 || slot2 === slot3 || slot1 === slot3) {
        winAmount = Math.floor(bet * 1.5);
        addCoins(sender, winAmount);
        resultText += `⚠️ *¡Casi!* ⚠️\n> Sacaste 2 iguales.\n> Recuperaste: *${winAmount} Coins*`;
        setTimeout(() => m.react('😌'), 500);
      } else {
        resultText += `💀 *¡PERDISTE!* 💀\n> No coincidió nada.\n> Perdiste: *${bet} Coins*`;
        setTimeout(() => m.react('📉'), 500);
      }

      resultText += `\n\n💰 *Saldo actual:* ${getCoins(sender)} Coins`;
      await m.reply(resultText);

    } catch (e) {
      console.error('[LUMIBOT DEBUG] Error en slots.js:', e);
      m.reply('🙄 *El casino está cerrado por fallas técnicas.*');
    }
  }
};
