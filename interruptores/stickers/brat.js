import axios from 'axios';
import fs from 'fs';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const fetchSticker = async (text, attempt = 1) => {
  try {
    const response = await axios.get(`https://skyzxu-brat.hf.space/brat`, { params: { text }, responseType: 'arraybuffer' });
    return response.data;
  } catch (error) {
    if (error.response?.status === 429 && attempt <= 3) {
      const retryAfter = error.response.headers['retry-after'] || 5;
      await delay(retryAfter * 1000);
      return fetchSticker(text, attempt + 1);
    }
    throw error;
  }
};

export default {
  command: ['brat'],
  category: 'stickers',
  run: async (client, m, args, usedPrefix, command, text) => {
    try {
      text = m.quoted?.text || text;
      if (!text) {
        return client.reply(m.chat, `╭⋯ ❌ *LUMIBOT - SINTAXIS* ⋯》\n┊ Ingresa texto o responde a un mensaje para generar el sticker.\n╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》`, m, global.miku);
      }
      
      await m.react('🕒');
      const db = global.db.data;
      const user = db.users[m.sender] || {};
      const name = user.name || m.sender.split('@')[0];
      
      const hasMeta1 = user.metadatos ? String(user.metadatos).trim() : '';
      const hasMeta2 = user.metadatos2 ? String(user.metadatos2).trim() : '';
      
      // ⚡ LUMIBOT OVERRIDE: Marca de agua táctica
      let texto1 = hasMeta1 ? user.metadatos : 'LumiBOT Security';
      let texto2 = hasMeta1 ? (hasMeta2 ? user.metadatos2 : '') : `Operador: ${name}`;
      
      const buffer = await fetchSticker(text);
      const tmpFile = `./tmp/brat-${Date.now()}.webp`;
      fs.writeFileSync(tmpFile, buffer);
      
      await client.sendImageAsSticker(m.chat, tmpFile, m, { packname: texto1, author: texto2 });
      fs.unlinkSync(tmpFile);
      
      await m.react('✔️');
    } catch (e) {
      await m.react('✖️');
      return m.reply(`╭⋯ ❌ *LUMIBOT OVERRIDE* ⋯》\n┊ La API de renderizado rechazó la solicitud.\n┊ Detalles: ${e.message}\n╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》`);
    }
  }
};
