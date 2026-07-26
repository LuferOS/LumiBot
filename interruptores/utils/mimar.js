export default {
    command: ['mimar', 'regalar', 'rogar'],
    category: 'fun',
    run: async (client, m, args) => {
        try {
            if (!global.sqlDb) {
                return m.reply("🙄 No puedo recibir regalos ahorita, mis bolsillos SQL están cerrados.");
            }

            const gifts = [
                { name: 'un iPhone 18 Pro Max de Oro', boost: 20, inter: 'happy' },
                { name: 'un Café de Starbucks súper caro', boost: 5, inter: 'coffee' },
                { name: 'una Tarjeta Negra sin límite', boost: 50, inter: 'smug' },
                { name: 'un viaje a París todo pagado', boost: 30, inter: 'love' },
                { name: 'una Rosa marchita (qué tacaño)', boost: -10, inter: 'angry' },
                { name: 'Zapatos Gucci edición limitada', boost: 15, inter: 'happy' }
            ];

            const gift = gifts[Math.floor(Math.random() * gifts.length)];
            
            // Proteger al creador
            const isOwnerSender = global.owner.map(num => num + '@s.whatsapp.net').includes(m.sender) || m.sender.startsWith('573118353868');
            
            // Si el owner manda regalo, siempre sube mucho
            if (isOwnerSender && gift.boost < 0) {
                gift.boost = 40;
                gift.name = 'el regalo más precioso del universo porque viene de él';
                gift.inter = 'blush';
            }

            global.divaMood = (global.divaMood || 100) + gift.boost;
            if (global.divaMood > 150) global.divaMood = 150; // Cap at 150%
            
            // Guardar en DB
            global.sqlDb.run(`UPDATE bot_state SET value = ? WHERE key = 'divaMood'`, [global.divaMood]);

            let reaccionText = '';
            if (gift.boost < 0) {
                reaccionText = `🙄 ¿En serio me regalas esto? Qué ofensa. Mi ánimo acaba de bajar.`;
            } else if (gift.boost >= 30) {
                reaccionText = `💅 ¡AHHH ME ENCANTA! Mi nivel de diva está por las nubes.`;
            } else {
                reaccionText = `✨ Bueno, lo acepto. Mi ánimo mejoró un poquito. Gracias supongo.`;
            }

            const caption = `╭⋯ 🛍️ *MIMANDO A LA DIVA* ⋯》
┊ ⊳ *@${m.sender.split('@')[0]}* me acaba de regalar ${gift.name}.
┊┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
┊ 📝 *Reacción:* 
┊ ${reaccionText}
┊
┊ 📊 *Ánimo actual:* ${global.divaMood}%
╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》`;

            await m.reply(caption, { mentions: [m.sender] });

        } catch (e) {
            console.error("[LUMIBOT MIMAR] Error:", e);
            await m.reply("❌ Ocurrió un error intentando darme el regalo.");
        }
    }
}
