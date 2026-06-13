import os from 'os';

export default {
  name: "ping",
  alias: ["estado", "status", "telemetria"],
  category: "utilidad",
  desc: "Muestra la velocidad de reacción y estado del host.",
  run: async ({ sock, m, args }) => {
    const latencia = Date.now() - (m.messageTimestamp * 1000);
    
    // Cálculos de Memoria
    const freeMemory = os.freemem();
    const totalMemory = os.totalmem();
    const usedMemory = totalMemory - freeMemory;
    const usedGb = (usedMemory / 1024 / 1024 / 1024).toFixed(2);
    const totalGb = (totalMemory / 1024 / 1024 / 1024).toFixed(2);
    const ramPct = ((usedMemory / totalMemory) * 100).toFixed(1);

    const txt = `*🟢 TELEMETRÍA TÁCTICA*\n\n` +
      `*Reacción:* ${latencia} ms\n` +
      `*Plataforma:* ${os.platform()} ${os.arch()}\n` +
      `*RAM Uso:* ${usedGb} GB / ${totalGb} GB (${ramPct}%)\n` +
      `*Procesador:* ${os.cpus()[0].model.trim()}`;

    m.reply(txt);
  }
};
