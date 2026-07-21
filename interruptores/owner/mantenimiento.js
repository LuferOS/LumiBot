export default {
    command: ['mantenimiento', 'mante'],
    category: 'owner',
    isOwner: true,
    run: async (client, m, args, usedPrefix, command) => {
        try {
            if (!global.db?.data?.settings) {
                global.db.data.settings = {};
            }
            
            const currentState = global.db.data.settings.mantenimiento || false;
            const newState = !currentState;
            global.db.data.settings.mantenimiento = newState;
            
            if (newState) {
                await client.reply(m.chat, `╭⋯ 🛠️ *MANTENIMIENTO ACTIVADO* ⋯》\n┊ El bot ahora está en modo mantenimiento.\n┊ Solo los dueños (LuferOS) podrán usar comandos.\n╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》`, m);
            } else {
                await client.reply(m.chat, `╭⋯ ✨ *MANTENIMIENTO DESACTIVADO* ⋯》\n┊ El bot vuelve a estar operativo para todos los usuarios.\n╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》`, m);
            }
        } catch (e) {
            console.error('[LUMIBOT DEBUG] Error en comando mantenimiento:', e);
            await m.reply('Hubo un error al cambiar el estado de mantenimiento.');
        }
    }
};
