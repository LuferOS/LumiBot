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
      if (target === sender) {
          return m.reply('🙄 *Bruh*, no puedes pelear contigo mismo. Busca un psicólogo.');
      }

      // Evitar que apuesten contra el bot
      if (target === client.user.id.split(':')[0] + '@s.whatsapp.net') {
          return m.reply('🤖 *Soy el crupier, no un luchador.* Reta a un humano.');
      }

      // Parsear apuesta
      const rawBet = args.find(arg => !arg.includes('@'));
      let bet = parseInt(rawBet);

      if (!rawBet || isNaN(bet) || bet < 10) {
          return m.reply('🙄 Debes ingresar una apuesta válida (Mínimo 10 Coins).');
      }

      let users = global.db.data.users;
      if (!users[sender]) users[sender] = { limit: 0, exp: 0 };
      if (!users[target]) users[target] = { limit: 0, exp: 0 };

      if ((users[sender].limit || 0) < bet) {
          return m.reply(`💸 *¡Estás en la quiebra!*\n> No tienes suficientes Coins para retarlo.\n> Tienes: *${users[sender].limit || 0} Coins*`);
      }

      if ((users[target].limit || 0) < bet) {
          return m.reply(`💸 *¡Tu oponente es pobre!*\n> @${target.split('@')[0]} no tiene suficientes Coins para aceptar esta apuesta.`, null, { mentions: [target] });
      }

      // Restamos a ambos inmediatamente (el pozo es bet * 2)
      users[sender].limit -= bet;
      users[target].limit -= bet;
      const pot = bet * 2;

      await client.sendMessage(m.chat, { 
          text: `⚔️ *¡DUELO A MUERTE INICIADO!* ⚔️\n\n🥊 @${sender.split('@')[0]} VS @${target.split('@')[0]} 🥊\n\n💰 *Pozo en juego:* ${pot} Coins\n\n_La pelea automática ha comenzado..._`, 
          mentions: [sender, target] 
      });

      // Simulación de pelea
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
          
          // 50/50 RNG
          const senderWins = Math.random() >= 0.5;
          const winner = senderWins ? sender : target;
          const loser = senderWins ? target : sender;
          const attack = attacks[Math.floor(Math.random() * attacks.length)];

          users[winner].limit += pot;

          await client.sendMessage(m.chat, { 
              text: `🩸 *RESULTADO DEL DUELO* 🩸\n\n@${winner.split('@')[0]} ${attack} a @${loser.split('@')[0]} y lo dejó inconsciente en el piso.\n\n🏆 *¡GANADOR:* @${winner.split('@')[0]}!*\nSe lleva el pozo de *${pot} Coins*.\n\n> 💰 *Saldo Ganador:* ${users[winner].limit} Coins\n> 💀 *Saldo Perdedor:* ${users[loser].limit} Coins`, 
              mentions: [winner, loser] 
          });
      }, 3000);

    } catch (e) {
      console.error('[LUMIBOT DEBUG] Error en duelo.js:', e);
      m.reply('🙄 *Alguien llamó a la policía y se canceló la pelea.* (Error del sistema)');
    }
  }
};
