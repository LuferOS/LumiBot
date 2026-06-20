export default {
    command: ['botban', 'unbanbot'],
    category: 'owner',
    run: async (client, m, args, usedPrefix, command) => {
        // Solo LuferOS
        if (!m.sender.startsWith('573118353868')) return m.reply("💅 Privilegio denegado. Solo mi creador LuferOS puede hacer esto.");

        let target = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : args[0] ? args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net' : null;
        
        if (!target) return m.reply("🙄 Etiqueta, responde al mensaje o escribe el número de la persona.");

        let user = global.db.data.users[target];
        if (!user) {
            global.db.data.users[target] = { banned: false };
            user = global.db.data.users[target];
        }

        if (command === 'botban') {
            user.banned = true;
            // Si el primer argumento es la persona, la razón es el resto
            let reason = m.quoted ? args.join(' ') : args.slice(1).join(' ');
            user.bannedReason = reason || 'Órden directa de LuferOS';
            return client.sendMessage(m.chat, { text: `╭⋯ 🛑 *USUARIO VETADO* ⋯》\n┊ El objetivo ha sido baneado permanentemente del sistema.\n┊ ⊳ *Target:* @${target.split('@')[0]}\n╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》`, mentions: [target] }, { quoted: m });
        } else {
            user.banned = false;
            user.bannedReason = '';
            return client.sendMessage(m.chat, { text: `╭⋯ ✨ *USUARIO PERDONADO* ⋯》\n┊ LuferOS te ha dado una segunda oportunidad. Aprovéchala.\n┊ ⊳ *Target:* @${target.split('@')[0]}\n╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》`, mentions: [target] }, { quoted: m });
        }
    }
}
