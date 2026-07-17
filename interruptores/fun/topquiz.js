export default {
  command: ['topquiz', 'quizboard'],
  category: 'games',
  run: async (client, m) => {
    try {
      const users = global.db.data.users || {};
      
      // Filtrar y mapear solo usuarios que tengan al menos 1 victoria en quiz
      const topUsers = Object.entries(users)
        .filter(([_, data]) => (data.quizWins || 0) > 0)
        .map(([jid, data]) => ({
          jid,
          name: data.name || 'Usuario',
          wins: data.quizWins || 0
        }))
        .sort((a, b) => b.wins - a.wins) // Ordenar de mayor a menor
        .slice(0, 10); // Tomar solo el Top 10

      if (topUsers.length === 0) {
        return m.reply('🙄 *Todavía no hay cerebritos en la base de datos.*\n> ¡Jueguen *.quiz* para aparecer aquí!');
      }

      let txt = `🏆 *LUMIBOT QUIZ LEADERBOARD* 🏆\n\n`;
      txt += `> _Los más inteligentes y rápidos del bot_\n\n`;

      topUsers.forEach((u, i) => {
        let medal = '🏅';
        if (i === 0) medal = '🥇';
        if (i === 1) medal = '🥈';
        if (i === 2) medal = '🥉';

        txt += `${medal} *#${i + 1}* - ${u.name}\n`;
        txt += `   └ 🎯 Victorias: *${u.wins}*\n\n`;
      });

      txt += `\n_Para ganar puntos, usa el comando_ *.quiz*`;

      await m.reply(txt);

    } catch (e) {
      console.error('[LUMIBOT DEBUG] Error en topquiz:', e);
      m.reply('🙄 *No pude cargar el ranking de cerebritos.*');
    }
  }
};
