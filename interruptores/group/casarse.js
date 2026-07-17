export default {
    command: ['casarse', 'proponer'],
    category: 'grupo',
    run: async (client, m, args) => {
        if (!m.isGroup) return m.reply("🙄 Las bodas se hacen en público (grupos), no a escondidas.");

        const target = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : (m.quoted ? m.quoted.sender : null);
        
        if (!target) return m.reply("🙄 Etiqueta o responde al mensaje del pobrecito con el que te quieres casar.");
        if (target === m.sender) return m.reply("🤡 Jajaja, nivel de soledad extremo. No te puedes casar contigo mismo.");
        if (target === client.user.id.split(':')[0] + '@s.whatsapp.net') return m.reply("💅 Mi corazón solo le pertenece a mi creador LuferOS. Busca a alguien de tu nivel.");

        if (!global.sqlDb) return m.reply("❌ Error 404: El registro civil está caído.");

        // Check if either is already married
        global.sqlDb.get(`SELECT * FROM marriages WHERE user1 = ? OR user2 = ? OR user1 = ? OR user2 = ?`, [m.sender, m.sender, target, target], (err, row) => {
            if (err) return m.reply("❌ Error consultando el registro civil.");
            
            if (row) {
                if ((row.user1 === m.sender && row.user2 === target) || (row.user1 === target && row.user2 === m.sender)) {
                    return m.reply("🙄 Ridículos, ya están casados. Dejen el show.");
                }
                const senderMarried = row.user1 === m.sender || row.user2 === m.sender;
                if (senderMarried) {
                    return m.reply("🚨 ¡ESCÁNDALO! Estás intentando casarte pero ya tienes esposo/a. ¿Eres polígamo o qué? Primero divórciate. 💅");
                } else {
                    return m.reply("🤡 Ese/a ya tiene dueño/a. Búscate alguien soltero, no seas rompehogares.");
                }
            }

            // Init proposals
            if (!global.proposals) global.proposals = {};

            // Check if there is a pending proposal from target to sender
            if (global.proposals[m.sender] === target) {
                // Se casan!
                global.sqlDb.run(`INSERT INTO marriages (user1, user2, date, group_id) VALUES (?, ?, ?, ?)`, [m.sender, target, new Date().toISOString(), m.chat], async (err2) => {
                    if (err2) return m.reply("❌ Error en la boda.");
                    
                    delete global.proposals[m.sender];
                    
                    const caption = `╭⋯ 💍 *NUEVO MATRIMONIO* ⋯》
┊ ⊳ ¡Felicidades! @${m.sender.split('@')[0]} y @${target.split('@')[0]} se acaban de casar oficialmente.
┊┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
┊ 📝 *Nota de Diva:* 
┊ Más les vale ser fieles, porque si los cacho usando comandos con otros, los voy a funar públicamente. Están advertidos. 💅
╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》`;
                    
                    await client.sendMessage(m.chat, { text: caption, mentions: [m.sender, target] }, { quoted: m });
                });
            } else {
                // Proposal created
                global.proposals[target] = m.sender;
                
                const caption = `╭⋯ 💍 *PROPUESTA DE MATRIMONIO* ⋯》
┊ ⊳ @${m.sender.split('@')[0]} le acaba de proponer matrimonio a @${target.split('@')[0]}.
┊┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
┊ 📝 @${target.split('@')[0]}, para aceptar, simplemente responde a este mensaje o escribe *.casarse @${m.sender.split('@')[0]}*.
╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》`;
                
                client.sendMessage(m.chat, { text: caption, mentions: [m.sender, target] }, { quoted: m });
            }
        });
    }
}
