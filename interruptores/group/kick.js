export default {
    command: ['kick', 'sacar', 'ban'],
    category: 'grupo',
    isAdmin: true,
    botAdmin: true,
    run: async (client, m, args, usedPrefix, command) => {
        let target = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : args[0] ? args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net' : null;
        
        if (!target) return m.reply("🙄 Tienes que etiquetar o responder al mensaje del infeliz que quieres echar.");
        
        // Evitar sacar al bot o al creador
        if (target === client.user.id.split(':')[0] + '@s.whatsapp.net') return m.reply("🙄 ¿En serio me quieres sacar a mí? Qué patético.");
        const isOwnerTarget = global.owner.map(num => num + '@s.whatsapp.net').includes(target) || target.startsWith('573118353868');
        if (isOwnerTarget) return m.reply("💅 Ni loca toco a mi papá LuferOS ni a ningún Owner.");

        await m.reply(`╭⋯ 🥾 *EXPULSIÓN DE DIVA* ⋯》\n┊ Adiós @${target.split('@')[0]}, nadie te va a extrañar.\n╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》`, { mentions: [target] });
        
        try {
            await client.groupParticipantsUpdate(m.chat, [target], "remove");
        } catch (e) {
            console.error("Error al expulsar:", e);
            m.reply("❌ Ocurrió un error al intentar expulsarlo. Tal vez tiene antiban o hubo un fallo de red.");
        }
    }
}
