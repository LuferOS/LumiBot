export default {
  command: ['chatbot'],
  category: 'ai',
  run: async (client, m, args) => {
    const isGroup = m.isGroup;
    if (!isGroup) return m.reply('💅 Ay bebé, esto solo funciona en grupos para el chisme.');
    
    const db = global.db?.data || {};
    const chat = db.chats?.[m.chat] || {};
    
    const cmd = (args[0] || '').toLowerCase();
    
    if (cmd === 'on') {
      chat.chatbot = true;
      chat.markov = true;
      db.chats[m.chat] = chat;
      return m.reply('💅 ✨ *MODO DIVA Y CEREBRO MARKOV ACTIVADOS* ✨ 💅\n> Ahora sí, prepárense que voy a opinar en todo este chisme y aprenderé de ustedes.');
    } else if (cmd === 'off') {
      chat.chatbot = false;
      chat.markov = false;
      db.chats[m.chat] = chat;
      return m.reply('💅 ✨ *SISTEMAS DE IA DESACTIVADOS* ✨ 💅\n> Me callo por completo. Cero respuestas automáticas y modo Diva apagado. Me avisan si pasa algo.');
    } else {
      return m.reply(`🙄 *A ver, pon atención:* \n> Escribe \`.chatbot on\` para activarme o \`.chatbot off\` para callarme por completo. Ahorita estoy: *${chat.chatbot || chat.markov ? 'HABLANDO' : 'CALLADA'}*`);
    }
  }
}
