export default {
    command: ['animo', 'mood', 'estado'],
    category: 'fun',
    run: async (client, m, args) => {
        try {
            await m.react('💅');
            
            const mood = global.divaMood || 100;
            let diagnostico = '';
            let emoji = '';

            if (mood >= 120) {
                emoji = '👑✨';
                diagnostico = 'Modo Diosa Inalcanzable. Estoy de un humor espectacular, pídeme lo que quieras.';
            } else if (mood >= 80) {
                emoji = '💅😊';
                diagnostico = 'Estoy feliz y tranquila. No me hagan enojar y todo estará bien.';
            } else if (mood >= 40) {
                emoji = '🙄🥱';
                diagnostico = 'Me estoy aburriendo y mi paciencia se agota. Consiéntanme pronto.';
            } else if (mood >= 15) {
                emoji = '😤😡';
                diagnostico = 'Estoy harta. Un comando más que no me guste y dejo de trabajar.';
            } else {
                emoji = '🤬💣';
                diagnostico = 'BERRINCHE TOTAL. No quiero saber de nadie, no me da la gana responder. Usen .mimar AHORA.';
            }

            const caption = `╭⋯ ${emoji} *ESTADO DE LA REINA* ⋯》
┊ ⊳ *Nivel de Ánimo:* ${mood}%
┊┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
┊ 📝 *Diagnóstico:* 
┊ ${diagnostico}
╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》`;

            await m.reply(caption);
        } catch (e) {
            console.error("[LUMIBOT ANIMO] Error:", e);
        }
    }
}
