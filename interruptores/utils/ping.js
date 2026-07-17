import os from 'os';
import { performance } from 'perf_hooks';
import fetch from 'node-fetch';
import { pingQuoteApis } from './quote_api.js';
export default {
  command: ["ping", "telemetria"],
  category: "utilidad",
  desc: "Muestra la velocidad de reacción y estado del host.",
  run: async (sock, m, args) => {
    const processStart = performance.now();
    const diff = Date.now() - (m.messageTimestamp * 1000);
    const clockDrift = diff < 0 ? `${Math.abs(diff)} ms` : `-${diff} ms`;

    async function pingApi(url) {
        try {
            const start = performance.now();
            await fetch(url, { timeout: 3000 });
            const end = performance.now();
            return (end - start).toFixed(0) + ' ms';
        } catch (e) {
            return 'Inalcanzable ❌';
        }
    }

    const execTime = (performance.now() - processStart).toFixed(2);
    
    await m.react('⏳');
    
    const [pingCausas, pingAlya, pingLyo] = await Promise.all([
        pingApi('https://rest.apicausas.xyz/'),
        pingApi('https://api.alyacore.xyz/'),
        pingQuoteApis()
    ]);
    
    // Cálculos de Memoria
    const freeMemory = os.freemem();
    const totalMemory = os.totalmem();
    const usedMemory = totalMemory - freeMemory;
    const usedGb = (usedMemory / 1024 / 1024 / 1024).toFixed(2);
    const totalGb = (totalMemory / 1024 / 1024 / 1024).toFixed(2);
    const ramPct = ((usedMemory / totalMemory) * 100).toFixed(1);

    // Cálculos de Uptime
    const formatUptime = (seconds) => {
        const d = Math.floor(seconds / (3600 * 24));
        const h = Math.floor((seconds % (3600 * 24)) / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = Math.floor(seconds % 60);
        return `${d > 0 ? d + 'd ' : ''}${h > 0 ? h + 'h ' : ''}${m > 0 ? m + 'm ' : ''}${s}s`;
    };
    
    const sysUptime = formatUptime(os.uptime());
    const botUptime = formatUptime(process.uptime());

      const ramEstado = ramPct < 80 ? '🟢 Óptimo' : (ramPct < 90 ? '🟡 Advertencia' : '🔴 Crítico');
      const sysEstado = execTime < 1000 ? '🟢 En línea' : '🔴 En problemas';
      const latencia = execTime < 500 ? '🟢 Excelente' : (execTime < 1000 ? '🟡 Aceptable' : '🔴 Malo');

      const txt = `⚡ 𝐑𝐄𝐒𝐔𝐋𝐓𝐀𝐃𝐎 𝐃𝐄 𝐋𝐀 𝐏𝐑𝐔𝐄𝐁𝐀 ⚡\n\n` +
                  `╭━━〔 𝐋𝐔𝐌𝐈𝐁𝐎𝐓 𝐒𝐘𝐒𝐓𝐄𝐌 〕━━⬣\n` +
                  `┃ ⚡ 𝐕𝐞𝐥𝐨𝐜𝐢𝐝𝐚𝐝 𝐝𝐞𝐥 𝐁𝐨𝐭: ${execTime}ms\n` +
                  `┃ 📶 𝐋𝐚𝐭𝐞𝐧𝐜𝐢𝐚: ${latencia}\n` +
                  `┃ 📊 𝐑𝐀𝐌 (𝐔𝐬𝐨): ${usedGb} GB / ${totalGb} GB (${ramPct}%)\n` +
                  `┃ 📈 𝐄𝐬𝐭𝐚𝐝𝐨 𝐑𝐀𝐌: ${ramEstado}\n` +
                  `┃ 💻 𝐔𝐩𝐭𝐢𝐦𝐞 𝐁𝐨𝐭: ${botUptime}\n` +
                  `┃ 🌐 𝐔𝐩𝐭𝐢𝐦𝐞 𝐒𝐲𝐬: ${sysUptime}\n` +
                  `┃ 🔥 𝐒𝐢𝐬𝐭𝐞𝐦𝐚: ${sysEstado}\n` +
                  `╰━━━━━━━━━━━━━━━━⬣`;

      try {
        await client.sendMessage(m.chat, { 
          video: { url: 'https://i.pinimg.com/originals/5b/b2/d1/5bb2d1601a93b22cf3c9cf1c2c317d74.gif' }, 
          caption: txt, 
          gifPlayback: true 
        }, { quoted: m });
      } catch (e) {
        await client.sendMessage(m.chat, { text: txt }, { quoted: m });
      }
    await m.react('✅');
  }
};
