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
      db.chats[m.chat] = chat;
      return m.reply('💅 ✨ *MODO DIVA ACTIVADO* ✨ 💅\n> Ahora sí, prepárense que voy a opinar en todo este chisme.');
    } else if (cmd === 'off') {
      chat.chatbot = false;
      db.chats[m.chat] = chat;
      return m.reply('💅 ✨ *MODO DIVA DESACTIVADO* ✨ 💅\n> Me voy a hacer la manicure, me avisan si pasa algo interesante.');
    } else {
      return m.reply(`🙄 *A ver, pon atención:* \n> Escribe \`.chatbot on\` para activarme o \`.chatbot off\` para callarme. Ahorita estoy: *${chat.chatbot ? 'HABLANDO' : 'CALLADA'}*`);
    }
  }
}
