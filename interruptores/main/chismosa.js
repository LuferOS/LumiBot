export default {
    before: async (client, m, { client: conn }) => {
        if (!m.isGroup) return false;
        if (!m.text) return false;
        
        const body = m.text.toLowerCase();
        
        // 1. Detección de chismes (Gossip Network)
        // Palabras clave que denotan salseo/chisme
        const gossipKeywords = ['infiel', 'novio', 'novia', 'terminar', 'odio', 'secreto', 'mentira', 'engañó', 'beso', 'acostar', 'coger', 'embarazo', 'pack', 'nudes'];
        
        // Si el mensaje tiene palabras clave y es un poco largo, es un chisme potencial
        const isGossip = gossipKeywords.some(kw => body.includes(kw)) && m.text.length > 25;
        
        if (isGossip && global.sqlDb) {
            // Guardar en la DB de forma pasiva
            global.sqlDb.run(
                `INSERT INTO gossip (message, author, group_id, date) VALUES (?, ?, ?, ?)`,
                [m.text, m.pushName || 'Alguien', m.chat, new Date().toISOString()]
            );
        }
        
        // 2. Interrupciones Orgánicas (Celos / Sarcasmo de Diva)
        if ((body.includes('te amo') || body.includes('mi amor') || body.includes('te quiero mucho')) && !m.text.includes(client.user.id.split(':')[0])) {
            // Si su ánimo es bajo, hay probabilidad de que interrumpa y arruine el momento
            if (global.divaMood && global.divaMood <= 60 && Math.random() < 0.10) {
                setTimeout(async () => {
                    await m.reply(`🙄 Uy sí, mucho amor por aquí. A ver cuánto les dura el teatrito antes de que se bloqueen. 💅`);
                }, 2000);
            }
        }
        
        return false; // Retornar false para no bloquear la ejecución de otros comandos
    }
}
