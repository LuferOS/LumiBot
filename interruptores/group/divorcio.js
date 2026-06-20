export default {
    command: ['divorcio', 'divorciarse'],
    category: 'grupo',
    run: async (client, m, args) => {
        if (!m.isGroup) return m.reply("🙄 Esto es para grupos, amigo.");
        if (!global.sqlDb) return m.reply("❌ Error 404: El registro civil está caído.");

        global.sqlDb.get(`SELECT * FROM marriages WHERE user1 = ? OR user2 = ?`, [m.sender, m.sender], (err, row) => {
            if (err) return m.reply("❌ Error consultando el registro civil.");
            if (!row) return m.reply("🤡 Jajaja, ¡pero si no estás casado con nadie! Qué ridículo. Primero consíguete a alguien.");

            const exSpouse = row.user1 === m.sender ? row.user2 : row.user1;

            global.sqlDb.run(`DELETE FROM marriages WHERE (user1 = ? AND user2 = ?) OR (user1 = ? AND user2 = ?)`, [row.user1, row.user2, row.user2, row.user1], async (err2) => {
                if (err2) return m.reply("❌ Error firmando los papeles de divorcio.");

                const caption = `╭⋯ 💔 *DIVORCIO OFICIAL* ⋯》
┊ ⊳ @${m.sender.split('@')[0]} se acaba de divorciar de @${exSpouse.split('@')[0]}.
┊┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
┊ 📝 *Nota de Diva:* 
┊ Se veía venir, la verdad. Ahora que están solteros de nuevo, cuidado con andar de tóxicos. 💅
╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》`;

                await client.sendMessage(m.chat, { text: caption, mentions: [m.sender, exSpouse] }, { quoted: m });
            });
        });
    }
}
