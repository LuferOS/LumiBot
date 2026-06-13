export default {
  command: ['bot'],
  isAdmin: true,
  category: 'grupo',
  run: async (client, m, args, usedPrefix, command) => {
    const isBotAdmin = m.isGroup ? m.groupAdmins?.includes(client.user.id.split(':')[0] + '@s.whatsapp.net') : false;
    
    if (!args[0]) {
      return client.reply(m.chat, `🙄 *Literal necesitas decirme qué hacer* 💅\n\nTipo, usa:\n✨ *${usedPrefix}bot on* para despertarme\n💤 *${usedPrefix}bot off* para mandarme a dormir.`, m, global.miku);
    }
    
    const option = args[0].toLowerCase();
    
    if (option === 'on') {
      if (!global.db.data.chats[m.chat].isBanned) {
        return client.reply(m.chat, `🤡 *Amig@, ya estaba activa...* literal abre los ojos. 🙄`, m, global.miku);
      }
      global.db.data.chats[m.chat].isBanned = false;
      return client.reply(m.chat, `✨ *Ya reviví, perrxs* ✨\nA ver qué chismes me perdí. Ya estoy procesando comandos. 💅`, m, global.miku);
    } 
    else if (option === 'off') {
      if (global.db.data.chats[m.chat].isBanned) {
        return client.reply(m.chat, `🤡 *Literal ya estaba ignorándolos...* no me molestes. 🙄`, m, global.miku);
      }
      global.db.data.chats[m.chat].isBanned = true;
      return client.reply(m.chat, `💤 *Me fui a dormir, literal no me hablen* 💤\nSolo los Admins pueden despertarme con *${usedPrefix}bot on*. Besos, bye. 💅`, m, global.miku);
    } 
    else {
      return client.reply(m.chat, `🙄 *¿"${option}"?* Literal no hablo tu idioma. Usa *on* o *off*. 🤡`, m, global.miku);
    }
  }
};
