export default {
    command: ['bangroup', 'unbangroup'],
    category: 'owner',
    run: async (client, m, args, usedPrefix, command) => {
        // Solo LuferOS
        if (!m.sender.startsWith('573118353868')) return m.reply("💅 Privilegio denegado. Solo mi creador LuferOS puede ejecutar esto.");

        let target = m.isGroup ? m.chat : args[0];
        if (!target) return m.reply("🙄 Tienes que estar en el grupo o pasar el ID del grupo.");

        let chat = global.db.data.chats[target];
        if (!chat) {
            global.db.data.chats[target] = { isBanned: false, bannedByOwner: false };
            chat = global.db.data.chats[target];
        }

        if (command === 'bangroup') {
            chat.bannedByOwner = true;
            return m.reply(`╭⋯ 🛑 *GRUPO VETADO* ⋯》\n┊ LuferOS ha desconectado permanentemente este grupo.\n┊ Ningún Admin puede encenderme aquí jamás.\n╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》`);
        } else {
            chat.bannedByOwner = false;
            return m.reply(`╭⋯ ✨ *GRUPO PERDONADO* ⋯》\n┊ LuferOS ha restaurado mis funciones en este grupo.\n┊ Sean agradecidos.\n╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》`);
        }
    }
}
