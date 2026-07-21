import { getCoins, addCoins, removeCoins, hasCoins } from '../../nucleo/coinsDB.js';

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

export default {
  command: ['carrera', 'caballos'],
  category: 'games',
  run: async (client, m, args, usedPrefix, command) => {
    try {
      const sender = m.sender;

      if (args.length < 2) return m.reply(`🏁 *CARRERA DE CABALLOS* 🏁\n\n> 💡 *Uso:* ${usedPrefix}${command} [1-4] [apuesta]\n> *Ejemplo:* ${usedPrefix}${command} 3 50\n\n💰 *Tus Coins:* ${getCoins(sender)}`);

      let caballo = parseInt(args[0]);
      let apuesta = parseInt(args[1]);

      if (isNaN(caballo) || caballo < 1 || caballo > 4) return m.reply(`🚩 Elige un caballo válido del *1* al *4*.`);
      if (isNaN(apuesta) || apuesta < 10) return m.reply(`🚩 Apuesta mínima de *10 Coins*.`);
      if (!hasCoins(sender, apuesta)) return m.reply(`💸 No tienes suficientes Coins.\n> Tienes: *${getCoins(sender)} Coins*`);

      await client.sendPresenceUpdate('composing', m.chat);
      await delay(1500);

      removeCoins(sender, apuesta);

      const emojis = ['🐴', '🦄', '🏇', '🐎'];
      let caballos = [
        { id: 1, pos: 0, emoji: emojis[0] },
        { id: 2, pos: 0, emoji: emojis[1] },
        { id: 3, pos: 0, emoji: emojis[2] },
        { id: 4, pos: 0, emoji: emojis[3] }
      ];

      const meta = 12;

      const renderTrack = () => {
        let str = `🏁 *CARRERA DE CABALLOS* 🏁\n\n`;
        for (let c of caballos) {
          let track = Array(meta).fill('▫️');
          let pos = c.pos >= meta ? meta - 1 : c.pos;
          track[pos] = c.emoji;
          str += `[${c.id}] ${track.join('')}🏁\n`;
        }
        str += `\n> 💰 Apostaste *${apuesta} Coins* al caballo *${caballo}*`;
        return str;
      };

      let msg = await client.sendMessage(m.chat, { text: renderTrack() }, { quoted: m });

      let winner = null;
      let maxIter = 15;
      let iter = 0;

      while (!winner && iter < maxIter) {
        iter++;
        await delay(1500);
        for (let c of caballos) {
          c.pos += Math.floor(Math.random() * 3) + 1;
          if (c.pos >= meta && !winner) winner = c.id;
        }
        try { await client.sendMessage(m.chat, { text: renderTrack(), edit: msg.key }); } catch {}
      }

      if (!winner) winner = caballos.sort((a, b) => b.pos - a.pos)[0].id;
      await delay(500);

      if (winner === caballo) {
        let premio = apuesta * 4;
        addCoins(sender, premio);
        let finalTxt = renderTrack() + `\n\n🎉 *¡Tu caballo ganó!* Te llevas *${premio} Coins*.\n> 💰 *Saldo:* ${getCoins(sender)} Coins`;
        try { await client.sendMessage(m.chat, { text: finalTxt, edit: msg.key }); } catch {}
      } else {
        let finalTxt = renderTrack() + `\n\n💥 *Perdiste.* El caballo *${winner}* cruzó primero.\n> 💰 *Saldo:* ${getCoins(sender)} Coins`;
        try { await client.sendMessage(m.chat, { text: finalTxt, edit: msg.key }); } catch {}
      }

    } catch (e) {
      console.error('[LUMIBOT DEBUG] Error en carrera.js:', e);
      m.reply('🙄 *Los caballos se escaparon.* (Error del sistema)');
    }
  }
};
