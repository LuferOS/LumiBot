import { getAllCoins } from '../../nucleo/coinsDB.js';

export default {
    command: ['topcoins', 'coinlb', 'lbcoins'],
    category: 'games',
    run: async (client, m, args, usedPrefix) => {
        try {
            const allCoins = getAllCoins();
            const dbUsers = global.db?.data?.users || {};
            
            // Filtrar y ordenar
            const top = Object.entries(allCoins)
                .filter(([jid, coins]) => typeof coins === 'number' && coins > 0)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 10);
            
            if (top.length === 0) {
                return client.reply(m.chat, '🙄 *Aún nadie tiene Coins en la base de datos.*', m);
            }
            
            let topText = `╭⋯ 🏆 *TOP COINIX MILLONARIOS* ⋯》\n┊\n`;
            
            for (let i = 0; i < top.length; i++) {
                const [jid, coins] = top[i];
                const cleanJid = jid.split('@')[0];
                const userName = dbUsers[jid]?.name || 'Usuario';
                
                let medal = '🏅';
                if (i === 0) medal = '🥇';
                if (i === 1) medal = '🥈';
                if (i === 2) medal = '🥉';
                
                topText += `┊ ${medal} *#${i + 1}* - @${cleanJid}\n┊ 🪙 Coins: *${coins.toLocaleString()}*\n┊\n`;
            }
            
            topText += `╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》`;
            
            await client.sendMessage(m.chat, { 
                text: topText, 
                mentions: top.map(t => t[0]) 
            }, { quoted: m });
            
        } catch (e) {
            console.error('[TOPCOINS] Error:', e);
            client.reply(m.chat, 'Ocurrió un error al cargar el top de coins.', m);
        }
    }
};
