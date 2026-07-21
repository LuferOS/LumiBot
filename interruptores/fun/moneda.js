const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

export default {
  command: ['moneda', 'coinflip', 'coin'],
  category: 'games',
  run: async (client, m, args, usedPrefix, command) => {
    try {
      const sender = m.sender;
      let users = global.db.data.users;
      if (!users[sender]) users[sender] = { coins: 0, exp: 0 };

      if (args.length < 2) return m.reply(`🪙 *CARA O CRUZ* 🪙\n\n> 💡 *Uso:* ${usedPrefix}${command} [cara/cruz] [apuesta]\n> *Ejemplo:* ${usedPrefix}${command} cara 50\n\n💰 *Tus Coins:* ${users[sender].coins || 0}`);

      let eleccion = args[0].toLowerCase();
      let apuesta = parseInt(args[1]);

      if (!['cara', 'cruz'].includes(eleccion)) return m.reply(`🚩 Debes elegir *cara* o *cruz*.`);
      if (isNaN(apuesta) || apuesta < 10) return m.reply(`🚩 Apuesta mínima de *10 Coins*.`);
      if ((users[sender].coins || 0) < apuesta) return m.reply(`💸 No tienes suficientes Coins.\n> Tienes: *${users[sender].coins || 0} Coins*`);

      // Anti-Spam
      await client.sendPresenceUpdate('composing', m.chat);
      await delay(1500);

      users[sender].coins -= apuesta;

      let resultado = Math.random() < 0.5 ? 'cara' : 'cruz';
      let isWin = eleccion === resultado;

      let emojiResult = resultado === 'cara' ? '🟡' : '⚪';

      let txt = `🪙 *CARA O CRUZ* 🪙\n\n`;
      txt += `Tu elección: *${eleccion.toUpperCase()}*\n`;
      txt += `La moneda cayó en: ${emojiResult} *${resultado.toUpperCase()}*\n\n`;

      if (isWin) {
        let premio = apuesta * 2;
        users[sender].coins += premio;
        txt += `🎉 *¡Ganaste!* Te llevas *${premio} Coins*.\n`;
      } else {
        txt += `💥 *Perdiste* tus *${apuesta} Coins*.\n`;
      }

      txt += `> 💰 *Saldo:* ${users[sender].coins} Coins`;

      await client.sendMessage(m.chat, { text: txt }, { quoted: m });

    } catch (e) {
      console.error('[LUMIBOT DEBUG] Error en moneda.js:', e);
      m.reply('🙄 *La moneda se cayó al piso y se perdió.* (Error del sistema)');
    }
  }
};
