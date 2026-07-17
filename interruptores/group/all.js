export default {
  command: ['all', 'todos', 'invocar'],
  category: 'group',
  run: async (client, m, args, usedPrefix, command) => {
    const groupMetadata = await client.groupMetadata(m.chat).catch(() => null);
    if (!groupMetadata) return client.reply(m.chat, '╭⋯ ❌ *LUMIBOT - SINTAXIS* ⋯》\n┊ Este comando solo se puede usar en grupos.\n╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》', m);

    const participants = groupMetadata.participants;
    const admins = participants.filter(p => p.admin === 'admin' || p.admin === 'superadmin').map(p => p.id);
    
    if (!admins.includes(m.sender)) {
      return client.reply(m.chat, '╭⋯ 🛑 *ACCESO DENEGADO* ⋯》\n┊ Solo los administradores pueden invocar a todos los miembros.\n╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》', m);
    }

    let text = args.join(' ') || '¡Atención a todos!';
    let mentions = [];
    let msg = `╭⋯ 📢 *INVOCACIÓN GENERAL* ⋯》\n┊ ⊳ *Mensaje:* ${text}\n┊┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈\n`;
    
    for (let participant of participants) {
      mentions.push(participant.id);
      msg += `┊ 👤 @${participant.id.split('@')[0]}\n`;
    }
    
    msg += `╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》`;
    
    await client.sendMessage(m.chat, { text: msg, mentions: mentions }, { quoted: m });
  }
};
