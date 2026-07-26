import { getCoins, addCoins, removeCoins, hasCoins } from '../../nucleo/coinsDB.js';

export default {
  command: ['duelo', 'pvp', 'pelear'],
  category: 'games',
  run: async (client, m, args, usedPrefix, command) => {
    try {
      const sender = m.sender;
      const mentionedJid = m.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];

      if (mentionedJid.length === 0) {
          return m.reply(`⚔️ *DUELOS LUMIBOT* ⚔️\n\n> 💡 *Uso:* ${usedPrefix}${command} @usuario [apuesta]\n> *Ejemplo:* ${usedPrefix}${command} @123456789 100\n\n_Reta a alguien a una pelea a muerte por sus Coins._`);
      }

      const target = mentionedJid[0];
      if (target === sender) return m.reply('🙄 *Bruh*, no puedes pelear contigo mismo.');
      if (target === client.user.id.split(':')[0] + '@s.whatsapp.net') return m.reply('🤖 *Soy el crupier, no un luchador.*');

      const rawBet = args.find(arg => !arg.includes('@'));
      let bet = parseInt(rawBet);
      if (!rawBet || isNaN(bet) || bet < 10) return m.reply('🙄 Apuesta mínima de *10 Coins*.');

      if (!hasCoins(sender, bet)) return m.reply(`💸 *¡Estás en la quiebra!*\n> Tienes: *${getCoins(sender)} Coins*`);
      if (!hasCoins(target, bet)) return m.reply(`💸 *¡Tu oponente es pobre!*\n> @${target.split('@')[0]} no tiene suficientes Coins.`, null, { mentions: [target] });

      removeCoins(sender, bet);
      removeCoins(target, bet);
      const pot = bet * 2;

      await client.sendPresenceUpdate('composing', m.chat);
      await client.sendMessage(m.chat, {
          text: `⚔️ *¡DUELO A MUERTE INICIADO!* ⚔️\n\n@${sender.split('@')[0]} ha retado a @${target.split('@')[0]} a un duelo por *${pot} Coins*.\n\n> 🎲 *La pelea está en marcha...*`,
          mentions: [sender, target]
      });

      setTimeout(async () => {
          const attacks = [
              "le dio un gancho derecho",
              "usó un ataque especial de ki",
              "le tiró una silla por la cabeza",
              "invocó a Exodia y obliteró",
              "usó 'Mordisco' y fue super efectivo",
              "hizo un 360 no-scope",
              "usó la técnica de la grulla",
              "le lanzó un Nokia 3310"
          ];

          const senderWins = Math.random() >= 0.5;
          const winner = senderWins ? sender : target;
          const loser = senderWins ? target : sender;
          const attack = attacks[Math.floor(Math.random() * attacks.length)];

          addCoins(winner, pot);

          await client.sendPresenceUpdate('composing', m.chat);
          await client.sendMessage(m.chat, {
              text: `🩸 *RESULTADO DEL DUELO* 🩸\n\n@${winner.split('@')[0]} ${attack} a @${loser.split('@')[0]} y lo dejó inconsciente.\n\n🏆 *¡GANADOR:* @${winner.split('@')[0]}!\nSe lleva el pozo de *${pot} Coins*.\n\n> 💰 *Saldo Ganador:* ${getCoins(winner)} Coins\n> 💀 *Saldo Perdedor:* ${getCoins(loser)} Coins`,
              mentions: [winner, loser]
          });
      }, 3000);

    } catch (e) {
      console.error('[LUMIBOT DEBUG] Error en duelo.js:', e);
      await m.reply('🙄 *Alguien llamó a la policía.* (Error del sistema)');
    }
  }
};
