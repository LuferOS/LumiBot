import os from 'os';
import { performance } from 'perf_hooks';
import fetch from 'node-fetch';
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
        pingApi('https://bot.lyo.su/')
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

    const txt = `*🟢 ESTADO DE LA QUEEN*\n\n` +
      `*Reacción Interna:* ${execTime} ms\n` +
      `*Desfase de Reloj:* ${clockDrift}\n` +
      `*API Causas:* ${pingCausas}\n` +
      `*API AlyaCore:* ${pingAlya}\n` +
      `*API Stickers:* ${pingLyo}\n\n` +
      `*Plataforma:* ${os.platform()} ${os.arch()}\n` +
      `*RAM Uso:* ${usedGb} GB / ${totalGb} GB (${ramPct}%)\n` +
      `*Procesador:* ${os.cpus()[0].model.trim()}\n` +
      `*Uptime Sistema:* ${sysUptime}\n` +
      `*Uptime LumiBot:* ${botUptime}`;

    await m.reply(txt);
    await m.react('✅');
  }
};
