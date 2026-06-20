export default {
    command: ['chisme', 'chismesito', 'spillthetea'],
    category: 'fun',
    run: async (client, m, args) => {
        try {
            await m.react('☕');
            
            if (!global.sqlDb) {
                return m.reply("🙄 Uy, mi libreta de chismes está cerrada por mantenimiento (No SQL).");
            }

            // Seleccionar un chisme aleatorio
            global.sqlDb.get(`SELECT message, author, group_id, date FROM gossip ORDER BY RANDOM() LIMIT 1`, async (err, row) => {
                if (err) {
                    console.error("[LUMIBOT CHISME] Error leyendo DB:", err);
                    return m.reply("❌ Ups, se me cayó el té. Error al buscar chismes.");
                }

                if (!row) {
                    return m.reply("🙄 Qué aburrido, no tengo ningún chisme guardado todavía. Pónganse a pelear o a confesar cosas para que yo anote. 💅");
                }

                // Darle algo de anonimato para que sea más salseante
                // Si el chisme es del mismo grupo, decir "Alguien aquí mismo..."
                const fromHere = row.group_id === m.chat;
                const authorHint = fromHere ? "Alguien de este grupo" : "Una ovejita de otro rebaño";
                
                const caption = `╭⋯ ☕ *LA REINA DEL CHISME* ⋯》
┊ ⊳ *Fuente:* ${authorHint}
┊ ⊳ *Fecha de captura:* ${new Date(row.date).toLocaleDateString()}
┊┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
┊ 💬 *El Chisme:*
┊ "${row.message}"
╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》
> 💅 *Nota de Diva:* Yo no me meto, solo expongo los hechos.`;

                await m.reply(caption);
                await m.react('✔️');
            });
            
        } catch (e) {
            console.error("[LUMIBOT CHISME] Error:", e);
            m.reply("❌ Error en el sistema de chismes.");
        }
    }
}
