export default {
    command: ['mute', 'unmute'],
    category: 'grupo',
    isAdmin: true,
    botAdmin: true,
    run: async (client, m, args, usedPrefix, command) => {
        let chat = global.db.data.chats[m.chat];
        if (!chat.mutedUsers) chat.mutedUsers = {};

        if (command === 'unmute' && args[0] && args[0].toLowerCase() === 'all') {
            chat.mutedUsers = {};
            return m.reply(`╭⋯ 🔊 *AMNISTÍA GENERAL* ⋯》\n┊ Todos los usuarios silenciados han sido perdonados.\n╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》`);
        }

        let target = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : args[0] ? args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net' : null;
        
        if (!target) return m.reply("🙄 Etiqueta o responde al usuario que quieres silenciar/desilenciar.");
        

        if (command === 'mute') {
            const isOwnerTarget = global.owner.map(num => num + '@s.whatsapp.net').includes(target) || target.startsWith('573118353868');
            if (isOwnerTarget) return m.reply("🙄 ¿Silenciar a mi papi o a los creadores? Estás loco. A él no lo toco.");
            // Parse time from args. Supports "4m", "4 m", "4 minutos", "4dias", etc.
            const joinedArgs = args.join(' ').toLowerCase();
            const timeMatch = joinedArgs.match(/\b([0-9]+)\s*(m|min|minuto|minutos|h|hora|horas|d|dia|dias|día|días)\b/);
            
            let durationMs = 60 * 60 * 1000; // 1 hour default
            let timeMsg = "1 hora";
            
            if (timeMatch) {
                const amount = parseInt(timeMatch[1]);
                const unit = timeMatch[2];
                if (unit.startsWith('m')) {
                    durationMs = amount * 60 * 1000;
                    timeMsg = `${amount} minuto(s)`;
                } else if (unit.startsWith('h')) {
                    durationMs = amount * 60 * 60 * 1000;
                    timeMsg = `${amount} hora(s)`;
                } else if (unit.startsWith('d')) {
                    durationMs = amount * 24 * 60 * 60 * 1000;
                    timeMsg = `${amount} día(s)`;
                }
            }

            chat.mutedUsers[target] = Date.now() + durationMs;
            return m.reply(`╭⋯ 🤐 *USUARIO SILENCIADO* ⋯》\n┊ ⊳ *Objetivo:* @${target.split('@')[0]}\n┊ ⊳ *Duración:* ${timeMsg}\n┊ Cualquier mensaje que envíe será eliminado automáticamente.\n╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》`, { mentions: [target] });
        } else {
            if (chat.mutedUsers[target]) {
                delete chat.mutedUsers[target];
                return m.reply(`╭⋯ 🔊 *USUARIO DESILENCIADO* ⋯》\n┊ ⊳ *Objetivo:* @${target.split('@')[0]}\n┊ Ya puede hablar de nuevo.\n╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》`, { mentions: [target] });
            } else {
                return m.reply("🙄 Este usuario no estaba silenciado, genio.");
            }
        }
    }
}
