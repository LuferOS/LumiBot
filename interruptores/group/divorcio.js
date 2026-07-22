export default {
    command: ['divorcio', 'divorciarse'],
    category: 'grupo',
    run: async (client, m, args) => {
        if (!m.isGroup) return m.reply("🙄 Esto es para grupos, amigo.");
        if (!global.sqlDb) return m.reply("❌ Error 404: El registro civil está caído.");

        global.sqlDb.get(`SELECT * FROM marriages WHERE user1 = ? OR user2 = ?`, [m.sender, m.sender], (err, row) => {
            if (err) return m.reply("❌ Error consultando el registro civil.");
            if (!row) {
                if (global.db.data.users[m.sender] && global.db.data.users[m.sender].marry) {
                    const exSpouse = global.db.data.users[m.sender].marry;
                    global.db.data.users[m.sender].marry = '';
                    if (global.db.data.users[exSpouse]) global.db.data.users[exSpouse].marry = '';
                    return m.reply("🤡 Jajaja, tu matrimonio estaba tan bugueado en el registro civil que lo anulé a la fuerza. ¡Ya eres libre!");
                }
                return m.reply("🤡 Jajaja, ¡pero si no estás casado con nadie! Qué ridículo. Primero consíguete a alguien.");
            }

            const exSpouse = row.user1 === m.sender ? row.user2 : row.user1;

            global.sqlDb.run(`DELETE FROM marriages WHERE (user1 = ? AND user2 = ?) OR (user1 = ? AND user2 = ?)`, [row.user1, row.user2, row.user2, row.user1], async (err2) => {
                if (err2) return m.reply("❌ Error firmando los papeles de divorcio.");

                if (global.db.data.users[m.sender]) global.db.data.users[m.sender].marry = '';
                if (global.db.data.users[exSpouse]) global.db.data.users[exSpouse].marry = '';

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
