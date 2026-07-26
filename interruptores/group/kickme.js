export default {
    command: ['kickme', 'autokick', 'salir'],
    category: 'grupo',
    run: async (client, m, args, usedPrefix, command) => {
        if (!m.isGroup) {
            return client.reply(m.chat, "🙄 Este comando solo se puede usar en grupos.", m);
        }

        const groupMetadata = await client.groupMetadata(m.chat);
        const participants = groupMetadata.participants;
        const botJid = client.decodeJid ? client.decodeJid(client.user.id) : (client.user.id.includes(':') ? client.user.id.split(':')[0] + '@s.whatsapp.net' : client.user.id);
        const botInfo = participants.find(p => p.id === botJid);
        const isBotAdmin = botInfo?.admin === 'admin' || botInfo?.admin === 'superadmin';

        if (!isBotAdmin) {
            return client.reply(m.chat, "╭⋯ ⚠️ *PERMISOS INSUFICIENTES* ⋯》\n┊ No puedo expulsarte si no me dan rango de Administrador primero.\n╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》", m);
        }

        const ownerNumbers = global.owner.map(num => num + '@s.whatsapp.net') || [];
        if (ownerNumbers.includes(m.sender) || m.sender.startsWith('573118353868')) {
            return client.reply(m.chat, "💅 Tú eres mi creador, no te voy a expulsar. Sal tú mismo si quieres.", m);
        }

        const senderInfo = participants.find(p => p.id === m.sender);
        const isSenderAdmin = senderInfo?.admin === 'admin' || senderInfo?.admin === 'superadmin';
        const isBotSuperAdmin = botInfo?.admin === 'superadmin';

        if (isSenderAdmin && !isBotSuperAdmin) {
            return client.reply(m.chat, "🙄 Eres Administrador del grupo. WhatsApp no me permite expulsar a otros Admins. Quítate el rango primero o salte por tu cuenta.", m);
        }

        await client.reply(m.chat, "╭⋯ 👋 *HASTA LA VISTA* ⋯》\n┊ A petición propia, procedo a darte de baja.\n┊ ¡Suerte en la vida!\n╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》", m);
        
        // Pausa breve para que el mensaje se envíe antes de expulsar
        setTimeout(async () => {
            try {
                await client.groupParticipantsUpdate(m.chat, [m.sender], 'remove');
            } catch (e) {
                console.error("[LUMIBOT DEBUG] Error al ejecutar kickme:", e);
            }
        }, 1500);
    }
};
