import fetch from 'node-fetch';
import os from 'os';
import { performance } from 'perf_hooks';
import fs from 'fs';
import path from 'path';

export default {
  command: ['ping'],
  category: 'info',
  run: async (client, m) => {
    const startResp = performance.now();
    const botId = client.user?.id?.split(':')[0] + "@s.whatsapp.net";
    const namebot = global.db?.data?.settings?.[botId]?.namebot || 'LumiBot';
    
    const sent = await client.sendMessage(m.chat, { text: '🙄 `midiendo, literal espérate un rato...` 💅' }, { quoted: m });
    const netLatency = (performance.now() - startResp).toFixed(2);
    
    // Latencia con APIs
    const startApi = performance.now();
    try {
        await fetch('https://api.alyacore.xyz', { timeout: 3000 });
    } catch (e) {}
    const apiLatency = (performance.now() - startApi).toFixed(2);

    // Velocidad de lectura (File I/O Test)
    const startRead = performance.now();
    const tempFile = path.join(process.cwd(), 'temp_ping.txt');
    try {
      fs.writeFileSync(tempFile, 'test');
      fs.readFileSync(tempFile);
      fs.unlinkSync(tempFile);
    } catch (e) {}
    const readSpeed = (performance.now() - startRead).toFixed(2);

    const txt = `✨ *B R U H...* ✨\n\n` +
                `📡 *Latencia de Red:* \`${netLatency} ms\`\n` +
                `🌐 *Latencia API:* \`${apiLatency} ms\`\n` +
                `💾 *Velocidad de Lectura:* \`${readSpeed} ms\``;

    await client.sendMessage(m.chat, { text: txt, edit: sent.key });
  },
};
