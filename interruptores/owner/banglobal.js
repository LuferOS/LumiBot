export default {
    command: ['banglobal', 'gban', 'globalban'],
    category: 'owner',
    isOwner: true,
    run: async (client, m, args, usedPrefix, command) => {
        // Solo LuferOS
        if (!m.sender.startsWith('573118353868')) {
            return m.reply("💅 Privilegio denegado. Solo mi creador LuferOS puede ejecutar esto.");
        }

        let textNumber = args.join('').replace(/[^0-9]/g, '');
        let target = m.quoted ? m.quoted.sender : m.mentions && m.mentions.length > 0 ? m.mentions[0] : textNumber.length > 5 ? textNumber + '@s.whatsapp.net' : null;

        if (!target) {
            return m.reply(`🙄 Etiqueta, responde a un mensaje, o escribe el número de la persona que quieres eliminar de TODOS mis grupos.\n\n> Ejemplo: ${usedPrefix}banglobal @usuario`);
        }

        if (target.startsWith('573118353868')) {
            return m.reply("🙄 No puedo banearte a ti mismo, genio.");
        }
        
        let botJid = client.user.id.split(':')[0] + '@s.whatsapp.net';
        if (client.decodeJid) botJid = client.decodeJid(client.user.id);
        
        if (target === botJid) {
            return m.reply("🙄 No me voy a auto-eliminar.");
        }

        await m.reply(`╭⋯ 🚨 *INICIANDO PURGA GLOBAL* ⋯》\n┊ ⊳ *Objetivo:* @${target.split('@')[0]}\n┊ ⊳ Buscando en todos los servidores...\n╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》`, { mentions: [target] });

        let groups;
        try {
            groups = await client.groupFetchAllParticipating();
        } catch (e) {
            return m.reply(`❌ Ocurrió un error al obtener la lista de grupos.`);
        }
        
        let kicks = 0;
        let errors = 0;
        let found = 0;

        for (let id in groups) {
            let group = groups[id];
            let participants = group.participants || [];
            let isUserInGroup = participants.some(p => p.id === target);
            
            if (isUserInGroup) {
                found++;
                let botInfo = participants.find(p => p.id === botJid);
                let isBotAdmin = botInfo?.admin === 'admin' || botInfo?.admin === 'superadmin';
                let isBotSuperAdmin = botInfo?.admin === 'superadmin';
                
                let targetInfo = participants.find(p => p.id === target);
                let isTargetAdmin = targetInfo?.admin === 'admin' || targetInfo?.admin === 'superadmin';
                
                // Si el bot es admin y (el objetivo no es admin O el bot es superadmin)
                if (isBotAdmin && (!isTargetAdmin || isBotSuperAdmin)) {
                    try {
                        // ⚡ LUMIBOT OVERRIDE: Eliminación implacable
                        await client.groupParticipantsUpdate(id, [target], 'remove');
                        kicks++;
                        await new Promise(r => setTimeout(r, 1500)); // Pausa de 1.5s para no saturar WhatsApp
                    } catch (e) {
                        errors++;
                    }
                } else {
                    errors++; // Cuenta como error si el bot no es admin, o si el objetivo es admin y el bot no es superadmin
                }
            }
        }

        let resultMsg = `╭⋯ ✅ *PURGA GLOBAL COMPLETADA* ⋯》\n`;
        resultMsg += `┊ ⊳ *Objetivo Neutralizado:* @${target.split('@')[0]}\n`;
        resultMsg += `┊┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈\n`;
        resultMsg += `┊ 📊 *ESTADÍSTICAS:*\n`;
        resultMsg += `┊ ⊳ Grupos donde estaba: ${found}\n`;
        resultMsg += `┊ ⊳ Expulsiones exitosas: ${kicks}\n`;
        resultMsg += `┊ ⊳ Fallos (No soy admin): ${errors}\n`;
        resultMsg += `╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》`;

        await client.sendMessage(m.chat, { text: resultMsg, mentions: [target] }, { quoted: m });
    }
}
