export default {
  command: ['markov'],
  category: 'group',
  isAdmin: true,
  run: async (client, m, args, usedPrefix, command) => {
    if (!m.isGroup) return m.reply(`💙 Este comando es exclusivo para grupos.`);
    
    const db = global.db.data;
    const chat = db.chats[m.chat];
    
    if (!args[0]) {
      return m.reply(`╭⋯ 🧠 *CEREBRO MARKOVIANO* ⋯》
┊ Activa o desactiva la inteligencia artificial pasiva del grupo.
┊ El bot aprenderá de todo lo que hablen y responderá de forma humana.
┊
┊ > *Uso:* \`${usedPrefix}${command} on\`
┊ > *Uso:* \`${usedPrefix}${command} off\`
╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》`);
    }

    if (args[0].toLowerCase() === 'on') {
      chat.markov = true;
      m.reply(`╭⋯ 🧠 *CEREBRO MARKOVIANO: ACTIVADO* ⋯》\n┊ Desde este momento, empezaré a recolectar contexto y a aprender del grupo.\n┊ ¡Cuidado con lo que dicen, porque lo usaré en su contra! 😈\n╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》`);
    } else if (args[0].toLowerCase() === 'off') {
      chat.markov = false;
      m.reply(`╭⋯ 💤 *CEREBRO MARKOVIANO: DESACTIVADO* ⋯》\n┊ He apagado mi inteligencia pasiva en este grupo. Ya no responderé al azar.\n╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》`);
    } else {
      m.reply(`🙄 *Bruh...* Solo entiendo "on" y "off".`);
    }
  }
};
