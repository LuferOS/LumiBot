import axios from 'axios';
import fs from 'fs';

export default {
  name: "qs",
  alias: ["quote_sticker", "qs"],
  category: "utilidad",
  desc: "Crea un sticker citando hasta los últimos 5 mensajes del historial.",
  run: async ({ sock, m, args }) => {
    try {
      let num = 2; // Por defecto 2 mensajes
      if (args[0] && !isNaN(args[0])) {
        num = parseInt(args[0]);
      }
      
      if (num > 5) num = 5;
      if (num < 1) num = 1;

      const cache = global.msgCache?.[m.chat] || [];
      if (cache.length === 0) {
        return m.reply("❌ El historial está vacío. Debes esperar a que haya mensajes.");
      }

      let endIndex = cache.length - 1;

      // Si respondió a un mensaje, buscamos ese mensaje en el caché
      if (m.quoted) {
        const quotedId = m.quoted.id;
        const index = cache.findIndex(msg => msg.id === quotedId);
        if (index !== -1) {
          endIndex = index;
        } else {
          return m.reply("❌ El mensaje citado es muy antiguo y ya no está en el caché (Solo recuerdo los últimos 300).");
        }
      }

      let startIndex = endIndex - num + 1;
      if (startIndex < 0) startIndex = 0;

      const selectedMessages = cache.slice(startIndex, endIndex + 1);
      
      if (selectedMessages.length === 0) return m.reply("❌ No se pudieron obtener mensajes.");

      await m.react('🕒');

      // Obtener avatares bajo demanda
      const pfpCache = {};
      
      const quoteMessages = [];
      for (const msg of selectedMessages) {
        let pfp = msg.pfp;
        if (!pfp) {
          if (!pfpCache[msg.sender]) {
            try {
              pfpCache[msg.sender] = await sock.profilePictureUrl(msg.sender, 'image');
            } catch (e) {
              pfpCache[msg.sender] = 'https://i.imgur.com/8Q9N49Q.jpeg'; // Default táctico
            }
          }
          pfp = pfpCache[msg.sender];
          msg.pfp = pfp; // Guardamos en caché para futuro
        }

        quoteMessages.push({
          entities: [],
          avatar: true,
          from: { 
            id: msg.sender, 
            name: msg.pushName || msg.sender.split('@')[0], 
            photo: { url: pfp } 
          },
          text: msg.text || '[Multimedia]',
          replyMessage: {}
        });
      }

      const quoteObj = { 
        type: 'quote', 
        format: 'png', 
        backgroundColor: '#0a0a0a', 
        width: 512, 
        height: 768, 
        scale: 2, 
        messages: quoteMessages 
      };

      const { data } = await axios.post('https://bot.lyo.su/quote/generate', quoteObj, { headers: { 'Content-Type': 'application/json' } });
      const buffer = Buffer.from(data.result.image, 'base64');

      const tmpFile = `./tmp/qs-${Date.now()}.webp`;
      fs.writeFileSync(tmpFile, buffer);
      
      const db = global.db?.data || {};
      const userGlobal = db.users?.[m.sender] || {};
      const name = userGlobal?.name || m.sender.split('@')[0];
      const meta1 = userGlobal.metadatos ? String(userGlobal.metadatos).trim() : 'LumiBOT Security';
      const meta2 = userGlobal.metadatos2 ? String(userGlobal.metadatos2).trim() : `Operador: ${name}`;

      await sock.sendImageAsSticker(m.chat, tmpFile, m, { packname: meta1, author: meta2 });
      fs.unlinkSync(tmpFile);
      await m.react('✔️');

    } catch (e) {
      console.error("[LUMIBOT DEBUG] Error en qs.js:", e);
      await m.react('✖️');
      m.reply(`❌ Fallo en la conexión con el servidor de citas.\nDetalles: ${e.message}`);
    }
  }
};
