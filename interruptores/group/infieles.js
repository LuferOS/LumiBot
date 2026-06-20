export default {
    command: ['infieles', 'topinfieles', 'cuernos'],
    category: 'grupo',
    run: async (client, m, args) => {
        if (!m.isGroup) return m.reply("🙄 Esto es para grupos.");
        if (!global.sqlDb) return m.reply("❌ Error 404: El registro civil está caído.");

        global.sqlDb.all(`SELECT jid, points FROM infiel_stats ORDER BY points DESC LIMIT 10`, (err, rows) => {
            if (err) return m.reply("❌ Error consultando el archivo de la vergüenza.");
            
            if (!rows || rows.length === 0) {
                return m.reply("😇 Increíble, pero cierto: Nadie ha sido infiel (o al menos yo no los he cachado todavía). Todos son unos santos. 💅");
            }

            let text = `╭⋯ 🚨 *TOP INFIELES DEL BARRIO* 🚨 ⋯》\n┊ Estos son los que más cuernos han puesto. Dejen de ser tan tóxicos, qué asco.\n┊┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈\n`;
            
            rows.forEach((row, i) => {
                const jid = row.jid.split('@')[0];
                let emoji = i === 0 ? '👑🐃' : (i === 1 ? '🥈🐃' : (i === 2 ? '🥉🐃' : '🐃'));
                text += `┊ ${emoji} ${i+1}. @${jid} - ${row.points} cuernos.\n`;
            });

            text += `╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》\n> 💅 La policía tóxica los vigila.`;

            const mentions = rows.map(r => r.jid);

            client.sendMessage(m.chat, { text, mentions }, { quoted: m });
        });
    }
}
