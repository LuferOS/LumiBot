export default {
    before: async (client, m, { client: conn }) => {
        if (!m.isGroup) return false;
        if (!m.text) return false;
        if (!global.sqlDb) return false;
        
        let body = m.text.trim();
        let prefixMatch = body.match(/^[°•π÷×¶∆£¢€¥®™+✓_=|~!?@#$%^&.©^]/);
        if (!prefixMatch) return false;

        let usedPrefix = prefixMatch[0];
        let args = body.slice(usedPrefix.length).trim().split(" ");
        let command = (args.shift() || '').toLowerCase();
        
        const romanticCommands = ['beso', 'tocar', 'lamer', 'coger', 'follar', 'ship', 'amor', 'compatibilidad', 'calor', 'horny', 'pito', 'grande'];
        
        if (!romanticCommands.includes(command)) return false;

        const target = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : (m.quoted ? m.quoted.sender : null);
        if (!target) return false; // Si no hay target, no hay infidelidad comprobable
        
        // Owner immunity
        const isOwnerTarget = global.owner.map(num => num + '@s.whatsapp.net').includes(target) || target.startsWith('573118353868');
        const isOwnerSender = global.owner.map(num => num + '@s.whatsapp.net').includes(m.sender) || m.sender.startsWith('573118353868');
        
        if (isOwnerTarget || isOwnerSender) return false; // Los dioses no son juzgados
        if (target === m.sender) return false; // Amor propio no es cuerno
        if (target === client.user.id.split(':')[0] + '@s.whatsapp.net') return false; // Acostarse con la bot no cuenta como cuerno xd

        return new Promise((resolve) => {
            // Revisar si el sender está casado
            global.sqlDb.get(`SELECT * FROM marriages WHERE user1 = ? OR user2 = ?`, [m.sender, m.sender], async (err, row) => {
                if (err || !row) return resolve(false); // No está casado, todo legal.

                const spouse = row.user1 === m.sender ? row.user2 : row.user1;

                if (target !== spouse) {
                    // ¡INFIDELIDAD DETECTADA!
                    
                    // Sumar un punto en infiel_stats
                    global.sqlDb.run(
                        `INSERT INTO infiel_stats (jid, points) VALUES (?, 1) ON CONFLICT(jid) DO UPDATE SET points = points + 1`,
                        [m.sender]
                    );

                    const caption = `🚨 *¡LA POLICÍA TÓXICA HA LLEGADO!* 🚨
┊
┊ ¡ESCÁNDALO! @${m.sender.split('@')[0]} (que está felizmente casado/a) intentó usar el comando *${command}* con @${target.split('@')[0]}.
┊
┊ ¡Venga a recoger a su basura infiel, @${spouse.split('@')[0]}!
┊ Esto cuenta como +1 punto en la tabla de infieles. Qué asco de persona. 💅`;

                    await client.sendMessage(m.chat, { text: caption, mentions: [m.sender, target, spouse] }, { quoted: m });
                    
                    // Retornar true para BLOQUEAR el comando original
                    return resolve(true); 
                }

                // Está interactuando con su esposo/a, está permitido.
                resolve(false);
            });
        });
    }
}
